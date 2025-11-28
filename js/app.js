// js/app.js

// 1. Initialize Cart
let cart = JSON.parse(localStorage.getItem('lokalCart')) || [];
let currentProduct = null; // To track which product is in the modal

// 2. DOM Elements
const productContainer = document.getElementById('product-list');
const cartContainer = document.getElementById('cart-items');
const checkoutList = document.getElementById('checkout-cart-list');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutForm = document.getElementById('checkout-form');
const adminTable = document.getElementById('admin-orders-table');

// --- DISPLAY PRODUCTS (Index Page) ---
function displayProducts() {
    if (!productContainer) return;
    productContainer.innerHTML = '';
    
    products.forEach(product => {
        const imgPath = product.img || 'https://via.placeholder.com/300?text=No+Image';
        
        productContainer.innerHTML += `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card h-100 shadow-sm border-0" onclick="openModal('${product.id}')" style="cursor: pointer;">
                    <img src="${imgPath}" class="card-img-top" style="height:200px; object-fit:cover;" onerror="this.src='https://via.placeholder.com/300?text=Image+Missing'">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${product.name}</h5>
                        <p class="card-text text-muted">RM ${product.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// --- MODAL FUNCTIONS (Like Grab) ---
function openModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    // Reset Modal UI
    document.getElementById('modal-img').src = currentProduct.img;
    document.getElementById('modal-title').innerText = currentProduct.name;
    document.getElementById('modal-price').innerText = currentProduct.price.toFixed(2);
    document.getElementById('modal-note').value = '';
    document.getElementById('modal-qty').innerText = '1';
    
    updateModalButton(1);

    // Show Bootstrap Modal
    const myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show();
}

function adjustModalQty(change) {
    const qtySpan = document.getElementById('modal-qty');
    let currentQty = parseInt(qtySpan.innerText);
    let newQty = currentQty + change;

    if (newQty < 1) newQty = 1;

    qtySpan.innerText = newQty;
    updateModalButton(newQty);
}

function updateModalButton(qty) {
    if (!currentProduct) return;
    const total = (currentProduct.price * qty).toFixed(2);
    document.getElementById('modal-btn-price').innerText = `RM ${total}`;
}

function addToCartFromModal() {
    if (!currentProduct) return;

    const qty = parseInt(document.getElementById('modal-qty').innerText);
    const note = document.getElementById('modal-note').value;

    // Add to Cart Logic
    const existing = cart.find(item => item.id === currentProduct.id && item.note === note);
    
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...currentProduct, qty: qty, note: note });
    }

    saveCart();

    // Close Modal
    const modalEl = document.getElementById('productModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    alert(`Added ${qty} ${currentProduct.name} to basket!`);
}

// --- STANDARD FUNCTIONS ---
function removeFromCart(id) {
    // Note: This removes all items with that ID, ignoring notes for simplicity in this demo
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function saveCart() {
    localStorage.setItem('lokalCart', JSON.stringify(cart));
    if (cartContainer) renderCartPage();
    if (checkoutList) renderCheckout();
}

// --- RENDER CART PAGE ---
function renderCartPage() {
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    let total = 0;
    
    if(cart.length === 0) {
        cartContainer.innerHTML = '<tr><td colspan="6" class="text-center">Basket is empty</td></tr>';
        document.getElementById('cart-total').innerText = '0.00';
        return;
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        const noteHtml = item.note ? `<br><small class="text-muted fst-italic">Note: ${item.note}</small>` : '';
        
        cartContainer.innerHTML += `
            <tr>
                <td><img src="${item.img}" width="50" style="border-radius:5px;"></td>
                <td>${item.name} ${noteHtml}</td>
                <td>RM ${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>RM ${(item.price * item.qty).toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm rounded-circle" onclick="removeFromCart('${item.id}')">x</button></td>
            </tr>
        `;
    });
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

// --- RENDER CHECKOUT ---
function renderCheckout() {
    if (!checkoutList) return;
    checkoutList.innerHTML = '';
    let total = 0;
    let qty = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        qty += item.qty;
        const noteHtml = item.note ? `<div class="text-muted small">Note: ${item.note}</div>` : '';

        checkoutList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    ${noteHtml}
                    <small class="text-muted">Qty: ${item.qty}</small>
                </div>
                <span class="text-muted">RM ${(item.price * item.qty).toFixed(2)}</span>
            </li>
        `;
    });
    
    if(document.getElementById('cart-count')) document.getElementById('cart-count').innerText = qty;
    if(checkoutTotal) checkoutTotal.innerText = 'RM ' + total.toFixed(2);
}

// --- CHECKOUT SUBMIT ---
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.querySelector('button[type="submit"]');
        btn.innerText = "Processing...";
        btn.disabled = true;

        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            items: cart,
            total: checkoutTotal.innerText,
            status: "New"
        };

        let allOrders = JSON.parse(localStorage.getItem('lokalOrders')) || [];
        allOrders.push(newOrder);
        localStorage.setItem('lokalOrders', JSON.stringify(allOrders));

        setTimeout(() => {
            localStorage.removeItem('lokalCart');
            window.location.href = 'confirmation.html';
        }, 1500);
    });
}

// --- ADMIN PANEL ---
function loadAdminOrders() {
    if (!adminTable) return;
    const allOrders = JSON.parse(localStorage.getItem('lokalOrders')) || [];
    adminTable.innerHTML = '';

    if (allOrders.length === 0) {
        adminTable.innerHTML = '<tr><td colspan="6" class="text-center">No orders found.</td></tr>';
        return;
    }

    allOrders.reverse().forEach(order => {
        const itemsString = order.items.map(i => `${i.name} (x${i.qty}) ${i.note ? '['+i.note+']' : ''}`).join(', ');
        const firstItem = order.items[0];
        const imagePath = firstItem ? firstItem.img : '';

        adminTable.innerHTML += `
            <tr>
                <td>${order.date}</td>
                <td>${order.name}<br><small>${order.email}</small></td>
                <td><img src="${imagePath}" width="50" style="border-radius:4px;"></td>
                <td>${itemsString}</td>
                <td>${order.total}</td>
                <td><span class="badge bg-success">${order.status}</span></td>
            </tr>
        `;
    });
}

// GLOBAL
window.openModal = openModal;
window.adjustModalQty = adjustModalQty;
window.addToCartFromModal = addToCartFromModal;
window.removeFromCart = removeFromCart;

window.onload = () => {
    displayProducts();
    renderCartPage();
    renderCheckout();
    loadAdminOrders();
};
