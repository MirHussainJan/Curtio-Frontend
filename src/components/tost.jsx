import React, { useEffect } from 'react';

export default function Tost({ message, onClose, duration = 3000 }) {
  // Auto-close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-indigo-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
        {message}
      </div>
    </div>
  );
}

/* Add simple fade-in animation */
<style jsx>{`
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fade-in 0.3s ease-out; }
`}</style>
