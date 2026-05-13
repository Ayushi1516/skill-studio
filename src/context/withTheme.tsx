import React from 'react';
import { useTheme } from './ThemeContext';
// for learning only
/**
 * withTheme HOC
 * Wraps a component to provide access to the current theme and the toggle function as props.
 * Useful for class components or for keeping components decoupled from context hooks.
 */
export interface WithThemeProps {
  theme: string;
  toggleTheme: () => void;
}

function withTheme<P extends object>(
  WrappedComponent: React.ComponentType<P & WithThemeProps>
) {
  return (props: P) => {
    const themeData = useTheme();
    return <WrappedComponent {...props} {...themeData} />;
  };
}

export default withTheme;