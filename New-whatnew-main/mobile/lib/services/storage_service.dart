import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static SharedPreferences? _prefs;
  
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }
  
  // Auth related storage
  static Future<void> saveAuthToken(String token) async {
    await _prefs?.setString('auth_token', token);
  }
  
  static String? getAuthToken() {
    return _prefs?.getString('auth_token');
  }
  
  static Future<void> removeAuthToken() async {
    await _prefs?.remove('auth_token');
  }
  
  static Future<void> saveUserId(String userId) async {
    await _prefs?.setString('user_id', userId);
  }
  
  static String? getUserId() {
    return _prefs?.getString('user_id');
  }
  
  static Future<void> removeUserId() async {
    await _prefs?.remove('user_id');
  }
  
  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _prefs?.setString('user_data', userData.toString());
  }
  
  static String? getUserData() {
    return _prefs?.getString('user_data');
  }
  
  static Future<void> removeUserData() async {
    await _prefs?.remove('user_data');
  }
  
  // App preferences
  static Future<void> setFirstTime(bool isFirstTime) async {
    await _prefs?.setBool('is_first_time', isFirstTime);
  }
  
  static bool isFirstTime() {
    return _prefs?.getBool('is_first_time') ?? true;
  }
  
  // Cart related storage
  static Future<void> saveCartItemCount(int count) async {
    await _prefs?.setInt('cart_item_count', count);
  }
  
  static int getCartItemCount() {
    return _prefs?.getInt('cart_item_count') ?? 0;
  }
  
  // Generic storage methods
  static Future<void> setString(String key, String value) async {
    await _prefs?.setString(key, value);
  }
  
  static String? getString(String key) {
    return _prefs?.getString(key);
  }
  
  static Future<void> setBool(String key, bool value) async {
    await _prefs?.setBool(key, value);
  }
  
  static bool? getBool(String key) {
    return _prefs?.getBool(key);
  }
  
  static Future<void> setInt(String key, int value) async {
    await _prefs?.setInt(key, value);
  }
  
  static int? getInt(String key) {
    return _prefs?.getInt(key);
  }
  
  static Future<void> remove(String key) async {
    await _prefs?.remove(key);
  }

  // Clear all data (logout)
  static Future<void> clearAll() async {
    await _prefs?.clear();
  }
}
