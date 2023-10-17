// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add tile layer (you can use different map styles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// URL of the JSON data representing the earthquake dataset
var earthquakeDataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch and add JSON data to the map
fetch(earthquakeDataURL)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Calculate marker size based on magnitude
                var markerSize = feature.properties.mag * 3;

                // Calculate marker color based on depth
                var depth = feature.geometry.coordinates[2];
                var markerColor = getColor(depth);

                // Create a circle marker with size and color based on magnitude and depth
                var marker = L.circleMarker(latlng, {
                    radius: markerSize,
                    fillColor: markerColor,
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });

                // Popup with additional earthquake information
                marker.bindPopup(`
                    <strong>Location:</strong> ${feature.properties.place}<br>
                    <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                    <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km
                `);

                return marker;
            }
        }).addTo(map);

        // Add legend
        var legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [-10, 10 -30, 30-50, 50-70,70-90, +90];
            var labels = [];

            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
            }

            return div;
        };

        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to determine marker color based on depth
//function getColor(depth) {
    //return depth > 700 ? '#67000d' :
           //depth > 300 ? '#a50f15' :
           //depth > 100 ? '#cb181d' :
           //depth > 50  ? '#ef3b2c' :
            //             '#fee5d9';
//};
function getColor(depth) {
    if (depth <= 10) return "#00FF00"; 
    else if (depth > 10 && depth <= 30) return "#ADFF2F"; 
    else if (depth > 30 && depth <= 50) return "#FFD700"; 
    else if (depth > 50 && depth <= 70) return "#FFCC80"; 
    else if (depth > 70 && depth <= 90) return "#FFA500"; 
    else if (depth > 90) return "#FF0000"; 
};