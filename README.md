# Glass Frame E-commerce Website

A full-stack e-commerce platform for a glass frame shop built with Next.js, MongoDB, and TypeScript.

## Features

- **User Authentication**
  - User signup and login
  - Password reset via email
  - JWT-based authentication

- **Product Management (Admin)**
  - Upload new glass frames with images
  - Edit product details (name, description, price)
  - Delete products

- **Shopping Experience**
  - Browse all available glass frames
  - View product details
  - Add single or multiple frames to cart
  - Update cart quantities
  - Remove items from cart

- **Order Management**
  - Place orders with shipping address
  - Mock payment processing
  - Order tracking with status updates
  - Admin can update order status and shipping details

- **Notifications**
  - In-app notifications for order updates
  - Email notifications for:
    - Order confirmations
    - Order status updates
    - Shipping updates
    - New orders (admin)

## Tech Stack

- **Frontend/Backend**: Next.js 14+ (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Next.js API routes
- **Email**: Nodemailer
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Email account for sending notifications (Gmail recommended)

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd glass-frame-shop
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/glass-frame-shop
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: For Gmail, you'll need to generate an App Password:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password for "Mail"
4. Use that password in `EMAIL_PASS`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating an Admin User

To create an admin user, you can either:

1. **Using MongoDB directly**: Update a user's role to 'admin' in the database
2. **Using the signup API**: Sign up normally, then manually change the role in MongoDB

Example MongoDB command:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Project Structure

```
glass-frame-shop/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── auth/              # Auth pages (login, signup, etc.)
│   ├── products/          # Product pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   └── orders/            # Order pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Auth components
│   ├── cart/             # Cart components
│   ├── notifications/    # Notification components
│   ├── orders/           # Order components
│   ├── products/         # Product components
│   └── shared/           # Shared components
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   ├── email.ts          # Email service
│   └── notifications.ts  # Notification service
├── models/               # MongoDB models
├── types/                # TypeScript types
└── public/               # Static files
    └── uploads/          # Uploaded product images
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart?productId=...` - Remove item from cart

### Orders
- `GET /api/orders` - Get orders (user's orders or all orders for admin)
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order (Admin)

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications` - Mark notifications as read

### Upload
- `POST /api/upload` - Upload product image (Admin)

## Usage

1. **As a Regular User**:
   - Sign up for an account
   - Browse products
   - Add items to cart
   - Checkout and place orders
   - Track your orders
   - Receive notifications about order updates

2. **As an Admin**:
   - Login with admin account
   - Access admin dashboard
   - Upload new products with images
   - Manage existing products
   - View all orders
   - Update order status and shipping details
   - Receive notifications about new orders

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`

## Notes

- The payment system is currently mocked - all payments succeed automatically
- Image uploads are stored in `public/uploads/`
- Make sure MongoDB is running before starting the app
- Email notifications require proper email configuration

## License

This project is open source and available for use.
