/* global google */
import warning from "warning"
import React from "react"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { MAP, GROUND_LAYER } from "../constants"

export const __jscodeshiftPlaceholder__ = `{
  "eventMapOverrides": {
    "onDblClick": "dblclick"
  },
  "getInstanceFromComponent": "this.state[GROUND_LAYER]"
}`

/**
 * A wrapper around `google.maps.GroundOverlay`
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference#GroundOverlay
 */
export class GroundOverlay extends React.PureComponent {
  static propTypes = {
    __jscodeshiftPlaceholder__: null,
    /**
     * @type string
     */
    defaultUrl: PropTypes.string /* v10.0.0 .isRequired */,

    /**
     * @see https://developers.google.com/maps/documentation/javascript/reference#GroundOverlay
     */
    defaultBounds: PropTypes.object /* v10.0.0 .isRequired */,

    /**
     * @type string
     * @deprecated use `defaultUrl` instead. It will be removed in v10.0.0
     */
    url: PropTypes.string,

    /**
     * @see https://developers.google.com/maps/documentation/javascript/reference#GroundOverlay
     * @deprecated use `defaultBounds` instead. It will be removed in v10.0.0
     */
    bounds: PropTypes.object,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#GroundOverlay
   */
  constructor(props, context) {
    super(props, context)
    warning(
      !props.url || !props.bounds,
      `
For GroundOveray, url and bounds are passed in to constructor and are immutable
 after iinstantiated. This is the behavior of Google Maps JavaScript API v3 (
 See https://developers.google.com/maps/documentation/javascript/reference#GroundOverlay)
 Hence, use the corresponding two props provided by \`react-google-maps\`.
 They're prefixed with _default_ (defaultUrl, defaultBounds).

 In some cases, you'll need the GroundOverlay component to reflect the changes
 of url and bounds. You can leverage the React's key property to remount the
 component. Typically, just \`key={url}\` would serve your need.
 See https://github.com/tomchentw/react-google-maps/issues/655
`
    )
    const groundOverlay = new google.maps.GroundOverlay(
      props.defaultUrl || props.url,
      props.defaultBounds || props.bounds
    )
    construct(GroundOverlay.propTypes, updaterMap, this.props, groundOverlay)
    groundOverlay.setMap(this.context[MAP])
    this.state = {
      [GROUND_LAYER]: groundOverlay,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[GROUND_LAYER], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[GROUND_LAYER],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const GroundOverlay = this.state[GROUND_LAYER]
    if (GroundOverlay) {
      GroundOverlay.setMap(null)
    }
  }

  render() {
    return false
  }
}

export default GroundOverlay

const eventMap = {}

const updaterMap = {}
