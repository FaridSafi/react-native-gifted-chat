/* global google */
import React from "react"
import PropTypes from "prop-types"
import makeMarkerWithLabel from "markerwithlabel"
import ReactDOM from "react-dom"

import {
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
  construct,
} from "../../utils/MapChildHelper"

import { MAP, MARKER_CLUSTERER, MARKER_WITH_LABEL } from "../../constants"

export const __jscodeshiftPlaceholder__ = `{
  "KlassNameOverrride": "Marker",
  "eventMapOverrides": {
    "onDblClick": "dblclick",
    "onDragEnd": "dragend",
    "onDragStart": "dragstart",
    "onMouseDown": "mousedown",
    "onMouseOut": "mouseout",
    "onMouseOver": "mouseover",
    "onMouseUp": "mouseup",
    "onRightClick": "rightclick"
  },
  "getInstanceFromComponent": "this.state[MARKER_WITH_LABEL]"
}`

/**
 * A wrapper around `MarkerWithLabel`
 *
 * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
 */
export class MarkerWithLabel extends React.PureComponent {
  static propTypes = {
    __jscodeshiftPlaceholder__: null,
    /**
     * It will be `MarkerWithLabel#labelContent`.
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    children: PropTypes.node,
    /**
     * For `MarkerWithLabel`
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelAnchor: PropTypes.object,
    /**
     * For `MarkerWithLabel`
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelClass: PropTypes.string,
    /**
     * For `MarkerWithLabel`. This is for native JS style object, so you may
     * expect some React shorthands for inline styles not working here.
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelStyle: PropTypes.object,
    /**
     * For `MarkerWithLabel`
     * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
     */
    labelVisible: PropTypes.bool,
    /**
     * For the 2nd argument of `MarkerCluster#addMarker`
     * @see https://github.com/mikesaidani/marker-clusterer-plus
     */
    noRedraw: PropTypes.bool,
  }

  static defaultProps = {
    labelVisible: true,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
    [MARKER_CLUSTERER]: PropTypes.object,
  }

  /*
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  constructor(props, context) {
    super(props, context)
    const NativeMarkerWithLabel = makeMarkerWithLabel(google.maps)
    const markerWithLabel = new NativeMarkerWithLabel()
    construct(
      MarkerWithLabel.propTypes,
      updaterMap,
      this.props,
      markerWithLabel
    )
    const markerClusterer = this.context[MARKER_CLUSTERER]
    if (markerClusterer) {
      markerClusterer.addMarker(markerWithLabel, !!this.props.noRedraw)
    } else {
      markerWithLabel.setMap(this.context[MAP])
    }
    this.state = {
      [MARKER_WITH_LABEL]: markerWithLabel,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[MARKER_WITH_LABEL], eventMap)
    const container = document.createElement(`div`)
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      React.Children.only(this.props.children),
      container
    )
    this.state[MARKER_WITH_LABEL].set(`labelContent`, container)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[MARKER_WITH_LABEL],
      eventMap,
      updaterMap,
      prevProps
    )
    if (this.props.children !== prevProps.children) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        React.Children.only(this.props.children),
        this.state[MARKER_WITH_LABEL].get("labelContent")
      )
    }
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const markerWithLabel = this.state[MARKER_WITH_LABEL]
    if (markerWithLabel) {
      const markerClusterer = this.context[MARKER_CLUSTERER]
      if (markerClusterer) {
        markerClusterer.removeMarker(markerWithLabel, !!this.props.noRedraw)
      }
      if (markerWithLabel.get("labelContent")) {
        ReactDOM.unmountComponentAtNode(markerWithLabel.get("labelContent"))
      }
      markerWithLabel.setMap(null)
    }
  }

  render() {
    return false
  }
}

export default MarkerWithLabel

const eventMap = {}

const updaterMap = {
  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelAnchor(instance, labelAnchor) {
    instance.set(`labelAnchor`, labelAnchor)
  },
  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelClass(instance, labelClass) {
    instance.set(`labelClass`, labelClass)
  },
  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelStyle(instance, labelStyle) {
    instance.set(`labelStyle`, labelStyle)
  },
  /**
   * For `MarkerWithLabel`
   * @see https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js
   */
  labelVisible(instance, labelVisible) {
    instance.set(`labelVisible`, labelVisible)
  },
}
