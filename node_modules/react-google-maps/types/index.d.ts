// TypeScript Version: 2.3

declare module 'react-google-maps' {
    export { default as withGoogleMap, WithGoogleMapProps } from 'react-google-maps/lib/withGoogleMap'
    export { default as withScriptjs, WithScriptjsProps } from 'react-google-maps/lib/withScriptjs'

    export { default as Circle, CircleProps } from 'react-google-maps/lib/components/Circle'
    export { default as DirectionsRenderer, DirectionsRendererProps } from 'react-google-maps/lib/components/DirectionsRenderer'
    export { default as FusionTablesLayer, FusionTablesLayerProps } from 'react-google-maps/lib/components/FusionTablesLayer'
    export { default as GoogleMap, GoogleMapProps } from 'react-google-maps/lib/components/GoogleMap'
    export { default as GroundOverlay, GroundOverlayProps} from 'react-google-maps/lib/components/GroundOverlay'
    export { default as InfoWindow, InfoWindowProps } from 'react-google-maps/lib/components/InfoWindow'
    export { default as KmlLayer, KmlLayerProps } from 'react-google-maps/lib/components/KmlLayer'
    export { default as Marker, MarkerProps } from 'react-google-maps/lib/components/Marker'
    export { default as OverlayView, OverlayViewProps } from 'react-google-maps/lib/components/OverlayView'
    export { default as Polygon, PolygonProps } from 'react-google-maps/lib/components/Polygon'
    export { default as Polyline, PolylineProps } from 'react-google-maps/lib/components/Polyline'
    export { default as Rectangle, RectangleProps } from 'react-google-maps/lib/components/Rectangle'
    export { default as StreetViewPanorama, StreetViewPanoramaProps } from 'react-google-maps/lib/components/StreetViewPanorama'
    export { default as TrafficLayer, TrafficLayerProps } from 'react-google-maps/lib/components/TrafficLayer'
}

declare module 'react-google-maps/lib/withGoogleMap' {
    import { ComponentClass, ReactElement, StatelessComponent } from 'react'

    export interface WithGoogleMapProps {
        containerElement: ReactElement<any>
        mapElement: ReactElement<any>
    }

    export default function withGoogleMap<P>(wrappedComponent: string | ComponentClass<P> | StatelessComponent<P>): ComponentClass<P & WithGoogleMapProps>
}

declare module 'react-google-maps/lib/withScriptjs' {
    import { ComponentClass, ReactElement } from 'react'

    export interface WithScriptjsProps {
        googleMapURL: string
        loadingElement: ReactElement<any>
    }

    export default function withScriptjs<P>(wrappedComponent: ComponentClass<P>): ComponentClass<P & WithScriptjsProps>
}

declare module 'react-google-maps/lib/components/addons/InfoBox' {
    import { Component } from 'react'
    import { InfoBoxOptions } from 'google-maps-infobox'

    export interface InfoBoxProps {
        defaultOptions?: InfoBoxOptions
        defaultPosition?: google.maps.LatLng
        defaultVisible?: boolean
        defaultZIndex?: number
        options?: InfoBoxOptions
        position?: google.maps.LatLng
        visible?: boolean
        zIndex?: number

        onCloseClick?(): void
        onContentChanged?(): void
        onDomReady?(): void
        onPositionChanged?(): void
        onZindexChanged?(): void
    }

    export default class InfoBox extends Component<InfoBoxProps> {
    }
}

declare module 'react-google-maps/lib/components/addons/MarkerClusterer' {
    import { Component } from 'react'

    export interface MarkerClustererProps {
        defaultAverageCenter?: boolean
        defaultBatchSizeIE?: number
        defaultBatchSize?: number
        defaultCalculator?: Calculator
        defaultClusterClass?: string
        defaultEnableRetinaIcons?: boolean
        defaultGridSize?: number
        defaultIgnoreHidden?: boolean
        defaultImageExtension?: string
        defaultImagePath?: string
        defaultImageSizes?: number[]
        defaultMaxZoom?: number
        defaultMinimumClusterSize?: number
        defaultStyles?: ClusterIconStyle[]
        defaultTitle?: string
        defaultZoomOnClick?: boolean
        averageCenter?: boolean
        batchSizeIE?: number
        batchSize?: number
        calculator?: Calculator
        clusterClass?: string
        enableRetinaIcons?: boolean
        gridSize?: number
        ignoreHidden?: boolean
        imageExtension?: string
        imagePath?: string
        imageSizes?: number[]
        maxZoom?: number
        minimumClusterSize?: number
        styles?: ClusterIconStyle[]
        title?:	string
        zoomOnClick?:	boolean

        onClick?(cluster: Cluster): void
        onClusteringBegin?(mc: MarkerClusterer): void
        onClusteringEnd?(mc: MarkerClusterer): void
        onMouseOut?(c: Cluster): void
        onMouseOver?(c: Cluster): void
    }

    export default class MarkerClusterer extends Component<MarkerClustererProps> {
    }
}

declare module 'react-google-maps/lib/components/Circle' {
    import { Component } from 'react'

    export interface CircleProps {
        defaultCenter?: google.maps.LatLng | google.maps.LatLngLiteral
        defaultDraggable?: boolean
        defaultEditable?: boolean
        defaultOptions?: google.maps.CircleOptions
        defaultRadius?: number
        defaultVisible?: boolean
        center?: google.maps.LatLng | google.maps.LatLngLiteral
        draggable?: boolean
        editable?: boolean
        options?: google.maps.CircleOptions
        radius?: number
        visible?: boolean

        onCenterChanged?(): void
        onClick?(e: google.maps.MouseEvent): void
        onDrag?(e: google.maps.MouseEvent): void
        onDblClick?(e: google.maps.MouseEvent): void
        onDragEnd?(e: google.maps.MouseEvent): void
        onDragStart?(e: google.maps.MouseEvent): void
        onMouseDown?(e: google.maps.MouseEvent): void
        onMouseMove?(e: google.maps.MouseEvent): void
        onMouseOut?(e: google.maps.MouseEvent): void
        onMouseOver?(e: google.maps.MouseEvent): void
        onMouseUp?(e: google.maps.MouseEvent): void
        onRadiusChanged?(): void
        onRightClick?(e: google.maps.MouseEvent): void
    }

    export default class Circle extends Component<CircleProps> {
        getBounds(): google.maps.LatLngBounds
        getCenter(): google.maps.LatLng
        getDraggable(): boolean
        getEditable(): boolean
        getRadius(): number
        getVisible(): boolean
    }
}

declare module 'react-google-maps/lib/components/DirectionsRenderer' {
    import { Component } from 'react'

    export interface DirectionsRendererProps {
        defaultDirections?: google.maps.DirectionsResult
        defaultOptions?: google.maps.DirectionsRendererOptions
        defaultPanel?: Node
        defaultRouteIndex?: number
        directions?: google.maps.DirectionsResult
        options?: google.maps.DirectionsRendererOptions
        panel?: Node
        routeIndex?: number

        onDirectionsChanged?(): void
    }

    export default class DirectionsRenderer extends Component<DirectionsRendererProps> {
        getDirections(): google.maps.DirectionsResult
        getPanel(): Node
        getRouteIndex(): number
    }
}

declare module 'react-google-maps/lib/components/drawing/DrawingManager' {
    import { Component } from 'react'

    export interface DrawingManagerProps {
        defaultDrawingMode?: google.maps.drawing.OverlayType
        defaultOptions?: google.maps.drawing.DrawingManagerOptions
        drawingMode?: google.maps.drawing.OverlayType
        options?: google.maps.drawing.DrawingManagerOptions

        onCircleComplete?(c: google.maps.Circle): void
        onMarkerComplete?(c: google.maps.Marker): void
        onOverlayComplete?(e: google.maps.drawing.OverlayCompleteEvent): void
        onPolygonComplete?(p: google.maps.Polygon): void
        onPolylineComplete?(p: google.maps.Polyline): void
        onRectangleComplete?(p: google.maps.Rectangle): void
    }

    export default class DrawingManager extends Component<DrawingManagerProps> {
        getDrawingMode(): google.maps.drawing.OverlayType
    }
}

declare module 'react-google-maps/lib/components/FusionTablesLayer' {
    import { Component } from 'react'

    export interface FusionTablesLayerProps {
        defaultOptions?: google.maps.FusionTablesLayerOptions
        options?: google.maps.FusionTablesLayerOptions
        onClick?(e: google.maps.FusionTablesMouseEvent): void
    }

    export default class FusionTablesLayer extends Component<FusionTablesLayerProps> {
    }
}

declare module 'react-google-maps/lib/components/GoogleMap' {
    import { Component } from 'react'

    export interface GoogleMapProps {
        defaultCenter?: google.maps.LatLng | google.maps.LatLngLiteral
        defaultClickableIcons?: boolean
        defaultHeading?: number
        defaultMapTypeId?: google.maps.MapTypeId | string
        defaultOptions?: google.maps.MapOptions
        defaultStreetView?: google.maps.StreetViewPanorama
        defaultTilt?: number
        defaultZoom?: number
        center?: google.maps.LatLng | google.maps.LatLngLiteral
        clickableIcons?: boolean
        heading?: number
        mapTypeId?: google.maps.MapTypeId | string
        options?: google.maps.MapOptions
        streetView?: google.maps.StreetViewPanorama
        tilt?: number
        zoom?: number

        onBoundsChanged?(): void
        onCenterChanged?(): void
        onClick?(e: google.maps.MouseEvent | google.maps.IconMouseEvent): void
        onDblClick?(e: google.maps.MouseEvent): void
        onDrag?(): void
        onDragEnd?(): void
        onDragStart?(): void
        onHeadingChanged?(): void
        onIdle?(): void
        onMapTypeIdChanged?(): void
        onMouseMove?(e: google.maps.MouseEvent): void
        onMouseOut?(e: google.maps.MouseEvent): void
        onMouseOver?(e: google.maps.MouseEvent): void
        onProjectionChanged?(): void
        onResize?(): void
        onRightClick?(e: google.maps.MouseEvent): void
        onTilesLoaded?(): void
        onTiltChanged?(): void
        onZoomChanged?(): void
    }

    export default class GoogleMap extends Component<GoogleMapProps> {
        fitBounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): void
        panBy(x: number, y: number): void
        panTo(latLng: google.maps.LatLng | google.maps.LatLngLiteral): void
        panToBounds(latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): void
        getBounds(): google.maps.LatLngBounds
        getCenter(): google.maps.LatLng
        getClickableIcons(): boolean
        getDiv(): Element
        getHeading(): number
        getMapTypeId(): google.maps.MapTypeId | string
        getProjection(): google.maps.Projection
        getStreetView(): google.maps.StreetViewPanorama
        getTilt(): number
        getZoom(): number
    }
}

declare module 'react-google-maps/lib/components/GroundOverlay' {
    import { Component } from 'react'

    export interface GroundOverlayProps {
        bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        url: string
        options?: google.maps.GroundOverlayOptions
    }

    export default class GroundOverlay extends Component<GroundOverlayProps> {
        getBounds(): google.maps.LatLngBounds
        getOpacity(): number
        getUrl(): string
    }
}

declare module 'react-google-maps/lib/components/InfoWindow' {
    import { Component } from 'react'

    export interface InfoWindowProps {
        defaultOptions?: google.maps.InfoWindowOptions
        defaultPosition?: google.maps.LatLng | google.maps.LatLngLiteral
        defaultZIndex?: number
        options?: google.maps.InfoWindowOptions
        position?: google.maps.LatLng | google.maps.LatLngLiteral
        zIndex?: number

        onCloseClick?(): void
        onDomReady?(): void
        onContentChanged?(): void
        onPositionChanged?(): void
        onZindexChanged?(): void
    }

    export default class InfoWindow extends Component<InfoWindowProps> {
        getPosition(): google.maps.LatLng
        getZIndex(): number
    }
}

declare module 'react-google-maps/lib/components/KmlLayer' {
    import { Component } from 'react'

    export interface KmlLayerProps {
        defaultOptions?: google.maps.KmlLayerOptions
        defaultUrl?: string
        defaultZIndex?: number
        options?: google.maps.KmlLayerOptions
        url?: string
        zIndex?: number

        onDefaultViewportChanged?(): void
        onClick?(e: google.maps.KmlMouseEvent): void
        onStatusChanged?(): void
    }

    export default class KmlLayer extends Component<KmlLayerProps> {
        getDefaultViewport(): google.maps.LatLngBounds
        getMetadata(): google.maps.KmlLayerMetadata
        getStatus(): google.maps.KmlLayerStatus
        getUrl(): string
        getZIndex(): number
    }
}

declare module 'react-google-maps/lib/components/Marker' {
    import { Component } from 'react'

    export interface MarkerProps {
        defaultAnimation?: google.maps.Animation
        defaultClickable?: boolean
        defaultCursor?: string
        defaultDraggable?: boolean
        defaultIcon?: string | google.maps.Icon | google.maps.Symbol
        defaultLabel?: google.maps.MarkerLabel
        defaultOpacity?: number
        defaultOptions?: google.maps.MarkerOptions
        defaultPlace?: google.maps.Place
        defaultPosition?: google.maps.LatLng | google.maps.LatLngLiteral
        defaultShape?: google.maps.MarkerShape
        defaultTitle?: string
        defaultVisible?: boolean
        defaultZIndex?: number
        animation?: google.maps.Animation
        attribution?: google.maps.Attribution
        clickable?: boolean
        cursor?: string
        draggable?: boolean
        icon?: string | google.maps.Icon | google.maps.Symbol
        label?: google.maps.MarkerLabel
        opacity?: number
        options?: google.maps.MarkerOptions
        place?: google.maps.Place
        position?: google.maps.LatLng | google.maps.LatLngLiteral
        shape?: google.maps.MarkerShape
        title?: string
        visible?: boolean
        zIndex?: number

        onAnimationChanged?(): void
        onClick?(e: google.maps.MouseEvent): void
        onClickableChanged?(): void
        onCursorChanged?(): void
        onDblClick?(e: google.maps.MouseEvent): void
        onDrag?(e: google.maps.MouseEvent): void
        onDraggableChanged?(): void
        onDragEnd?(e: google.maps.MouseEvent): void
        onDragStart?(e: google.maps.MouseEvent): void
        onFlatChanged?(): void
        onIconChanged?(): void
        onMouseDown?(e: google.maps.MouseEvent): void
        onMouseOut?(e: google.maps.MouseEvent): void
        onMouseOver?(e: google.maps.MouseEvent): void
        onMouseUp?(e: google.maps.MouseEvent): void
        onPositionChanged?(): void
        onRightClick?(e: google.maps.MouseEvent): void
        onShapeChanged?(): void
        onTitleChanged?(): void
        onVisibleChanged?(): void
        onZindexChanged?(): void

        // MarkerClustererPlus
        noRedraw?: boolean

        // MarkerWithLabel
        markerWithLabel?(): void
        labelClass?: string
        labelAnchor?: google.maps.Point
        labelContent?: string
        labelStyle?: CSSStyleDeclaration
    }

    export default class Marker extends Component<MarkerProps> {
        getAnimation(): google.maps.Animation
        getClickable(): boolean
        getCursor(): string
        getDraggable(): boolean
        getIcon(): string | google.maps.Icon | google.maps.Symbol
        getLabel(): google.maps.MarkerLabel
        getOpacity(): number
        getPlace(): google.maps.Place
        getPosition(): google.maps.LatLng
        getShape(): google.maps.MarkerShape
        getTitle(): string
        getVisible(): boolean
        getZIndex(): number
    }
}

declare module 'react-google-maps/lib/components/OverlayView' {
    import { Component, ReactNode } from 'react'

    export interface OverlayViewProps {
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        children?: ReactNode
        getPixelPositionOffset?: (width: number, height: number) => { x?: number, y?: number }
        mapPaneName?: string
        position?: google.maps.LatLng | google.maps.LatLngLiteral
    }

    export default class OverlayView extends Component<OverlayViewProps> {
        static FLOAT_PANE: string
        static MAP_PANE: string
        static MARKER_LAYER: string
        static OVERLAY_LAYER: string
        static OVERLAY_MOUSE_TARGET: string

        getPanes(): google.maps.MapPanes
        getProjection(): google.maps.MapCanvasProjection
    }
}

declare module 'react-google-maps/lib/components/places/SearchBox' {
    import { Component } from 'react'

    export interface SearchBoxProps {
        controlPosition?: number
        defaultBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        onPlacesChanged?(): void
    }

    export default class SearchBox extends Component<SearchBoxProps> {
        getBounds(): google.maps.LatLngBounds
        getPlaces(): google.maps.places.PlaceResult[]
    }
}

declare module 'react-google-maps/lib/components/places/StandaloneSearchBox' {
    import { Component } from 'react'

    export interface StandaloneSearchBoxProps {
        defaultBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        onPlacesChanged?(): void
    }

    export default class StandaloneSearchBox extends Component<StandaloneSearchBoxProps> {
        getBounds(): google.maps.LatLngBounds
        getPlaces(): google.maps.places.PlaceResult[]
    }
}

declare module 'react-google-maps/lib/components/Polygon' {
    import { Component } from 'react'

    export interface PolygonProps {
        defaultDraggable?: boolean
        defaultEditable?: boolean
        defaultOptions?: google.maps.PolygonOptions
        defaultPath?: google.maps.MVCArray<google.maps.LatLng> | Array<google.maps.LatLng | google.maps.LatLngLiteral>
        defaultPaths?: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> | google.maps.MVCArray<google.maps.LatLng> | Array<Array<google.maps.LatLng | google.maps.LatLngLiteral>> | Array<google.maps.LatLng | google.maps.LatLngLiteral>
        defaultVisible?: boolean
        draggable?: boolean
        editable?: boolean
        options?: google.maps.PolygonOptions
        path?: google.maps.MVCArray<google.maps.LatLng> | Array<google.maps.LatLng | google.maps.LatLngLiteral>
        paths?: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> | google.maps.MVCArray<google.maps.LatLng> | Array<Array<google.maps.LatLng | google.maps.LatLngLiteral>> | Array<google.maps.LatLng | google.maps.LatLngLiteral>
        visible?: boolean

        onClick?(e: google.maps.PolyMouseEvent): void
        onDblClick?(e: google.maps.PolyMouseEvent): void
        onDrag?(e: google.maps.MouseEvent): void
        onDragEnd?(e: google.maps.MouseEvent): void
        onDragStart?(e: google.maps.MouseEvent): void
        onMouseDown?(e: google.maps.PolyMouseEvent): void
        onMouseMove?(e: google.maps.PolyMouseEvent): void
        onMouseOut?(e: google.maps.PolyMouseEvent): void
        onMouseOver?(e: google.maps.PolyMouseEvent): void
        onMouseUp?(e: google.maps.PolyMouseEvent): void
        onRightClick?(e: google.maps.PolyMouseEvent): void
    }

    export default class Polygon extends Component<PolygonProps> {
        getDraggable(): boolean
        getEditable(): boolean
        getPath(): google.maps.MVCArray<google.maps.LatLng>
        getPaths(): google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
        getVisible(): boolean
    }
}

declare module 'react-google-maps/lib/components/Polyline' {
    import { Component } from 'react'

    export interface PolylineProps {
        defaultDraggable?: boolean
        defaultEditable?: boolean
        defaultOptions?: google.maps.PolylineOptions
        defaultPath?: google.maps.MVCArray<google.maps.LatLng> | Array<google.maps.LatLng | google.maps.LatLngLiteral>
        defaultVisible?: boolean
        draggable?: boolean
        editable?: boolean
        options?: google.maps.PolylineOptions
        path?: google.maps.MVCArray<google.maps.LatLng> | Array<google.maps.LatLng | google.maps.LatLngLiteral>
        visible?: boolean

        onClick?(e: google.maps.PolyMouseEvent): void
        onDblClick?(e: google.maps.PolyMouseEvent): void
        onDrag?(e: google.maps.MouseEvent): void
        onDragEnd?(e: google.maps.MouseEvent): void
        onDragStart?(e: google.maps.MouseEvent): void
        onMouseDown?(e: google.maps.PolyMouseEvent): void
        onMouseMove?(e: google.maps.PolyMouseEvent): void
        onMouseOut?(e: google.maps.PolyMouseEvent): void
        onMouseOver?(e: google.maps.PolyMouseEvent): void
        onMouseUp?(e: google.maps.PolyMouseEvent): void
        onRightClick?(e: google.maps.PolyMouseEvent): void
    }

    export default class Polyline extends Component<PolylineProps> {
        getDraggable(): boolean
        getEditable(): boolean
        getPath(): google.maps.MVCArray<google.maps.LatLng>
        getVisible(): boolean
    }
}

declare module 'react-google-maps/lib/components/Rectangle' {
    import { Component } from 'react'

    export interface RectangleProps {
        defaultBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        defaultDraggable?: boolean
        defaultEditable?: boolean
        defaultOptions?: google.maps.RectangleOptions
        defaultVisible?: boolean
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
        draggable?: boolean
        editable?: boolean
        options?: google.maps.RectangleOptions
        visible?: boolean

        onBoundsChanged?(): void
        onClick?(e: google.maps.MouseEvent): void
        onDblClick?(e: google.maps.MouseEvent): void
        onDrag?(e: google.maps.MouseEvent): void
        onDragEnd?(e: google.maps.MouseEvent): void
        onDragStart?(e: google.maps.MouseEvent): void
        onMouseDown?(e: google.maps.MouseEvent): void
        onMouseMove?(e: google.maps.MouseEvent): void
        onMouseOut?(e: google.maps.MouseEvent): void
        onMouseOver?(e: google.maps.MouseEvent): void
        onMouseUp?(e: google.maps.MouseEvent): void
        onRightClick?(e: google.maps.MouseEvent): void
    }

    export default class Rectangle extends Component<RectangleProps> {
        getBounds(): google.maps.LatLngBounds
        getDraggable(): boolean
        getEditable(): boolean
        getVisible(): boolean
    }
}

declare module 'react-google-maps/lib/components/StreetViewPanorama' {
    import { Component } from 'react'

    export interface StreetViewPanoramaProps {
        defaultLinks?: google.maps.StreetViewLink[]
        defaultMotionTracking?: boolean
        defaultOptions?: google.maps.StreetViewPanoramaOptions
        defaultPano?: string
        defaultPosition?: google.maps.LatLng | google.maps.LatLngLiteral
        defaultPov?: google.maps.StreetViewPov
        defaultVisible?: boolean
        defaultZoom?: number
        links?: google.maps.StreetViewLink[]
        motionTracking?: boolean
        options?: google.maps.StreetViewPanoramaOptions
        pano?: string
        position?: google.maps.LatLng | google.maps.LatLngLiteral
        pov?: google.maps.StreetViewPov
        visible?: boolean
        zoom?: number

        onCloseClick?(e: Event): void
        onPanoChanged?(): void
        onPositionChanged?(): void
        onPovChanged?(): void
        onResize?(): void
        onStatusChanged?(): void
        onVisibleChanged?(): void
        onZoomChanged?(): void
    }

    export default class StreetViewPanorama extends Component<StreetViewPanoramaProps> {
        getLinks(): google.maps.StreetViewLink[]
        getLocation(): google.maps.StreetViewLocation
        getMotionTracking(): boolean
        getPano(): string
        getPhotographerPov(): google.maps.StreetViewPov
        getPosition(): google.maps.LatLng
        getPov(): google.maps.StreetViewPov
        getStatus(): google.maps.StreetViewStatus
        getVisible(): boolean
        getZoom(): number
    }
}

declare module 'react-google-maps/lib/components/TrafficLayer' {
    import { Component } from 'react'

    export interface TrafficLayerProps {
        defaultOptions?: google.maps.TrafficLayerOptions
        options?: google.maps.TrafficLayerOptions
    }

    export default class TrafficLayer extends Component<TrafficLayerProps> {
    }
}

declare module 'react-google-maps/lib/components/visualization/HeatmapLayer' {
    import { Component } from 'react'

    export interface HeatmapLayerProps {
        defaultData?: google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation> | Array<google.maps.LatLng | google.maps.visualization.WeightedLocation>
        defaultOptions?: google.maps.visualization.HeatmapLayerOptions
        data?: google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation> | Array<google.maps.LatLng | google.maps.visualization.WeightedLocation>
        options?: google.maps.visualization.HeatmapLayerOptions
    }

    export default class HeatmapLayer extends Component<HeatmapLayerProps> {
        getData(): google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation>
    }
}
