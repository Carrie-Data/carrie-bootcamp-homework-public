

// Link to GeoJSON
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var faultLineURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

var earthquakes;
var faults;
var legend_colors = ['#6EC12F', '#DDF44B', '#FDD558', '#DC9565', '#DC6565', '#D33C3C']

// Color by earthquake magnitude function
fillColor = 'black';
function chooseColor(magnitude) {
  magnitude <= 1 ? fillColor = legend_colors[0] :
    (magnitude <= 2 ? fillColor = legend_colors[1] :
      (magnitude <= 3 ? fillColor = legend_colors[2] :
        (magnitude <= 4 ? fillColor = legend_colors[3] :
          (magnitude <= 5 ? fillColor = legend_colors[4] : fillColor = legend_colors[5])
        )
      )
    );
  return fillColor;
}

function radiusSize(magnitude) {
  magnitude === 0 ? radius = 1 :
    (magnitude <= 0 ? radius = .01 :
      (radius = magnitude * 3)
    )
  return radius;
}

d3.json(earthquakeURL, function (earthquake_data) {

  d3.json(faultLineURL, function (fault_data) {
    console.log(earthquake_data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map

    earthquakes = L.geoJSON(earthquake_data.features, {

      pointToLayer: function (feature, latlng) {
        // console.log(feature.properties.mag);
        return L.circleMarker(latlng);
      },
      style: function (feature) {
        return {
          radius: radiusSize(feature.properties.mag),
          color: chooseColor(feature.properties.mag),
          // Call the chooseColor function to decide color based on magnitude
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: 1,
          weight: 1,
          opacity: 1,
        };
      },

      // Called on each feature
      onEachFeature: function (feature, layer) {
        layer.on({
          click: function (event) {
          }
        });
        // Giving each feature a pop-up with earthquake info
        layer.bindPopup(`<h3>${feature.properties.title}</h3>
      <p>${new Date(feature.properties.time)}</p>`);
      }

    });
    console.log(earthquakes);

    faults = L.geoJSON(fault_data.features, {
      style: function (feature) {
        return {
          color: legend_colors[2],
          weight: 3
        };
      }
    });

    console.log(faults);



    // Adding tile layer
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });

    var overlayMaps = {
      Earthquakes: earthquakes,
      'Fault Lines': faults
    };
    // Create a baseMaps 
    var baseMaps = {
      Satellite: satellite,
      Greyscale: greyscale,
      Outdoors: outdoors
    };

    // Creating map object
    var myMap = L.map("map", {
      center: [45, -120],
      zoom: 4,
      layers: [greyscale, earthquakes]
    });

    // Set up the legend
    var legend = L.control({ position: 'bottomright' })

    legend.onAdd = function () {

      var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"]

      var legendInfo = `<h2>Earthquake Magnitude</h2>
                        `;

      var colorlist = legend_colors.map(color => {
        return `<li style = "background-color: ${color}"></li>`;
      });

      var label_list = labels.map(label => {
        return `<li>${label}</li>`;
      });

      var div = L.DomUtil.create('div', 'info legend');

      div.innerHTML = `
     ${legendInfo}
     <ul>
     ${label_list.join(' ')}
     </ul>
     <ul>
       ${colorlist.join('')}
     </ul>`
      // return: DOM Element, that it will put into the Leaflet
      return div;
    }
    legend.addTo(myMap)

    // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // End of d3.json
  });
});


