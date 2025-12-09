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

    // Mesafe hesaplama
    places.forEach(p => {
        p.distance = distance(userLat, userLng, p.lat, p.lng);
    });

    // Mesafeye göre sırala
    places.sort((a, b) => a.distance - b.distance);

    // Listele
    const container = document.getElementById("places");
    container.innerHTML = places.map(p => `
        <div style="margin-bottom:20px">
            <h3>${p.name} (${p.distance.toFixed(2)} km)</h3>
            <img src="${p.image}" width="200"><br>
            <a href="yer.html?id=${p.id}">Detay</a>
        </div>
    `).join("");

});
