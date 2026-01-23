# Razorpay Test Credentials

This document contains test credentials for the Razorpay payment gateway integration in the Crime Rate Analysis Platform.

## Current Status

The application currently uses a **simulated payment gateway** that mimics Razorpay's UI and behavior. This is perfect for development and testing without requiring actual Razorpay API integration.

## Test Credentials (Simulated Mode)

When using the payment modal, you can use any of these test card details:

### Test Credit Cards

| Card Network | Card Number | Expiry Date | CVV | Expected Result |
|--------------|-------------|-------------|-----|-----------------|
| Visa | 4111 1111 1111 1111 | Any future date | Any 3 digits | Click "Success" button |
| Mastercard | 5555 5555 5555 4444 | Any future date | Any 3 digits | Click "Success" button |
| American Express | 3782 822463 10005 | Any future date | Any 4 digits | Click "Success" button |

### How to Test

1. Navigate to the **Pricing** page (`/pricing`)
2. Click **"Get Started"** on any plan
3. The payment modal will open with Razorpay branding
4. Enter any test card details from the table above
5. Click either:
   - **"Success"** button to simulate successful payment
   - **"Failure"** button to simulate failed payment

### What Happens on Success

- Success animation plays
- User's subscription is activated in Firebase
- `subscriptionStatus` is set to `'active'`
- `subscriptionPlan` is set to the selected plan
- User is redirected to their dashboard
- Full platform access is granted (no trial restrictions)

## Switching to Real Razorpay Integration

If you want to integrate with actual Razorpay API, follow these steps:

### 1. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Generate Test Mode keys:
   - **Key ID**: `rzp_test_XXXXXXXXXXXX`
   - **Key Secret**: `XXXXXXXXXXXXXXXXXXXX`

### 2. Install Razorpay SDK

```bash
npm install razorpay
```

### 3. Create Razorpay Configuration

Create a new file `src/config/razorpay.js`:

```javascript
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID
export const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET
```

### 4. Update Environment Variables

Create `.env` file in the project root:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
VITE_RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXX
```

### 5. Update DummyPaymentModal.jsx

Replace the simulated payment logic with actual Razorpay integration:

```javascript
import { RAZORPAY_KEY_ID } from '../config/razorpay'

const handleRazorpayPayment = () => {
    const options = {
        key: RAZORPAY_KEY_ID,
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
        name: 'CrimeWatch Analytics',
        description: `${plan.name} Subscription`,
        handler: function (response) {
            // Payment successful
            onSuccess(plan)
        },
        prefill: {
            email: user?.email,
            contact: user?.phone || ''
        },
        theme: {
            color: '#3b82f6'
        }
    }
    
    const razorpay = new window.Razorpay(options)
    razorpay.open()
}
```

### 6. Add Razorpay Script to index.html

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

## Razorpay Test Cards (Real Integration)

When using actual Razorpay integration in test mode:

### Successful Payments

| Card Number | Network | Description |
|-------------|---------|-------------|
| 4111 1111 1111 1111 | Visa | Successful payment |
| 5555 5555 5555 4444 | Mastercard | Successful payment |
| 3782 822463 10005 | American Express | Successful payment |

### Failed Payments

| Card Number | Network | Error |
|-------------|---------|-------|
| 4000 0000 0000 0002 | Visa | Card declined |
| 4000 0000 0000 0069 | Visa | Expired card |
| 4000 0000 0000 0119 | Visa | Processing error |

### Test UPI IDs

- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

### Test Netbanking

- Select any bank from the test mode list
- All test mode banks will show a success/failure simulator

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit API keys** to version control
2. Use environment variables for all sensitive data
3. Keep test and production keys separate
4. Rotate keys regularly
5. Use webhook signatures to verify payment authenticity
6. Implement server-side payment verification

## Support

For issues with Razorpay integration:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)

---

**Last Updated**: January 23, 2026
