module.exports = function() {

  // Note that we assume google.maps has loaded by this point in time
  var MarkerWithLabel = require('../index')(google.maps);

  var latLng = new google.maps.LatLng(49.47805, -123.84716);
  var homeLatLng = new google.maps.LatLng(49.47805, -123.84716);

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var marker = new MarkerWithLabel({
    position: homeLatLng,
    map: map,
    draggable: true,
    raiseOnDrag: true,
    icon: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless.png",
    labelContent: "A",
    labelAnchor: new google.maps.Point(3, 30),
    labelClass: "labels", // the CSS class for the label
    labelInBackground: false
  });

  var iw = new google.maps.InfoWindow({
    content: "Home For Sale"
  });
  google.maps.event.addListener(marker, "click", function (e) { iw.open(map, this); });
}
