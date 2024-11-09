import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function ErrorMessage({ message, duration = 3000 }) {
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (message) {
      setDisplay(true);
      setTimeout(() => setVisible(true), 10);

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setDisplay(false), 500);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!display) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-opacity duration-500 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      } bg-gray-800 text-gray-200 border-2 border-red-500`}
    >
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        className="h-5 w-5 text-red-400"
      />
      <span className="font-medium">{message}</span>
    </div>
  );
}
