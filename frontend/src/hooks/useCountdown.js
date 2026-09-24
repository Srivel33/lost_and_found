import { useState, useEffect } from 'react';
import { formatTimeCountdown } from '../utils/format';

export const useCountdown = (targetDateString) => {
  const [timeLeft, setTimeLeft] = useState(formatTimeCountdown(targetDateString));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDateString) {
      setIsExpired(true);
      return;
    }

    const check = () => {
      const target = new Date(targetDateString).getTime();
      const diff = target - Date.now();
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft('00:00:00');
      } else {
        setIsExpired(false);
        setTimeLeft(formatTimeCountdown(targetDateString));
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [targetDateString]);

  return { timeLeft, isExpired };
};
