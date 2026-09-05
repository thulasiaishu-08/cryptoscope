import { forwardRef } from 'react';
import './Card.css';

export const Card = forwardRef(function Card({ as: Tag = 'div', className = '', hoverable = false, children, ...rest }, ref) {
  const classes = ['card', hoverable ? 'card-hoverable' : '', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
});
