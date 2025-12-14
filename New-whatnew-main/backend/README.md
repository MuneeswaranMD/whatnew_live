# Livestream Ecommerce Backend

A Django-based backend API for a livestream ecommerce platform built for the Indian market.

## Features

### For Buyers (Mobile App)
- User registration and authentication
- Join live streams
- Participate in product bidding
- Shopping cart management
- Order placement and tracking
- Razorpay payment integration
- Order history

### For Sellers (Web App)
- Seller registration with verification process
- Product management (create, update, delete)
- Livestream creation and management
- Real-time bidding controls
- Order management
- Payment and withdrawal management
- Credit system for livestream usage
- Chat moderation

### Technical Features
- Real-time WebSocket connections for live streaming and chat
- Agora integration for video streaming
- Razorpay payment gateway integration
- Real-time bidding system
- Credit-based livestream pricing
- Comprehensive admin panel
- RESTful API design

## API Endpoints

### Authentication
- `POST /api/auth/register/buyer/` - Buyer registration
- `POST /api/auth/register/seller/` - Seller registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/update/` - Update user profile

### Products
- `GET /api/products/categories/` - List categories
- `GET /api/products/products/` - List products
- `POST /api/products/products/` - Create product (sellers only)
- `GET /api/products/products/{id}/` - Get product details
- `PUT /api/products/products/{id}/` - Update product
- `DELETE /api/products/products/{id}/` - Delete product

### Livestreams
- `GET /api/livestreams/livestreams/` - List livestreams
- `POST /api/livestreams/livestreams/` - Create livestream
- `GET /api/livestreams/livestreams/live_now/` - Get live streams
- `POST /api/livestreams/livestreams/{id}/start/` - Start livestream
- `POST /api/livestreams/livestreams/{id}/end/` - End livestream
- `POST /api/livestreams/livestreams/{id}/join/` - Join livestream
- `POST /api/livestreams/biddings/{id}/place-bid/` - Place bid

### Orders
- `GET /api/orders/cart/` - Get cart
- `POST /api/orders/cart/add/` - Add to cart
- `DELETE /api/orders/cart/remove/` - Remove from cart
- `POST /api/orders/orders/create/` - Create order
- `GET /api/orders/orders/` - List orders

### Payments
- `POST /api/payments/create-order/` - Create Razorpay order
- `POST /api/payments/verify-payment/` - Verify payment
- `POST /api/payments/credits/purchase/` - Purchase credits
- `GET /api/payments/seller/earnings/` - Get seller earnings

### Chat
- `GET /api/chat/messages/{livestream_id}/` - Get chat messages
- `POST /api/chat/messages/{livestream_id}/send/` - Send message
- `POST /api/chat/livestreams/{livestream_id}/ban-user/` - Ban user

## WebSocket Endpoints

### Livestream
- `ws://localhost:8000/ws/livestream/{livestream_id}/` - Livestream events

### Chat
- `ws://localhost:8000/ws/chat/{livestream_id}/` - Real-time chat

## Setup Instructions

### Prerequisites
- Python 3.8+
- Redis server
- PostgreSQL (optional, SQLite for development)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Razorpay Settings
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Agora Settings
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
```

5. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create sample data
```bash
python manage.py create_sample_data
```

7. Create superuser (optional)
```bash
python manage.py createsuperuser
```

8. Run the server
```bash
python manage.py runserver
```
OR

```bash
uvicorn livestream_ecommerce.asgi:application --host 192.168.31.247 --port 8000 --reload
```

### Redis Setup
Make sure Redis is running on localhost:6379, or update the CHANNEL_LAYERS configuration in settings.py.

## Testing

### Sample Accounts
After running `create_sample_data` command:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Buyer:**
- Username: `buyer1`
- Password: `buyer123`

**Seller:**
- Username: `seller1`
- Password: `seller123`

### API Testing
Use tools like Postman or curl to test the API endpoints. Import the included Postman collection for comprehensive testing.

## Project Structure

```
backend/
├── accounts/          # User management and authentication
├── products/          # Product and category management
├── livestreams/       # Livestream and bidding functionality
├── orders/           # Cart and order management
├── payments/         # Payment processing and credits
├── chat/             # Real-time chat functionality
├── livestream_ecommerce/  # Main project settings
├── static/           # Static files
├── media/            # User uploaded files
├── templates/        # HTML templates
├── requirements.txt  # Python dependencies
└── manage.py         # Django management script
```

## Key Models

### User Management
- `CustomUser` - Extended user model with buyer/seller types
- `BuyerProfile` - Buyer-specific information
- `SellerProfile` - Seller verification and credit management

### Products
- `Category` - Product categories
- `Product` - Product information
- `ProductImage` - Product images

### Livestreams
- `LiveStream` - Livestream information
- `ProductBidding` - Bidding sessions
- `Bid` - Individual bids

### Orders
- `Cart` & `CartItem` - Shopping cart
- `Order` & `OrderItem` - Order management
- `OrderTracking` - Order status tracking

### Payments
- `Payment` - Payment records
- `CreditPurchase` - Credit purchases
- `SellerEarnings` - Seller earnings tracking
- `WithdrawalRequest` - Withdrawal requests

## Business Logic

### Credit System
- Sellers receive 1 free credit upon verification
- Each livestream consumes 1 credit per 30 minutes
- Credits can be purchased via Razorpay

### Bidding System
- Real-time bidding during livestreams
- Highest bidder wins the product
- Winner's product is automatically added to cart

### Payment Flow
1. Create Razorpay order
2. Frontend handles payment
3. Verify payment signature
4. Update order status
5. Process seller earnings

### Order Management
- Buyers place orders from cart
- Sellers manage order fulfillment
- Automatic earnings calculation
- Withdrawal system for sellers

## Security Features

- JWT-based authentication
- Razorpay signature verification
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)
- File upload restrictions

## Deployment

### Production Settings
- Set `DEBUG=False`
- Configure PostgreSQL database
- Set up Redis for production
- Configure static file serving
- Set up SSL certificates
- Configure email backend

### Environment Variables
Ensure all required environment variables are set in production:
- Database credentials
- Razorpay keys
- Agora credentials
- Secret keys
- Email configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
