import * as React from 'react';
/**
 * A filter chip: gold outline; on fills gold. Small pills sit in a desk's filter row.
 */
export interface PillProps {
  /** Selected: gold fill, on-gold text */
  on?: boolean;
  size?: 'md' | 'sm';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Pill(props: PillProps): JSX.Element;
