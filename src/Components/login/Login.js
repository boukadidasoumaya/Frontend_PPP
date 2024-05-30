import "./login.css";
import {FaUser , FaLock} from "react-icons/fa";
import { useState } from "react";
import  Alert  from "./Alert";
function Login() {
    const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
    const [showToast, setShowToast] = useState(false); // State to control toast visibility
  
    function launchToast(message) {
      setErrorMessage(message);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  
    function removeHtmlEntities(input) {
      const pattern = /&[^\s]*?;/g; // This pattern matches any HTML entity
      return input.replace(pattern, '');
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission behavior
  
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
  
      if (usernameInput.value.trim() === '' || passwordInput.value.trim() === '') {
        launchToast('Please fill out all required fields.');
        return;
      }
  
      const data = {
        username: removeHtmlEntities(usernameInput.value.trim()),
        password: removeHtmlEntities(passwordInput.value.trim())
      };
  
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          launchToast(errorData.error);
          console.error('Error:', errorData.error);
          return;
        }
  
        const responseData = await response.json();
        const token = responseData.token;
        sessionStorage.setItem('jwtToken', token);
        window.location.href = '/';
      } catch (error) {
        console.error('Error:', error);
        launchToast('An error occurred while logging in.');
      }
    };
  
    return (
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {showToast &&<div className='alertss'>
 <Alert message={errorMessage} icon=<FaLock /> showToast={showToast}/></div> }
          <div className="input-box">
                    <input type="text" placeholder='Username' id ='username' required ></input>
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' id='password' required />
                    <FaLock className="icon" />
                </div>
                <div className="remember-forgot">
                   
                     <a href="/forgot">Forgot password?
                     <svg viewBox="0 0 70 36">
    <path d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527" />
  </svg></a>
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>Login</button>
            </form>
            
            </div>

        );
    }
    export default Login;