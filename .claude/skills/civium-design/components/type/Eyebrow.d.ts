import * as React from 'react';
/**
 * An uppercase label above a card or block; gold for the block that matters on the page. Never a heading.
 */
export interface EyebrowProps {
  /** gold-deep text for the one block that matters */
  gold?: boolean;
  as?: 'div' | 'span' | 'p' | 'label';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
