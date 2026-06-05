const table = document.querySelector(".cart-table");
let totalPrice = 0;
if (localStorage.getItem("cart")) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach(item => {
    const row = document.createElement("tr");
    const price = (item.size === "small" ? 3 : item.size === "medium" ? 5 : 7);
    totalPrice += price;
    const size = item.size === "small" ? "Klein" : item.size === "medium" ? "Medium" : "Groot";
    row.innerHTML = `
        <td>
        <div class="product-cell">
            <img src="${item.photo}" alt="Foto ${item.photo}" class="image-cart">
            <span class="product-title">Foto #${item.photo.split("_").pop().split(".")[0]}</span>
        </div>
        </td>
        <td class="text-muted">${size} formaat</td>
        <td class="text-price">€${price}</td>
        <td class="text-remove">
        <button class="remove-btn" data-photo="${item.photo}">Verwijderen</button>
        </td>
    `;
    table.querySelector("tbody").appendChild(row);
    });
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
    <td colspan="2" class="text-right">Totaal:</td>
    <td class="text-price">€${totalPrice}</td>
    `;
    table.querySelector("tbody").appendChild(totalRow);
}
else {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td colspan="3" class="text-center">Geen artikelen in de winkelwagen</td>
    `;
    table.querySelector("tbody").appendChild(row);
}

document.getElementById("checkout-button").addEventListener("click", function() {
    alert("Artikelen afrekenen. Totaal: €" + totalPrice);
    localStorage.removeItem("cart");
    window.location.href = "index.html";
});

document.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", function() {
    const photo = this.getAttribute("data-photo");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = cart.filter(item => item.photo !== photo);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
    });
});