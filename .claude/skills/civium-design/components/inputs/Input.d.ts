import * as React from 'react';
/**
 * One input style for text and select. Focus turns the border gold with the ring; bad turns it red; busy washes it gold while the server works.
 */
export interface InputProps {
  as?: 'input' | 'select';
  /** bad = red border + ring-red; busy = gold border + gold-wash */
  state?: 'default' | 'bad' | 'busy';
  /** Label to the left, in body */
  label?: React.ReactNode;
  /** Unit to the right, in tiny fade */
  unit?: React.ReactNode;
  /** For as="select" */
  options?: Array<string | { value: string; label: string }>;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
