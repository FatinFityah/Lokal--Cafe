// js/app.js

// --- STATE ---
let cart = JSON.parse(localStorage.getItem('lokalCart')) || [];

// --- DOM ELEMENTS ---
const menuContainer = document.getElementById('menu-grid');
const cartCountBadge = document.getElementById('cart-count');

// --- INIT ---
window.onload = () => {
    // Determine which page we are on
    if (document.getElementById('menu-grid')) {
        renderMenu('all');
        setupFilters();
    }
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
    if (document.getElementById('checkout-summary')) {
        renderCheckout();
    }
    
    // Check if we are on Admin Page
    if (document.getElementById('admin-orders-pending')) {
        loadAdminOrders();
    }
    
    updateCartBadge();
};

// --- 1. RENDER MENU ---
function renderMenu(category) {
    if (!menuContainer) return;
    menuContainer.innerHTML = '';

    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    filtered.forEach(p => {
        menuContainer.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4 fade-in">
                <div class="product-card">
                    <div class="img-wrapper">
                        <img src="${p.img}" class="product-img" onerror="this.src='https://placehold.co/600x400/eee/31343C?text=No+Image'">
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-start mt-3">
                        <h5 class="product-title">${p.name}</h5>
                        <span class="price-tag">RM ${p.price.toFixed(2)}</span>
                    </div>
                    <p class="product-desc">${p.desc}</p>
                    
                    <div class="qty-control">
                        <button class="btn-qty-mini" onclick="updateCardQty('${p.id}', -1)">-</button>
                        <span id="qty-${p.id}">1</span>
                        <button class="btn-qty-mini" onclick="updateCardQty('${p.id}', 1)">+</button>
                    </div>

                    <button class="btn-add-cart" onclick="addToCart('${p.id}')">
                        <i class="bi bi-cart-plus-fill me-2"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    });
}

// --- 2. FILTER LOGIC ---
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const cat = e.target.dataset.filter;
            renderMenu(cat);
        });
    });
}

// --- 3. CART LOGIC ---
function updateCardQty(id, change) {
    const qtySpan = document.getElementById(`qty-${id}`);
    let current = parseInt(qtySpan.innerText);
    let newQty = current + change;
    if (newQty < 1) newQty = 1;
    qtySpan.innerText = newQty;
}

function addToCart(id) {
    const qtySpan = document.getElementById(`qty-${id}`);
    const qty = parseInt(qtySpan.innerText);
    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty: qty });
    }

    saveCart();
    alert(`Added ${qty} x ${product.name} to cart.`);
    qtySpan.innerText = 1; 
}

// --- 4. CART PAGE LOGIC ---
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-page-total');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-5"><h3>Your cart is empty</h3><a href="index.html" class="btn btn-dark mt-3">Back to Menu</a></div>';
        if(totalEl) totalEl.innerText = '0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        container.innerHTML += `
            <div class="row align-items-center border-bottom py-3">
                <div class="col-md-2 col-4">
                    <img src="${item.img}" class="img-fluid rounded" onerror="this.src='https://placehold.co/100'">
                </div>
                <div class="col-md-4 col-8">
                    <h5 class="fw-bold mb-1">${item.name}</h5>
                    <div class="text-muted">RM ${item.price.toFixed(2)}</div>
                </div>
                <div class="col-md-3 col-6 mt-3 mt-md-0 d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-dark rounded-circle" onclick="updateCartItemQty('${item.id}', -1)">-</button>
                    <span class="mx-3 fw-bold">${item.qty}</span>
                    <button class="btn btn-sm btn-outline-dark rounded-circle" onclick="updateCartItemQty('${item.id}', 1)">+</button>
                </div>
                <div class="col-md-2 col-6 mt-3 mt-md-0 text-end">
                    <span class="fw-bold">RM ${itemTotal.toFixed(2)}</span>
                </div>
                <div class="col-md-1 text-end">
                    <button class="btn text-danger" onclick="removeCartItem('${item.id}')">&times;</button>
                </div>
            </div>
        `;
    });

    if(totalEl) totalEl.innerText = total.toFixed(2);
}

function updateCartItemQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty < 1) item.qty = 1;
        saveCart();
        renderCartPage();
    }
}

function removeCartItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCartPage();
}

function saveCart() {
    localStorage.setItem('lokalCart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    if (cartCountBadge) {
        const count = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCountBadge.innerText = count;
        cartCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// --- 5. CHECKOUT ---
function renderCheckout() {
    const list = document.getElementById('checkout-summary');
    const totalEl = document.getElementById('checkout-total-price');
    let total = 0;
    list.innerHTML = '';
    
    cart.forEach(item => {
        total += item.price * item.qty;
        list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">Qty: ${item.qty}</small>
                </div>
                <span class="text-muted">RM ${(item.price * item.qty).toFixed(2)}</span>
            </li>
        `;
    });
    totalEl.innerText = 'RM ' + total.toFixed(2);
}

const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const order = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            name: document.getElementById('name').value,
            total: document.getElementById('checkout-total-price').innerText,
            items: cart,
            status: 'Pending'
        };

        const orders = JSON.parse(localStorage.getItem('lokalOrders')) || [];
        orders.push(order);
        localStorage.setItem('lokalOrders', JSON.stringify(orders));
        
        cart = [];
        saveCart();
        window.location.href = 'confirmation.html';
    });
}

// --- 6. ADMIN PANEL ---
function loadAdminOrders() {
    const pendingBody = document.getElementById('admin-orders-pending');
    const historyBody = document.getElementById('admin-orders-history');
    
    if (!pendingBody || !historyBody) return;

    const orders = JSON.parse(localStorage.getItem('lokalOrders')) || [];

    pendingBody.innerHTML = '';
    historyBody.innerHTML = '';

    if (orders.length === 0) {
        pendingBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No active orders.</td></tr>';
        historyBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No history yet.</td></tr>';
        return;
    }

    orders.reverse().forEach(o => {
        const itemsStr = o.items.map(i => `<div class="small">• ${i.name} (x${i.qty})</div>`).join('');
        
        if (o.status === 'Pending') {
            pendingBody.innerHTML += `
                <tr class="table-warning">
                    <td><strong>${o.date}</strong></td>
                    <td>${o.name}</td>
                    <td>${itemsStr}</td>
                    <td class="fw-bold">${o.total}</td>
                    <td>
                        <button class="btn btn-sm btn-success fw-bold px-3 shadow-sm" onclick="markOrderDone(${o.id})">
                            ✔ Done
                        </button>
                    </td>
                </tr>
            `;
        } else {
            historyBody.innerHTML += `
                <tr class="opacity-75">
                    <td>${o.date}</td>
                    <td>${o.name}</td>
                    <td>${itemsStr}</td>
                    <td>${o.total}</td>
                    <td><span class="badge bg-secondary">Completed</span></td>
                </tr>
            `;
        }
    });
}

window.markOrderDone = function(orderId) {
    const orders = JSON.parse(localStorage.getItem('lokalOrders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'Completed';
        localStorage.setItem('lokalOrders', JSON.stringify(orders));
        loadAdminOrders();
    }
};

window.resetSystem = function() {
    if(confirm("Are you sure you want to delete ALL orders?")) {
        localStorage.removeItem('lokalOrders');
        location.reload();
    }
};

// --- 7. LOGIN MODAL LOGIC ---
let currentLoginMode = 'customer'; 

function toggleLoginModal() {
    const overlay = document.getElementById('login-overlay');
    if(overlay) overlay.classList.toggle('d-none');
}

function switchLogin(mode) {
    currentLoginMode = mode;
    const btnCust = document.getElementById('btn-customer');
    const btnAdmin = document.getElementById('btn-admin');
    const inputUser = document.getElementById('login-user');

    if (mode === 'customer') {
        btnCust.classList.add('active');
        btnAdmin.classList.remove('active');
        inputUser.placeholder = "you@example.com";
    } else {
        btnAdmin.classList.add('active');
        btnCust.classList.remove('active');
        inputUser.placeholder = "Username (admin)";
    }
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const user = document.getElementById('login-user').value;
        const pass = document.getElementById('login-pass').value;

        if (currentLoginMode === 'admin') {
            if (user === 'admin' && pass === 'admin123') {
                alert('Welcome back, Admin.');
                window.location.href = 'admin.html'; 
            } else {
                alert('Wrong Admin Username or Password!');
            }
        } else {
            alert('Welcome back, Customer!');
            toggleLoginModal(); 
        }
    });
}

const signinBtn = document.querySelector('.btn-signin');
if (signinBtn) {
    signinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLoginModal();
    });
}
