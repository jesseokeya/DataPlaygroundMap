let map = null;
let infowindow = null;
let dataAnalyzed = [];
const socket = io();

function main() {
  $('#map').hide();

  socket.emit('pageLoad', {message: 'Successfully Connected'});

  socket.on('dummyData', function(data) {
    $('#inputData').val('');
    $('#inputData').val(JSON.stringify(data.dummyData));
  });

  socket.on('mapData', function(data) {
    let incomingData = JSON.parse(data);
    $('#inputData').val('');
    $('#inputData').val(data);
    $('#viewMap').click();
  });

  setInterval(() => {
    let inputValue = $('#inputData').val();
    if (inputValue) {
      inputValue = JSON.parse(inputValue);
      inputValue = JSON.stringify(inputValue, null, "\t");
      $('#inputData').val(inputValue);
    }
  }, 100);

}

function visualizeDataAsMap() {
  dataAnalyzed = $('#inputData').val().replace(/ /g, '');
  dataAnalyzed = JSON.parse(dataAnalyzed);
  $('#button').hide();
  $('#textArea').hide();
  $('#map').show();

  $(document).ready(function() {
    $(window).resize(function() {
      google.maps.event.trigger(map, 'resize');
    });
    google.maps.event.trigger(map, 'resize');
  });

  let bounds = new google.maps.LatLngBounds();
  let mapOptions = {
    mapTypeId: 'roadmap'
  };

  // Display a map on the page
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  map.setTilt(45);

  // Multiple Markers
  let markers = [];
  let nullIndexes = [];

  for (let i in dataAnalyzed) {
    let data = dataAnalyzed[i];
    let lat = parseFloat(data.Latitude);
    let lng = parseFloat(data.Longitude);
    if (isNaN(lat) || isNaN(lng)) {
      nullIndexes.push(i);
    } else {
      let crimeData = [`${data.firstName} ${data.lastName}`, lat, lng]
      markers.push(crimeData);
    }
  }

  // Info Window Content
  let infoWindowContent = [];
  for (let i in dataAnalyzed) {
    let data = dataAnalyzed[i];
    let fullName = `${data.firstName} ${data.middleName} ${data.lastName}`;
    let crimeInfo = [`<div class="info_content">
        <h5>${fullName}</h5>
        <p style="font-weight: bold; font-size: 14px;">
          <pre>Crime Commited: Gun Offence on ${data.modified_date}</pre>
          <pre>CaseNumber: ${data.caseNumber}</pre>
          <pre>Sex: ${data.sex}</pre>
          <pre>Race: ${data.race}</pre>
          <pre>Date_Of_Birth: ${data.Date_Of_Birth}</pre>
          <pre>Address: ${data.full_address}</pre>
          <pre>Postal_Code: ${data.zip_code}</pre>
          <pre>Neighborhood: ${data.neighborhood}</pre>
          <pre>City: ${data.city}</pre>
        </p>
       </div>`];

    infoWindowContent.push(crimeInfo)
  }

  for (let i in nullIndexes) {
    for (let j in infoWindowContent) {
      if (nullIndexes[i] === j) {
        infoWindowContent[j] = '_Empty_';
      }
    }
  }

  // Display multiple markers on a map
  infoWindow = new google.maps.InfoWindow();
  let marker;
  let i;

  // Loop through our array of markers & place each one on the map
  for (i = 0; i < markers.length; i++) {
    let position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    bounds.extend(position);
    marker = new google.maps.Marker({position: position, map: map, title: markers[i][0]
    });

    // Allow each marker to have an info window
    google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
      return function() {
        infoWindow.setContent(infoWindowContent[i][0]);
        infoWindow.open(map, marker);
      }
    })(marker, i));

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
  }

  console.log(markers.length);

  // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  let boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {

    (markers.length > 500)
      ? this.setZoom(11)
      : this.setZoom(12);

    google.maps.event.removeListener(boundsListener);
  });
}

main();
