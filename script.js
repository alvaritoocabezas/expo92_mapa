// Crear el mapa y configurar la vista inicial
var map = L.map('map').setView([37.4079, -6.0027], 16); // Centrado inicial

// Añadir mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Definir los íconos personalizados
var espanaIcon = L.icon({
    iconUrl: 'images/espana-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -40]
});

var franciaIcon = L.icon({
    iconUrl: 'images/francia-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -40]
});

// Coordenadas y audios de los pabellones
var pabellones = [
    {
        name: "Pabellón de España",
        coordinates: [37.40776158135978, -6.002082623424854],
        icon: espanaIcon,
        audio: new Audio('Audios/espana.mp3')
    },
    {
        name: "Pabellón de Francia",
        coordinates: [37.408357163442794, -6.003399740268715],
        icon: franciaIcon,
        audio: new Audio('Audios/francia.mp3')
    }
];

// Añadir marcadores al mapa
pabellones.forEach(function (pabellon) {
    L.marker(pabellon.coordinates, { icon: pabellon.icon })
        .addTo(map)
        .bindPopup(pabellon.name);
});

// Función para calcular distancia y ajustar audio
function checkProximity(userLatLng) {
    pabellones.forEach(function (pabellon) {
        var distance = map.distance(userLatLng, L.latLng(pabellon.coordinates)); // Distancia en metros
        var maxDistance = 30; // Máxima distancia para activar el audio (puedes modificar esto)

        // Verifica si la distancia es menor que la máxima
        if (distance < maxDistance) {
            // Ajustar volumen en función de la distancia
            var volume = 1 - (distance / maxDistance); // El volumen disminuye cuanto mayor es la distancia
            pabellon.audio.volume = Math.max(0, Math.min(volume, 1)); // Limita el volumen entre 0 y 1

            // Reproducir el audio si no está ya sonando
            if (pabellon.audio.paused) {
                pabellon.audio.play();
            }
        } else {
            // Detener el audio si la distancia es mayor que la máxima
            if (!pabellon.audio.paused) {
                pabellon.audio.pause();
                pabellon.audio.currentTime = 0; // Reinicia el audio al principio
            }
        }
    });
}

// Modo para móviles: Usar ubicación GPS
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function (position) {
        var userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
        checkProximity(userLatLng);
    }, function (error) {
        console.error("No se pudo obtener la ubicación:", error);
    });
}

// Modo para ordenadores: Usar cursor del ratón
map.on('mousemove', function (e) {
    var userLatLng = e.latlng; // Coordenadas del cursor
    checkProximity(userLatLng);
});

