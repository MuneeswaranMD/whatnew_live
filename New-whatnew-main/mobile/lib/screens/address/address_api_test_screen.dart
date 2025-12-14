import 'dart:convert';
import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class AddressApiTestScreen extends StatefulWidget {
  const AddressApiTestScreen({Key? key}) : super(key: key);

  @override
  State<AddressApiTestScreen> createState() => _AddressApiTestScreenState();
}

class _AddressApiTestScreenState extends State<AddressApiTestScreen> {
  String _testResults = '';
  bool _isLoading = false;

  void _runAddressTests() async {
    setState(() {
      _isLoading = true;
      _testResults = '';
    });

    String results = 'Address API Test Results:\n\n';

    try {
      // Test 1: Get Addresses
      results += '1. Testing Get Addresses...\n';
      try {
        final getResponse = await ApiService.getAddresses();
        results += '✅ Get Addresses Success\n';
        results += 'Response: ${jsonEncode(getResponse)}\n\n';
      } catch (e) {
        results += '❌ Get Addresses Failed: $e\n\n';
      }

      // Test 2: Add Address
      results += '2. Testing Add Address...\n';
      try {
        final addResponse = await ApiService.addAddress(
          fullName: 'Test User Flutter',
          phoneNumber: '9876543210',
          addressLine1: '123 Flutter Street',
          addressLine2: 'Apt 5C',
          city: 'Flutter City',
          state: 'Flutter State',
          pincode: '654321',
          isDefault: true,
        );
        results += '✅ Add Address Success\n';
        results += 'Response: ${jsonEncode(addResponse)}\n\n';
      } catch (e) {
        results += '❌ Add Address Failed: $e\n\n';
        if (e is ApiException) {
          results += 'Error details: ${e.errors}\n\n';
        }
      }

      // Test 3: Get Addresses Again
      results += '3. Testing Get Addresses Again...\n';
      try {
        final getResponse2 = await ApiService.getAddresses();
        results += '✅ Get Addresses Success\n';
        results += 'Response: ${jsonEncode(getResponse2)}\n\n';
      } catch (e) {
        results += '❌ Get Addresses Failed: $e\n\n';
      }

    } catch (e) {
      results += 'General error: $e\n';
    }

    setState(() {
      _isLoading = false;
      _testResults = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Address API Test'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: _isLoading ? null : _runAddressTests,
              child: _isLoading 
                  ? const CircularProgressIndicator()
                  : const Text('Run Address API Tests'),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: SingleChildScrollView(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!),
                  ),
                  child: Text(
                    _testResults.isEmpty ? 'No tests run yet' : _testResults,
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
