class ReferralProgress {
  final int currentReferrals;
  final int currentLevel;
  final List<ReferralMilestone> milestones;
  final ReferralMilestone? nextMilestone;
  final List<EarnedPromoCode> earnedPromoCodes;
  final int totalPromoCodes;
  final int unusedPromoCodes;

  ReferralProgress({
    required this.currentReferrals,
    required this.currentLevel,
    required this.milestones,
    this.nextMilestone,
    required this.earnedPromoCodes,
    required this.totalPromoCodes,
    required this.unusedPromoCodes,
  });

  factory ReferralProgress.fromJson(Map<String, dynamic> json) {
    return ReferralProgress(
      currentReferrals: json['current_referrals'] ?? 0,
      currentLevel: json['current_level'] ?? 0,
      milestones: (json['milestones'] as List<dynamic>?)
          ?.map((milestone) => ReferralMilestone.fromJson(milestone))
          .toList() ?? [],
      nextMilestone: json['next_milestone'] != null
          ? ReferralMilestone.fromJson(json['next_milestone'])
          : null,
      earnedPromoCodes: (json['earned_promo_codes'] as List<dynamic>?)
          ?.map((code) => EarnedPromoCode.fromJson(code))
          .toList() ?? [],
      totalPromoCodes: json['total_promo_codes'] ?? 0,
      unusedPromoCodes: json['unused_promo_codes'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'current_referrals': currentReferrals,
      'current_level': currentLevel,
      'milestones': milestones.map((m) => m.toJson()).toList(),
      'next_milestone': nextMilestone?.toJson(),
      'earned_promo_codes': earnedPromoCodes.map((c) => c.toJson()).toList(),
      'total_promo_codes': totalPromoCodes,
      'unused_promo_codes': unusedPromoCodes,
    };
  }

  // Helper getters
  double get overallProgress {
    if (milestones.isEmpty) return 0.0;
    
    final completedMilestones = milestones.where((m) => m.completed).length;
    return (completedMilestones / milestones.length) * 100;
  }

  String get progressSummary {
    final completed = milestones.where((m) => m.completed).length;
    return '$completed/${milestones.length} milestones completed';
  }

  String get nextRewardDescription {
    if (nextMilestone != null) {
      return 'Refer ${nextMilestone!.referralsNeeded} more friends to earn ${nextMilestone!.reward}';
    }
    return 'All milestones completed!';
  }
}

class ReferralMilestone {
  final int level;
  final int threshold;
  final String reward;
  final String description;
  final bool completed;
  final double progressPercentage;
  final int referralsNeeded;

  ReferralMilestone({
    required this.level,
    required this.threshold,
    required this.reward,
    required this.description,
    required this.completed,
    required this.progressPercentage,
    required this.referralsNeeded,
  });

  factory ReferralMilestone.fromJson(Map<String, dynamic> json) {
    return ReferralMilestone(
      level: json['level'] ?? 0,
      threshold: json['threshold'] ?? 0,
      reward: json['reward'] ?? '',
      description: json['description'] ?? '',
      completed: json['completed'] ?? false,
      progressPercentage: (json['progress_percentage'] ?? 0).toDouble(),
      referralsNeeded: json['referrals_needed'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'level': level,
      'threshold': threshold,
      'reward': reward,
      'description': description,
      'completed': completed,
      'progress_percentage': progressPercentage,
      'referrals_needed': referralsNeeded,
    };
  }

  // Helper getters
  String get levelText => 'Level $level';
  
  String get progressText => completed 
      ? 'Completed!' 
      : '$referralsNeeded more needed';
      
  String get discountText {
    final match = RegExp(r'(\d+)%').firstMatch(reward);
    return match != null ? '${match.group(1)}% OFF' : reward;
  }
}

class EarnedPromoCode {
  final String code;
  final int level;
  final double discountValue;
  final String discountType;
  final bool isUsed;
  final DateTime createdAt;
  final DateTime? validUntil;

  EarnedPromoCode({
    required this.code,
    required this.level,
    required this.discountValue,
    required this.discountType,
    required this.isUsed,
    required this.createdAt,
    this.validUntil,
  });

  factory EarnedPromoCode.fromJson(Map<String, dynamic> json) {
    return EarnedPromoCode(
      code: json['code'] ?? '',
      level: json['level'] ?? 0,
      discountValue: (json['discount_value'] ?? 0).toDouble(),
      discountType: json['discount_type'] ?? 'percentage',
      isUsed: json['is_used'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
      validUntil: json['valid_until'] != null 
          ? DateTime.parse(json['valid_until']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'level': level,
      'discount_value': discountValue,
      'discount_type': discountType,
      'is_used': isUsed,
      'created_at': createdAt.toIso8601String(),
      'valid_until': validUntil?.toIso8601String(),
    };
  }

  // Helper getters
  String get discountText => discountType == 'percentage' 
      ? '${discountValue.toInt()}% OFF'
      : '₹${discountValue.toInt()} OFF';
      
  String get statusText => isUsed ? 'Used' : 'Available';
  
  String get levelText => 'Level $level Reward';
  
  bool get isExpired => validUntil != null && validUntil!.isBefore(DateTime.now());
  
  String get validityText {
    if (validUntil == null) return 'No expiry';
    if (isExpired) return 'Expired';
    
    final now = DateTime.now();
    final difference = validUntil!.difference(now);
    
    if (difference.inDays > 0) {
      return 'Expires in ${difference.inDays} days';
    } else if (difference.inHours > 0) {
      return 'Expires in ${difference.inHours} hours';
    } else {
      return 'Expires soon';
    }
  }
}
