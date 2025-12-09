async function loadPlaces() {
    const response = await fetch("data/yerler.json");
    return await response.json();
}

function getId() {
    const url = new URL(window.location.href);
    return url.searchParams.get("id");
}

(async () => {
    const id = getId();
    const places = await loadPlaces();
    const place = places.find(p => p.id === id);

    if (!place) return;

    document.getElementById("content").innerHTML = `
        <h1>${place.name}</h1>
        <img src="${place.image}" width="300"><br><br>
        <p>${place.description}</p>

        <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" 
           target="_blank">
            🚗 Yol Tarifi Al
        </a>
    `;
})();
