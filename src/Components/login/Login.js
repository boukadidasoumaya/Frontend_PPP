import "./login.css";
import {FaUser , FaLock} from "react-icons/fa";
import { useState } from "react";

    function Login() {
        const [errorMessage, setErrorMessage] = useState(""); // State to hold error message

        function removeHtmlEntities(input) {
            // Define a regular expression pattern to match HTML entities
            const pattern = /&[^\s]*?;/g; // This pattern matches any HTML entity
        
            // Use the replace method with the pattern to remove HTML entities
            return input.replace(pattern, '');
        }
            // Function to handle form submission
            const handleSubmit = async (event) => {
                event.preventDefault(); // Prevent default form submission behavior
            
                // Accessing the input fields
                const usernameInput = document.getElementById('username');
                const passwordInput = document.getElementById('password');
            
                // Check if inputs are not empty
                if (usernameInput.value.trim() === '' || passwordInput.value.trim() === '') {
                    alert('Please fill out all required fields.');
                    return;
                }
            
                // Construct the data object to be sent in the request body
                const data = {
                    username: removeHtmlEntities(usernameInput.value.trim()),
                    password: removeHtmlEntities(passwordInput.value.trim())
                };
            
                try {
                    // Make a POST request to your backend API endpoint
                    const response = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
            
                    // Check if the request was successful (status code 2xx)
                    if (!response.ok) {
                        // If the request fails, get the error message from the response
                        const errorData = await response.json();
                        setErrorMessage(errorData.error); // Set error message in state
                        console.error('Error:', errorData.error);
                        return; // Stop further execution
                    }
            
                    // Get the JWT token from the response
                    const responseData = await response.json();
                    const token = responseData.token;
            
                    // Store the token in sessionStorage
                    sessionStorage.setItem('jwtToken', token);
            
                    // Redirect the user upon successful login
                    window.location.href = '/'; // Redirect to the home page
                } catch (error) {
                    // Handle any network errors or other exceptions
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                }
            };
        return (
            <div className='wrapper'>
                <form action="">
                <h1>Login</h1>
                {errorMessage && <div className="error-message"><FaLock />   {errorMessage}</div>}
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