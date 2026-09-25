import * as React from 'react';
/**
 * Serif labels on a hairline; the active tab in ink with a 2px gold underline. One row per page: the lanes of a deal.
 */
export interface TabsProps {
  items: Array<string | { id: string; label: React.ReactNode }>;
  /** id of the active tab; defaults to the first */
  active?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
