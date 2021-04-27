import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { ActionSheetProps } from './types';
export default function connectActionSheet<OwnProps = any>(WrappedComponent: React.ComponentType<OwnProps & ActionSheetProps>): ((props: OwnProps) => JSX.Element) & hoistNonReactStatic.NonReactStatics<React.ComponentType<OwnProps & ActionSheetProps>, {}>;
