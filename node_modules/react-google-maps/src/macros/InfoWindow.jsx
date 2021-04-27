/* global google */
import invariant from "invariant"
import canUseDOM from "can-use-dom"
import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../utils/MapChildHelper"

import { MAP, ANCHOR, INFO_WINDOW } from "../constants"

export const __jscodeshiftPlaceholder__ = `{
  "prohibitedPropNames": [
    "content"
  ],
  "eventMapOverrides": {
    "onCloseClick": "closeclick",
    "onDomReady": "domready"
  },
  "getInstanceFromComponent": "this.state[INFO_WINDOW]"
}`

/**
 * A wrapper around `google.maps.InfoWindow`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
 */
export class InfoWindow extends React.PureComponent {
  static propTypes = {
    __jscodeshiftPlaceholder__: null,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
    [ANCHOR]: PropTypes.object,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
   */
  constructor(props, context) {
    super(props, context)
    const infoWindow = new google.maps.InfoWindow()
    construct(InfoWindow.propTypes, updaterMap, this.props, infoWindow)
    infoWindow.setMap(this.context[MAP])
    this.state = {
      [INFO_WINDOW]: infoWindow,
    }
  }

  componentWillMount() {
    if (!canUseDOM || this.containerElement) {
      return
    }
    if (React.version.match(/^16/)) {
      this.containerElement = document.createElement(`div`)
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[INFO_WINDOW], eventMap)
    if (React.version.match(/^16/)) {
      this.state[INFO_WINDOW].setContent(this.containerElement)
      open(this.state[INFO_WINDOW], this.context[ANCHOR])
      return
    }
    const content = document.createElement(`div`)
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      React.Children.only(this.props.children),
      content
    )
    this.state[INFO_WINDOW].setContent(content)
    open(this.state[INFO_WINDOW], this.context[ANCHOR])
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[INFO_WINDOW],
      eventMap,
      updaterMap,
      prevProps
    )
    if (React.version.match(/^16/)) {
      return
    }
    if (this.props.children !== prevProps.children) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        React.Children.only(this.props.children),
        this.state[INFO_WINDOW].getContent()
      )
    }
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const infoWindow = this.state[INFO_WINDOW]
    if (infoWindow) {
      if (!React.version.match(/^16/) && infoWindow.getContent()) {
        ReactDOM.unmountComponentAtNode(infoWindow.getContent())
      }
      infoWindow.setMap(null)
    }
  }

  render() {
    if (React.version.match(/^16/)) {
      return ReactDOM.createPortal(
        React.Children.only(this.props.children),
        this.containerElement
      )
    }
    return false
  }
}

export default InfoWindow

const open = (infoWindow, anchor) => {
  if (anchor) {
    infoWindow.open(infoWindow.getMap(), anchor)
  } else if (infoWindow.getPosition()) {
    infoWindow.open(infoWindow.getMap())
  } else {
    invariant(
      false,
      `You must provide either an anchor (typically render it inside a <Marker>) or a position props for <InfoWindow>.`
    )
  }
}

const eventMap = {}

const updaterMap = {}
