/* @ds-bundle: {"format":4,"namespace":"CiviumDesignSystem_be8662","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Pill","sourcePath":"components/actions/Pill.jsx"},{"name":"Input","sourcePath":"components/inputs/Input.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Tag","sourcePath":"components/signals/Tag.jsx"},{"name":"Receipt","sourcePath":"components/signature/Receipt.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/type/Eyebrow.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"95c96e308ce1","components/actions/Pill.jsx":"d42666a7cc4f","components/inputs/Input.jsx":"684c087f3f7e","components/navigation/Tabs.jsx":"6eaccece5d8e","components/signals/Tag.jsx":"d12df4c781d6","components/signature/Receipt.jsx":"1f24a70195fb","components/surfaces/Card.jsx":"5984b78bd4de","components/type/Eyebrow.jsx":"510cdaab37b6","design_handoff_client_app/design/client-app/ds-base.js":"6817ada77764","design_handoff_client_app/design/client-app/receipts-larkspur.js":"495898185bbb","design_handoff_client_app/design/client-app/receipts.js":"9e4c151076d7","ui_kits/product/Deal.jsx":"be160c473e31","ui_kits/product/Desk.jsx":"2d4cb88a8780","ui_kits/product/Shell.jsx":"82caf1bdd738","ui_kits/product/SignIn.jsx":"b358652bf65e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CiviumDesignSystem_be8662 = window.CiviumDesignSystem_be8662 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const btnVariants = {
  primary: {
    rest: {
      background: 'var(--gold)',
      color: 'var(--on-gold)'
    },
    hover: {
      background: 'var(--gold-deep)'
    }
  },
  ghost: {
    rest: {
      background: 'none',
      borderColor: 'var(--gold)',
      color: 'var(--gold-deep)'
    },
    hover: {
      background: 'var(--gold-wash)'
    }
  },
  ink: {
    rest: {
      background: 'var(--ink)',
      color: 'var(--on-gold)'
    },
    hover: {
      background: '#453e33'
    }
  },
  link: {
    rest: {
      background: 'none',
      border: 'none',
      color: 'var(--gold-deep)',
      fontSize: '12.5px',
      padding: 0
    },
    hover: {}
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = btnVariants[variant] || btnVariants.primary;
  const base = {
    font: '12.5px/1.3 var(--font-sans)',
    borderRadius: 'var(--radius-control)',
    cursor: disabled ? 'default' : 'pointer',
    padding: '6px 14px',
    border: '1px solid transparent',
    fontVariantNumeric: 'tabular-nums lining-nums'
  };
  const sm = size === 'sm' && variant !== 'link' ? {
    padding: '3px 10px',
    fontSize: '11.5px',
    borderRadius: 'var(--radius-control-sm)'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...v.rest,
      ...sm,
      ...(hover && !disabled ? v.hover : {}),
      ...(disabled ? {
        opacity: 0.45
      } : {}),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/Pill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pill({
  on = false,
  size = 'md',
  onClick,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    borderRadius: 'var(--radius-pill)',
    padding: '4px 12px',
    font: '12px/1.4 var(--font-sans)',
    cursor: 'pointer',
    border: '1px solid var(--gold)',
    background: 'none',
    color: 'var(--gold-deep)'
  };
  const sm = size === 'sm' ? {
    padding: '2px 9px',
    fontSize: '10.5px',
    borderRadius: '11px'
  } : {};
  const onS = on ? {
    background: 'var(--gold)',
    color: 'var(--on-gold)'
  } : hover ? {
    background: 'var(--gold-wash)'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": on,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...sm,
      ...onS,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Pill.jsx", error: String((e && e.message) || e) }); }

// components/inputs/Input.jsx
try { (() => {
function Input({
  as = 'input',
  state = 'default',
  label,
  unit,
  options = [],
  disabled = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const base = {
    font: '12.5px var(--font-sans)',
    color: 'var(--ink)',
    padding: '4px 7px',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-control)',
    background: '#fff',
    outline: 'none',
    fontVariantNumeric: 'tabular-nums lining-nums'
  };
  const st = state === 'bad' ? {
    borderColor: 'var(--red)',
    boxShadow: 'var(--ring-red)'
  } : state === 'busy' ? {
    borderColor: 'var(--gold)',
    background: 'var(--gold-wash)'
  } : focus ? {
    borderColor: 'var(--gold)',
    boxShadow: 'var(--ring)'
  } : {};
  const dis = disabled ? {
    background: 'var(--wash)'
  } : {};
  const common = {
    disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...base,
      ...st,
      ...dis,
      ...style
    },
    ...rest
  };
  const field = as === 'select' ? /*#__PURE__*/React.createElement("select", common, options.map(o => {
    const v = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v.value,
      value: v.value
    }, v.label);
  })) : /*#__PURE__*/React.createElement("input", common);
  if (label == null && unit == null) return field;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      font: '13px/1.45 var(--font-sans)',
      color: 'var(--ink)'
    }
  }, label != null && /*#__PURE__*/React.createElement("span", null, label), field, unit != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '11px/1.4 var(--font-sans)',
      color: 'var(--fade)'
    }
  }, unit));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/inputs/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function TabButton({
  label,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": active,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      border: 'none',
      background: 'none',
      font: '14.5px/1.3 var(--font-serif)',
      padding: '7px 14px 9px',
      color: active ? 'var(--ink)' : hover ? 'var(--ink-soft)' : 'var(--fade)',
      borderBottom: '2px solid ' + (active ? 'var(--gold)' : 'transparent'),
      marginBottom: -1,
      cursor: 'pointer'
    }
  }, label);
}
function Tabs({
  items = [],
  active,
  onChange,
  style
}) {
  const list = items.map(it => typeof it === 'string' ? {
    id: it,
    label: it
  } : it);
  const cur = active ?? (list[0] && list[0].id);
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 2,
      borderBottom: '1px solid var(--line)',
      ...style
    }
  }, list.map(it => /*#__PURE__*/React.createElement(TabButton, {
    key: it.id,
    label: it.label,
    active: it.id === cur,
    onClick: () => onChange && onChange(it.id)
  })));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/signals/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tagTones = {
  default: {},
  good: {
    color: 'var(--green)',
    borderColor: 'var(--green)',
    background: 'var(--green-wash)'
  },
  warn: {
    color: 'var(--red)',
    borderColor: 'var(--red)',
    background: 'var(--red-wash)'
  },
  gold: {
    background: 'var(--gold)',
    borderColor: 'var(--gold)',
    color: 'var(--on-gold)'
  },
  assume: {
    color: 'var(--amber)',
    borderColor: 'var(--gold-soft)',
    fontSize: '9px'
  }
};
function Tag({
  tone = 'default',
  style,
  children,
  ...rest
}) {
  const base = {
    display: 'inline-block',
    font: '10px/1.3 var(--font-sans)',
    color: 'var(--fade)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius-tag)',
    padding: '1px 8px',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums lining-nums'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...(tagTones[tone] || {}),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signals/Tag.jsx", error: String((e && e.message) || e) }); }

// components/type/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Eyebrow({
  gold = false,
  as = 'div',
  style,
  children,
  ...rest
}) {
  const El = as;
  return /*#__PURE__*/React.createElement(El, _extends({
    style: {
      font: '10.5px/1.3 var(--font-sans)',
      letterSpacing: '1.6px',
      textTransform: 'uppercase',
      color: gold ? 'var(--gold-deep)' : 'var(--fade)',
      margin: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/signature/Receipt.jsx
try { (() => {
function ReceiptCard({
  value,
  equation,
  source,
  rows = [],
  more,
  chainLabel,
  onOpenChain,
  style
}) {
  const td = {
    padding: '2px 10px 2px 0'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-card)',
      padding: '14px 16px',
      boxShadow: 'var(--shadow-1)',
      minWidth: 'min(360px, 100%)',
      boxSizing: 'border-box',
      textAlign: 'left',
      color: 'var(--ink)',
      fontVariantNumeric: 'tabular-nums lining-nums',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    gold: true,
    style: {
      marginBottom: 6
    }
  }, "The receipt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 15
    }
  }, value, " = ", equation), source && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '11px/1.4 var(--font-sans)',
      color: 'var(--fade)',
      marginTop: 8
    }
  }, source), rows.length > 0 && /*#__PURE__*/React.createElement("table", {
    style: {
      font: '11px/1.4 var(--font-sans)',
      marginTop: 6,
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: i % 2 ? {
      background: 'var(--zebra)'
    } : undefined
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, r.label), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'right'
    }
  }, r.value), /*#__PURE__*/React.createElement("td", {
    style: {
      paddingLeft: 10,
      color: 'var(--fade)'
    }
  }, r.origin))), more && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--fade)'
    }
  }, more), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onOpenChain,
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--gold-deep)',
      font: '12.5px/1.3 var(--font-sans)',
      padding: 0,
      cursor: 'pointer',
      marginTop: 8,
      display: 'block'
    }
  }, chainLabel));
}
function Receipt({
  value,
  label,
  size = 'metric',
  equation,
  source,
  rows,
  more,
  chainLabel = '→ open the chain',
  onOpenChain,
  mode = 'hover',
  style
}) {
  const [open, setOpen] = React.useState(false);
  const num = /*#__PURE__*/React.createElement("span", {
    style: {
      font: size === 'metric' ? '19px/1.15 var(--font-serif)' : '13px/1.45 var(--font-sans)',
      borderBottom: '1px dotted var(--gold-deep)',
      display: 'inline-block',
      cursor: 'help',
      fontVariantNumeric: 'tabular-nums lining-nums'
    }
  }, value);
  const card = /*#__PURE__*/React.createElement(ReceiptCard, {
    value: value,
    equation: equation,
    source: source,
    rows: rows,
    more: more,
    chainLabel: chainLabel,
    onOpenChain: onOpenChain
  });
  if (mode === 'static') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, label), num), card);
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block',
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, label && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, label), num, open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      paddingTop: 6,
      zIndex: 20
    }
  }, React.cloneElement(card, {
    style: {
      boxShadow: 'var(--shadow-2)'
    }
  })));
}
Object.assign(__ds_scope, { Receipt });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/signature/Receipt.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  eyebrow,
  eyebrowGold = false,
  hint,
  clickable = false,
  onClick,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lift = clickable && hover ? {
    boxShadow: 'var(--shadow-2)',
    borderColor: '#d5c9a9'
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-card)',
      padding: '14px 16px',
      boxShadow: 'var(--shadow-1)',
      cursor: clickable ? 'pointer' : undefined,
      ...lift,
      ...style
    }
  }, rest), eyebrow != null && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    gold: eyebrowGold,
    style: {
      marginBottom: 6
    }
  }, eyebrow), hint != null && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '11px/1.4 var(--font-sans)',
      color: 'var(--fade)',
      marginBottom: 8
    }
  }, hint), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// design_handoff_client_app/design/client-app/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  for (const p of ["tokens/fonts.css", "tokens/civium.css", "tokens/system.css", "tokens/base.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_client_app/design/client-app/ds-base.js", error: String((e && e.message) || e) }); }

// design_handoff_client_app/design/client-app/receipts-larkspur.js
try { (() => {
// Larkspur Crossing sample receipts, shared by every tab. Generated from each tab's own numbers.
window.CiviumReceiptRefs = {
  "rr.room": {
    "1 bed": "rr.seg1",
    "2 bed": "rr.seg2",
    "3 bed": "rr.seg3"
  },
  "mk.room": {
    "1 bed": "mk.b1",
    "2 bed": "mk.b2",
    "3 bed": "mk.b3"
  },
  "rr.econ": {
    "Rent in place": "rr.inplace",
    "Market rent": "rr.market"
  },
  "rr.inplace": {
    "Occupied units": "rr.phys"
  },
  "rr.market": {
    "Units": "rr.units"
  },
  "t12.noi": {
    "Effective gross income": "t12.egi",
    "Operating expenses": "t12.opex"
  },
  "t12.egi": {
    "Rent, less": "t12.cat_gpr",
    "Other income": "t12.cat_other",
    "Concessions": "t12.cat_conc",
    "Vacancy": "t12.cat_vac",
    "Bad debt": "t12.cat_bd"
  },
  "t12.opex": {
    "Real estate taxes": "t12.cat_tax",
    "Payroll": "t12.cat_pay",
    "Utilities": "t12.cat_util",
    "Repairs": "t12.cat_rm",
    "Insurance": "t12.cat_ins",
    "Contract": "t12.cat_cs",
    "Administrative": "t12.cat_adm",
    "Marketing": "t12.cat_mkt"
  },
  "pf.capT12": {
    "NOI, trailing 12": "t12.noi"
  },
  "pf.capY1": {
    "NOI, year 1": "pf.noi1"
  },
  "pf.dscr": {
    "NOI, year 1": "pf.noi1"
  },
  "pf.noi1": {
    "of which taxes": "pf.tax"
  },
  "pf.tax": {
    "The statement": "t12.cat_tax"
  },
  "pf.coc": {
    "Equity in": "pf.equity"
  },
  "pf.mult": {
    "Equity in": "pf.equity"
  },
  "pf.irr": {
    "Equity in": "pf.equity",
    "Year 5, with the sale": "pf.exit"
  }
};
(function go() {
  if (!window.CiviumReceipts) return setTimeout(go, 20);
  window.CiviumReceipts.register({
    "rr.units": {
      "label": "Units",
      "value": "96",
      "eq": "Every unit identity on the roll, counted once",
      "note": "",
      "inputs": [{
        "l": "Unit rows read",
        "v": "96",
        "o": "Sheet1 · rows 8–103"
      }, {
        "l": "Future-lease rows, kept out of the count",
        "v": "3",
        "o": "Sheet1 · rows 104–106"
      }, {
        "l": "Stated total on the file",
        "v": "96",
        "o": "Sheet1 · row 108 · tied"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.units",
        "where": "Key numbers",
        "sec": null
      }
    },
    "rr.phys": {
      "label": "Physical occupancy",
      "value": "91.7%",
      "eq": "88 occupied ÷ 96 units",
      "note": "",
      "inputs": [{
        "l": "Occupied (“Current”)",
        "v": "84",
        "o": "status column, file’s words"
      }, {
        "l": "On notice (“Notice”)",
        "v": "4",
        "o": "counted as occupied"
      }, {
        "l": "Vacant, leased",
        "v": "3",
        "o": "not occupied"
      }, {
        "l": "Vacant",
        "v": "4",
        "o": "not occupied"
      }, {
        "l": "Down / admin",
        "v": "1",
        "o": "not occupied"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.phys",
        "where": "Key numbers",
        "sec": null
      }
    },
    "rr.econ": {
      "label": "Economic occupancy",
      "value": "86.4%",
      "eq": "$118,452 rent in place ÷ $137,040 market rent",
      "note": "",
      "inputs": [{
        "l": "Rent in place, monthly",
        "v": "$118,452",
        "o": "Σ rent charge codes, 88 occupied units"
      }, {
        "l": "Market rent, monthly",
        "v": "$137,040",
        "o": "Σ market column, 96 units · tied to row 108"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.econ",
        "where": "Key numbers",
        "sec": null
      }
    },
    "rr.inplace": {
      "label": "Average rent in place",
      "value": "$1,346",
      "eq": "$118,452 ÷ 88 occupied units carrying rent",
      "note": "",
      "inputs": [{
        "l": "Rent in place, monthly",
        "v": "$118,452",
        "o": "Σ rent charge codes"
      }, {
        "l": "Occupied units carrying rent",
        "v": "88",
        "o": "status column"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.inplace",
        "where": "Key numbers",
        "sec": null
      }
    },
    "rr.market": {
      "label": "Average market rent (the file’s own)",
      "value": "$1,428",
      "eq": "$137,040 ÷ 96 units",
      "note": "",
      "inputs": [{
        "l": "Market rent, monthly",
        "v": "$137,040",
        "o": "Sheet1 · market column · tied"
      }, {
        "l": "Units",
        "v": "96",
        "o": "unit identities"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.market",
        "where": "Key numbers",
        "sec": null
      }
    },
    "rr.room": {
      "label": "Room vs. street",
      "value": "+$8,160 / mo",
      "eq": "Each bedroom’s (comp median ask − avg in place) × its units, positive side only",
      "note": "Arithmetic on stated numbers, not a forecast. Comp asks are captured from each property’s own website, dated.",
      "inputs": [{
        "l": "1 bed: +$87 × 40 units",
        "v": "+$3,480",
        "o": "21 comp plans, 12 buildings"
      }, {
        "l": "2 bed: +$84 × 44 units",
        "v": "+$3,696",
        "o": "23 comp plans, 13 buildings"
      }, {
        "l": "3 bed: +$82 × 12 units",
        "v": "+$984",
        "o": "8 comp plans, 6 buildings"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.room",
        "where": "Key numbers",
        "sec": null
      }
    },
    "rr.ltl": {
      "label": "Loss to lease",
      "value": "$80 / unit / mo",
      "eq": "Σ (market − in place) × units ÷ 96",
      "note": "",
      "inputs": [{
        "l": "1 bed: $1,236 − $1,158",
        "v": "$78",
        "o": "40 units"
      }, {
        "l": "2 bed: $1,500 − $1,421",
        "v": "$79",
        "o": "44 units"
      }, {
        "l": "3 bed: $1,800 − $1,706",
        "v": "$94",
        "o": "12 units"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.ltl",
        "where": "The unit mix",
        "sec": null
      }
    },
    "rr.spread": {
      "label": "In-place rent spread",
      "value": "$1,095 · $1,389 · $1,795",
      "eq": "Lowest · median · highest in-place rent, occupied units",
      "note": "",
      "inputs": [{
        "l": "Lowest",
        "v": "$1,095",
        "o": "unit 1104 · A1"
      }, {
        "l": "Median",
        "v": "$1,389",
        "o": "88 occupied units"
      }, {
        "l": "Highest",
        "v": "$1,795",
        "o": "unit 3302 · C1"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.spread",
        "where": "The unit mix",
        "sec": null
      }
    },
    "rr.stayed": {
      "label": "Stayed 2 years or more",
      "value": "38.6%",
      "eq": "34 of 88 occupied units moved in before Sep 15, 2024",
      "note": "",
      "inputs": [{
        "l": "Occupied units with a move-in date",
        "v": "88",
        "o": "move-in column"
      }, {
        "l": "Moved in more than 24 months before the as-of",
        "v": "34",
        "o": ""
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.stayed",
        "where": "Who stays",
        "sec": null
      }
    },
    "rr.tenure": {
      "label": "Median tenure",
      "value": "19 months",
      "eq": "Median months from move-in to Sep 15, 2026",
      "note": "",
      "inputs": [{
        "l": "Occupied units",
        "v": "88",
        "o": "move-in column"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.tenure",
        "where": "Who stays",
        "sec": null
      }
    },
    "rr.mtm": {
      "label": "Month-to-month",
      "value": "6 leases · $8,120 / mo",
      "eq": "Leases past their end date, still paying",
      "note": "",
      "inputs": [{
        "l": "Leases past end date",
        "v": "6",
        "o": "lease-end column before Sep 15, 2026"
      }, {
        "l": "Their rent, monthly",
        "v": "$8,120",
        "o": "6.9% of rent in place"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.mtm",
        "where": "Who stays",
        "sec": null
      }
    },
    "rr.credits": {
      "label": "Recurring credits & discounts",
      "value": "−$2,310 / mo",
      "eq": "Every negative charge code that repeats monthly",
      "note": "",
      "inputs": [{
        "l": "Concessions (“CONC”)",
        "v": "−$1,420",
        "o": "14 units"
      }, {
        "l": "Employee discount (“EMPDIS”)",
        "v": "−$640",
        "o": "2 units"
      }, {
        "l": "Military discount (“MILDIS”)",
        "v": "−$250",
        "o": "3 units"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.credits",
        "where": "Money beyond rent",
        "sec": null
      }
    },
    "rr.addon": {
      "label": "Add-on income",
      "value": "$6,840 / mo",
      "eq": "Every non-rent charge code, bucketed",
      "note": "",
      "inputs": [{
        "l": "Parking (“PARK”)",
        "v": "$2,150",
        "o": "43 spaces"
      }, {
        "l": "Pet rent (“PETRNT”)",
        "v": "$1,980",
        "o": "55 pets"
      }, {
        "l": "Utility reimbursement (“RUBS”)",
        "v": "$1,860",
        "o": "88 units"
      }, {
        "l": "Storage (“STOR”)",
        "v": "$850",
        "o": "17 units"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.addon",
        "where": "Money beyond rent",
        "sec": null
      }
    },
    "rr.owed": {
      "label": "Balances owed",
      "value": "$14,280",
      "eq": "Positive balances on the file’s snapshot date",
      "note": "A one-day snapshot, not a collections history.",
      "inputs": [{
        "l": "Units with a balance",
        "v": "11",
        "o": "balance column"
      }, {
        "l": "Largest single balance",
        "v": "$3,410",
        "o": "unit 2207"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.owed",
        "where": "Money beyond rent",
        "sec": null
      }
    },
    "rr.deposits": {
      "label": "Deposits held",
      "value": "$41,650",
      "eq": "Every labeled deposit column, summed",
      "note": "",
      "inputs": [{
        "l": "Security deposits",
        "v": "$36,900",
        "o": "deposit column"
      }, {
        "l": "Pet deposits",
        "v": "$4,750",
        "o": "pet deposit column"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.deposits",
        "where": "Money beyond rent",
        "sec": null
      }
    },
    "rr.proofs": {
      "label": "The checks",
      "value": "7 of 7 tie",
      "eq": "Every total the file states about itself, re-derived from its rows",
      "note": "412 rows read and sorted: 96 unit rows, 287 charge rows, 3 future-lease rows, 5 stated totals, 21 report-furniture rows. None unaccounted.",
      "inputs": [{
        "l": "Total units",
        "v": "96 = 96",
        "o": "row 108"
      }, {
        "l": "Occupied units",
        "v": "88 = 88",
        "o": "row 108"
      }, {
        "l": "Total square feet",
        "v": "85,920 = 85,920",
        "o": "row 108"
      }, {
        "l": "Market rent, monthly",
        "v": "$137,040 = $137,040",
        "o": "row 108"
      }, {
        "l": "Rent charges, monthly",
        "v": "$118,452 = $118,452",
        "o": "row 109"
      }, {
        "l": "Deposits held",
        "v": "$41,650 = $41,650",
        "o": "row 110"
      }, {
        "l": "Balances",
        "v": "$14,280 = $14,280",
        "o": "row 111"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.proofs",
        "where": "The checks",
        "sec": null
      }
    },
    "rr.seg1": {
      "label": "1 bed · comp median ask",
      "value": "$1,245",
      "eq": "Median of 21 matched plan asks, ±75 sf around 709 sf",
      "note": "",
      "inputs": [{
        "l": "Matched plans",
        "v": "21",
        "o": "12 buildings with live pricing"
      }, {
        "l": "Low · high ask",
        "v": "$1,150 · $1,395",
        "o": "captured Sep 2026"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.seg1",
        "where": "The unit mix",
        "sec": null
      }
    },
    "rr.seg2": {
      "label": "2 bed · comp median ask",
      "value": "$1,505",
      "eq": "Median of 23 matched plan asks, ±75 sf around 985 sf",
      "note": "",
      "inputs": [{
        "l": "Matched plans",
        "v": "23",
        "o": "13 buildings with live pricing"
      }, {
        "l": "Low · high ask",
        "v": "$1,380 · $1,690",
        "o": "captured Sep 2026"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.seg2",
        "where": "The unit mix",
        "sec": null
      }
    },
    "rr.seg3": {
      "label": "3 bed · comp median ask",
      "value": "$1,788",
      "eq": "Median of 8 matched plan asks, ±75 sf around 1,185 sf",
      "note": "",
      "inputs": [{
        "l": "Matched plans",
        "v": "8",
        "o": "6 buildings with live pricing"
      }, {
        "l": "Low · high ask",
        "v": "$1,695 · $1,925",
        "o": "captured Sep 2026"
      }],
      "at": {
        "tab": "rr",
        "anchor": "rr.seg3",
        "where": "The unit mix",
        "sec": null
      }
    },
    "t12.egi": {
      "label": "Effective gross income, trailing 12",
      "value": "$1,267,661",
      "eq": "Rent and other income, less concessions, vacancy and bad debt",
      "note": "Re-derived from the lines and tied to the file’s own “Total Income”, row 29.",
      "inputs": [{
        "l": "Rent, less loss to lease",
        "v": "$1,382,400",
        "o": "rows 8–9"
      }, {
        "l": "Other income",
        "v": "$82,080",
        "o": "rows 14–17"
      }, {
        "l": "Concessions",
        "v": "($17,040)",
        "o": "rows 20–21"
      }, {
        "l": "Vacancy",
        "v": "($148,200)",
        "o": "rows 23–24"
      }, {
        "l": "Bad debt",
        "v": "($31,579)",
        "o": "rows 26–27"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.egi",
        "where": "Key numbers",
        "sec": null
      }
    },
    "t12.opex": {
      "label": "Operating expenses, trailing 12",
      "value": "$614,701",
      "eq": "The eight expense categories, summed",
      "note": "Tied to the file’s own “Total Operating Expenses”, row 70.",
      "inputs": [{
        "l": "Real estate taxes",
        "v": "$188,650",
        "o": "rows 58–59"
      }, {
        "l": "Payroll",
        "v": "$104,000",
        "o": "rows 65–67"
      }, {
        "l": "Utilities",
        "v": "$96,480",
        "o": "rows 41–44"
      }, {
        "l": "Repairs and maintenance",
        "v": "$71,520",
        "o": "rows 47–49"
      }, {
        "l": "Insurance",
        "v": "$58,901",
        "o": "row 62"
      }, {
        "l": "Contract services",
        "v": "$42,300",
        "o": "rows 52–55"
      }, {
        "l": "Administrative",
        "v": "$38,640",
        "o": "rows 36–38"
      }, {
        "l": "Marketing",
        "v": "$14,210",
        "o": "rows 33–34"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.opex",
        "where": "Key numbers",
        "sec": null
      }
    },
    "t12.noi": {
      "label": "Net operating income, trailing 12",
      "value": "$652,960",
      "eq": "$1,267,661 effective gross income − $614,701 operating expenses",
      "note": "Ties in all 12 months, not only the annual total.",
      "inputs": [{
        "l": "Effective gross income",
        "v": "$1,267,661",
        "o": "row 29"
      }, {
        "l": "Operating expenses",
        "v": "$614,701",
        "o": "row 70"
      }, {
        "l": "The file’s own NOI",
        "v": "$652,960",
        "o": "row 72 · tied"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.noi",
        "where": "Key numbers",
        "sec": null
      }
    },
    "t12.margin": {
      "label": "NOI margin",
      "value": "51.5%",
      "eq": "$652,960 NOI ÷ $1,267,661 effective gross income",
      "note": "",
      "inputs": [{
        "l": "Library median",
        "v": "48.9%",
        "o": "11 other deals in your library"
      }, {
        "l": "Library range",
        "v": "43.2% – 55.8%",
        "o": ""
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.margin",
        "where": "Key numbers",
        "sec": null
      }
    },
    "t12.knife": {
      "label": "Rent trend",
      "value": "+2.1%",
      "eq": "Rent, first three months vs last three months, monthly average",
      "note": "House rule: a fall of more than 3% flags the deal. Clear.",
      "inputs": [{
        "l": "Oct–Dec 2025",
        "v": "$113,990 / mo",
        "o": "row 8, less row 9"
      }, {
        "l": "Jul–Sep 2026",
        "v": "$116,380 / mo",
        "o": "row 8, less row 9"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.knife",
        "where": "Key numbers",
        "sec": null
      }
    },
    "t12.accounting": {
      "label": "How the statement was read",
      "value": "186 lines",
      "eq": "Every numeric line in the file, accounted for",
      "note": "Accrual book, as stated on the file. No open items.",
      "inputs": [{
        "l": "In the categories above",
        "v": "142",
        "o": "rows 8–67"
      }, {
        "l": "Section totals, used as checks",
        "v": "38",
        "o": "each re-derives from its lines"
      }, {
        "l": "Below NOI (capital and debt)",
        "v": "4",
        "o": "rows 75–78, never in expenses"
      }, {
        "l": "The file’s own summary lines",
        "v": "2",
        "o": "rows 29, 72"
      }, {
        "l": "Not counted anywhere",
        "v": "0",
        "o": ""
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.accounting",
        "where": "The checks",
        "sec": null
      }
    },
    "t12.cat_gpr": {
      "label": "Rent, less loss to lease, trailing 12",
      "value": "$1,382,400",
      "eq": "What’s in this line, in the file’s own words",
      "note": "+3% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Gross potential rent",
        "v": "$1,644,480",
        "o": "row 8"
      }, {
        "l": "Loss to lease",
        "v": "($262,080)",
        "o": "row 9"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_gpr",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_other": {
      "label": "Other income, trailing 12",
      "value": "$82,080",
      "eq": "What’s in this line, in the file’s own words",
      "note": "−8% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Parking",
        "v": "$25,800",
        "o": "row 14"
      }, {
        "l": "Pet rent",
        "v": "$23,760",
        "o": "row 15"
      }, {
        "l": "Utility reimbursement",
        "v": "$22,320",
        "o": "row 16"
      }, {
        "l": "Storage",
        "v": "$10,200",
        "o": "row 17"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_other",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_conc": {
      "label": "Concessions, trailing 12",
      "value": "$17,040",
      "eq": "What’s in this line, in the file’s own words",
      "note": "",
      "inputs": [{
        "l": "Move-in concessions",
        "v": "($11,280)",
        "o": "row 20"
      }, {
        "l": "Renewal concessions",
        "v": "($5,760)",
        "o": "row 21"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_conc",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_vac": {
      "label": "Vacancy, trailing 12",
      "value": "$148,200",
      "eq": "What’s in this line, in the file’s own words",
      "note": "",
      "inputs": [{
        "l": "Physical vacancy",
        "v": "($131,400)",
        "o": "row 23"
      }, {
        "l": "Model and down units",
        "v": "($16,800)",
        "o": "row 24"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_vac",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_bd": {
      "label": "Bad debt, trailing 12",
      "value": "$31,579",
      "eq": "What’s in this line, in the file’s own words",
      "note": "",
      "inputs": [{
        "l": "Bad debt write-offs",
        "v": "($34,905)",
        "o": "row 26"
      }, {
        "l": "Recoveries",
        "v": "$3,326",
        "o": "row 27"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_bd",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_mkt": {
      "label": "Marketing, trailing 12",
      "value": "$14,210",
      "eq": "What’s in this line, in the file’s own words",
      "note": "−12% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Advertising",
        "v": "$9,840",
        "o": "row 33"
      }, {
        "l": "Resident events",
        "v": "$4,370",
        "o": "row 34"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_mkt",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_adm": {
      "label": "Administrative, trailing 12",
      "value": "$38,640",
      "eq": "What’s in this line, in the file’s own words",
      "note": "+4% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Office and software",
        "v": "$21,480",
        "o": "row 36"
      }, {
        "l": "Legal and professional",
        "v": "$9,960",
        "o": "row 37"
      }, {
        "l": "Bank fees",
        "v": "$7,200",
        "o": "row 38"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_adm",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_util": {
      "label": "Utilities, trailing 12",
      "value": "$96,480",
      "eq": "What’s in this line, in the file’s own words",
      "note": "+18% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Electric",
        "v": "$38,120",
        "o": "row 41"
      }, {
        "l": "Water and sewer",
        "v": "$44,860",
        "o": "row 42"
      }, {
        "l": "Gas",
        "v": "$6,300",
        "o": "row 43"
      }, {
        "l": "Trash",
        "v": "$7,200",
        "o": "row 44"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_util",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_rm": {
      "label": "Repairs and maintenance, trailing 12",
      "value": "$71,520",
      "eq": "What’s in this line, in the file’s own words",
      "note": "−6% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Repairs",
        "v": "$34,210",
        "o": "row 47"
      }, {
        "l": "Make-ready and turnover",
        "v": "$25,860",
        "o": "row 48"
      }, {
        "l": "Supplies",
        "v": "$11,450",
        "o": "row 49"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_rm",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_cs": {
      "label": "Contract services, trailing 12",
      "value": "$42,300",
      "eq": "What’s in this line, in the file’s own words",
      "note": "+2% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Landscaping",
        "v": "$19,200",
        "o": "row 52"
      }, {
        "l": "Pest control",
        "v": "$6,300",
        "o": "row 53"
      }, {
        "l": "Pool and amenities",
        "v": "$8,400",
        "o": "row 54"
      }, {
        "l": "Security patrol",
        "v": "$8,400",
        "o": "row 55"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_cs",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_tax": {
      "label": "Real estate taxes, trailing 12",
      "value": "$188,650",
      "eq": "What’s in this line, in the file’s own words",
      "note": "+9% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Real estate taxes",
        "v": "$186,400",
        "o": "row 58"
      }, {
        "l": "Business personal property",
        "v": "$2,250",
        "o": "row 59"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_tax",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_ins": {
      "label": "Insurance, trailing 12",
      "value": "$58,901",
      "eq": "What’s in this line, in the file’s own words",
      "note": "−21% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Property and liability",
        "v": "$58,901",
        "o": "row 62"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_ins",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "t12.cat_pay": {
      "label": "Payroll, trailing 12",
      "value": "$104,000",
      "eq": "What’s in this line, in the file’s own words",
      "note": "−3% per unit vs. your library’s median.",
      "inputs": [{
        "l": "Property manager",
        "v": "$52,000",
        "o": "row 65"
      }, {
        "l": "Maintenance technician",
        "v": "$38,000",
        "o": "row 66"
      }, {
        "l": "Payroll taxes and benefits",
        "v": "$14,000",
        "o": "row 67"
      }],
      "at": {
        "tab": "t12",
        "anchor": "t12.cat_pay",
        "where": "Income and expenses",
        "sec": null
      }
    },
    "mk.coverage": {
      "label": "The comp set",
      "value": "16 properties",
      "eq": "Austin · Southeast, linked to Larkspur Crossing",
      "note": "Distances are straight-line miles from each parcel’s point. Places come from a dated map snapshot.",
      "inputs": [{
        "l": "With a live asking rent",
        "v": "14",
        "o": "read from each property’s own website"
      }, {
        "l": "Website read refused",
        "v": "1",
        "o": "The Arbor · recorded"
      }, {
        "l": "Not read yet",
        "v": "1",
        "o": "Brookhaven"
      }, {
        "l": "Age-restricted asks (55+/62+)",
        "v": "0",
        "o": "counted out if present"
      }, {
        "l": "Income-restricted asks",
        "v": "0",
        "o": "counted out if present"
      }, {
        "l": "Larkspur’s own parcel",
        "v": "excluded",
        "o": "a deal is never its own comp"
      }],
      "at": {
        "tab": "mk",
        "anchor": "mk.coverage",
        "where": "Coverage",
        "sec": null
      }
    },
    "mk.b1": {
      "label": "1 bed · comp median ask, within ±75 sf",
      "value": "$1,245",
      "eq": "Median of 21 matched plan asks, around Larkspur’s 709 sf",
      "note": "",
      "inputs": [{
        "l": "Any size, every 1-bed plan",
        "v": "$1,262",
        "o": "38 plans"
      }, {
        "l": "Members’ medians",
        "v": "$1,150 – $1,395",
        "o": "14 buildings"
      }],
      "at": {
        "tab": "mk",
        "anchor": "mk.b1",
        "where": "Where Larkspur stands",
        "sec": null
      }
    },
    "mk.b2": {
      "label": "2 bed · comp median ask, within ±75 sf",
      "value": "$1,505",
      "eq": "Median of 23 matched plan asks, around Larkspur’s 985 sf",
      "note": "",
      "inputs": [{
        "l": "Any size, every 2-bed plan",
        "v": "$1,530",
        "o": "41 plans"
      }, {
        "l": "Members’ medians",
        "v": "$1,380 – $1,690",
        "o": "14 buildings"
      }],
      "at": {
        "tab": "mk",
        "anchor": "mk.b2",
        "where": "Where Larkspur stands",
        "sec": null
      }
    },
    "mk.b3": {
      "label": "3 bed · comp median ask, within ±75 sf",
      "value": "$1,788",
      "eq": "Median of 8 matched plan asks, around Larkspur’s 1,185 sf",
      "note": "",
      "inputs": [{
        "l": "Any size, every 3-bed plan",
        "v": "$1,815",
        "o": "14 plans"
      }, {
        "l": "Members’ medians",
        "v": "$1,695 – $1,925",
        "o": "10 buildings"
      }],
      "at": {
        "tab": "mk",
        "anchor": "mk.b3",
        "where": "Where Larkspur stands",
        "sec": null
      }
    },
    "mk.room": {
      "label": "Room vs. street",
      "value": "+$8,160 / mo",
      "eq": "Each bedroom’s (comp median − avg in place) × its units",
      "note": "Arithmetic on stated numbers, not a forecast. Comp asks are gross of concessions.",
      "inputs": [{
        "l": "1 bed: +$87 × 40 units",
        "v": "+$3,480",
        "o": ""
      }, {
        "l": "2 bed: +$84 × 44 units",
        "v": "+$3,696",
        "o": ""
      }, {
        "l": "3 bed: +$82 × 12 units",
        "v": "+$984",
        "o": ""
      }],
      "at": {
        "tab": "mk",
        "anchor": "mk.room",
        "where": "Key numbers",
        "sec": null
      }
    },
    "pf.capT12": {
      "label": "Cap rate on T-12 NOI",
      "value": "6.28%",
      "eq": "Trailing-12 NOI ÷ your bid",
      "note": "",
      "inputs": [{
        "l": "NOI, trailing 12",
        "v": "$652,960",
        "o": "T-12 · row 72"
      }, {
        "l": "Your bid",
        "v": "$10,400,000",
        "o": "your price"
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.capT12",
        "where": "Price band",
        "sec": null
      }
    },
    "pf.capY1": {
      "label": "Cap rate, year 1",
      "value": "7.12%",
      "eq": "Year-1 NOI ÷ your bid",
      "note": "",
      "inputs": [{
        "l": "NOI, year 1",
        "v": "$740,600",
        "o": "the model, months 1–12"
      }, {
        "l": "Your bid",
        "v": "$10,400,000",
        "o": ""
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.capY1",
        "where": "Price band",
        "sec": null
      }
    },
    "pf.noi1": {
      "label": "NOI, year 1",
      "value": "$740,600",
      "eq": "Effective gross income − operating expenses, months 1–12",
      "note": "",
      "inputs": [{
        "l": "Effective gross income",
        "v": "$1,427,291",
        "o": ""
      }, {
        "l": "Operating expenses",
        "v": "$686,691",
        "o": ""
      }, {
        "l": "of which taxes, reassessed",
        "v": "$194,480",
        "o": "at your price"
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.noi1",
        "where": "Operating statement",
        "sec": "operating"
      }
    },
    "pf.irr": {
      "label": "Levered IRR",
      "value": "23.2%",
      "eq": "The rate that brings equity in and every year’s levered cash flow to zero",
      "note": "",
      "inputs": [{
        "l": "Equity in, at close",
        "v": "($4,203,600)",
        "o": ""
      }, {
        "l": "Year 1",
        "v": "$294,100",
        "o": ""
      }, {
        "l": "Year 2",
        "v": "$448,561",
        "o": ""
      }, {
        "l": "Year 3",
        "v": "$399,707",
        "o": ""
      }, {
        "l": "Year 4",
        "v": "$428,705",
        "o": ""
      }, {
        "l": "Year 5, with the sale",
        "v": "$9,281,395",
        "o": ""
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.irr",
        "where": "Price band",
        "sec": null
      }
    },
    "pf.mult": {
      "label": "Equity multiple",
      "value": "2.58x",
      "eq": "Every levered dollar back ÷ equity in",
      "note": "",
      "inputs": [{
        "l": "Back, over the hold",
        "v": "$10,852,467",
        "o": ""
      }, {
        "l": "Equity in",
        "v": "$4,203,600",
        "o": ""
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.mult",
        "where": "Price band",
        "sec": null
      }
    },
    "pf.dscr": {
      "label": "Debt service coverage, year 1",
      "value": "1.75",
      "eq": "Year-1 NOI ÷ year-1 debt service",
      "note": "",
      "inputs": [{
        "l": "NOI, year 1",
        "v": "$740,600",
        "o": ""
      }, {
        "l": "Debt service, year 1",
        "v": "$422,500",
        "o": "interest-only"
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.dscr",
        "where": "Price band",
        "sec": null
      }
    },
    "pf.coc": {
      "label": "Cash-on-cash, year 1",
      "value": "7.0%",
      "eq": "(NOI − reserves − debt service) ÷ equity in",
      "note": "",
      "inputs": [{
        "l": "Cash flow after debt, year 1",
        "v": "$294,100",
        "o": ""
      }, {
        "l": "Equity in",
        "v": "$4,203,600",
        "o": ""
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.coc",
        "where": "Price band",
        "sec": null
      }
    },
    "pf.tax": {
      "label": "Taxes at your price",
      "value": "$194,480",
      "eq": "Price × assessed ratio × tax rate",
      "note": "",
      "inputs": [{
        "l": "Your bid",
        "v": "$10,400,000",
        "o": ""
      }, {
        "l": "Assessed value",
        "v": "$8,840,000",
        "o": "85% of price"
      }, {
        "l": "Tax rate",
        "v": "2.2%",
        "o": "of assessed value"
      }, {
        "l": "The statement’s taxes",
        "v": "$188,650",
        "o": "T-12 · rows 58–59"
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.tax",
        "where": "Taxes",
        "sec": "taxes"
      }
    },
    "pf.equity": {
      "label": "Equity in, at close",
      "value": "$4,203,600",
      "eq": "Price + closing + loan fee + renovation − loan",
      "note": "",
      "inputs": [{
        "l": "Price",
        "v": "$10,400,000",
        "o": ""
      }, {
        "l": "Closing costs",
        "v": "$156,000",
        "o": ""
      }, {
        "l": "Loan fee",
        "v": "$67,600",
        "o": ""
      }, {
        "l": "Renovation budget",
        "v": "$340,000",
        "o": "40 units"
      }, {
        "l": "Less the loan",
        "v": "($6,760,000)",
        "o": ""
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.equity",
        "where": "Financing",
        "sec": "financing"
      }
    },
    "pf.exit": {
      "label": "Net sale at month 60",
      "value": "$15,329,527",
      "eq": "The buyer’s forward year of NOI ÷ the exit cap, less the cost of sale",
      "note": "",
      "inputs": [{
        "l": "Forward NOI, year 6",
        "v": "$1,016,754",
        "o": ""
      }, {
        "l": "Exit cap",
        "v": "6.50%",
        "o": ""
      }, {
        "l": "Gross sale",
        "v": "$15,642,375",
        "o": ""
      }, {
        "l": "Cost of sale",
        "v": "($312,847)",
        "o": "2%"
      }],
      "at": {
        "tab": "pf",
        "anchor": "pf.exit",
        "where": "Returns",
        "sec": "returns"
      }
    }
  });
  window.CiviumReceipts.terms({
    "NOI": "Net operating income: what the property earns in a year after operating expenses, before the loan and capital spending.",
    "Cap rate": "A year of NOI divided by the price. Higher means cheaper for the income.",
    "Loss to lease": "The gap between what the file says units could rent for and what current leases pay.",
    "Economic occupancy": "Rent actually charged as a share of what every unit is asking.",
    "DSCR": "Debt service coverage: NOI divided by the year’s loan payments. Lenders usually want at least 1.25.",
    "Levered IRR": "The yearly return on your cash, after the loan, counting the timing of every dollar.",
    "Equity multiple": "Every dollar back over the hold, divided by the dollars you put in.",
    "Exit cap": "The cap rate a buyer pays when you sell. The sale price is the next year’s NOI divided by it.",
    "Reassessment": "After a sale the county re-values the property at the price, and taxes follow.",
    "Stabilized": "The year the model treats as settled: occupancy at target and loss to lease burned off."
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_client_app/design/client-app/receipts-larkspur.js", error: String((e && e.message) || e) }); }

// design_handoff_client_app/design/client-app/receipts.js
try { (() => {
// Civium receipts — one drill-down for every number in the app.
// Any element with data-rc="<id>" gets the hover card and the click popover;
// data-term="<word>" gets a plain-words definition. Receipts are registered
// with CiviumReceipts.register({ id: { label, value, eq, inputs:[{l,v,o,ref}], note, at:{tab,anchor,sec,where} } }).
(() => {
  if (window.CiviumReceipts) return;
  const TABS = {
    rr: 'Rent Roll Analyzer',
    t12: 'T-12 Analyzer',
    mk: 'Market Data Analyzer',
    pf: 'Pro Forma',
    op: 'One Page'
  };
  const reg = {},
    base = {},
    terms = {};
  let hoverEl = null,
    hoverT = null,
    card = null,
    pop = null,
    stack = [],
    origin = null,
    pill = null;
  const st = document.createElement('style');
  st.textContent = `
.crc{position:fixed;z-index:1000;width:360px;max-width:calc(100vw - 16px);box-sizing:border-box;background:var(--card,#fff);color:var(--ink,#2b2620);border:1px solid var(--line,#e2dccf);border-radius:12px;box-shadow:0 18px 40px -18px rgba(29,25,21,.45),0 2px 6px rgba(29,25,21,.08);font:13px/1.45 var(--sans,system-ui);font-variant-numeric:tabular-nums lining-nums}
.crc-b{padding:14px 16px 12px}
.crc-eb{font:10.5px/1.3 var(--sans,system-ui);letter-spacing:1.6px;text-transform:uppercase;color:var(--gold-deep,#8a6d2f)}
.crc-hd{display:flex;align-items:center;justify-content:space-between;gap:10px}
.crc-t{margin-top:8px;color:var(--ink-soft,#5b5348)}
.crc-v{font:400 26px/1.15 var(--serif,Georgia);margin-top:2px}
.crc-eq{margin-top:10px;padding:9px 11px;background:var(--wash,#f6f2ea);border-radius:8px;color:var(--ink-soft,#5b5348)}
.crc-in{margin-top:6px}
.crc-r{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:8px 0;border-top:1px solid var(--line-soft,#eee7da)}
.crc-r:first-child{border-top:0}
.crc-rl{min-width:0}.crc-ro{display:block;font-size:11.5px;color:var(--fade,#8d8577)}
.crc-rv{flex:none;font:400 14.5px/1.3 var(--serif,Georgia)}
.crc-link{background:none;border:0;padding:0;font:inherit;color:inherit;text-align:left;cursor:pointer;border-bottom:1px dotted var(--gold-deep,#8a6d2f)}
.crc-link:hover{color:var(--gold-deep,#8a6d2f)}
.crc-note{margin-top:8px;font-size:12px;color:var(--fade,#8d8577)}
.crc-ft{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 16px;border-top:1px solid var(--line-soft,#eee7da);background:var(--paper,#fbf8f2);border-radius:0 0 12px 12px;font-size:12px;color:var(--fade,#8d8577)}
.crc-btn{background:var(--ink,#2b2620);color:var(--paper,#fbf8f2);border:0;border-radius:7px;padding:7px 11px;font:12.5px/1 var(--sans,system-ui);cursor:pointer;white-space:nowrap}
.crc-ghost{background:none;border:0;padding:2px 4px;font:12.5px/1 var(--sans,system-ui);color:var(--fade,#8d8577);cursor:pointer}
.crc-ghost:hover{color:var(--ink,#2b2620)}
.crc-crumb{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;font-size:11.5px;color:var(--fade,#8d8577)}
.crc-pill{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:1001;display:flex;align-items:center;gap:6px;background:var(--ink,#2b2620);color:var(--paper,#fbf8f2);border-radius:999px;padding:6px 6px 6px 16px;box-shadow:0 12px 30px -12px rgba(0,0,0,.5);font:13px/1 var(--sans,system-ui)}
.crc-pill button{background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:8px 6px}
.crc-pill .crc-x{opacity:.6;padding:8px 10px}
@keyframes crcFlash{0%,100%{box-shadow:0 0 0 0 rgba(180,154,92,0)}20%,60%{box-shadow:0 0 0 6px rgba(180,154,92,.45)}}
.crc-flash{animation:crcFlash 1.6s ease 1;border-radius:6px;background:var(--gold-wash,#f7efdc)!important}
@media print{.crc,.crc-pill{display:none!important}}`;
  document.head.appendChild(st);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  })[c]);
  const place = (rect, w, h) => {
    const vw = innerWidth,
      vh = innerHeight;
    let left = Math.max(8, Math.min(rect.left, vw - w - 8)),
      top = rect.bottom + 8;
    if (top + h > vh - 8 && rect.top - h - 8 > 8) top = rect.top - h - 8;
    if (top + h > vh - 8) top = Math.max(8, vh - h - 8);
    return {
      left,
      top
    };
  };
  const tabOf = el => {
    const s = el && el.closest && el.closest('[data-screen-label]');
    return s ? s.getAttribute('data-screen-label') : null;
  };
  const rows = (r, live) => (r.inputs || []).map(i => {
    const can = live && i.ref && reg[i.ref];
    const lab = can ? `<button class="crc-link" data-crc-go="${esc(i.ref)}">${esc(i.l)}</button>` : esc(i.l);
    return `<div class="crc-r"><span class="crc-rl">${lab}${i.o ? `<span class="crc-ro">${esc(i.o)}</span>` : ''}</span><span class="crc-rv">${esc(i.v)}</span></div>`;
  }).join('');
  const bodyHtml = (r, live) => `<div class="crc-t">${esc(r.label)}</div><div class="crc-v">${esc(r.value)}</div>${r.eq ? `<div class="crc-eq">${esc(r.eq)}</div>` : ''}${(r.inputs || []).length ? `<div class="crc-in">${rows(r, live)}</div>` : ''}${r.note ? `<div class="crc-note">${esc(r.note)}</div>` : ''}`;
  function hideCard() {
    clearTimeout(hoverT);
    hoverT = null;
    if (card) {
      card.remove();
      card = null;
    }
  }
  function showCard(el) {
    let html;
    if (el.hasAttribute('data-term')) {
      const t = el.getAttribute('data-term'),
        d = terms[t];
      if (!d) return;
      html = `<div class="crc-b"><div class="crc-eb">The word, plainly</div><div class="crc-v" style="font-size:19px;margin-top:8px">${esc(t)}</div><div class="crc-t" style="margin-top:6px">${esc(d)}</div></div>`;
    } else {
      const r = reg[el.getAttribute('data-rc')];
      if (!r) return;
      const where = r.at ? (TABS[r.at.tab] || '') + (r.at.where ? ' · ' + r.at.where : '') : '';
      html = `<div class="crc-b"><div class="crc-eb">Where this is from</div>${bodyHtml(r, false)}</div><div class="crc-ft"><span>${esc(where)}</span><span>Click to follow it</span></div>`;
    }
    card = document.createElement('div');
    card.className = 'crc';
    card.setAttribute('role', 'tooltip');
    card.innerHTML = html;
    card.style.visibility = 'hidden';
    document.body.appendChild(card);
    const p = place(el.getBoundingClientRect(), card.offsetWidth, card.offsetHeight);
    card.style.left = p.left + 'px';
    card.style.top = p.top + 'px';
    card.style.visibility = '';
  }
  function renderPop() {
    const id = stack[stack.length - 1],
      r = reg[id];
    if (!r || !pop) return;
    const here = tabOf(origin && origin.el),
      dest = r.at ? TABS[r.at.tab] : null,
      same = dest && here === dest;
    const crumbs = stack.length > 1 ? `<div class="crc-crumb">${stack.map((s, i) => esc((reg[s] || {}).label || s) + (i < stack.length - 1 ? ' ›' : '')).join(' ')}</div>` : '';
    pop.innerHTML = `<div class="crc-b"><div class="crc-hd"><span style="display:flex;align-items:center;gap:8px">${stack.length > 1 ? '<button class="crc-ghost" data-crc-back>← Back</button>' : ''}<span class="crc-eb">Where this is from</span></span><button class="crc-ghost" data-crc-close aria-label="Close">Close</button></div>${crumbs}${bodyHtml(r, true)}</div>${r.at ? `<div class="crc-ft"><span>${same ? 'On this page' : 'Lives on ' + esc(dest || '')}${r.at.where ? ' · ' + esc(r.at.where) : ''}</span><button class="crc-btn" data-crc-show>${same ? 'Show it' : 'Go to it'}</button></div>` : ''}`;
  }
  function openPop(id, el) {
    hideCard();
    closePop();
    stack = [id];
    origin = {
      el,
      tab: tabOf(el),
      anchor: el.getAttribute('data-anchor') || el.getAttribute('data-rc')
    };
    pop = document.createElement('div');
    pop.className = 'crc';
    pop.setAttribute('role', 'dialog');
    document.body.appendChild(pop);
    renderPop();
    const p = place(el.getBoundingClientRect(), pop.offsetWidth, Math.min(pop.offsetHeight, 480));
    pop.style.left = p.left + 'px';
    pop.style.top = p.top + 'px';
    pop.style.maxHeight = 'calc(100vh - 16px)';
    pop.style.overflow = 'auto';
    pop.addEventListener('click', e => {
      const t = e.target.closest('button');
      if (!t) return;
      e.stopPropagation();
      if (t.hasAttribute('data-crc-close')) closePop();else if (t.hasAttribute('data-crc-back')) {
        stack.pop();
        renderPop();
      } else if (t.hasAttribute('data-crc-go')) {
        stack.push(t.getAttribute('data-crc-go'));
        renderPop();
      } else if (t.hasAttribute('data-crc-show')) {
        const r = reg[stack[stack.length - 1]];
        const from = origin;
        closePop();
        goto(r.at, from);
      }
    });
  }
  function closePop() {
    if (pop) {
      pop.remove();
      pop = null;
    }
    stack = [];
  }
  function scrollerOf(el) {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const s = getComputedStyle(p);
      if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight) return p;
      p = p.parentElement;
    }
    return null;
  }
  function reveal(anchor, tries = 30) {
    const el = [...document.querySelectorAll('[data-anchor="' + anchor + '"],[data-rc="' + anchor + '"]')].find(x => x.offsetParent !== null && !(pop && pop.contains(x)));
    if (!el) {
      if (tries > 0) setTimeout(() => reveal(anchor, tries - 1), 80);else toast('That number lives on another tab. Open the deal in the app to jump to it.');
      return;
    }
    const sc = scrollerOf(el);
    if (sc) {
      const r = el.getBoundingClientRect(),
        sr = sc.getBoundingClientRect();
      sc.scrollTo({
        top: sc.scrollTop + r.top - sr.top - sc.clientHeight / 3,
        behavior: 'smooth'
      });
    } else {
      const r = el.getBoundingClientRect();
      window.scrollTo({
        top: scrollY + r.top - innerHeight / 3,
        behavior: 'smooth'
      });
    }
    el.classList.remove('crc-flash');
    void el.offsetWidth;
    el.classList.add('crc-flash');
    setTimeout(() => el.classList.remove('crc-flash'), 1800);
  }
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'crc-pill';
    t.style.padding = '14px 18px';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  }
  function goto(at, from) {
    if (!at) return;
    const dest = TABS[at.tab];
    window.CiviumReceipts.pending = {
      tab: dest,
      sec: at.sec || null,
      anchor: at.anchor
    };
    window.dispatchEvent(new CustomEvent('civium:goto', {
      detail: {
        tab: dest,
        sec: at.sec || null,
        anchor: at.anchor
      }
    }));
    setTimeout(() => reveal(at.anchor), 60);
    if (from && from.tab && from.tab !== dest) showBack(from);
  }
  function showBack(from) {
    if (pill) pill.remove();
    pill = document.createElement('div');
    pill.className = 'crc-pill';
    pill.innerHTML = `<button data-b>← Back to ${esc(from.tab)}</button><button class="crc-x" data-x aria-label="Dismiss">×</button>`;
    pill.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-b')) {
        window.dispatchEvent(new CustomEvent('civium:goto', {
          detail: {
            tab: from.tab,
            anchor: from.anchor
          }
        }));
        setTimeout(() => reveal(from.anchor), 60);
      }
      pill.remove();
      pill = null;
    });
    document.body.appendChild(pill);
  }
  document.addEventListener('mouseover', e => {
    const el = e.target.closest && e.target.closest('[data-rc],[data-term]');
    if (el === hoverEl) return;
    hideCard();
    hoverEl = el;
    if (!el || pop) return;
    hoverT = setTimeout(() => showCard(el), 140);
  });
  document.addEventListener('click', e => {
    const el = e.target.closest && e.target.closest('[data-rc]');
    if (el && !(pop && pop.contains(el)) && reg[el.getAttribute('data-rc')]) {
      e.preventDefault();
      e.stopPropagation();
      openPop(el.getAttribute('data-rc'), el);
      return;
    }
    if (pop && !pop.contains(e.target)) closePop();
  }, true);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closePop();
      hideCard();
    }
  });
  addEventListener('scroll', () => hideCard(), true);
  window.CiviumReceipts = {
    TABS,
    register(map, opts) {
      const refs = window.CiviumReceiptRefs || {};
      Object.keys(map).forEach(id => {
        const r = map[id],
          rf = refs[id];
        if (rf && r && r.inputs) r.inputs.forEach(i => {
          if (!i.ref) {
            const k = Object.keys(rf).find(p => String(i.l).startsWith(p));
            if (k) i.ref = rf[k];
          }
        });
      });
      Object.assign(reg, map);
      if (!opts || !opts.live) Object.assign(base, map);
    },
    restore(prefix) {
      Object.keys(base).forEach(k => {
        if (k.startsWith(prefix)) reg[k] = base[k];
      });
    },
    terms(map) {
      Object.assign(terms, map);
    },
    get: id => reg[id],
    open: (id, el) => openPop(id, el),
    reveal,
    goto
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_client_app/design/client-app/receipts.js", error: String((e && e.message) || e) }); }

// ui_kits/product/Deal.jsx
try { (() => {
const {
  Tabs: DlTabs,
  Card: DlCard,
  Eyebrow: DlEyebrow,
  Receipt: DlReceipt,
  Tag: DlTag,
  Button: DlButton
} = window.CiviumDesignSystem_be8662;
const dlRows = [{
  unit: '1101',
  plan: 'A1',
  rent: '$1,205',
  origin: 'Sheet1!7 · Market Rent'
}, {
  unit: '1102',
  plan: 'A1',
  rent: '$1,205',
  origin: 'Sheet1!8 · Market Rent'
}];
function Deal({
  onBack
}) {
  const [lane, setLane] = React.useState('Rent Roll Analyzer');
  const th = {
    textAlign: 'left',
    font: 'var(--type-eyebrow)',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'var(--fade)',
    fontWeight: 400,
    padding: '6px 10px',
    borderBottom: '1px solid var(--line)'
  };
  const td = {
    padding: '6px 10px',
    borderBottom: '1px solid var(--line-soft)'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DlButton, {
    variant: "link",
    onClick: onBack
  }, "\u2190 deals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      margin: '10px 0 14px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h-page)',
      margin: 0
    }
  }, "Larkspur Crossing"), /*#__PURE__*/React.createElement(DlTag, {
    tone: "good"
  }, "ready")), /*#__PURE__*/React.createElement(DlTabs, {
    items: ['Rent Roll Analyzer', 'T-12 Analyzer', 'Market', 'Underwriting', 'The deal in one page'],
    active: lane,
    onChange: setLane
  }), lane === 'Rent Roll Analyzer' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(DlCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DlEyebrow, null, "Units"), /*#__PURE__*/React.createElement("div", {
    className: "metric"
  }, "96")), /*#__PURE__*/React.createElement(DlReceipt, {
    label: "Market rent / month",
    value: "$137,040",
    equation: "\u03A3 market rent over 96 units",
    source: "from the rent roll's own unit lines",
    rows: dlRows.map(r => ({
      label: r.unit + ' · ' + r.plan,
      value: r.rent,
      origin: r.origin
    })),
    more: "\u2026 94 more"
  }), /*#__PURE__*/React.createElement(DlReceipt, {
    label: "Market rent / unit",
    value: "$1,427.50",
    equation: "$137,040 \xF7 96 units",
    source: "the two numbers beside it"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tiny mut",
    style: {
      marginTop: 10
    }
  }, "96 units read; every row classed.")), /*#__PURE__*/React.createElement(DlCard, {
    eyebrow: "Unit lines"
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Unit"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Plan"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Market rent"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Origin"))), /*#__PURE__*/React.createElement("tbody", null, dlRows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.unit,
    style: i % 2 ? {
      background: 'var(--zebra)'
    } : undefined
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, r.unit), /*#__PURE__*/React.createElement("td", {
    style: td
  }, r.plan), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, r.rent), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--fade)'
    },
    className: "tiny"
  }, r.origin))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--fade)'
    },
    colSpan: 4
  }, "\u2026 94 more")))))) : /*#__PURE__*/React.createElement("div", {
    className: "tiny mut",
    style: {
      marginTop: 16
    }
  }, "This lane is not recreated \u2014 the product repository is private and its screens were not available."));
}
window.Deal = Deal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/product/Deal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/product/Desk.jsx
try { (() => {
const {
  Card: DkCard,
  Eyebrow: DkEyebrow,
  Pill: DkPill,
  Tag: DkTag,
  Button: DkButton
} = window.CiviumDesignSystem_be8662;
function Desk({
  onOpen
}) {
  const [filter, setFilter] = React.useState('all');
  const [dropped, setDropped] = React.useState(false);
  const showDeal = filter === 'all' || filter === 'ready';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(DkCard, {
    eyebrow: "Drop a deal",
    eyebrowGold: true,
    hint: "it reads on the server and lands as a deal when it is ready; anything the reader cannot settle goes to Civium, and you hear within a day"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setDropped(true),
    style: {
      padding: '14px 12px',
      textAlign: 'center',
      borderRadius: 'var(--radius-panel)',
      border: '1px dashed var(--faint)',
      cursor: 'pointer',
      background: dropped ? 'var(--gold-wash)' : undefined
    }
  }, dropped ? 'reading…' : 'drop the workbooks (.xlsx / .xls) here — or press to choose')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(DkEyebrow, null, "The deals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, ['all', 'ready', 'with Civium'].map(x => /*#__PURE__*/React.createElement(DkPill, {
    key: x,
    on: filter === x,
    onClick: () => setFilter(x)
  }, x)))), showDeal ? /*#__PURE__*/React.createElement(DkCard, {
    clickable: true,
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h-section)'
    }
  }, "Larkspur Crossing"), /*#__PURE__*/React.createElement(DkTag, null, "96 units"), /*#__PURE__*/React.createElement(DkTag, {
    tone: "good"
  }, "ready")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(DkButton, {
    variant: "link"
  }, "\u2192 open Larkspur Crossing"))) : /*#__PURE__*/React.createElement("div", {
    className: "tiny mut"
  }, "no deals with Civium")));
}
window.Desk = Desk;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/product/Desk.jsx", error: String((e && e.message) || e) }); }

// ui_kits/product/Shell.jsx
try { (() => {
const {
  Button
} = window.CiviumDesignSystem_be8662;
function Shell({
  children,
  onSignOut
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-brand)',
      letterSpacing: 7,
      color: 'var(--gold)'
    }
  }, "CIVIUM"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onSignOut
  }, "sign out"))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '24px 24px 48px',
      boxSizing: 'border-box'
    }
  }, children));
}
window.Shell = Shell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/product/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/product/SignIn.jsx
try { (() => {
const {
  Card: SiCard,
  Input: SiInput,
  Button: SiButton
} = window.CiviumDesignSystem_be8662;
function SignIn({
  onEnter
}) {
  const [busy, setBusy] = React.useState(false);
  const enter = () => {
    setBusy(true);
    setTimeout(onEnter, 700);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--paper)',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 360,
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-brand)',
      letterSpacing: 7,
      color: 'var(--gold)',
      textAlign: 'center'
    }
  }, "CIVIUM"), /*#__PURE__*/React.createElement(SiCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(SiInput, {
    defaultValue: "x@x.test",
    "aria-label": "email"
  }), /*#__PURE__*/React.createElement(SiInput, {
    type: "password",
    defaultValue: "correct horse battery staple",
    "aria-label": "password"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SiButton, {
    disabled: busy,
    onClick: enter
  }, busy ? 'sending…' : 'Set password and enter')), /*#__PURE__*/React.createElement("div", {
    className: "tiny mut"
  }, "shown once \u2014 send it yourself")))));
}
window.SignIn = SignIn;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/product/SignIn.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Receipt = __ds_scope.Receipt;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

})();
