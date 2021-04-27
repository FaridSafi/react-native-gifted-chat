# react-native-web-maps
> React Native for Web implementation of react-native-maps

## Getting started
`$ npm install react-native-web-maps --save`

To implement `react-native-web-maps` we're using the `react-google-maps` package:

`$ npm install react-google-maps --save`

Alias the package in your webpack config:

```
resolve: {
    alias: {
        'react-native': 'react-native-web',
        ...
        'react-native-maps': 'react-native-web-maps',
    }
}
```

You need to have a Google Maps Javascript API key to use the map, you can get one [here](https://developers.google.com/maps/documentation/javascript/get-api-key).

Then, you should add this script to your index.html:
``` html
<script src="https://maps.googleapis.com/maps/api/js?key=<YOUR_GOOGLE_API_KEY>"></script>
```

## Usage

``` javascript
import MapView from 'react-native-maps';
```
See the original [documentation](https://github.com/airbnb/react-native-maps).

The supported components are:

* `MapView`
* `MapView.Marker`
* `MapView.Polyline`

`MapView`:
- The officially supported props are:
    - `region`
- The officially supported events are:
    - `onRegionChange`
    - `onRegionChangeComplete`
    - `onPress`

`MapView.Marker`:
- The officially supported props are:
    - `title`
    - `description`
    - `coordinate`


## Examples
See the [storybook](https://react-native-web-community.github.io/react-native-web-maps/storybook/index.html).

## Contributing
PRs are welcome!
