class ReferralCode {
  final String id;
  final String code;
  final bool isActive;
  final DateTime createdAt;

  ReferralCode({
    required this.id,
    required this.code,
    required this.isActive,
    required this.createdAt,
  });

  factory ReferralCode.fromJson(Map<String, dynamic> json) {
    return ReferralCode(
      id: json['id']?.toString() ?? '',
      code: json['code']?.toString() ?? '',
      isActive: json['is_active'] ?? true,
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class ReferralStats {
  final int totalReferrals;
  final int successfulReferrals;
  final double totalEarnings;
  final int totalCreditsEarned;
  final int currentStreak;
  final int bestStreak;
  final DateTime? lastReferralDate;
  final DateTime updatedAt;

  ReferralStats({
    required this.totalReferrals,
    required this.successfulReferrals,
    required this.totalEarnings,
    required this.totalCreditsEarned,
    required this.currentStreak,
    required this.bestStreak,
    this.lastReferralDate,
    required this.updatedAt,
  });

  factory ReferralStats.fromJson(Map<String, dynamic> json) {
    return ReferralStats(
      totalReferrals: json['total_referrals'] ?? 0,
      successfulReferrals: json['successful_referrals'] ?? 0,
      totalEarnings: double.parse((json['total_earnings'] ?? 0).toString()),
      totalCreditsEarned: json['total_credits_earned'] ?? 0,
      currentStreak: json['current_streak'] ?? 0,
      bestStreak: json['best_streak'] ?? 0,
      lastReferralDate: json['last_referral_date'] != null 
          ? DateTime.parse(json['last_referral_date']) 
          : null,
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}

class ReferralHistory {
  final String id;
  final ReferredUserDetails referredUserDetails;
  final String status;
  final DateTime createdAt;
  final DateTime? completedAt;
  final RewardDetails? rewardDetails;
  final int daysSinceReferral;

  ReferralHistory({
    required this.id,
    required this.referredUserDetails,
    required this.status,
    required this.createdAt,
    this.completedAt,
    this.rewardDetails,
    required this.daysSinceReferral,
  });

  factory ReferralHistory.fromJson(Map<String, dynamic> json) {
    return ReferralHistory(
      id: json['id']?.toString() ?? '',
      referredUserDetails: ReferredUserDetails.fromJson(json['referred_user_details']),
      status: json['status'] ?? 'pending',
      createdAt: DateTime.parse(json['created_at']),
      completedAt: json['completed_at'] != null 
          ? DateTime.parse(json['completed_at']) 
          : null,
      rewardDetails: json['reward_details'] != null 
          ? RewardDetails.fromJson(json['reward_details']) 
          : null,
      daysSinceReferral: json['days_since_referral'] ?? 0,
    );
  }
}

class ReferredUserDetails {
  final String username;
  final String firstName;
  final String lastName;
  final DateTime joinedDate;

  ReferredUserDetails({
    required this.username,
    required this.firstName,
    required this.lastName,
    required this.joinedDate,
  });

  factory ReferredUserDetails.fromJson(Map<String, dynamic> json) {
    return ReferredUserDetails(
      username: json['username']?.toString() ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      joinedDate: DateTime.parse(json['joined_date']),
    );
  }

  String get displayName {
    if (firstName.isNotEmpty || lastName.isNotEmpty) {
      return '$firstName $lastName'.trim();
    }
    return username;
  }
}

class RewardDetails {
  final String rewardType;
  final double amount;
  final String status;
  final DateTime? creditedAt;

  RewardDetails({
    required this.rewardType,
    required this.amount,
    required this.status,
    this.creditedAt,
  });

  factory RewardDetails.fromJson(Map<String, dynamic> json) {
    return RewardDetails(
      rewardType: json['reward_type'] ?? 'credits',
      amount: double.parse((json['amount'] ?? 0).toString()),
      status: json['status'] ?? 'pending',
      creditedAt: json['credited_at'] != null 
          ? DateTime.parse(json['credited_at']) 
          : null,
    );
  }
}

class ReferralReward {
  final String id;
  final String rewardType;
  final double amount;
  final String description;
  final String status;
  final DateTime createdAt;
  final DateTime? creditedAt;
  final ReferralData referralData;

  ReferralReward({
    required this.id,
    required this.rewardType,
    required this.amount,
    required this.description,
    required this.status,
    required this.createdAt,
    this.creditedAt,
    required this.referralData,
  });

  factory ReferralReward.fromJson(Map<String, dynamic> json) {
    return ReferralReward(
      id: json['id']?.toString() ?? '',
      rewardType: json['reward_type'] ?? 'credits',
      amount: double.parse((json['amount'] ?? 0).toString()),
      description: json['description'] ?? '',
      status: json['status'] ?? 'pending',
      createdAt: DateTime.parse(json['created_at']),
      creditedAt: json['credited_at'] != null 
          ? DateTime.parse(json['credited_at']) 
          : null,
      referralData: ReferralData.fromJson(json['referral_data']),
    );
  }
}

class ReferralData {
  final String referrer;
  final String referredUser;
  final String code;

  ReferralData({
    required this.referrer,
    required this.referredUser,
    required this.code,
  });

  factory ReferralData.fromJson(Map<String, dynamic> json) {
    return ReferralData(
      referrer: json['referrer']?.toString() ?? '',
      referredUser: json['referred_user']?.toString() ?? '',
      code: json['code']?.toString() ?? '',
    );
  }
}

class ShareContent {
  final String platform;
  final String text;
  final String referralCode;
  final String referralUrl;
  final String? url;
  final String? smsUrl;
  final String? emailUrl;
  final String? subject;
  final String? body;
  final String? shareTitle;
  final String? shareDescription;

  ShareContent({
    required this.platform,
    required this.text,
    required this.referralCode,
    required this.referralUrl,
    this.url,
    this.smsUrl,
    this.emailUrl,
    this.subject,
    this.body,
    this.shareTitle,
    this.shareDescription,
  });

  factory ShareContent.fromJson(Map<String, dynamic> json) {
    return ShareContent(
      platform: json['platform']?.toString() ?? '',
      text: json['text']?.toString() ?? '',
      referralCode: json['referral_code']?.toString() ?? '',
      referralUrl: json['referral_url']?.toString() ?? '',
      url: json['url']?.toString(),
      smsUrl: json['sms_url']?.toString(),
      emailUrl: json['email_url']?.toString(),
      subject: json['subject']?.toString(),
      body: json['body']?.toString(),
      shareTitle: json['share_title']?.toString(),
      shareDescription: json['share_description']?.toString(),
    );
  }
}

class ReferralCampaign {
  final String id;
  final String name;
  final String description;
  final double referrerRewardAmount;
  final double referredUserRewardAmount;
  final String rewardType;
  final int minimumReferrals;
  final String status;
  final bool isActiveNow;
  final DateTime startDate;
  final DateTime endDate;

  ReferralCampaign({
    required this.id,
    required this.name,
    required this.description,
    required this.referrerRewardAmount,
    required this.referredUserRewardAmount,
    required this.rewardType,
    required this.minimumReferrals,
    required this.status,
    required this.isActiveNow,
    required this.startDate,
    required this.endDate,
  });

  factory ReferralCampaign.fromJson(Map<String, dynamic> json) {
    return ReferralCampaign(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      referrerRewardAmount: double.parse((json['referrer_reward_amount'] ?? 0).toString()),
      referredUserRewardAmount: double.parse((json['referred_user_reward_amount'] ?? 0).toString()),
      rewardType: json['reward_type'] ?? 'credits',
      minimumReferrals: json['minimum_referrals'] ?? 1,
      status: json['status'] ?? 'inactive',
      isActiveNow: json['is_active_now'] ?? false,
      startDate: DateTime.parse(json['start_date']),
      endDate: DateTime.parse(json['end_date']),
    );
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
      validUntil: json['valid_until'] != null ? DateTime.parse(json['valid_until']) : null,
    );
  }

  String get discountText {
    if (discountType == 'percentage') {
      return '${discountValue.toInt()}% OFF';
    } else {
      return '₹${discountValue.toInt()} OFF';
    }
  }
}

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
    final milestonesList = (json['milestones'] as List? ?? [])
        .map((m) => ReferralMilestone.fromJson(m))
        .toList();

    final earnedCodesList = (json['earned_promo_codes'] as List? ?? [])
        .map((c) => EarnedPromoCode.fromJson(c))
        .toList();

    return ReferralProgress(
      currentReferrals: json['current_referrals'] ?? 0,
      currentLevel: json['current_level'] ?? 0,
      milestones: milestonesList,
      nextMilestone: json['next_milestone'] != null 
          ? ReferralMilestone.fromJson(json['next_milestone']) 
          : null,
      earnedPromoCodes: earnedCodesList,
      totalPromoCodes: json['total_promo_codes'] ?? 0,
      unusedPromoCodes: json['unused_promo_codes'] ?? 0,
    );
  }

  // Get progress percentage to next milestone
  double get nextMilestoneProgress {
    if (nextMilestone == null) return 100.0;
    return nextMilestone!.progressPercentage;
  }

  // Get current level milestone (if completed)
  ReferralMilestone? get currentLevelMilestone {
    if (currentLevel == 0) return null;
    return milestones.firstWhere(
      (m) => m.level == currentLevel,
      orElse: () => milestones.first,
    );
  }
}
