/* @ds-bundle: {"format":4,"namespace":"CiviumDesignSystem_be8662","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Pill","sourcePath":"components/actions/Pill.jsx"},{"name":"Input","sourcePath":"components/inputs/Input.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Tag","sourcePath":"components/signals/Tag.jsx"},{"name":"Receipt","sourcePath":"components/signature/Receipt.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/type/Eyebrow.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"95c96e308ce1","components/actions/Pill.jsx":"d42666a7cc4f","components/inputs/Input.jsx":"684c087f3f7e","components/navigation/Tabs.jsx":"6eaccece5d8e","components/signals/Tag.jsx":"d12df4c781d6","components/signature/Receipt.jsx":"12aa540ccbdf","components/surfaces/Card.jsx":"5984b78bd4de","components/type/Eyebrow.jsx":"510cdaab37b6","ui_kits/product/Deal.jsx":"be160c473e31","ui_kits/product/Desk.jsx":"2d4cb88a8780","ui_kits/product/Shell.jsx":"82caf1bdd738","ui_kits/product/SignIn.jsx":"b358652bf65e"},"inlinedExternals":[],"unexposedExports":[]} */

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
      minWidth: 360,
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
