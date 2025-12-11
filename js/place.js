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

    // If the page was reached from a card click, add a body class so CSS can change the
    // overall page background specifically for that navigation path.
    const params = new URL(window.location.href).searchParams;
    if (params.get('from') === 'card') {
        document.body.classList.add('from-card');
    }

    document.getElementById("content").innerHTML = `
        <div class="place-detail">
            <h1 class="place-name">${place.name}</h1>
            <div class="detail-image">
                <img class="detail-image-img" src="${place.image}" alt="${place.name}">
            </div>
            <div class="place-description">
                ${place.description.split('\n\n').map(p => `<p>${p}</p>`).join('')}
            </div>

            <div class="actions">
                <a class="directions-button" href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" 
                   target="_blank">
                    🚗 Yol Tarifi Al
                </a>
            </div>
        </div>
    `;
})();
