import React, { useEffect, useState } from 'react';
import "./loginPage.css";
import Login from "../../Components/login/Login.js";
import Forgot from "../../Components/login/Forgot.js";
import PasswordReset from "../../Components/login/PasswordReset.js";
import Verification from "../../Components/login/Verification.js";

function LoginPage() {
    const [url, setUrl] = useState('');
    const [pageType, setPageType] = useState('login');

    useEffect(() => {
        // Get the current URL
        const currentUrl = window.location.href;
        setUrl(currentUrl);

        // Check if the URL contains any of the words
        if (currentUrl.includes('forgot')) {
            setPageType('forgot');
        } else if (currentUrl.includes('passwordReset')) {
            setPageType('passwordReset');
        } else if (currentUrl.includes('verif')) {
            setPageType('verification');
        } else {
            setPageType('login');
        }
    }, []);

    // Render the appropriate component based on the page type
    return (
        <div className='hello'>
            {pageType === 'login' && <Login />}
            {pageType === 'forgot' && <Forgot />}
            {
