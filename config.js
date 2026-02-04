// Payment Configuration
const PaymentConfig = {
    // Authorize.Net Configuration
    authorizeNet: {
        apiLoginID: '7t37xPX5',
        clientKey: '8S4jDQprdt5cULV5mR9AA4tHgV4Yw68W48t7Fm2f7naftQRgZXdygSdXLA6t732F',
        transactionKey: '8Wp4F4T9fqK5gq6M',
        signatureKey: 'EBA0C8BDB015B802F92683B2BDDD5362EDB5BAAE09B3DA0693990B574602D5541A73EE5D45C6D2A8C70A48CA20A2A30798CCDE256A44ECC22E0DC519CA170CFF',
        environment: 'PRODUCTION' // Using production credentials
    },

    // Zelle Configuration
    zelle: {
        businessName: 'PULSE MEDIA LABS',
        handle: 'dixx-co',
        qrCode: 'zelle-qr-code.jpg' // Zelle QR code image
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
