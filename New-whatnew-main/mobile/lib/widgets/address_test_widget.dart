import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/address_provider.dart';

// Simple test widget to test address functionality
class AddressTestWidget extends StatefulWidget {
  const AddressTestWidget({super.key});

  @override
  State<AddressTestWidget> createState() => _AddressTestWidgetState();
}

class _AddressTestWidgetState extends State<AddressTestWidget> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressLine1Controller = TextEditingController();
  final _addressLine2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _pincodeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Set test data
    _fullNameController.text = 'Test User';
    _phoneController.text = '9876543210';
    _addressLine1Controller.text = '123 Test Street';
    _addressLine2Controller.text = 'Apt 4B';
    _cityController.text = 'Mumbai';
    _stateController.text = 'Maharashtra';
    _pincodeController.text = '400001';
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _phoneController.dispose();
    _addressLine1Controller.dispose();
    _addressLine2Controller.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _pincodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Address API Test'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Consumer<AddressProvider>(
          builder: (context, addressProvider, child) {
            return Column(
              children: [
                if (addressProvider.error != null)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.red[100],
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.red),
                    ),
                    child: Text(
                      'Error: ${addressProvider.error}',
                      style: const TextStyle(color: Colors.red),
                    ),
                  ),
                
                Expanded(
                  child: Form(
                    key: _formKey,
                    child: ListView(
                      children: [
                        TextFormField(
                          controller: _fullNameController,
                          decoration: const InputDecoration(labelText: 'Full Name'),
                          validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _phoneController,
                          decoration: const InputDecoration(labelText: 'Phone'),
                          validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _addressLine1Controller,
                          decoration: const InputDecoration(labelText: 'Address Line 1'),
                          validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _addressLine2Controller,
                          decoration: const InputDecoration(labelText: 'Address Line 2'),
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _cityController,
                          decoration: const InputDecoration(labelText: 'City'),
                          validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _stateController,
                          decoration: const InputDecoration(labelText: 'State'),
                          validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _pincodeController,
                          decoration: const InputDecoration(labelText: 'Pincode'),
                          validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
                        ),
                        const SizedBox(height: 32),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: addressProvider.isLoading 
                                  ? null 
                                  : () => _testLoadAddresses(),
                                child: const Text('Load Addresses'),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: addressProvider.isLoading 
                                  ? null 
                                  : () => _testAddAddress(),
                                child: const Text('Add Address'),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        if (addressProvider.isLoading)
                          const Center(child: CircularProgressIndicator()),
                        
                        if (addressProvider.addresses.isNotEmpty) ...[
                          const SizedBox(height: 16),
                          const Text('Addresses:', style: TextStyle(fontWeight: FontWeight.bold)),
                          ...addressProvider.addresses.map((address) => Card(
                            child: ListTile(
                              title: Text(address.fullName),
                              subtitle: Text(address.formattedAddress),
                              trailing: address.isDefault
                                  ? const Icon(Icons.star, color: Colors.amber)
                                  : null,
                            ),
                          )),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _testLoadAddresses() async {
    final provider = Provider.of<AddressProvider>(context, listen: false);
    provider.clearError();
    await provider.loadAddresses();
  }

  void _testAddAddress() async {
    if (_formKey.currentState?.validate() ?? false) {
      final provider = Provider.of<AddressProvider>(context, listen: false);
      provider.clearError();
      
      final success = await provider.addAddress(
        fullName: _fullNameController.text,
        phoneNumber: _phoneController.text,
        addressLine1: _addressLine1Controller.text,
        addressLine2: _addressLine2Controller.text.isEmpty 
            ? null 
            : _addressLine2Controller.text,
        city: _cityController.text,
        state: _stateController.text,
        pincode: _pincodeController.text,
        isDefault: false,
      );
      
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Address added successfully!')),
        );
      }
    }
  }
}
