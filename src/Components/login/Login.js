import "./login.css";
import {FaUser , FaLock} from "react-icons/fa";
    function Login() {
            // Function to handle form submission
            const handleSubmit = (event) => {
                event.preventDefault(); // Prevent default form submission behavior
                
                // Accessing the input fields
                const usernameInput = document.getElementById('username');
                const passwordInput = document.getElementById('password');
        
                // Check if inputs are not empty
                if (usernameInput.value.trim() === '' || passwordInput.value.trim() === '') {
                    alert('Please fill out all required fields.');
                    return;
                }
        
                // If inputs are filled, continue with form submission
                // You can add your form submission logic here
            };
        return (
            <div className='wrapper'>
                <form action="">
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' required ></input>
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required />
                    <FaLock className="icon" />
                </div>
                <div className="remember-forgot">
                   
                     <a href="/forgot">Forgot password?
                     <svg viewBox="0 0 70 36">
    <path d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527" />
  </svg></a>
                </div>
                <button type="submit">Login</button>
            </form>
            </div>

        );
    }
    export default Login;