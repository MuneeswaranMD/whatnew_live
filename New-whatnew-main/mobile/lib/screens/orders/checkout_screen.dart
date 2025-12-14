import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../providers/address_provider.dart';
import '../../widgets/custom_text_field.dart';
import '../../core/theme/app_colors.dart';
import '../../models/address.dart';
import '../../models/order.dart' as order_model;
import '../../services/api_service.dart';
import 'payment_screen.dart';
import '../../utils/image_widgets.dart';
import '../../utils/image_utils.dart';
import '../address/add_address_screen.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressLine1Controller = TextEditingController();
  final _addressLine2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _pincodeController = TextEditingController();
  final _notesController = TextEditingController();

  Address? _selectedAddress;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadAddresses();
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressLine1Controller.dispose();
    _addressLine2Controller.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _pincodeController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _loadAddresses() async {
    try {
      final addressProvider = Provider.of<AddressProvider>(context, listen: false);
      // print('Loading addresses...');
      await addressProvider.loadAddresses();
      // print('Addresses loaded: ${addressProvider.addresses.length}');
      
      // Set default address if available
      final defaultAddress = addressProvider.addresses
          .where((addr) => addr.isDefault)
          .firstOrNull;
      
      if (defaultAddress != null) {
        // print('Setting default address: ${defaultAddress.fullName}');
        setState(() {
          _selectedAddress = defaultAddress;
          _populateAddressFields(defaultAddress);
        });
      } else if (addressProvider.addresses.isNotEmpty) {
        // If no default address, use the first one
        final firstAddress = addressProvider.addresses.first;
        // print('No default address, using first: ${firstAddress.fullName}');
        setState(() {
          _selectedAddress = firstAddress;
          _populateAddressFields(firstAddress);
        });
      } else {
        // print('No addresses found');
      }
    } catch (e) {
      // print('Error loading addresses: $e');
    }
  }

  void _populateAddressFields(Address address) {
    _nameController.text = address.fullName;
    _phoneController.text = address.phoneNumber;
    _addressLine1Controller.text = address.addressLine1;
    _addressLine2Controller.text = address.addressLine2 ?? '';
    _cityController.text = address.city;
    _stateController.text = address.state;
    _pincodeController.text = address.pincode;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      appBar: AppBar(
        title: Text(
          'Checkout',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            color: AppColors.pureWhite,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: AppColors.crimsonRed,
        foregroundColor: AppColors.pureWhite,
        elevation: 0,
        centerTitle: true,
      ),
      body: Consumer3<CartProvider, OrderProvider, AddressProvider>(
        builder: (context, cartProvider, orderProvider, addressProvider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Order summary
                  _buildOrderSummary(cartProvider),
                  
                  const SizedBox(height: 24),
                  
                  // Delivery address
                  _buildDeliveryAddressSection(addressProvider),
                  
                  const SizedBox(height: 24),
                  
                  // Additional notes
                  _buildNotesSection(),
                  
                  const SizedBox(height: 24),
                  
                  // Order total
                  _buildOrderTotal(cartProvider),
                  
                  const SizedBox(height: 24),
                  
                  // Place order button
                  _buildPlaceOrderButton(cartProvider),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildOrderSummary(CartProvider cartProvider) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.lightCard,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowLight,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.shopping_bag_outlined,
                  color: AppColors.crimsonRed,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Text(
                  'Order Summary',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.lightTextPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            ...cartProvider.items.map((item) {
              final product = item.product;
              final quantity = item.quantity;
              final price = item.price;
              final totalPrice = item.total;
              
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.offWhite,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.borderLight,
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: NetworkImageExtension.networkWithFallback(
                        ImageUtils.getProductImageUrl(product),
                        width: 60,
                        height: 60,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product['name'],
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppColors.lightTextPrimary,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Qty: $quantity × ₹$price',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.lightTextSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.crimsonRed.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '₹$totalPrice',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.crimsonRed,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
            
            const Divider(),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Total Items: ${cartProvider.totalItems}',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w500,
                    color: AppColors.lightTextSecondary,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.crimsonRed, AppColors.vibrantPurple],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '₹${cartProvider.totalAmount.toStringAsFixed(2)}',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.pureWhite,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliveryAddressSection(AddressProvider addressProvider) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.lightCard,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowLight,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.location_on_outlined,
                  color: AppColors.crimsonRed,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Delivery Address',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.lightTextPrimary,
                    ),
                  ),
                ),
                // Refresh addresses button
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.crimsonRed.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    onPressed: () {
                      _loadAddresses();
                    },
                    icon: Icon(
                      Icons.refresh,
                      color: AppColors.crimsonRed,
                      size: 20,
                    ),
                    tooltip: 'Refresh Addresses',
                  ),
                ),
                // Address options popup
                PopupMenuButton<String>(
                  onSelected: (value) {
                    // print('Selected action: $value');
                    if (value == 'select') {
                      _navigateToAddressSelection();
                    } else if (value == 'create') {
                      _navigateToCreateAddress();
                    }
                  },
                  itemBuilder: (context) {
                    // print('Building popup menu. Addresses count: ${addressProvider.addresses.length}');
                    return [
                      if (addressProvider.addresses.isNotEmpty)
                        const PopupMenuItem(
                          value: 'select',
                          child: Row(
                            children: [
                              Icon(Icons.location_on, size: 20),
                              SizedBox(width: 8),
                              Text('Choose Existing'),
                            ],
                          ),
                        ),
                      const PopupMenuItem(
                        value: 'create',
                        child: Row(
                          children: [
                            Icon(Icons.add_location, size: 20),
                            SizedBox(width: 8),
                            Text('Create New Address'),
                          ],
                        ),
                      ),
                    ];
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.primaryColor),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.location_on, size: 16, color: AppColors.primaryColor),
                        const SizedBox(width: 4),
                        Text(
                          'Address Options',
                          style: TextStyle(color: AppColors.primaryColor, fontSize: 12),
                        ),
                        const SizedBox(width: 4),
                        Icon(Icons.arrow_drop_down, size: 16, color: AppColors.primaryColor),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            
            if (_selectedAddress != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  border: Border.all(color: Colors.green[200]!),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.check_circle, color: Colors.green[600], size: 20),
                        const SizedBox(width: 8),
                        const Text(
                          'Selected Address:',
                          style: TextStyle(fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _selectedAddress!.fullName,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(_selectedAddress!.phoneNumber),
                    Text(_selectedAddress!.formattedAddress),
                  ],
                ),
              ),
            ],
            
            const SizedBox(height: 16),
            
            CustomTextField(
              controller: _nameController,
              label: 'Full Name',
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your full name';
                }
                return null;
              },
            ),
            
            const SizedBox(height: 12),
            
            CustomTextField(
              controller: _phoneController,
              label: 'Phone Number',
              keyboardType: TextInputType.phone,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your phone number';
                }
                if (value.length < 10) {
                  return 'Please enter a valid phone number';
                }
                return null;
              },
            ),
            
            const SizedBox(height: 12),
            
            CustomTextField(
              controller: _addressLine1Controller,
              label: 'Address Line 1',
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your address';
                }
                return null;
              },
            ),
            
            const SizedBox(height: 12),
            
            CustomTextField(
              controller: _addressLine2Controller,
              label: 'Address Line 2 (Optional)',
            ),
            
            const SizedBox(height: 12),
            
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: _cityController,
                    label: 'City',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your city';
                      }
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: CustomTextField(
                    controller: _stateController,
                    label: 'State',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your state';
                      }
                      return null;
                    },
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            CustomTextField(
              controller: _pincodeController,
              label: 'Pincode',
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your pincode';
                }
                if (value.length != 6) {
                  return 'Please enter a valid 6-digit pincode';
                }
                return null;
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotesSection() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Additional Notes (Optional)',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            CustomTextField(
              controller: _notesController,
              label: 'Special instructions for delivery',
              maxLines: 3,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderTotal(CartProvider cartProvider) {
    final subtotal = cartProvider.totalAmount;
    const platformFee = 3.0; // Platform fee
    const deliveryCharge = 79.0; // Delivery charge
    const taxAmount = 0.0; // No tax for now
    final total = subtotal + platformFee + deliveryCharge + taxAmount;

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Order Total',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Subtotal'),
                Text('₹${subtotal.toStringAsFixed(2)}'),
              ],
            ),
            
            const SizedBox(height: 8),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Platform Fee'),
                Text('₹${platformFee.toStringAsFixed(2)}'),
              ],
            ),
            
            const SizedBox(height: 8),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Delivery Charge'),
                Text('₹${deliveryCharge.toStringAsFixed(2)}'),
              ],
            ),
            
            if (taxAmount > 0) ...[
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Tax'),
                  Text('₹${taxAmount.toStringAsFixed(2)}'),
                ],
              ),
            ],
            
            const Divider(),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Total',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '₹${total.toStringAsFixed(2)}',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryColor,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceOrderButton(CartProvider cartProvider) {
    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.crimsonRed, AppColors.vibrantPurple],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.crimsonRed.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: _isLoading ? null : () => _proceedToPayment(cartProvider),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          foregroundColor: AppColors.pureWhite,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: _isLoading
            ? SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation(AppColors.pureWhite),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.payment,
                    color: AppColors.pureWhite,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Proceed to Payment',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.pureWhite,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  void _navigateToAddressSelection() {
    final addressProvider = Provider.of<AddressProvider>(context, listen: false);
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.7,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  'Choose Address (${addressProvider.addresses.length} available)',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                TextButton.icon(
                  onPressed: () {
                    Navigator.of(context).pop();
                    _navigateToCreateAddress();
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Add New'),
                ),
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            Expanded(
              child: addressProvider.addresses.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.location_off_outlined,
                            size: 64,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No Addresses Found',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Add your first delivery address to continue',
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton.icon(
                            onPressed: () {
                              Navigator.of(context).pop();
                              _navigateToCreateAddress();
                            },
                            icon: const Icon(Icons.add),
                            label: const Text('Add Address'),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: addressProvider.addresses.length,
                      itemBuilder: (context, index) {
                        final address = addressProvider.addresses[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(12),
                            title: Text(
                              address.fullName,
                              style: const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(address.phoneNumber),
                                const SizedBox(height: 4),
                                Text(
                                  address.formattedAddress,
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ],
                            ),
                            trailing: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (address.isDefault)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppColors.primaryColor,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text(
                                      'Default',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                if (_selectedAddress?.id == address.id)
                                  Icon(Icons.check_circle, color: AppColors.primaryColor)
                                else
                                  Icon(Icons.radio_button_unchecked, color: Colors.grey[400]),
                              ],
                            ),
                            onTap: () {
                              setState(() {
                                _selectedAddress = address;
                                _populateAddressFields(address);
                              });
                              Navigator.of(context).pop();
                            },
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToCreateAddress() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const AddAddressScreen(),
      ),
    );
    
    if (result == true) {
      // Address was created successfully, reload addresses
      await _loadAddresses();
      
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Address added successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  Future<void> _proceedToPayment(CartProvider cartProvider) async {
    // Check if address is selected or if form is filled
    if (_selectedAddress == null && !_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select an address or fill in the delivery details'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      Map<String, dynamic> shippingAddress;
      
      // Use selected address or form data
      if (_selectedAddress != null) {
        shippingAddress = {
          'full_name': _selectedAddress!.fullName,
          'phone_number': _selectedAddress!.phoneNumber,
          'address_line_1': _selectedAddress!.addressLine1,
          'address_line_2': _selectedAddress!.addressLine2 ?? '',
          'city': _selectedAddress!.city,
          'state': _selectedAddress!.state,
          'pincode': _selectedAddress!.pincode,
          'country': 'India',
        };
      } else {
        // Use form data
        shippingAddress = {
          'full_name': _nameController.text,
          'phone_number': _phoneController.text,
          'address_line_1': _addressLine1Controller.text,
          'address_line_2': _addressLine2Controller.text,
          'city': _cityController.text,
          'state': _stateController.text,
          'pincode': _pincodeController.text,
          'country': 'India',
        };
      }

      // Create order first
      final orderResponse = await ApiService.createOrder(
        shippingAddress: shippingAddress,
      );

      // print('Order created successfully: $orderResponse');

      // Create Order object from response
      final order = order_model.Order.fromJson(orderResponse);

      // Create Address object for payment screen
      final address = _selectedAddress ?? Address(
        id: 0,
        fullName: _nameController.text,
        phoneNumber: _phoneController.text,
        addressLine1: _addressLine1Controller.text,
        addressLine2: _addressLine2Controller.text.isEmpty ? null : _addressLine2Controller.text,
        city: _cityController.text,
        state: _stateController.text,
        pincode: _pincodeController.text,
        isDefault: false,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      // Navigate to payment screen
      final result = await Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => PaymentScreen(
            order: order,
            shippingAddress: address,
          ),
        ),
      );

      // Handle payment result
      if (result != null && result is Map<String, dynamic>) {
        if (result['success'] == true) {
          // Clear the cart after successful payment
          final cartProvider = Provider.of<CartProvider>(context, listen: false);
          await cartProvider.clearCart();
          
          // Refresh orders to get updated status
          final orderProvider = Provider.of<OrderProvider>(context, listen: false);
          await orderProvider.getOrders();
          
          // Show success message
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.white),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Order placed successfully! Payment confirmed.\nOrder Status: ${result['order_status']?.toUpperCase() ?? 'CONFIRMED'}',
                    ),
                  ),
                ],
              ),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 4),
            ),
          );
          
          // Wait to show message then navigate
          await Future.delayed(Duration(seconds: 2));
          Navigator.of(context).popUntil((route) => route.isFirst);
        } else {
          // Payment failed, show error
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result['error'] ?? 'Payment failed. Please try again.'),
              backgroundColor: Colors.red,
              duration: Duration(seconds: 3),
            ),
          );
        }
      } else if (result == true) {
        // Backward compatibility
        final cartProvider = Provider.of<CartProvider>(context, listen: false);
        await cartProvider.clearCart();
        
        // Refresh orders to get updated status
        final orderProvider = Provider.of<OrderProvider>(context, listen: false);
        await orderProvider.getOrders();
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Order placed successfully! Cart cleared.'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 3),
          ),
        );
        
        Navigator.of(context).popUntil((route) => route.isFirst);
      }
    } catch (e) {
      // print('Error creating order: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error creating order: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
}
