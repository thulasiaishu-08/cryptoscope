import './Button.css';

export function Button({ variant = 'secondary', size = 'md', icon: Icon, iconOnly = false, className = '', children, ...rest }) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, iconOnly ? 'btn-icon-only' : '', className].filter(Boolean).join(' ');
  return (
    <button className={classes} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
      {!iconOnly && children}
    </button>
  );
}
