let photos = [];

selectedPhoto = null;


document.getElementById("close-confirm-buy-overlay").addEventListener("click", function() {
    document.getElementById("confirm-buy-overlay").style.display = "none";
});
document.getElementById("cancel").addEventListener("click", function() {
    document.getElementById("confirm-buy-overlay").style.display = "none";
});
document.getElementById("day-select").addEventListener("change", function() {
    loadDay();
});

let firstPhotoShown = 1;


// Navigatie knoppen, vorige/volgende. Er wordt gecheckt of je al op de eerste of laatste foto zit
document.getElementById("prev-photo").addEventListener("click", function() {
    firstPhotoShown = Math.max(1, firstPhotoShown - 10);
    loadPhotos();
});
document.getElementById("next-photo").addEventListener("click", function() {
    const maxStart = Math.max(1, photos.length - 9);
    firstPhotoShown = Math.min(maxStart, firstPhotoShown + 10);
    loadPhotos();
});

loadDay();

// Functie om de foto's van een dag in te laden
// Async functie zorgt ervoor dat je await kunt gebruiken, zodat je kunt wachten op de resultaten van de fetch-aanroep.
async function loadDay() {
    // Checkt welke dag geselecteerd is
    const day = document.getElementById("day-select").value;
    // Try zorgt ervoor dat het niet crasht als er iets misgaat
    try {
        // Fetch de txt file met de namen van alle foto's van die dag
        const res = await fetch(`fotos/${day}/photoNames.txt`);
        // Fallback als het ophalen van de foto lijst mislukt
        if (!res.ok) {
            console.error('Failed to fetch photo list:', res.status);
            photos = [];
            return;
        }
        // De data wordt gelezen en verwerkt
        const data = await res.text();
        // De foto namen worden opgeslagen in de photos array, elk item is een regel
        photos = data
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        // De eerste foto wordt ingestelt
        firstPhotoShown = 1;
        // De foto's worden geladen
        loadPhotos();
    } catch (err) {
        console.error('Error loading photos:', err);
        photos = [];
        loadPhotos();
    }
}


// Functie om de photo's te laden in de containers.
function loadPhotos() {
    // Maakt een array van de photo-card elementen
    const photoCards = Array.from(document.getElementsByClassName("photo-card"));
    // Gaat met een for-loop langs alle cards
    photoCards.forEach((photoCard, index) => {
        // Verwijdert de vorige inhoud van de card
        photoCard.innerHTML = "";
        // Het nummer van de foto wordt berekend, en de foto wordt opgehaald (src)
        const photoIndex = index + firstPhotoShown - 1;
        // De src van de foto wordt ingesteld
        const src = photos[photoIndex];
        // Als de src niet bestaat, wordt de functie verlaten. Dit zou als het goed is nooit moeten gebeuren.
        if (!src) return;
        // Maakt de foto en de bijbehorende informatie aan
        const img = document.createElement("img");
        const photoInfo = document.createElement("p");
        // Haalt de informatie uit de bestandsnaam
        const info = parseFileName(src);
        // Stelt de inhoud van de img en photoInfo elementen in
        img.src = "fotos/" + document.getElementById("day-select").value + "/" + src;
        img.alt = info ? "Photo " + info.id : "Photo";
        photoInfo.textContent = info ? `#${info.id} - ${info.time}` : src;
        // Voegt de img en photoInfo elementen toe aan de card
        photoCard.appendChild(img);
        photoCard.appendChild(photoInfo);
        // De functie als je op een card klikt
        photoCard.addEventListener("click", function() {
            selectedPhoto = img.src;
            document.getElementById("confirm-buy-overlay").style.display = "flex";
            document.getElementById("confirm-buy-photo").src = img.src;
            document.getElementById("confirm-buy-photo").alt = img.alt;
            document.getElementById("confirm-buy-photo-info").textContent = photoInfo.textContent;
        });
    });
};

// Functie om de bestandsnaam van een foto te parseren
function parseFileName(fileName) {
  const match = fileName.match(/^(\d{2})_(\d{2})_(\d{2})_id(\d+)\.[^.]+$/);

  if (!match) {
    return null;
  }

  const [, hours, minutes, seconds, id] = match;

  return {
    time: `${hours}:${minutes}:${seconds}`,
    id: Number(id)
  };
}

document.getElementById("add-to-cart").addEventListener("click", function() {
    if (selectedPhoto) {
        const selectedSize = document.getElementById("photo-size").value;
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push({ photo: selectedPhoto, size: selectedSize });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Foto toegevoegd aan winkelwagentje");
        document.getElementById("confirm-buy-overlay").style.display = "none";
    }
});

document.getElementById("photo-size").addEventListener("change", function() {
    const selectedSize = this.value;
    let price = 0;
    switch (selectedSize) {
        case "small":
            price = 3.00;
            break;
        case "medium":
            price = 5.00;
            break;
        case "large":
            price = 7.00;
            break;
    }
    document.getElementById("price").textContent = `€ ${price.toFixed(2)}`;
});