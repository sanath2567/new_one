// Razorpay Configuration (TEST MODE ONLY)
// This is for demonstration and functional validation only

export const RAZORPAY_CONFIG = {
    // Test mode key - Replace with your actual test key
    keyId: 'rzp_test_YOUR_KEY_ID',
    keySecret: 'YOUR_TEST_KEY_SECRET',

    // Test mode enabled
    testMode: true,

    // Currency
    currency: 'INR',

    // Company details
    companyName: 'Crime Rate Analysis Platform',
    companyLogo: '', // Optional logo URL

    // Theme
    theme: {
        color: '#3b82f6'
    }
}

// Plan pricing (in paise for Razorpay - multiply by 100)
export const PLAN_PRICING = {
    USER_MONTHLY: {
        amount: 99900, // ₹999 in paise
        currency: 'INR',
        name: 'User Plan - Monthly',
        description: 'Access to crime analytics dashboard',
        duration: 1 // months
    },
    USER_YEARLY: {
        amount: 999900, // ₹9,999 in paise
        currency: 'INR',
        name: 'User Plan - Yearly',
        description: 'Access to crime analytics dashboard (12 months)',
        duration: 12 // months
    },
    ADMIN_MONTHLY: {
        amount: 499900, // ₹4,999 in paise
        currency: 'INR',
        name: 'Admin Plan - Monthly',
        description: 'Advanced analytics and case management',
        duration: 1 // months
    },
    ADMIN_YEARLY: {
        amount: 4999900, // ₹49,999 in paise
        currency: 'INR',
        name: 'Admin Plan - Yearly',
        description: 'Advanced analytics and case management (12 months)',
        duration: 12 // months
    }
}

// Helper function to load Razorpay script
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

// Helper function to create Razorpay order options
export const createRazorpayOptions = (planKey, userEmail, onSuccess, onFailure) => {
    const plan = PLAN_PRICING[planKey]

    return {
        key: RAZORPAY_CONFIG.keyId,
        amount: plan.amount,
        currency: plan.currency,
        name: RAZORPAY_CONFIG.companyName,
        description: plan.description,
        image: RAZORPAY_CONFIG.companyLogo,
        prefill: {
            email: userEmail
        },
        theme: RAZORPAY_CONFIG.theme,
        handler: function (response) {
            // Payment successful
            onSuccess({
                paymentId: response.razorpay_payment_id,
                planKey: planKey,
                plan: plan
            })
        },
        modal: {
            ondismiss: function () {
                // Payment cancelled
                onFailure('Payment cancelled by user')
            }
        }
    }
}
