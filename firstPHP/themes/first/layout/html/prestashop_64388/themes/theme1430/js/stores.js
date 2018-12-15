var google_map_style = [{"featureType": "administrative", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {
  "featureType": "administrative",
  "elementType": "geometry.stroke",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "administrative.country", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "administrative.country", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {
  "featureType": "administrative.province",
  "elementType": "all",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "administrative.province", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "administrative.locality", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
  "featureType": "administrative.locality",
  "elementType": "geometry",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "administrative.locality", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "administrative.neighborhood", "elementType": "geometry", "stylers": [{"visibility": "on"}]}, {
  "featureType": "administrative.neighborhood",
  "elementType": "geometry.fill",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "landscape", "elementType": "all", "stylers": [{"hue": "#FFBB00"}, {"saturation": 43.400000000000006}, {"lightness": 37.599999999999994}, {"gamma": 1}]}, {"featureType": "landscape", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {
  "featureType": "landscape",
  "elementType": "geometry.stroke",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "landscape.natural", "elementType": "geometry", "stylers": [{"visibility": "on"}]}, {"featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {
  "featureType": "landscape.natural",
  "elementType": "geometry.stroke",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "landscape.natural.landcover", "elementType": "geometry", "stylers": [{"visibility": "on"}]}, {"featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {
  "featureType": "landscape.natural.terrain",
  "elementType": "geometry",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "landscape.natural.terrain", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "poi", "elementType": "all", "stylers": [{"hue": "#00FF6A"}, {"saturation": -1.0989010989011234}, {"lightness": 11.200000000000017}, {"gamma": 1}]}, {
  "featureType": "poi.business",
  "elementType": "all",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "road", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "road.highway", "elementType": "all", "stylers": [{"hue": "#FFC200"}, {"saturation": -61.8}, {"lightness": 45.599999999999994}, {"gamma": 1}]}, {
  "featureType": "road.highway.controlled_access",
  "elementType": "geometry",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "road.highway.controlled_access", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "road.arterial", "elementType": "all", "stylers": [{"hue": "#FF0300"}, {"saturation": -100}, {"lightness": 51.19999999999999}, {"gamma": 1}]}, {
  "featureType": "road.arterial",
  "elementType": "geometry",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "all", "stylers": [{"hue": "#FF0300"}, {"saturation": -100}, {"lightness": 52}, {"gamma": 1}]}, {
  "featureType": "transit",
  "elementType": "geometry",
  "stylers": [{"visibility": "on"}]
}, {"featureType": "transit", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}]}, {"featureType": "water", "elementType": "all", "stylers": [{"hue": "#0078FF"}, {"saturation": -13.200000000000003}, {"lightness": 2.4000000000000057}, {"gamma": 1}]}];
$(document).ready(function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(defaultLat, defaultLong),
    zoom: 10,
    mapTypeId: 'roadmap',
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    styles: google_map_style
  });
  infoWindow = new google.maps.InfoWindow();
  locationSelect = document.getElementById('locationSelect');
  locationSelect.onchange = function() {
    var markerNum = locationSelect.options[locationSelect.selectedIndex].value;
    if (markerNum !== 'none') {
      google.maps.event.trigger(markers[markerNum], 'click');
    }
  };
  $('#addressInput').keypress(function(e) {
    code = e.keyCode ? e.keyCode : e.which;
    if (code.toString() == 13) {
      searchLocations();
    }
  });
  $(document).on('click', 'input[name=location]', function(e) {
    e.preventDefault();
    $(this).val('');
  });
  $(document).on('click', 'button[name=search_locations]', function(e) {
    e.preventDefault();
    searchLocations();
  });
  initMarkers();
});
function initMarkers() {
  searchUrl += '@ajax=1&all=1';
  downloadUrl(searchUrl, function(data) {
    var xml = parseXml(data.trim());
    var markerNodes = xml.documentElement.getElementsByTagName('marker');
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markerNodes.length; i++) {
      var name = markerNodes[i].getAttribute('name');
      var address = markerNodes[i].getAttribute('address');
      var addressNoHtml = markerNodes[i].getAttribute('addressNoHtml');
      var other = markerNodes[i].getAttribute('other');
      var id_store = markerNodes[i].getAttribute('id_store');
      var has_store_picture = markerNodes[i].getAttribute('has_store_picture');
      var latlng = new google.maps.LatLng(
        parseFloat(markerNodes[i].getAttribute('lat')),
        parseFloat(markerNodes[i].getAttribute('lng'))
      );
      createMarker(latlng, name, address, other, id_store, has_store_picture);
      bounds.extend(latlng);
    }
    map.fitBounds(bounds);
    var zoomOverride = map.getZoom();
    if (zoomOverride > 10) {
      zoomOverride = 10;
    }
    map.setZoom(zoomOverride);
  });
}
function searchLocations() {
  $('#stores_loader').show();
  var address = document.getElementById('addressInput').value;
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      searchLocationsNear(results[0].geometry.location);
    } else {
      if (!!$.prototype.fancybox && isCleanHtml(address)) {
        $.fancybox.open([
          {
            type: 'inline',
            autoScale: true,
            minHeight: 30,
            content: '<p class="fancybox-error">' + address + ' ' + translation_6 + '</p>'
          }
        ], {
          padding: 0
        });
      } else {
        alert(address + ' ' + translation_6);
      }
    }
    $('#stores_loader').hide();
  });
}
function clearLocations(n) {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++)
    markers[i].setMap(null);
  markers.length = 0;
  locationSelect.innerHTML = '';
  var option = document.createElement('option');
  option.value = 'none';
  if (!n)
    option.innerHTML = translation_1;
  else {
    if (n === 1)
      option.innerHTML = '1' + ' ' + translation_2;
    else
      option.innerHTML = n + ' ' + translation_3;
  }
  locationSelect.appendChild(option);
  if (!!$.prototype.uniform)
    $("select#locationSelect").uniform();
  $('#stores-table tr.node').remove();
}
function searchLocationsNear(center) {
  var radius = document.getElementById('radiusSelect').value;
  var searchUrl = baseUri + '@controller=stores&ajax=1&latitude=' + center.lat() + '&longitude=' + center.lng() + '&radius=' + radius;
  downloadUrl(searchUrl, function(data) {
    var xml = parseXml(data.trim());
    var markerNodes = xml.documentElement.getElementsByTagName('marker');
    var bounds = new google.maps.LatLngBounds();
    clearLocations(markerNodes.length);
    $('table#stores-table').find('tbody tr').remove();
    for (var i = 0; i < markerNodes.length; i++) {
      var name = markerNodes[i].getAttribute('name');
      var address = markerNodes[i].getAttribute('address');
      var addressNoHtml = markerNodes[i].getAttribute('addressNoHtml');
      var other = markerNodes[i].getAttribute('other');
      var distance = parseFloat(markerNodes[i].getAttribute('distance'));
      var id_store = parseFloat(markerNodes[i].getAttribute('id_store'));
      var phone = markerNodes[i].getAttribute('phone');
      var has_store_picture = markerNodes[i].getAttribute('has_store_picture');
      var latlng = new google.maps.LatLng(
        parseFloat(markerNodes[i].getAttribute('lat')),
        parseFloat(markerNodes[i].getAttribute('lng')));
      createOption(name, distance, i);
      createMarker(latlng, name, address, other, id_store, has_store_picture);
      bounds.extend(latlng);
      address = address.replace(phone, '');
      $('table#stores-table').find('tbody').append('<tr ><td class="num">' + parseInt(i + 1) + '</td><td class="name">' + (has_store_picture == 1 ? '<img src="' + img_store_dir + parseInt(id_store) + '.jpg" alt="" />' : '') + '<span>' + name + '</span></td><td class="address">' + address + (phone !== '' ? '' + translation_4 + ' ' + phone : '') + '</td><td class="distance">' + distance + ' ' + distance_unit + '</td></tr>');
      $('#stores-table').show();
    }
    if (markerNodes.length) {
      map.fitBounds(bounds);
      var listener = google.maps.event.addListener(map, "idle", function() {
        if (map.getZoom() > 13) {
          map.setZoom(13);
        }
        google.maps.event.removeListener(listener);
      });
    }
    locationSelect.style.visibility = 'visible';
    $(locationSelect).parent().parent().addClass('active').show();
    locationSelect.onchange = function() {
      var markerNum = locationSelect.options[locationSelect.selectedIndex].value;
      google.maps.event.trigger(markers[markerNum], 'click');
    };
  });
}
function createMarker(latlng, name, address, other, id_store, has_store_picture) {
  var html = '<b>' + name + '</b><br/>' + address + (has_store_picture === 1 ? '<br /><br /><img src="' + img_store_dir + parseInt(id_store) + '.jpg" alt="" />' : '') + other + '<br /><a href="../../maps.google.com/maps@saddr=&daddr=' + latlng + '" target="_blank">' + translation_5 + '<\/a>';
  var image = new google.maps.MarkerImage(img_ps_dir + logo_store);
  var marker = '';
  if (hasStoreIcon) {
    marker = new google.maps.Marker({map: map, icon: image, position: latlng});
  } else {
    marker = new google.maps.Marker({map: map, position: latlng});
  }
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
function createOption(name, distance, num) {
  var option = document.createElement('option');
  option.value = num;
  option.innerHTML = name + ' (' + distance.toFixed(1) + ' ' + distance_unit + ')';
  locationSelect.appendChild(option);
}
function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };
  request.open('GET', url, true);
  request.send(null);
}
function parseXml(str) {
  if (window.ActiveXObject) {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(str);
    return doc;
  } else if (window.DOMParser) {
    return (new DOMParser()).parseFromString(str, 'text/xml');
  }
}
function doNothing() {
}