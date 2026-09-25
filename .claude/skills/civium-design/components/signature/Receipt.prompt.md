Any number Civium derived: show it bare, and let hover open its receipt (equation + each input's origin).

```jsx
<Receipt label="Market rent / month" value="$137,040"
  equation="Σ market rent over 96 units" source="from the rent roll's own unit lines"
  rows={[{label:'1101 · A1', value:'$1,205', origin:'Sheet1!7 · Market Rent'},
         {label:'1102 · A1', value:'$1,205', origin:'Sheet1!8 · Market Rent'}]}
  more="… 94 more" />
```

- `mode="static"` renders the card at rest beside the number (for specimens).
- `size="body"` for a number inside a table row.
- Never dress the number; caveats live in the receipt, not beside the figure.
