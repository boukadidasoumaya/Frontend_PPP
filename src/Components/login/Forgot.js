import {FaUser , FaLock} from "react-icons/fa";

function Forgot() {
    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Accessing the input fields
        const usernameInput = document.getElementById('cin');

        // Check if inputs are not empty
        if (usernameInput.value.trim() === '' ) {
            alert('Please fill out all required fields.');
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
                alert('Password retrieval request sent successfully!');
            } else {
                // Handle errors from the server
                const errorData = await response.json();
                alert('Error: ' + errorData.message); // Assuming your server returns error messages in a JSON format
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        }
    };

    return (  <div className='wrapper'>
    <form action="">
    <h1>retrieving password for</h1>
    <div className="input-box">
        <input type="text" placeholder='cin' required ></input>
        <FaUser className="icon" />
    </div>
   
    <div className="remember-forgot">
       
         <a href="/login">login
         <svg viewBox="0 0 70 36">
<path d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527" />
</svg></a>
    </div>
    <button type="submit">send code</button>
</form>
</div>

);
}
export default Forgot;