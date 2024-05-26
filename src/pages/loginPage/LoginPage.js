import React, { useEffect, useState } from 'react';
import "./loginPage.css";
import Login from "../../Components/login/Login.js";
import Forgot from "../../Components/login/Forgot.js";
import Verification from "../../Components/login/Verification.js";

function LoginPage() {
    const [url, setUrl] = useState('');

    useEffect(() => {
        // Get the current URL
        const currentUrl = window.location.href;
        setUrl(currentUrl);
    }, []); // Empty dependency array ensures this runs only once on mount

    // Determine which component to render based on the URL
    const renderComponent = () => {
        if (url.includes('verif')) {
          return <Verification />;
          
        } else if (url.includes('forgot')) {
          return <Forgot />;
        } else {
            return <Login />;
        }
    };

    return (
        <div className='hello'>
            {renderComponent()}
        </div>
    );
}

export default LoginPage;
