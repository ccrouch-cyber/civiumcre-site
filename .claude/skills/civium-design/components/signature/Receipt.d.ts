import * as React from 'react';
export interface ReceiptRow { label: React.ReactNode; value: React.ReactNode; origin: React.ReactNode; }
/**
 * The signature: every number carries its receipt. Hover the number and a card opens with the equation and each input's origin; click and the chain walks.
 * The product's own component (frontend/src/receipt.jsx: Cite + ReceiptProvider) is the source of truth; this is a cosmetic rendition.
 */
export interface ReceiptProps {
  /** The number, formatted: "$137,040" */
  value: React.ReactNode;
  /** Optional eyebrow above the number */
  label?: React.ReactNode;
  /** metric = serif headline number; body = in-table number */
  size?: 'metric' | 'body';
  /** Right side of the equation, with the numbers in it: "Σ market rent over 96 units" */
  equation: React.ReactNode;
  /** Where the inputs come from, one tiny line */
  source?: React.ReactNode;
  /** Each input and its origin (sheet!row · column) */
  rows?: ReceiptRow[];
  /** "… 94 more" */
  more?: React.ReactNode;
  chainLabel?: React.ReactNode;
  onOpenChain?: () => void;
  /** hover = card opens on hover (default); static = card shown beside the number */
  mode?: 'hover' | 'static';
  style?: React.CSSProperties;
}
export declare function Receipt(props: ReceiptProps): JSX.Element;
