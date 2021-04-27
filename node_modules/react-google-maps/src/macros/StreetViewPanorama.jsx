import invariant from "invariant"
import React from "react"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { MAP } from "../constants"

export const __jscodeshiftPlaceholder__ = `{
  "eventMapOverrides": {
    "onCloseClick": "closeclick"
  },
  "getInstanceFromComponent": "this.context[MAP]"
}`

/**
 * A wrapper around `google.maps.StreetViewPanorama`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanorama
 */
export class StreetViewPanorama extends React.PureComponent {
  static propTypes = {
    __jscodeshiftPlaceholder__: null,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  static childContextTypes = {
    [MAP]: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    invariant(
      !!this.context[MAP],
      `Did you render <StreetViewPanorama> as a child of <GoogleMap> with withGoogleMap() HOC?`
    )
    construct(
      StreetViewPanorama.propTypes,
      updaterMap,
      this.props,
      this.context[MAP].getStreetView()
    )
  }

  getChildContext() {
    return {
      [MAP]: this.context[MAP].getStreetView(),
    }
  }

  componentDidMount() {
    componentDidMount(this, this.context[MAP].getStreetView(), eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.context[MAP].getStreetView(),
      eventMap,
      updaterMap,
      prevProps
    )
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const streetViewPanorama = this.context[MAP].getStreetView()
    if (streetViewPanorama) {
      streetViewPanorama.setVisible(false)
    }
  }

  render() {
    const { children } = this.props
    return <div>{children}</div>
  }
}

export default StreetViewPanorama

const eventMap = {}

const updaterMap = {}
