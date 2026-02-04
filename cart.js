// Shopping Cart Management System
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('dixxCart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('dixxCart', JSON.stringify(this.items));
        this.updateCartUI();
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item =>
            item.id === product.id &&
            item.size === product.size &&
            item.color === product.color
        );

        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                size: product.size,
                color: product.color,
                image: product.image,
                quantity: product.quantity
            });
        }

        this.saveCart();
        this.showNotification(`${product.name} added to cart!`);
    }

    // Remove item from cart
    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.items[index].quantity = quantity;
            this.saveCart();
        }
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Calculate subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Check if bundle pricing applies
    isBundleEligible() {
        return this.getItemCount() >= 5;
    }

    // Calculate bundle discount
    getBundleDiscount() {
        if (this.isBundleEligible()) {
            const subtotal = this.getSubtotal();
            const bundlePrice = 99;
            return Math.max(0, subtotal - bundlePrice);
        }
        return 0;
    }

    // Calculate Zelle discount
    getZelleDiscount() {
        return this.isBundleEligible() ? 20 : 0;
    }

    // Get total with discounts
    getTotal(applyZelleDiscount = false) {
        const subtotal = this.getSubtotal();
        const bundleDiscount = this.getBundleDiscount();
        const zelleDiscount = applyZelleDiscount ? this.getZelleDiscount() : 0;

        return Math.max(0, subtotal - bundleDiscount - zelleDiscount);
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveCart();
    }

    // Update cart icon badge
    updateCartUI() {
        const badge = document.querySelector('.cart-badge');
        const count = this.getItemCount();

        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart function for product pages
function addToCart(productData) {
    // Get selected options
    const sizeSelect = document.querySelector('select[name="size"]');
    const colorSelect = document.querySelector('select[name="color"]') ||
        document.querySelector('.color-option.selected');
    const quantityInput = document.querySelector('input[name="quantity"]');

    // Validate selections
    if (sizeSelect && !sizeSelect.value) {
        alert('Please select a size');
        return;
    }

    const product = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        size: sizeSelect ? sizeSelect.value : 'One Size',
        color: colorSelect ? (colorSelect.value || colorSelect.dataset.color) : 'Default',
        image: productData.image,
        quantity: quantityInput ? parseInt(quantityInput.value) : 1
    };

    cart.addItem(product);
}

// Quick add to cart (for landing page)
function quickAddToCart(productId, productName, productPrice, productImage) {
    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        size: 'M', // Default size for quick add
        color: 'Default',
        image: productImage,
        quantity: 1
    };

    cart.addItem(product);
}
