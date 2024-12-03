// Crear el mapa y configurar la vista inicial
var map = L.map('map').setView([37.4079, -6.0027], 16); // Centrado inicial

// Añadir mapa base con Stamen Toner (blanco y negro)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CartoDB</a>',
    maxZoom: 19  // Zoom máximo
}).addTo(map);

// Definir los íconos personalizados con tamaño manual inicial
var espana = L.icon({
    iconUrl: 'images/espana.png',
    iconSize: [10, 20],  // Tamaño manual del icono para España
    iconAnchor: [5, 10],  // Centrado del ícono (mitad del tamaño)
    popupAnchor: [0, -40]
});

var francia = L.icon({
    iconUrl: 'images/francia.png',
    iconSize: [10, 20],  // Tamaño manual del icono para Francia
    iconAnchor: [5, 10],  // Centrado del ícono (mitad del tamaño)
    popupAnchor: [0, -40]
});

var noruega = L.icon({
    iconUrl: 'images/noruega.png',
    iconSize: [20, 10],  // Tamaño manual del icono para Noruega
    iconAnchor: [20, 10],  // Centrado del ícono (mitad del tamaño)
    popupAnchor: [0, -40]
});

// Agregar el icono para Finlandia
var finlandia = L.icon({
    iconUrl: 'images/finlandia.png', // Asegúrate de tener esta imagen
    iconSize: [20, 20],  // Tamaño manual del icono para Finlandia
    iconAnchor: [5, 10],  // Centrado del ícono (mitad del tamaño)
    popupAnchor: [0, -40]
});

// Coordenadas y audios de los pabellones
var pabellones = [
    {
        name: "Pabellón de España",
        coordinates: [37.40776158135978, -6.002082623424854],
        icon: espana,
        audio: new Audio('Audios/espana.mp3')
    },
    {
        name: "Pabellón de Francia",
        coordinates: [37.408357163442794, -6.003399740268715],
        icon: francia,
        audio: new Audio('Audios/francia.mp3')
    },
    {
        name: "Pabellón de Noruega",
        coordinates: [37.40675004809431, -6.006143403548355],
        icon: noruega,
        audio: new Audio('Audios/noruega.mp3')
    },
    {
        name: "Pabellón de Finlandia", // Nuevo pabellón de Finlandia
        coordinates: [37.40661425993701, -6.005901133015222], // Ajusta las coordenadas a las correspondientes
        icon: finlandia,
        audio: new Audio('Audios/finlandia.mp3') // Asegúrate de tener el audio correspondiente
    }
];

// Guardar los marcadores en un array
var markers = [];

// Función para ajustar el tamaño de los íconos manteniendo la proporción
function adjustIconSize() {
    var zoomLevel = map.getZoom();
    
    // Definir los tamaños base de los iconos (sin zoom)
    var baseEspanaSize = [10, 20];
    var baseFranciaSize = [10, 20];
    var baseNoruegaSize = [20, 10];
    var baseFinlandiaSize = [20, 20]; // Tamaño base para Finlandia
    
    // Calcular el factor de escala para el zoom (puedes ajustar este valor)
    var scaleFactor = zoomLevel * 0.09;  // Ajustar este valor según sea necesario

    // Calcular los nuevos tamaños
    var espanaSize = [baseEspanaSize[0] * scaleFactor, baseEspanaSize[1] * scaleFactor];
    var franciaSize = [baseFranciaSize[0] * scaleFactor, baseFranciaSize[1] * scaleFactor];
    var noruegaSize = [baseNoruegaSize[0] * scaleFactor, baseNoruegaSize[1] * scaleFactor];
    var finlandiaSize = [baseFinlandiaSize[0] * scaleFactor, baseFinlandiaSize[1] * scaleFactor];

    // Actualizar los tamaños de los íconos
    espana.options.iconSize = espanaSize;
    francia.options.iconSize = franciaSize;
    noruega.options.iconSize = noruegaSize;
    finlandia.options.iconSize = finlandiaSize;  // Ajustar el tamaño de Finlandia

    // Actualizar los iconos de los marcadores existentes
    pabellones.forEach(function(pabellon, index) {
        // Actualizar el marcador existente con el nuevo icono
        markers[index].setIcon(L.icon({
            iconUrl: pabellon.icon.options.iconUrl,
            iconSize: pabellon.icon.options.iconSize,
            iconAnchor: pabellon.icon.options.iconAnchor,
            popupAnchor: pabellon.icon.options.popupAnchor
        }));
    });
}

// Llamar a la función para ajustar el tamaño de los íconos cuando el mapa se haga zoom
map.on('zoomend', function () {
    adjustIconSize();
});

// Añadir marcadores al mapa con los íconos iniciales y guardarlos en el array de marcadores
pabellones.forEach(function (pabellon) {
    var marker = L.marker(pabellon.coordinates, { icon: pabellon.icon })
        .addTo(map)
        .bindPopup(function () {
            // Obtener el tamaño del icono
            var iconSize = pabellon.icon.options.iconSize;

            // Aumentar el tamaño de la imagen dentro del popup (10 veces más grande)
            var popupImageSize = [iconSize[0] * 10, iconSize[1] * 10];
            
            // Crear el contenido del popup con el tamaño aumentado
            return '<h3>' + pabellon.name + '</h3>' +
                '<img src="' + pabellon.icon.options.iconUrl + '" ' +
                'style="width: ' + popupImageSize[0] + 'px; height: ' + popupImageSize[1] + 'px;" />';
        });
    markers.push(marker);  // Guardar el marcador en el array
});

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

