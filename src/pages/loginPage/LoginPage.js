import React, { useEffect, useState } from 'react';
import "./loginPage.css";
import Login from "../../Components/login/Login.js";
import Forgot from "../../Components/login/Forgot.js";
import Verification from "../../Components/login/Verification.js";

function LoginPage({ componentToRender }) {
    // Determine which component to render based on the prop
    const renderComponent = () => {
        switch (componentToRender) {
            case 'verification':
                return <Verification />;
            case 'forgot':
                return <Forgot />;
            default:
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
