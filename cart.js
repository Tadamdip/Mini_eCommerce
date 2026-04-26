// cart.js

document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    document.getElementById("checkoutBtn").addEventListener("click", checkout);
});

function loadCart() {
    const cartContent = document.getElementById("cartContent");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContent.innerHTML = "<p>Your cart is empty!</p>";
        document.getElementById("checkoutBtn").style.display = "none";
        return;
    }

    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
            </tr>
    `;

    let grandTotal = 0;

    cart.forEach((item, index) => {
        const rowTotal = item.unitPrice * item.quantity;
        grandTotal += rowTotal;

        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.3);">
                <td style="padding: 10px;">${item.productName}</td>
                <td style="text-align: center;">₱${item.unitPrice}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: center;">₱${rowTotal}</td>
                <td style="text-align: center;">
                    <button onclick="removeItem(${index})" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
                </td>
            </tr>
        `;
    });

    html += `</table>`;
    html += `<h3 style="text-align: right; margin-top: 20px;">Grand Total: ₱${grandTotal}</h3>`;

    cartContent.innerHTML = html;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // redraw
}

async function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    const confirmCheckout = confirm("Are you sure you want to finalize your purchase?");
    if (!confirmCheckout) return;

    try {
        // We use a Firestore Batched Write to deduct all stock safely at once
        const batch = db.batch();

        cart.forEach(item => {
            const productRef = db.collection("products").doc(item.productId);
            // Firebase FieldValue.increment handles subtraction when negative
            batch.update(productRef, {
                quantity: firebase.firestore.FieldValue.increment(-item.quantity)
            });
        });

        // Commit the database update
        await batch.commit();

        // Clear local cart
        localStorage.removeItem("cart");

        alert("Checkout successful! Stock has been deducted.");
        window.location.href = "inventory.html"; // Go back home

    } catch (error) {
        console.error("Error during checkout:", error);
        alert("An error occurred during checkout. Please check the console.");
    }
}
