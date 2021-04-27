import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import TextExtraction from './lib/TextExtraction';

/**
 * This is a list of the known patterns that are provided by this library
 * @typedef {('url'|'phone'|'email')} KnownParsePattern
 */
/**
 * @type {Object.<string, RegExp>}
 * // The keys really should be KnownParsePattern -- but this is unsupported in jsdoc, sadly
 */
export const PATTERNS = {
  /**
   * Segments/Features:
   *  - http/https support https?
   *  - auto-detecting loose domains if preceded by `www.`
   *  - Localized & Long top-level domains \.(xn--)?[a-z0-9-]{2,20}\b
   *  - Allowed query parameters & values, it's two blocks of matchers
   *    ([-a-zA-Z0-9@:%_\+,.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*
   *    - First block is [-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]* -- this matches parameter names & values (including commas, dots, opening & closing brackets)
   *    - The first block must be followed by a closing block [-a-zA-Z0-9@:%_\+\]~#?&\/=] -- this doesn't match commas, dots, and opening brackets
   */
  url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/i,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
  email: /\S+@\S+\.\S+/,
};

/**
 * This is for built-in-patterns already supported by this library
 * Note: any additional keys/props are permitted, and will be passed along as props to the <Text> component!
 * @typedef {Object} DefaultParseShape
 * @property {KnownParsePattern} [type] key of the known pattern you'd like to configure
 * @property {number} [nonExhaustiveModeMaxMatchCount] Enables "non-exhaustive mode", where you can limit how many matches are found. -- Must be a positive integer or Infinity matches are permitted
 * @property {Function} [renderText] arbitrary function to rewrite the matched string into something else
 * @property {Function} [onPress]
 * @property {Function} [onLongPress]
 */
const defaultParseShape = PropTypes.shape({
  ...Text.propTypes,
  type: PropTypes.oneOf(Object.keys(PATTERNS)).isRequired,
  nonExhaustiveMaxMatchCount: PropTypes.number,
});

const customParseShape = PropTypes.shape({
  ...Text.propTypes,
  pattern: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])
    .isRequired,
  nonExhaustiveMaxMatchCount: PropTypes.number,
});

/**
 * The props added by this component
 * @typedef {DefaultParseShape|import('./lib/TextExtraction').CustomParseShape} ParsedTextAddedProps
 * @property {ParseShape[]} parse
 * @property {import('react-native').TextProps} childrenProps -- the props set on each child Text component
 */
/** @typedef {ParsedTextAddedProps & import('react-native').TextProps} ParsedTextProps */

/** @type {import('react').ComponentClass<ParsedTextProps>} */
class ParsedText extends React.Component {
  static displayName = 'ParsedText';

  static propTypes = {
    ...Text.propTypes,
    parse: PropTypes.arrayOf(
      PropTypes.oneOfType([defaultParseShape, customParseShape]),
    ),
    childrenProps: PropTypes.shape(Text.propTypes),
  };

  static defaultProps = {
    parse: null,
    childrenProps: {},
  };

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
  /** @returns {import('./lib/TextExtraction').CustomParseShape[]} */
  getPatterns() {
    return this.props.parse.map((option) => {
      const { type, ...patternOption } = option;
      if (type) {
        if (!PATTERNS[type]) {
          throw new Error(`${option.type} is not a supported type`);
        }
        patternOption.pattern = PATTERNS[type];
      }

      return patternOption;
    });
  }

  getParsedText() {
    if (!this.props.parse) {
      return this.props.children;
    }
    if (typeof this.props.children !== 'string') {
      return this.props.children;
    }

    const textExtraction = new TextExtraction(
      this.props.children,
      this.getPatterns(),
    );

    return textExtraction.parse().map((props, index) => {
      const { style: parentStyle } = this.props;
      const { style, ...remainder } = props;
      return (
        <Text
          key={`parsedText-${index}`}
          style={[parentStyle, style]}
          {...this.props.childrenProps}
          {...remainder}
        />
      );
    });
  }

  render() {
    // Discard custom props before passing remainder to Text
    const { parse, childrenProps, ...remainder } = { ...this.props };

    return (
      <Text ref={(ref) => (this._root = ref)} {...remainder}>
        {this.getParsedText()}
      </Text>
    );
  }
}

export default ParsedText;
