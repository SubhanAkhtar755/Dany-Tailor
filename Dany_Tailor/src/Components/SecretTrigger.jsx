import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SecretTrigger = () => {
  const [typed, setTyped] = useState('');
  const [pressStartTime, setPressStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      
      // Only allow number keys (0-9)
      if (!/^[0-9]$/.test(key)) return;

      const updatedTyped = (typed + key).slice(-6); // track last 6 characters
      setTyped(updatedTyped);

      if (updatedTyped === '003456') {
        navigate('/003456'); // replace with your desired route
      }
    };

    const handleTouchStart = (e) => {
      setPressStartTime(Date.now()); // Record start time of touch
    };

    const handleTouchEnd = (e) => {
      const pressDuration = Date.now() - pressStartTime;

      if (pressDuration >= 10000) { // If long press is 10 seconds or more
        navigate('/003456'); // Redirect after long press
      }
      setPressStartTime(null); // Reset touch start time
    };

    // Keyboard event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Mobile touch event listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [typed, navigate, pressStartTime]);

  return null; // Hidden component, nothing is shown
};

export default SecretTrigger;
