// Payment Configuration
const PaymentConfig = {
    // Authorize.Net Configuration
    authorizeNet: {
        apiLoginID: 'YOUR_API_LOGIN_ID', // To be replaced with actual credentials
        clientKey: 'YOUR_PUBLIC_CLIENT_KEY', // To be replaced with actual credentials
        environment: 'SANDBOX' // Change to 'PRODUCTION' for live transactions
    },

    // Zelle Configuration
    zelle: {
        email: 'payments@dixxco.com', // Replace with actual Zelle email
        phone: '(555) 123-4567', // Replace with actual Zelle phone
        qrCode: 'zelle-qr-code.png' // Replace with actual QR code image path
    },

    // Pricing
    shipping: {
        standard: 0, // Free shipping
        express: 12.99
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentConfig;
}
