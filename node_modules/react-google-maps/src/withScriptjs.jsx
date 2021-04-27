import _ from "lodash"
import invariant from "invariant"
import canUseDOM from "can-use-dom"
import { getDisplayName } from "recompose"
import PropTypes from "prop-types"
import React from "react"

const LOADING_STATE_NONE = `NONE`
const LOADING_STATE_BEGIN = `BEGIN`
const LOADING_STATE_LOADED = `LOADED`

export function withScriptjs(BaseComponent) {
  const factory = React.createFactory(BaseComponent)

  class Container extends React.PureComponent {
    static displayName = `withScriptjs(${getDisplayName(BaseComponent)})`

    static propTypes = {
      loadingElement: PropTypes.node.isRequired,
      googleMapURL: PropTypes.string.isRequired,
    }

    state = {
      loadingState: LOADING_STATE_NONE,
    }

    isUnmounted = false

    handleLoaded = _.bind(this.handleLoaded, this)

    handleLoaded() {
      if (this.isUnmounted) {
        return
      }
      this.setState({
        loadingState: LOADING_STATE_LOADED,
      })
    }

    componentWillMount() {
      const { loadingElement, googleMapURL } = this.props
      invariant(
        !!loadingElement && !!googleMapURL,
        `Required props loadingElement or googleMapURL is missing. You need to provide both of them.`
      )
    }

    componentDidMount() {
      const { loadingState } = this.state
      if (loadingState !== LOADING_STATE_NONE || !canUseDOM) {
        return
      }
      this.setState({
        loadingState: LOADING_STATE_BEGIN,
      })
      // Don't load scriptjs as a dependency since we do not want this module be used on server side.
      // eslint-disable-next-line global-require
      const scriptjs = require(`scriptjs`)
      const { googleMapURL } = this.props
      scriptjs(googleMapURL, this.handleLoaded)
    }

    componentWillUnmount() {
      this.isUnmounted = true
    }

    render() {
      const {
        loadingElement,
        googleMapURL, // eslint-disable-line no-unused-vars
        ...restProps
      } = this.props

      const { loadingState } = this.state

      if (loadingState === LOADING_STATE_LOADED) {
        return factory(restProps)
      } else {
        return loadingElement
      }
    }
  }

  return Container
}

export default withScriptjs
