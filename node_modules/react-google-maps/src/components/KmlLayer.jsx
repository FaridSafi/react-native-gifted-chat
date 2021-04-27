/*
 * -----------------------------------------------------------------------------
 * This file is auto-generated from the corresponding file at `src/macros/`.
 * Please **DO NOT** edit this file directly when creating PRs.
 * -----------------------------------------------------------------------------
 */
/* global google */
import React from "react"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { MAP, KML_LAYER } from "../constants"

/**
 * A wrapper around `google.maps.KmlLayer`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#KmlLayer
 */
export class KmlLayer extends React.PureComponent {
  static propTypes = {
    /**
     * @type KmlLayerOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type string
     */
    defaultUrl: PropTypes.string,

    /**
     * @type number
     */
    defaultZIndex: PropTypes.number,

    /**
     * @type KmlLayerOptions
     */
    options: PropTypes.any,

    /**
     * @type string
     */
    url: PropTypes.string,

    /**
     * @type number
     */
    zIndex: PropTypes.number,

    /**
     * function
     */
    onDefaultViewportChanged: PropTypes.func,

    /**
     * function
     */
    onClick: PropTypes.func,

    /**
     * function
     */
    onStatusChanged: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#KmlLayer
   */
  constructor(props, context) {
    super(props, context)
    const kmlLayer = new google.maps.KmlLayer()
    construct(KmlLayer.propTypes, updaterMap, this.props, kmlLayer)
    kmlLayer.setMap(this.context[MAP])
    this.state = {
      [KML_LAYER]: kmlLayer,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[KML_LAYER], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[KML_LAYER],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const kmlLayer = this.state[KML_LAYER]
    if (kmlLayer) {
      kmlLayer.setMap(null)
    }
  }

  render() {
    return false
  }

  /**
   * Get the default viewport for the layer being displayed.
   * @type LatLngBounds
   * @public
   */
  getDefaultViewport() {
    return this.state[KML_LAYER].getDefaultViewport()
  }

  /**
   * Get the metadata associated with this layer, as specified in the layer markup.
   * @type KmlLayerMetadata
   * @public
   */
  getMetadata() {
    return this.state[KML_LAYER].getMetadata()
  }

  /**
   * Get the status of the layer, set once the requested document has loaded.
   * @type KmlLayerStatus
   * @public
   */
  getStatus() {
    return this.state[KML_LAYER].getStatus()
  }

  /**
   * Gets the URL of the KML file being displayed.
   * @type string
   * @public
   */
  getUrl() {
    return this.state[KML_LAYER].getUrl()
  }

  /**
   * Gets the z-index of the KML Layer.
   * @type number
   * @public
   */
  getZIndex() {
    return this.state[KML_LAYER].getZIndex()
  }
}

export default KmlLayer

const eventMap = {
  onDefaultViewportChanged: "defaultviewport_changed",
  onClick: "click",
  onStatusChanged: "status_changed",
}

const updaterMap = {
  options(instance, options) {
    instance.setOptions(options)
  },

  url(instance, url) {
    instance.setUrl(url)
  },

  zIndex(instance, zIndex) {
    instance.setZIndex(zIndex)
  },
}
