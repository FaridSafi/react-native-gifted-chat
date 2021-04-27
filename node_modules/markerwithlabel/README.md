# MarkerWithLabel for V3 v1.1.8 [February 26, 2013] Reference

**Note:** _This library is a copy of [the original hosted on Google Code](https://code.google.com/p/google-maps-utility-library-v3/wiki/Libraries)) with modifications and bug fixes made where appropriate._

MarkerWithLabel extends the Google Maps JavaScript API V3 `google.maps.Marker` class.

MarkerWithLabel allows you to define markers with associated labels. As you would expect, if the marker is draggable, so too will be the label. In addition, a marker with a label responds to all mouse events in the same manner as a regular marker. It also fires mouse events and "property changed" events just as a regular marker would. Version 1.1 adds support for the raiseOnDrag feature introduced in API V3.3.

If you drag a marker by its label, you can cancel the drag and return the marker to its original position by pressing the `Esc` key. This doesn't work if you drag the marker itself because this feature is not (yet) supported in the `google.maps.Marker` class.

Note: Be sure to include Google Maps JavaScript API V3 in your page _before_ using this library.

## Using

```shell
npm install --save-dev markerwithlabel
```

From here you can use browserify, webpack or something similar to use the module.

```js
var MarkerWithLabel = require('markerwithlabel')(google.maps);
```

See the examples below for specific uses of this marker type.

# LabeledMarker Documentation: Examples

For a complete example, see [the `example` folder](./example).

## Creating a Basic Marker

The example below shows how to use MarkerWithLabel to create a marker that has a label centered beneath it in a small box. The label can be styled most easily by defining a CSS class with the desired properties for the label DIV. In this example the class is called "labels" and this name is passed in the `labelClass` parameter to MarkerWithLabel. Additional styling information can be passed in the `labelStyle` parameter. The text of the label is passed in `labelContent`. Other parameters that can be passed to MarkerWithLabel are identical to those that can be passed to `google.maps.Marker`.

     
```javascript
var latLng = new google.maps.LatLng(49.47805, -123.84716);
var homeLatLng = new google.maps.LatLng(49.47805, -123.84716);

var map = new google.maps.Map(document.getElementById('map_canvas'), {
  zoom: 12,
  center: latLng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var marker1 = new MarkerWithLabel({
  position: homeLatLng,
  draggable: true,
  raiseOnDrag: true,
  map: map,
  labelContent: "$425K",
  labelAnchor: new google.maps.Point(22, 0),
  labelClass: "labels", // the CSS class for the label
  labelStyle: {opacity: 0.75}
});

var iw1 = new google.maps.InfoWindow({
  content: "Home For Sale"
});
google.maps.event.addListener(marker1, "click", function (e) { iw1.open(map, this); });
```


## Creating a Lettered Marker

This example shows how to place a single character over the center of Google's default marker. Note the use of the `labelInBackground` property to ensure the label appears in the foreground (rather than in the background behind the marker).

     
```javascript
var latLng = new google.maps.LatLng(49.47805, -123.84716);
var homeLatLng = new google.maps.LatLng(49.47805, -123.84716);

var map = new google.maps.Map(document.getElementById('map_canvas'), {
  zoom: 12,
  center: latLng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var marker = new MarkerWithLabel({
  position: homeLatLng,
  map: map,
  draggable: true,
  raiseOnDrag: true,
  labelContent: "A",
  labelAnchor: new google.maps.Point(3, 30),
  labelClass: "labels", // the CSS class for the label
  labelInBackground: false
});

var iw = new google.maps.InfoWindow({
  content: "Home For Sale"
});
google.maps.event.addListener(marker, "click", function (e) { iw.open(map, this); });
```


## Mouse Events

This example illustrates the mouse events that are fired when you interact with a marker with a label. You can also attach event listeners to "property changed" events. The marker here has been made draggable so you can see the events that are fired when the marker is moved around the map. (You can start the drag by clicking the marker portion or the label portion.)

     
```javascript
var latLng = new google.maps.LatLng(49.47805, -123.84716);
var homeLatLng = new google.maps.LatLng(49.47805, -123.84716);

var map = new google.maps.Map(document.getElementById('map_canvas'), {
  zoom: 12,
  center: latLng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var marker = new MarkerWithLabel({
  position: homeLatLng,
  draggable: true,
  raiseOnDrag: true,
  map: map,
  labelContent: "$425K",
  labelAnchor: new google.maps.Point(22, 0),
  labelClass: "labels" // the CSS class for the label
});

var iw = new google.maps.InfoWindow({
  content: "Home For Sale"
});
google.maps.event.addListener(marker, "click", function (e) { iw.open(map, this); });

google.maps.event.addListener(marker, "click", function (e) { log("Click"); });
google.maps.event.addListener(marker, "dblclick", function (e) { log("Double Click"); });
google.maps.event.addListener(marker, "mouseover", function (e) { log("Mouse Over"); });
google.maps.event.addListener(marker, "mouseout", function (e) { log("Mouse Out"); });
google.maps.event.addListener(marker, "mouseup", function (e) { log("Mouse Up"); });
google.maps.event.addListener(marker, "mousedown", function (e) { log("Mouse Down"); });
google.maps.event.addListener(marker, "dragstart", function (mEvent) { log("Drag Start: " + mEvent.latLng.toString()); });
google.maps.event.addListener(marker, "drag", function (mEvent) { log("Drag: " + mEvent.latLng.toString()); });
google.maps.event.addListener(marker, "dragend", function (mEvent) { log("Drag End: " + mEvent.latLng.toString()); });
```


## Pictures as Labels

This example illustrates that `labelContent` can also be set to any arbitrary HTML DOM node. In this case, the DOM node is a simple img element holding a picture. The picture label has an opacity of 0.50 to make it possible to see what's behind it on the map.

     
```javascript
var latLng = new google.maps.LatLng(49.47805, -123.84716);
var homeLatLng = new google.maps.LatLng(49.47805, -123.84716);

var map = new google.maps.Map(document.getElementById('map_canvas'), {
  zoom: 12,
  center: latLng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
});

var pictureLabel = document.createElement("img");
pictureLabel.src = "home.jpg";

var marker = new MarkerWithLabel({
  position: homeLatLng,
  map: map,
  draggable: true,
  raiseOnDrag: true,
  labelContent: pictureLabel,
  labelAnchor: new google.maps.Point(50, 0),
  labelClass: "labels", // the CSS class for the label
  labelStyle: {opacity: 0.50}
});

var iw = new google.maps.InfoWindow({
  content: "Home For Sale"
});
google.maps.event.addListener(marker, "click", function (e) { iw.open(map, this); });
```


## class MarkerWithLabel

### Constructor

| Constructor  | Description |
|------|------|
| `MarkerWithLabel(opt_options?:MarkerWithLabelOptions)` |  Creates a MarkerWithLabel with the options specified in `MarkerWithLabelOptions`. |

## class MarkerWithLabelOptions

This class represents the optional parameter passed to the `MarkerWithLabel` constructor. The properties available are the same as for `google.maps.Marker` with the addition of the properties listed below. To change any of these additional properties after the labeled marker has been created, call `google.maps.Marker.set(propertyName, propertyValue)`.

When any of these properties changes, a property changed event is fired. The names of these events are derived from the name of the property and are of the form `propertyname_changed`. For example, if the content of the label changes, a `labelcontent_changed` event is fired.

There is no constructor for this class. Instead, this class is instantiated as a javascript object literal.

### Properties

| Properties  | Type | Description |
|------|------|------|
| `crossImage` |  `string` |  The URL of the cross image to be displayed while dragging a marker. The default value is `"http://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png"`. |
| `handCursor` |  `string` |  The URL of the cursor to be displayed while dragging a marker. The default value is `"http://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur"`. |
| `labelAnchor` |  `Point` |  By default, a label is drawn with its anchor point at (0,0) so that its top left corner is positioned at the anchor point of the associated marker. Use this property to change the anchor point of the label. For example, to center a 50px-wide label beneath a marker, specify a `labelAnchor` of `google.maps.Point(25, 0)`. (Note: x-values increase to the right and y-values increase to the top.) |
| `labelClass` |  `string` |  The name of the CSS class defining the styles for the label. Note that style values for `position`, `overflow`, `top`, `left`, `zIndex`, `display`, `marginLeft`, and `marginTop` are ignored; these styles are for internal use only. |
| `labelContent` |  `string|Node` |  The content of the label (plain text or an HTML DOM node). |
| `labelInBackground` |  `boolean` |  A flag indicating whether a label that overlaps its associated marker should appear in the background (i.e., in a plane below the marker). The default is `false`, which causes the label to appear in the foreground. |
| `labelStyle` |  `Object` |  An object literal whose properties define specific CSS style values to be applied to the label. Style values defined here override those that may be defined in the `labelClass` style sheet. If this property is changed after the label has been created, all previously set styles (except those defined in the style sheet) are removed from the label before the new style values are applied. Note that style values for `position`, `overflow`, `top`, `left`, `zIndex`, `display`, `marginLeft`, and `marginTop` are ignored; these styles are for internal use only. |
| `labelVisible` |  `boolean` |  A flag indicating whether the label is to be visible. The default is `true`. Note that even if `labelVisible` is `true`, the label will _not_ be visible unless the associated marker is also visible (i.e., unless the marker's `visible` property is `true`). |
| `optimized` |  `boolean` |  A flag indicating whether rendering is to be optimized for the marker. **Important: The optimized rendering technique is not supported by MarkerWithLabel, so the value of this parameter is always forced to `false`.** |
| `raiseOnDrag` |  `boolean` |  A flag indicating whether the label and marker are to be raised when the marker is dragged. The default is `true`. If a draggable marker is being created and a version of Google Maps API earlier than V3.3 is being used, this property must be set to `false`. |
