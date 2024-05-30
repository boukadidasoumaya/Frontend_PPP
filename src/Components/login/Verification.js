import "./login.css";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
    import { useLocation } from 'react-router-dom';
import Alert from "./Alert";
function Verifing() {
    
    const [showToast, setShowToast] = useState(false); // State to control toast visibility
  
    function launchToast(message) {
      setErrorMessage(message);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);}
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const token = searchParams.get('token');
  const id = searchParams.get('id');
    const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
console.log(id)
        // Accessing the input fields
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        // Check if passwords are empty
        if (passwordInput.value.trim() === '' || confirmPasswordInput.value.trim() === '') {
            setErrorMessage("Please fill out all required fields");
            launchToast(errorMessage);
            return;
        }

        // Check if passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            setErrorMessage("Passwords do not match");
            launchToast(errorMessage);

            return;
        }

        // Clear error message if passwords match and are not empty
        try {
            // Fetch content from the API
            const response = await fetch('/api/admin/resetverif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
userId: id,
token:token,
                    password: passwordInput.value,
                    confirmPassword: confirmPasswordInput.value
                })
            });

            if (!response.ok) {
                setErrorMessage('Failed to verify');
                launchToast(errorMessage);

            }

            // Proceed with navigation to login page after successful verification
            navigate("/login");
        } catch (error) {
            console.error('Error verifying:', error);
            setErrorMessage("Failed to verify");
            launchToast(errorMessage);

        }
    };

    return (
        <div className='wrapper'>
            <form>
                <h1>Verifing</h1>
                {showToast &&<div className='alertss'>
 <Alert message={errorMessage} icon=<FaLock /> showToast={showToast}/></div> }
*                <div className="input-box">
                    <input type="password" placeholder='Password' id='password' required />
                    <FaLock className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Confirm Password' id='confirmPassword' required />
                    <FaLock className="icon" />
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>Login</button>
            </form>
        </div>
    );
}

export default Verifing;
