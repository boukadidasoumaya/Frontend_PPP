import React, { useEffect, useState } from 'react';
import "./loginPage.css";
import Login from "../../Components/login/Login.js";
import Forgot from "../../Components/login/Forgot.js"
function LoginPage() {
    const [url, setUrl] = useState('');
    const [containsWord, setContainsWord] = useState(false);
    const wordToCheck = 'forgot'; // The word you want to check for
  
    useEffect(() => {
      // Get the current URL
      const currentUrl = window.location.href;
      setUrl(currentUrl);
  
      // Check if the URL contains the word
      const urlContainsWord = currentUrl.toLowerCase().includes(wordToCheck.toLowerCase());
      setContainsWord(urlContainsWord);
    }, []); // Empty dependency array ensures this runs only once on mount
    if (containsWord) {
    return (
   
      <div className='hello'>
     <Forgot/>

     </div>    
        
       
    );}
    else return (      <div className='hello'>
    <Login/> </div>)
}

export default LoginPage;
