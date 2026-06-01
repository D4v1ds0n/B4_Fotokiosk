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

function loadPhotos() {
    const photoCards = Array.from(document.getElementsByClassName("photo-card"));
    photoCards.forEach((photoCard, index) => {
        photoCard.innerHTML = "";
        const photoIndex = index + firstPhotoShown - 1;
        const src = photos[photoIndex];
        if (!src) return;
        const img = document.createElement("img");
        const photoInfo = document.createElement("p");
        const info = parseFileName(src);
        img.src = "fotos/" + document.getElementById("day-select").value + "/" + src;
        img.alt = info ? "Photo " + info.id : "Photo";
        photoInfo.textContent = info ? `#${info.id} - ${info.time}` : src;
        photoCard.appendChild(img);
        photoCard.appendChild(photoInfo);
        photoCard.addEventListener("click", function() {
            selectedPhoto = img.src;
            document.getElementById("confirm-buy-overlay").style.display = "flex";
            document.getElementById("confirm-buy-photo").src = img.src;
            document.getElementById("confirm-buy-photo").alt = img.alt;
            document.getElementById("confirm-buy-photo-info").textContent = photoInfo.textContent;
        });
    });
};

async function loadDay() {
    const day = document.getElementById("day-select").value;
    try {
        const res = await fetch(`fotos/${day}/photoNames.txt`);
        if (!res.ok) {
            console.error('Failed to fetch photo list:', res.status);
            photos = [];
            loadPhotos();
            return;
        }
        const data = await res.text();
        photos = data
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        firstPhotoShown = 1;
        loadPhotos();
    } catch (err) {
        console.error('Error loading photos:', err);
        photos = [];
        loadPhotos();
    }
}

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