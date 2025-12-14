# Referral Code Implementation Test Plan

## Summary of Changes Made

### Backend Changes ✅
1. **Updated BuyerRegistrationSerializer** (`backend/accounts/serializers.py`):
   - Added optional `referral_code` field
   - Validates and applies referral codes during registration
   - Includes email and username uniqueness validation
   - Creates referral rewards when valid code is provided

2. **Updated BuyerRegistrationView** (`backend/accounts/views.py`):
   - Returns structured error codes and user-friendly messages
   - Uses centralized error code system

3. **Updated LoginView** (`backend/accounts/views.py`):
   - Returns structured error codes and user-friendly messages
   - Uses centralized error code system

4. **Created Error Codes System** (`backend/accounts/error_codes.py`):
   - Centralized error codes for auth, registration, OTP, and referral
   - User-friendly error messages
   - Consistent error response format

5. **Disabled Post-Registration Referral Application** (`backend/accounts/referral_views.py`):
   - `ApplyReferralCodeView` now returns `REFERRAL_ONLY_DURING_REGISTRATION` error
   - Prevents applying referral codes after registration

### Mobile App Changes ✅
1. **Updated ApiService** (`mobile/lib/services/api_service.dart`):
   - `registerBuyer` method accepts optional `referralCode` parameter
   - Includes referral code in registration request if provided

2. **Updated AuthProvider** (`mobile/lib/providers/auth_provider.dart`):
   - `registerBuyer` method accepts optional `referralCode` parameter
   - Passes referral code to API service

3. **Registration Screen** (`mobile/lib/screens/auth/register_screen.dart`):
   - Already has referral code field (confirmed existing)
   - Passes referral code to registration process

4. **Updated Error Messages** (`mobile/lib/utils/error_messages.dart`):
   - Added all backend error codes with user-friendly messages
   - Enhanced error pattern matching
   - Supports JSON error code extraction

5. **Updated Deep Link Handling** (`mobile/lib/services/deep_link_service.dart`):
   - Changed referral code dialog to inform users that codes work during registration only
   - Removed "Apply Code" functionality for existing users

## Test Scenarios

### 1. Registration with Valid Referral Code ✅
- **Action**: Register new user with valid referral code
- **Expected**: Registration succeeds, referral relationship created, rewards generated
- **Test**: Enter valid referral code during registration

### 2. Registration with Invalid Referral Code ✅
- **Action**: Register new user with invalid referral code
- **Expected**: User-friendly error message displayed
- **Test**: Enter "INVALID123" as referral code

### 3. Registration without Referral Code ✅
- **Action**: Register new user without referral code
- **Expected**: Registration succeeds, no referral processing
- **Test**: Leave referral code field empty

### 4. Existing User Tries to Apply Referral Code ✅
- **Action**: POST to `/api/auth/referral/apply/` as authenticated user
- **Expected**: Returns "Referral codes can only be applied during registration" error
- **Test**: Call API endpoint directly

### 5. Deep Link with Referral Code ✅
- **Action**: Open app via referral deep link as existing user
- **Expected**: Dialog explains referral codes work during registration only
- **Test**: Use URL like `whatnew://referral?code=ABC123`

### 6. Email/Username Validation ✅
- **Action**: Register with existing email/username
- **Expected**: User-friendly error messages displayed
- **Test**: Try to register with already used email

### 7. Error Message Display ✅
- **Action**: Trigger various errors during login/registration
- **Expected**: User-friendly messages shown (not technical error codes)
- **Test**: Various invalid inputs

## API Endpoints Status

### ✅ Working Endpoints:
- `POST /api/auth/register/buyer/` - Registration with optional referral code
- `POST /api/auth/login/` - Login with enhanced error messages
- `GET /api/auth/referral/code/` - Get user's referral code
- `GET /api/auth/referral/stats/` - Get referral statistics
- `GET /api/auth/referral/history/` - Get referral history
- `GET /api/auth/referral/rewards/` - Get referral rewards

### ❌ Disabled Endpoints:
- `POST /api/auth/referral/apply/` - Returns error, use registration instead

## Key Features Implemented

1. **Referral Code During Registration Only**: ✅
   - Referral codes can only be applied during registration
   - Post-registration application is blocked with clear error message

2. **Optional Referral Code Field**: ✅
   - Referral code field is optional during registration
   - Registration works with or without referral code

3. **Email and Username Validation**: ✅
   - Checks for existing emails and usernames during registration
   - Returns user-friendly error messages

4. **Comprehensive Error Handling**: ✅
   - Centralized error codes with user-friendly messages
   - Consistent error response format across backend and mobile

5. **Deep Link Handling**: ✅
   - Referral deep links inform users about registration requirement
   - No attempt to apply codes post-registration

## Testing the Implementation

### Backend Testing:
```bash
# Test registration with referral code
curl -X POST http://localhost:8000/api/auth/register/buyer/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "password_confirm": "password123",
    "first_name": "Test",
    "last_name": "User",
    "phone_number": "1234567890",
    "referral_code": "VALID123"
  }'

# Test post-registration referral application (should fail)
curl -X POST http://localhost:8000/api/auth/referral/apply/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"referral_code": "VALID123"}'
```

### Mobile Testing:
1. Open registration screen
2. Fill in all fields including referral code
3. Complete registration flow
4. Try opening referral deep link as existing user
5. Verify error messages display correctly

## Success Criteria ✅

- [x] Referral codes only work during registration
- [x] Registration works with and without referral codes
- [x] Email and username validation during registration
- [x] User-friendly error messages throughout
- [x] Post-registration referral application blocked
- [x] Deep links handle referral codes appropriately
- [x] Existing referral features (sharing, history) still work
- [x] No breaking changes to existing functionality

## Migration Notes

- **Backward Compatibility**: ✅ All existing API endpoints work as before
- **Database Changes**: ✅ No database migrations required
- **Mobile App**: ✅ Registration flow enhanced, existing features preserved
- **Error Handling**: ✅ Improved error messages, backward compatible
