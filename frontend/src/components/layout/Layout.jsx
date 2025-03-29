import React, { useEffect } from 'react';
import '../../styles/style.css';

const Layout = ({ children }) => {
  useEffect(() => {
    // If you need to use jQuery and match-height
    const script1 = document.createElement('script');
    script1.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
    script1.async = true;
    document.body.appendChild(script1);
    
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = '/js/match-height.js';
      script2.async = true;
      document.body.appendChild(script2);
      
      script2.onload = () => {
        // Initialize match height
        window.jQuery('.match-height-bootstrap-row > * > *').matchHeight();
        window.jQuery('.match-height > *').matchHeight();
      };
    };
    
    return () => {
      document.body.removeChild(script1);
    };
  }, []);
  
  return (
    <>
      {children}
    </>
  );
};

export default Layout;