import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../models/livestream.dart';
import '../../../constants/app_theme.dart';
import '../../../utils/image_widgets.dart';

class BiddingWidget extends StatefulWidget {
  final ProductBidding bidding;
  final Function(double) onBidPlaced;

  const BiddingWidget({
    super.key,
    required this.bidding,
    required this.onBidPlaced,
  });

  @override
  State<BiddingWidget> createState() => _BiddingWidgetState();
}

class _BiddingWidgetState extends State<BiddingWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _pulseAnimation;
  final TextEditingController _bidController = TextEditingController();
  bool _isPlacingBid = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );
    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.05,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    
    if (widget.bidding.isActive) {
      _animationController.repeat(reverse: true);
    }

    // Set suggested bid amount
    _bidController.text = widget.bidding.nextBidAmount.toStringAsFixed(0);
  }

  @override
  void dispose() {
    _animationController.dispose();
    _bidController.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(BiddingWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.bidding.isActive && !oldWidget.bidding.isActive) {
      _animationController.repeat(reverse: true);
    } else if (!widget.bidding.isActive && oldWidget.bidding.isActive) {
      _animationController.stop();
    }
  }

  Future<void> _placeBid() async {
    final bidAmount = double.tryParse(_bidController.text);
    if (bidAmount == null || bidAmount <= 0) {
      _showError('Please enter a valid bid amount');
      return;
    }

    final currentHighest = widget.bidding.currentHighestBid ?? widget.bidding.startingPrice;
    if (bidAmount <= currentHighest) {
      _showError('Bid must be higher than ₹${currentHighest.toStringAsFixed(0)}');
      return;
    }

    setState(() => _isPlacingBid = true);
    
    try {
      await widget.onBidPlaced(bidAmount);
      _bidController.text = (bidAmount + 50).toStringAsFixed(0); // Suggest next bid
    } catch (e) {
      _showError('Failed to place bid');
    } finally {
      setState(() => _isPlacingBid = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _quickBid(double amount) {
    _bidController.text = amount.toStringAsFixed(0);
  }

  @override
  Widget build(BuildContext context) {
    final timeRemaining = widget.bidding.timeRemaining;
    final isActive = widget.bidding.isActive;

    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: isActive ? _pulseAnimation.value : 1.0,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isActive
                    ? [Colors.red[100]!, Colors.red[50]!]
                    : [Colors.grey[100]!, Colors.grey[50]!],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isActive ? Colors.red : Colors.grey[300]!,
                width: 2,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: isActive ? Colors.red : Colors.grey,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isActive ? Icons.gavel : Icons.timer_off,
                            color: Colors.white,
                            size: 16,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            isActive ? 'LIVE BIDDING' : 'BIDDING ENDED',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                    if (isActive) ...[
                      Icon(
                        Icons.timer,
                        color: Colors.red[700],
                        size: 20,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _formatTime(timeRemaining),
                        style: TextStyle(
                          color: Colors.red[700],
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ],
                ),

                const SizedBox(height: 16),

                // Product info
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: NetworkImageExtension.networkWithFallback(
                        widget.bidding.product.images.isNotEmpty
                            ? widget.bidding.product.images.first.fullImageUrl
                            : null,
                        width: 60,
                        height: 60,
                        fit: BoxFit.cover,
                        errorWidget: Container(
                          width: 60,
                          height: 60,
                          color: Colors.grey[300],
                          child: const Icon(Icons.image, color: Colors.grey),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.bidding.product.name,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Starting: ₹${widget.bidding.startingPrice.toStringAsFixed(0)}',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Current highest bid
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.trending_up,
                        color: AppColors.primaryColor,
                      ),
                      const SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Current Highest Bid',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            '₹${(widget.bidding.currentHighestBid ?? widget.bidding.startingPrice).toStringAsFixed(0)}',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primaryColor,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      if (widget.bidding.winnerName != null) ...[
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'Leading Bidder',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                            Text(
                              widget.bidding.winnerName!,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),

                if (isActive) ...[
                  const SizedBox(height: 16),

                  // Quick bid buttons
                  const Text(
                    'Quick Bid',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildQuickBidButton(widget.bidding.nextBidAmount),
                      const SizedBox(width: 8),
                      _buildQuickBidButton(widget.bidding.nextBidAmount + 100),
                      const SizedBox(width: 8),
                      _buildQuickBidButton(widget.bidding.nextBidAmount + 500),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Custom bid input
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _bidController,
                          keyboardType: TextInputType.number,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                          ],
                          decoration: InputDecoration(
                            labelText: 'Your Bid Amount',
                            prefixText: '₹',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      ElevatedButton(
                        onPressed: (_isPlacingBid || widget.bidding.product.availableQuantity <= 0) 
                          ? null 
                          : _placeBid,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: widget.bidding.product.availableQuantity <= 0 
                            ? Colors.grey 
                            : AppColors.primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: _isPlacingBid
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation(Colors.white),
                                ),
                              )
                            : Text(
                                widget.bidding.product.availableQuantity <= 0 
                                  ? 'OUT OF STOCK' 
                                  : 'BID',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ],
                  ),
                ] else if (widget.bidding.isEnded) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.green[200]!),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.emoji_events,
                          color: Colors.green[700],
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            widget.bidding.winnerName != null
                                ? 'Winner: ${widget.bidding.winnerName}'
                                : 'Bidding ended with no winner',
                            style: TextStyle(
                              color: Colors.green[700],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildQuickBidButton(double amount) {
    final isOutOfStock = widget.bidding.product.availableQuantity <= 0;
    return Expanded(
      child: OutlinedButton(
        onPressed: isOutOfStock ? null : () => _quickBid(amount),
        style: OutlinedButton.styleFrom(
          side: BorderSide(color: isOutOfStock ? Colors.grey : AppColors.primaryColor),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: Text(
          '₹${amount.toStringAsFixed(0)}',
          style: TextStyle(
            color: AppColors.primaryColor,
            fontWeight: FontWeight.w500,
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  String _formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }
}
