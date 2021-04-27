/* global google */
import React from "react"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { MAP, TRAFFIC_LAYER } from "../constants"

export const __jscodeshiftPlaceholder__ = `{
  "eventMapOverrides": {
  },
  "getInstanceFromComponent": "this.state[TRAFFIC_LAYER]"
}`

/**
 * A wrapper around `google.maps.TrafficLayer`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#TrafficLayer
 */
export class TrafficLayer extends React.PureComponent {
  static propTypes = {
    __jscodeshiftPlaceholder__: null,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#TrafficLayer
   */
  constructor(props, context) {
    super(props, context)
    const trafficLayer = new google.maps.TrafficLayer()
    construct(TrafficLayer.propTypes, updaterMap, this.props, trafficLayer)
    trafficLayer.setMap(this.context[MAP])
    this.state = {
      [TRAFFIC_LAYER]: trafficLayer,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[TRAFFIC_LAYER], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[TRAFFIC_LAYER],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const trafficLayer = this.state[TRAFFIC_LAYER]
    if (trafficLayer) {
      trafficLayer.setMap(null)
    }
  }

  render() {
    return false
  }
}

export default TrafficLayer

const eventMap = {}

const updaterMap = {}
