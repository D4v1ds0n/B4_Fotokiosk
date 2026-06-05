const table = document.querySelector(".cart-table");
let totalPrice = 0;
// Checkt of er artikelen in de winkelwagen zijn (lege winkelwagen is opgeslagen als [], dus alleen als er meer dan 2 tekens zijn)
if (localStorage.getItem("cart") && localStorage.getItem("cart").length > 2) {
    // Laad winkelwagen van localStorage
    const cart = JSON.parse(localStorage.getItem("cart"));
    // Loopt door de artikelen in de winkelwagen
    cart.forEach(item => {
        // Maakt een nieuwe rij aan voor het artikel
        const row = document.createElement("tr");
        // Berekent de prijs
        const price = (item.size === "small" ? 3 : item.size === "medium" ? 5 : 7);
        // Telt de prijs op bij de totaalprijs
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
        // Voegt de rij toe aan de tabel
        table.querySelector("tbody").appendChild(row);
    });
    // Onderste rij met totaalprijs wordt toegevoegd
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
    <td colspan="2" class="text-right">Totaal:</td>
    <td class="text-price">€${totalPrice}</td>
    `;
    table.querySelector("tbody").appendChild(totalRow);
}
else {
    // Functie die wordt uitgevoerd als de winkelwagen leeg is
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

// Functie om een artikel uit de winkelwagen te verwijderen
document.querySelectorAll(".remove-btn").forEach(button => {
    button.addEventListener("click", function() {
    const photo = this.getAttribute("data-photo");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = cart.filter(item => item.photo !== photo);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Pagina herladen om de wijzigingen weer te geven
    window.location.reload();
    });
});