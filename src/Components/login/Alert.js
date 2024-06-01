import React from 'react';
import {FaUser , FaLock} from "react-icons/fa";
const Alert = ({ message,icon,showToast }) => {
    return (
      <div id="toast" className={showToast ? 'show' : ''}>
        <div id="img">{icon}</div>
        <div id="desc">{message}</div>
      </div>
    );
  };

export default Alert;