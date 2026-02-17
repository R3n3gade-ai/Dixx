// Payment Configuration
const PaymentConfig = {
    // Stripe Configuration
    stripe: {
        publishableKey: 'pk_live_51SYwcoCJzOHOpfn0Htumh6LF5MPZNBvYuUXZNHDt2L8EvYjK3RgTjVetdjhQsfQ9Mi0HO9DRLdsRjdFCEw5SI2wd00lblswwoE',
        secretKey: 'mk_1SYwd1CJzOHOpfn0k9vxHdAq', // Keep secure - should be on backend only
        environment: 'LIVE' // Using live credentials
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
