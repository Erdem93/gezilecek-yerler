async function loadPlaces() {
    const response = await fetch("data/yerler.json");
    return await response.json();
}

// Haversine Formülü
function distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2)**2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

navigator.geolocation.getCurrentPosition(async (pos) => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    let places = await loadPlaces();

    // populate city filter (unique cities)
    const cityFilter = document.getElementById('city-filter');
    const cities = Array.from(new Set(places.map(p => p.city).filter(Boolean))).sort();
    cities.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        cityFilter.appendChild(opt);
    });

    // Mesafe hesaplama
    places.forEach(p => {
        p.distance = distance(userLat, userLng, p.lat, p.lng);
    });

    // Mesafeye göre sırala
    places.sort((a, b) => a.distance - b.distance);

    const container = document.getElementById("places");

    function renderPlaces(list) {
        container.innerHTML = list.map(p => `
            <div class="place-card" data-href="yer.html?id=${p.id}&from=card">
                <h3>${p.name} (${p.distance !== undefined ? p.distance.toFixed(2) + ' km' : ''})</h3>
                <div class="card-image">
                    <img class="card-image-img" src="${p.image}" alt="${p.name}">
                </div>
                <a class="detail-link" href="yer.html?id=${p.id}&from=card">Detay</a>
            </div>
        `).join("");

        // Make the whole card clickable, but allow inner links (like the Detay link) to work normally.
        const cards = container.querySelectorAll('.place-card');
        cards.forEach(card => {
            // accessibility
            card.tabIndex = 0;
            card.setAttribute('role', 'link');

            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                const href = card.dataset.href;
                if (href) window.location.href = href;
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const href = card.dataset.href;
                    if (href) window.location.href = href;
                }
            });
        });
    }

    // initial render (no filter = all)
    renderPlaces(places);

    // filter handler
    cityFilter.addEventListener('change', () => {
        const val = cityFilter.value;
        if (!val) renderPlaces(places);
        else renderPlaces(places.filter(p => p.city === val));
    });

    // Make the whole card clickable, but allow inner links (like the Detay link) to work normally.
    const cards = container.querySelectorAll('.place-card');
    cards.forEach(card => {
        // accessibility
        card.tabIndex = 0;
        card.setAttribute('role', 'link');

        card.addEventListener('click', (e) => {
            // if the click originated from an actual link inside the card, do nothing
            if (e.target.closest('a')) return;
            const href = card.dataset.href;
            if (href) window.location.href = href;
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                // prevent page from scrolling on Space
                e.preventDefault();
                const href = card.dataset.href;
                if (href) window.location.href = href;
            }
        });
    });

});
