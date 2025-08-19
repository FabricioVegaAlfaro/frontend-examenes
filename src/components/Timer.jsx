import { useState, useEffect } from "react";
import "./Timer.css";

export default function Timer({ duration, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="timer">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
