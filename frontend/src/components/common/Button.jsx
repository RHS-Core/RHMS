export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
