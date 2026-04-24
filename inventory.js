// inventory.js

// Ensure user is logged in (optional check)
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    updateCartBadge();
    
    document.getElementById("logoutBtn").addEventListener("click", () => {
        window.location.href = "login.html";
    });
});

async function loadProducts() {
    const productsGrid = document.getElementById("productsGrid");
    const loadingMessage = document.getElementById("loadingMessage");
    
    try {
        // Fetch products from Firebase collection "products"
        const snapshot = await db.collection("products").get();
        productsGrid.innerHTML = ""; // Clear existing
        loadingMessage.style.display = "none";

        if (snapshot.empty) {
            productsGrid.innerHTML = "<p style='color:white;'>No products found in database.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const product = doc.data();
            product.id = doc.id; // Store document ID
            
            // Build the card HTML
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" alt="${product.productName}">
                <h3>${product.productName}</h3>
                <p>Code: ${product.productCode}</p>
                <p>Unit Price: ₱${product.unitPrice}</p>
                <p>Available: ${product.quantity}</p>
                <input type="number" id="qty-${product.id}" value="1" min="1" max="${product.quantity}">
                <button class="btn btn-login add-to-cart-btn" onclick="addToCart('${product.id}', '${product.productName}', ${product.unitPrice}, ${product.quantity})">
                    Add to Cart
                </button>
            `;
            productsGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading products:", error);
        loadingMessage.innerHTML = "Error loading products! Check Console (F12).";
    }
}

function addToCart(productId, name, price, maxQty) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const selectedQty = parseInt(qtyInput.value);

    if (selectedQty <= 0 || selectedQty > maxQty) {
        alert("Invalid quantity!");
        return;
    }

    // Retrieve cart from LocalStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already in cart
    const existingIndex = cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity += selectedQty;
        if (cart[existingIndex].quantity > maxQty) {
            alert("Exceeds maximum available stock!");
            cart[existingIndex].quantity = maxQty; // cap at max
        }
    } else {
        // Add new item
        cart.push({
            productId: productId,
            productName: name,
            unitPrice: price,
            quantity: selectedQty
        });
    }

    // Save back to LocalStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
    updateCartBadge();
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartBadge").innerText = totalItems;
}
