import "./login.css";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
    import { useLocation } from 'react-router-dom';

function Verifing() {
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
            return;
        }

        // Check if passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            setErrorMessage("Passwords do not match");
            return;
        }

        // Clear error message if passwords match and are not empty
        setErrorMessage("");

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
                throw new Error('Failed to verify');
            }

            // Proceed with navigation to login page after successful verification
            navigate("/login");
        } catch (error) {
            console.error('Error verifying:', error);
            setErrorMessage("Failed to verify");
        }
    };

    return (
        <div className='wrapper'>
            <form>
                <h1>Verifing</h1>
                {errorMessage && <div className="error-message"><FaLock />   {errorMessage}</div>}
                <div className="input-box">
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
