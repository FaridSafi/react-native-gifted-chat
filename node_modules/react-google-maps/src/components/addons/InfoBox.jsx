import canUseDOM from "can-use-dom"
import invariant from "invariant"
import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../../utils/MapChildHelper"

import { MAP, ANCHOR, INFO_BOX } from "../../constants"

/**
 * A wrapper around `InfoBox`
 *
 * @see http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/infobox/docs/reference.html
 */
export class InfoBox extends React.PureComponent {
  static propTypes = {
    /**
     * @type InfoBoxOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type LatLng|LatLngLiteral
     */
    defaultPosition: PropTypes.any,

    /**
     * @type boolean
     */
    defaultVisible: PropTypes.bool,

    /**
     * @type number
     */
    defaultZIndex: PropTypes.number,

    /**
     * @type InfoBoxOptions
     */
    options: PropTypes.any,

    /**
     * @type LatLng|LatLngLiteral
     */
    position: PropTypes.any,

    /**
     * @type boolean
     */
    visible: PropTypes.bool,

    /**
     * @type number
     */
    zIndex: PropTypes.number,

    /**
     * function
     */
    onCloseClick: PropTypes.func,

    /**
     * function
     */
    onDomReady: PropTypes.func,

    /**
     * function
     */
    onContentChanged: PropTypes.func,

    /**
     * function
     */
    onPositionChanged: PropTypes.func,

    /**
     * function
     */
    onZindexChanged: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
    [ANCHOR]: PropTypes.object,
  }

  state = {
    [INFO_BOX]: null,
  }

  /*
   * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoBox
   */
  componentWillMount() {
    if (!canUseDOM || this.state[INFO_BOX]) {
      return
    }
    const {
      InfoBox: GoogleMapsInfobox,
    } = require(/* "google-maps-infobox" uses "google" as a global variable. Since we don't
       * have "google" on the server, we can not use it in server-side rendering.
       * As a result, we import "google-maps-infobox" here to prevent an error on
       * a isomorphic server.
       */ `google-maps-infobox`)
    const infoBox = new GoogleMapsInfobox()
    construct(InfoBox.propTypes, updaterMap, this.props, infoBox)
    infoBox.setMap(this.context[MAP])
    this.setState({
      [INFO_BOX]: infoBox,
    })
  }

  componentDidMount() {
    componentDidMount(this, this.state[INFO_BOX], eventMap)
    const content = document.createElement(`div`)
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      React.Children.only(this.props.children),
      content
    )
    this.state[INFO_BOX].setContent(content)
    open(this.state[INFO_BOX], this.context[ANCHOR])
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[INFO_BOX],
      eventMap,
      updaterMap,
      prevProps
    )
    if (this.props.children !== prevProps.children) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        React.Children.only(this.props.children),
        this.state[INFO_BOX].getContent()
      )
    }
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const infoBox = this.state[INFO_BOX]
    if (infoBox) {
      if (infoBox.getContent()) {
        ReactDOM.unmountComponentAtNode(infoBox.getContent())
      }
      infoBox.setMap(null)
    }
  }

  render() {
    return false
  }

  /**
   *
   * @type LatLng
   */
  getPosition() {
    return this.state[INFO_BOX].getPosition()
  }

  /**
   *
   * @type boolean
   */
  getVisible() {
    return this.state[INFO_BOX].getVisible()
  }

  /**
   *
   * @type number
   */
  getZIndex() {
    return this.state[INFO_BOX].getZIndex()
  }
}

export default InfoBox

const open = (infoBox, anchor) => {
  if (anchor) {
    infoBox.open(infoBox.getMap(), anchor)
  } else if (infoBox.getPosition()) {
    infoBox.open(infoBox.getMap())
  } else {
    invariant(
      false,
      `You must provide either an anchor (typically render it inside a <Marker>) or a position props for <InfoBox>.`
    )
  }
}

const eventMap = {
  onCloseClick: "closeclick",
  onDomReady: "domready",
  onContentChanged: "content_changed",
  onPositionChanged: "position_changed",
  onZindexChanged: "zindex_changed",
}

const updaterMap = {
  options(instance, options) {
    instance.setOptions(options)
  },

  position(instance, position) {
    instance.setPosition(position)
  },

  visible(instance, visible) {
    instance.setVisible(visible)
  },

  zIndex(instance, zIndex) {
    instance.setZIndex(zIndex)
  },
}
