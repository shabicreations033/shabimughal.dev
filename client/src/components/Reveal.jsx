import useReveal from '../hooks/useReveal';

// Wrap any block of content to fade + slide it up once it scrolls into view.
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, inView] = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in-view' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
