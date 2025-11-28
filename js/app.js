// js/app.js
// This controls the Cart, Checkout, and Admin Panel using Browser Memory (LocalStorage)

// 1. Initialize Cart
let cart = JSON.parse(localStorage.getItem('lokalCart')) || [];

// 2. Select Elements from HTML
const productContainer = document.getElementById('product-list');
const cartContainer = document.getElementById('cart-items');
const totalContainer = document.getElementById('cart-total');
const checkoutList = document.getElementById('checkout-cart-list');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutForm = document.getElementById('checkout-form');
const adminTable = document.getElementById('admin-orders-table');

// --- DISPLAY PRODUCTS (Index Page) ---
function displayProducts() {
    if (!productContainer) return;
    productContainer.innerHTML = '';
    
    // products is available globally from js/db.js
    products.forEach(product => {
        // Fallback if image fails to load
        const imgPath = product.img || 'https://via.placeholder.com/300?text=No+Image';
        
        productContainer.innerHTML += `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${imgPath}" class="card-img-top" style="height:200px; object-fit:cover;" onerror="this.src='https://via.placeholder.com/300?text=Image+Missing'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">RM ${product.price.toFixed(2)}</p>
                        <button class="btn btn-warning mt-auto text-white" onclick="addToCart('${product.id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// --- CART FUNCTIONS ---
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const prod = products.find(p => p.id === id);
        if (prod) cart.push({ ...prod, qty: 1 });
    }
    saveCart();
    alert("Item added to cart!");
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function saveCart() {
    localStorage.setItem('lokalCart', JSON.stringify(cart));
    // Update view if on cart/checkout page
    if (cartContainer) renderCartPage();
    if (checkoutList) renderCheckout();
}

// --- RENDER CART PAGE ---
function renderCartPage() {
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    let total = 0;
    
    if(cart.length === 0) {
        cartContainer.innerHTML = '<tr><td colspan="6" class="text-center">Your cart is empty.</td></tr>';
        totalContainer.innerText = '0.00';
        return;
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        cartContainer.innerHTML += `
            <tr>
                <td><img src="${item.img}" width="50" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td>${item.name}</td>
                <td>RM ${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>RM ${(item.price * item.qty).toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">X</button></td>
            </tr>
        `;
    });
    totalContainer.innerText = total.toFixed(2);
}

// --- RENDER CHECKOUT PAGE ---
function renderCheckout() {
    if (!checkoutList) return;
    checkoutList.innerHTML = '';
    let total = 0;
    let qty = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        qty += item.qty;
        checkoutList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div><h6 class="my-0">${item.name}</h6><small class="text-muted">Qty: ${item.qty}</small></div>
                <span class="text-muted">RM ${(item.price * item.qty).toFixed(2)}</span>
            </li>
        `;
    });

    const countBadge = document.getElementById('cart-count');
    if(countBadge) countBadge.innerText = qty;
    if(checkoutTotal) checkoutTotal.innerText = 'RM ' + total.toFixed(2);
}

// --- CHECKOUT SUBMIT (Simulated Database) ---
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = document.querySelector('button[type="submit"]');
        btn.innerText = "Processing...";
        btn.disabled = true;

        const newOrder = {
            id: Date.now(), // Unique ID
            date: new Date().toLocaleString(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            items: cart,
            total: checkoutTotal.innerText,
            status: "New"
        };

        // SAVE TO LOCAL STORAGE (The "Database" for your presentation)
        let allOrders = JSON.parse(localStorage.getItem('lokalOrders')) || [];
        allOrders.push(newOrder);
        localStorage.setItem('lokalOrders', JSON.stringify(allOrders));

        // Fake Payment Processing Delay
        setTimeout(() => {
            localStorage.removeItem('lokalCart'); // Clear cart
            window.location.href = 'confirmation.html';
        }, 1500);
    });
}

// --- ADMIN PANEL LOGIC ---
function loadAdminOrders() {
    if (!adminTable) return;
    
    const allOrders = JSON.parse(localStorage.getItem('lokalOrders')) || [];
    adminTable.innerHTML = '';

    if (allOrders.length === 0) {
        adminTable.innerHTML = '<tr><td colspan="5" class="text-center">No orders found.</td></tr>';
        return;
    }

    // Show newest orders first
    allOrders.reverse().forEach(order => {
        const itemsString = order.items.map(i => `${i.name} (x${i.qty})`).join(', ');
        
        adminTable.innerHTML += `
            <tr>
                <td>${order.date}</td>
                <td>${order.name}<br><small>${order.email}</small></td>
                <td>${itemsString}</td>
                <td>${order.total}</td>
                <td><span class="badge bg-success">${order.status}</span></td>
            </tr>
        `;
    });
}

// --- GLOBAL ATTACHMENT & INITIALIZE ---

// Attach functions to the window so HTML 'onclick' attributes can access them
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

// Run the necessary functions when the page loads
window.onload = () => {
    displayProducts();
    renderCartPage();
    renderCheckout();
    loadAdminOrders();
};
