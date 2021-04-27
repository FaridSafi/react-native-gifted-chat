import React from "react"
import PropTypes from "prop-types"
import MarkerClustererPlus from "marker-clusterer-plus"

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from "../../utils/MapChildHelper"

import { MAP, ANCHOR, MARKER_CLUSTERER } from "../../constants"

/**
 * A wrapper around `MarkerClusterer`
 *
 * @see https://github.com/mahnunchik/markerclustererplus/blob/master/docs/reference.html
 */
export class MarkerClusterer extends React.PureComponent {
  static propTypes = {
    /**
     * @type boolean
     */
    defaultAverageCenter: PropTypes.bool,

    /**
     * @type number
     */
    defaultBatchSizeIE: PropTypes.number,

    /**
     * @type number
     */
    defaultBatchSize: PropTypes.number,

    /**
     * @type function
     */
    defaultCalculator: PropTypes.func,

    /**
     * @type string
     */
    defaultClusterClass: PropTypes.string,

    /**
     * @type boolean
     */
    defaultEnableRetinaIcons: PropTypes.bool,

    /**
     * @type number
     */
    defaultGridSize: PropTypes.number,

    /**
     * @type boolean
     */
    defaultIgnoreHidden: PropTypes.bool,

    /**
     * @type string
     */
    defaultImageExtension: PropTypes.string,

    /**
     * @type string
     */
    defaultImagePath: PropTypes.string,

    /**
     * @type Array
     */
    defaultImageSizes: PropTypes.array,

    /**
     * @type number
     */
    defaultMaxZoom: PropTypes.number,

    /**
     * @type number
     */
    defaultMinimumClusterSize: PropTypes.number,

    /**
     * @type Array
     */
    defaultStyles: PropTypes.array,

    /**
     * @type string
     */
    defaultTitle: PropTypes.string,

    /**
     * @type boolean
     */
    defaultZoomOnClick: PropTypes.bool,

    /**
     * @type boolean
     */
    averageCenter: PropTypes.bool,

    /**
     * @type number
     */
    batchSizeIE: PropTypes.number,

    /**
     * @type number
     */
    batchSize: PropTypes.number,

    /**
     * @type function
     */
    calculator: PropTypes.func,

    /**
     * @type string
     */
    clusterClass: PropTypes.string,

    /**
     * @type boolean
     */
    enableRetinaIcons: PropTypes.bool,

    /**
     * @type number
     */
    gridSize: PropTypes.number,

    /**
     * @type boolean
     */
    ignoreHidden: PropTypes.bool,

    /**
     * @type string
     */
    imageExtension: PropTypes.string,

    /**
     * @type string
     */
    imagePath: PropTypes.string,

    /**
     * @type Array
     */
    imageSizes: PropTypes.array,

    /**
     * @type number
     */
    maxZoom: PropTypes.number,

    /**
     * @type number
     */
    minimumClusterSize: PropTypes.number,

    /**
     * @type Array
     */
    styles: PropTypes.array,

    /**
     * @type string
     */
    title: PropTypes.string,

    /**
     * @type boolean
     */
    zoomOnClick: PropTypes.bool,

    /**
     * function
     */
    onClick: PropTypes.func,

    /**
     * function
     */
    onClusteringBegin: PropTypes.func,

    /**
     * function
     */
    onClusteringEnd: PropTypes.func,

    /**
     * function
     */
    onMouseOut: PropTypes.func,

    /**
     * function
     */
    onMouseOver: PropTypes.func,
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  static childContextTypes = {
    [ANCHOR]: PropTypes.object,
    [MARKER_CLUSTERER]: PropTypes.object,
  }

  /*
   * @see https://github.com/mahnunchik/markerclustererplus/blob/master/docs/reference.html
   */
  constructor(props, context) {
    super(props, context)
    const markerClusterer = new MarkerClustererPlus()
    construct(
      MarkerClusterer.propTypes,
      updaterMap,
      this.props,
      markerClusterer
    )
    markerClusterer.setMap(this.context[MAP])
    this.state = {
      [MARKER_CLUSTERER]: markerClusterer,
    }
  }

  getChildContext() {
    const markerClusterer = this.state[MARKER_CLUSTERER]
    return {
      [ANCHOR]: markerClusterer,
      [MARKER_CLUSTERER]: markerClusterer,
    }
  }

  componentDidMount() {
    componentDidMount(this, this.state[MARKER_CLUSTERER], eventMap)
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(
      this,
      this.state[MARKER_CLUSTERER],
      eventMap,
      updaterMap,
      prevProps
    )
    this.state[MARKER_CLUSTERER].repaint()
  }

  componentWillUnmount() {
    componentWillUnmount(this)
    const markerClusterer = this.state[MARKER_CLUSTERER]
    if (markerClusterer) {
      markerClusterer.setMap(null)
    }
  }

  render() {
    const { children } = this.props
    return <div>{children}</div>
  }
}

export default MarkerClusterer

const eventMap = {
  onClick: "click",
  onClusteringBegin: "clusteringbegin",
  onClusteringEnd: "clusteringend",
  onMouseOut: "mouseout",
  onMouseOver: "mouseover",
}

const updaterMap = {
  averageCenter(instance, averageCenter) {
    instance.setAverageCenter(averageCenter)
  },

  batchSizeIE(instance, batchSizeIE) {
    instance.setBatchSizeIE(batchSizeIE)
  },

  batchSize(instance, batchSize) {
    instance.setBatchSize(batchSize)
  },

  calculator(instance, calculator) {
    instance.setCalculator(calculator)
  },

  clusterClass(instance, clusterClass) {
    instance.setClusterClass(clusterClass)
  },

  enableRetinaIcons(instance, enableRetinaIcons) {
    instance.setEnableRetinaIcons(enableRetinaIcons)
  },

  gridSize(instance, gridSize) {
    instance.setGridSize(gridSize)
  },

  ignoreHidden(instance, ignoreHidden) {
    instance.setIgnoreHidden(ignoreHidden)
  },

  imageExtension(instance, imageExtension) {
    instance.setImageExtension(imageExtension)
  },

  imagePath(instance, imagePath) {
    instance.setImagePath(imagePath)
  },

  imageSizes(instance, imageSizes) {
    instance.setImageSizes(imageSizes)
  },

  maxZoom(instance, maxZoom) {
    instance.setMaxZoom(maxZoom)
  },

  minimumClusterSize(instance, minimumClusterSize) {
    instance.setMinimumClusterSize(minimumClusterSize)
  },

  styles(instance, styles) {
    instance.setStyles(styles)
  },

  title(instance, title) {
    instance.setTitle(title)
  },

  zoomOnClick(instance, zoomOnClick) {
    instance.setZoomOnClick(zoomOnClick)
  },
}
