import * as React from 'react';
/**
 * The surface: card on paper with a line border and the whisper shadow; a clickable card lifts on hover. One idea per card: an eyebrow, a line saying what happens, the thing.
 */
export interface CardProps {
  /** Uppercase label at the top */
  eyebrow?: React.ReactNode;
  /** Gold eyebrow for the card that matters */
  eyebrowGold?: boolean;
  /** tiny fade line saying what happens */
  hint?: React.ReactNode;
  /** Lifts to shadow-2 on hover */
  clickable?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
