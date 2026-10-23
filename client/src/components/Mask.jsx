// Wraps heading text so it can rise out of a clipped line when its parent
// `.reveal` scrolls into view (see .mask / .mask-in in index.css).
export default function Mask({ children }) {
  return (
    <span className="mask">
      <span className="mask-in">{children}</span>
    </span>
  );
}
