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

import { MAP, BICYCLING_LAYER } from "../constants"

/**
 * A wrapper around `google.maps.BicyclingLayer`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#BicyclingLayer
 */
export class BicyclingLayer extends React.PureComponent {
  static propTypes = {}

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#BicyclingLayer
   */
  constructor(props, context) {
    super(props, context)
    const bicyclingLayer = new google.maps.BicyclingLayer()
    construct(BicyclingLayer.propTypes, updaterMap, this.props, bicyclingLayer)
    bicyclingLayer.setMap(this.context[MAP])
    this.state = {
      [BICYCLING_LAYER]: bicyclingLayer,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[BICYCLING_LAYER], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[BICYCLING_LAYER],
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const bicyclingLayer = this.state[BICYCLING_LAYER]
    if (bicyclingLayer) {
      bicyclingLayer.setMap(null)
    }
  }

  render() {
    return false
  }
}

export default BicyclingLayer

const eventMap = {}

const updaterMap = {}
