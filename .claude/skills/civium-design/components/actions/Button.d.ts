import * as React from 'react';
/**
 * The one act on a card is primary; a second act beside it is ghost; ink for a rare heavy act; link for an inline act; sm for a row's verbs.
 */
export interface ButtonProps {
  /** primary = gold fill; ghost = gold outline; ink = heavy act; link = inline act */
  variant?: 'primary' | 'ghost' | 'ink' | 'link';
  /** sm for a row's verbs */
  size?: 'md' | 'sm';
  /** A disabled button stays visible at 45% */
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  /** A verb, in the customer's language */
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
