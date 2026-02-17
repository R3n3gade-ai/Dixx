// Checkout Page JavaScript
let selectedPaymentMethod = 'credit-card';
let stripe;
let cardElement;

// Initialize Stripe
function initializeStripe() {
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js not loaded');
        return;
    }

    stripe = Stripe(PaymentConfig.stripe.publishableKey);
    const elements = stripe.elements();

    // Create card element with custom styling
    cardElement = elements.create('card', {
        style: {
            base: {
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                },
            },
            invalid: {
                color: '#ff4444',
                iconColor: '#ff4444',
            },
        },
    });

    // Mount card element
    cardElement.mount('#card-element');

    // Handle real-time validation errors
    cardElement.on('change', function (event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

// Load order summary
function loadOrderSummary() {
    const itemsContainer = document.getElementById('summaryItems');
    const totalsContainer = document.getElementById('summaryTotals');

    if (cart.items.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // Render items
    const itemsHTML = cart.items.map(item => `
        <div class="summary-item">
            <span>${item.name} (${item.size}, ${item.color}) x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    itemsContainer.innerHTML = itemsHTML;

    // Calculate totals
    const subtotal = cart.getSubtotal();
    const bundleDiscount = cart.getBundleDiscount();
    const zelleDiscount = selectedPaymentMethod === 'zelle' ? cart.getZelleDiscount() : 0;
    const total = cart.getTotal(selectedPaymentMethod === 'zelle');
    const isBundleEligible = cart.isBundleEligible();

    let totalsHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
    `;

    if (bundleDiscount > 0) {
        totalsHTML += `
            <div class="summary-row discount">
                <span>Bundle Discount (5+ pairs)</span>
                <span>-$${bundleDiscount.toFixed(2)}</span>
            </div>
        `;
    }

    if (zelleDiscount > 0) {
        totalsHTML += `
            <div class="summary-row discount">
                <span>Zelle Discount</span>
                <span>-$${zelleDiscount.toFixed(2)}</span>
            </div>
        `;
    }

    totalsHTML += `
        <div class="summary-row">
            <span>Shipping</span>
            <span>FREE</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;

    totalsContainer.innerHTML = totalsHTML;
}

// Payment method selection
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function () {
        selectedPaymentMethod = this.value;

        // Update UI
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
        this.closest('.payment-option').classList.add('selected');

        // Show/hide payment fields
        const creditCardFields = document.getElementById('creditCardFields');
        const zelleInstructions = document.getElementById('zelleInstructions');

        if (this.value === 'credit-card') {
            creditCardFields.classList.add('active');
            zelleInstructions.classList.remove('active');
        } else {
            creditCardFields.classList.remove('active');
            zelleInstructions.classList.add('active');
        }

        // Reload summary to show/hide Zelle discount
        loadOrderSummary();
    });
});

// Form validation and submission
document.getElementById('checkoutForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('placeOrderBtn');
    const errorMsg = document.getElementById('errorMessage');

    // Disable button
    btn.disabled = true;
    btn.textContent = 'Processing...';
    errorMsg.classList.remove('show');

    try {
        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
            paymentMethod: selectedPaymentMethod,
            items: cart.items,
            subtotal: cart.getSubtotal(),
            bundleDiscount: cart.getBundleDiscount(),
            zelleDiscount: selectedPaymentMethod === 'zelle' ? cart.getZelleDiscount() : 0,
            total: cart.getTotal(selectedPaymentMethod === 'zelle')
        };

        if (selectedPaymentMethod === 'credit-card') {
            // Process credit card payment
            await processCreditCardPayment(formData);
        } else {
            // Process Zelle order
            await processZelleOrder(formData);
        }

    } catch (error) {
        console.error('Checkout error:', error);
        errorMsg.textContent = error.message || 'An error occurred. Please try again.';
        errorMsg.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Place Order';
    }
});

// Process credit card payment with Stripe
async function processCreditCardPayment(orderData) {
    if (!stripe || !cardElement) {
        throw new Error('Stripe not initialized');
    }

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: `${orderData.firstName} ${orderData.lastName}`,
            email: orderData.email,
            phone: orderData.phone,
            address: {
                line1: orderData.address,
                city: orderData.city,
                state: orderData.state,
                postal_code: orderData.zip,
                country: orderData.country,
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    // In a production environment, you would send the paymentMethod.id to your backend
    // to create a payment intent and confirm the payment
    // For now, we'll simulate a successful payment

    console.log('Payment Method Created:', paymentMethod.id);

    // Simulate backend processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate order number
    const orderNumber = 'DIXX-' + Date.now();

    // Store order data
    const completeOrderData = {
        ...orderData,
        orderNumber,
        paymentMethodId: paymentMethod.id,
        paymentStatus: 'completed',
        orderDate: new Date().toISOString()
    };

    localStorage.setItem('lastOrder', JSON.stringify(completeOrderData));
    localStorage.setItem(`order_${orderNumber}`, JSON.stringify(completeOrderData));

    // Clear cart
    cart.clear();

    // Redirect to confirmation
    window.location.href = 'order-confirmation.html';
}

// Process Zelle order
async function processZelleOrder(orderData) {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate order number
    const orderNumber = 'DIXX-' + Date.now();

    // Store order data
    const zelleOrderData = {
        ...orderData,
        orderNumber,
        paymentStatus: 'pending-zelle',
        orderDate: new Date().toISOString()
    };

    localStorage.setItem('lastOrder', JSON.stringify(zelleOrderData));
    localStorage.setItem(`order_${orderNumber}`, JSON.stringify(zelleOrderData));

    // Clear cart
    cart.clear();

    // Redirect to confirmation
    window.location.href = 'order-confirmation.html';
}

// Initialize Stripe when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeStripe();
    loadOrderSummary();
});
