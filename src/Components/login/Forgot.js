import React, { useState } from 'react';
import { FaUser, FaLock ,FaCheck } from "react-icons/fa";
import  Alert  from "./Alert";
function Forgot() {
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false); // State to control toast visibility
const [success,setSuccess]=useState(false);
const [successmsg,setSuccessmsg]=useState('');

    function launchToast() {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);}
    function launchSuccessToast() {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
        }, 5000);}
    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Accessing the input field
        const CinInput = document.getElementById('cin');
        const cin = CinInput.value.trim();
    
        // Check if input is not empty
        if (cin === '') {
            setError('Please fill out all required fields.');
            launchToast()
            return;
        }
    
        try {
            // Make a POST request to your backend API
            const response = await fetch('/api/admin/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cin }) // Send the username in the request body
            });
    
            // Check if request was successful
            if (response.ok) {
                setSuccessmsg('Password retrieval request sent!');
                launchSuccessToast();
            } else {
                // Handle errors from the server
                const errorData = await response.json();
                setError( errorData.error); 
                launchToast();// Assuming your server returns error messages in a JSON format
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error:', error);
            setError('An error occurred while processing your request.');
            launchToast();
        }
    };

    return (
        <div className='wrapper'>
            <form action="">
                <h1>Retrieving Password</h1>
                {showToast &&<div className='alertss'>
 <Alert message={error} icon=<FaLock /> showToast={showToast}/></div> }
 {success &&<div className='alertss'>
 <Alert message={successmsg} icon=<FaCheck /> showToast={success}/></div> }
                <div className="input-box">
                    <input type="text" placeholder='CIN' id='cin' required></input>
                    <FaUser className="icon" />
                </div>
                <div className="remember-forgot">
                    <a href="/login">Login
                    <svg viewBox="0 0 70 36">
                        <path d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527" />
                    </svg></a>
                </div>
                <button type="submit" onClick={(e) => handleSubmit(e)}>send code</button>
            </form>
        </div>
    );
}

export default Forgot;
