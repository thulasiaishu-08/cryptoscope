import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './FilterDropdown.css';

export function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = value !== 'All';

  return (
    <div className="filter-dropdown" ref={ref}>
      <button className={`filter-trigger ${isActive ? 'filter-trigger-active' : ''}`} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {label}
        {isActive && <span className="filter-value">: {value}</span>}
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="filter-menu" role="listbox">
          {options.map((opt) => (
            <button
              key={opt}
              className="filter-option"
              role="option"
              aria-selected={opt === value}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
              {opt === value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
