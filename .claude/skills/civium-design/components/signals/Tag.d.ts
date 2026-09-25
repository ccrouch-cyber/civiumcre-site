import * as React from 'react';
/**
 * A state word beside the thing it describes.
 */
export interface TagProps {
  /** default = a fact; good = READY; warn = with Civium / refused; gold = the primary; assume = an assumption */
  tone?: 'default' | 'good' | 'warn' | 'gold' | 'assume';
  style?: React.CSSProperties;
  /** The state's word, in the customer's language */
  children?: React.ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;
