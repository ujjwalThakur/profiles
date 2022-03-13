import React from "react";
import './Login.css'
const Login = ({onGoogleSignIn, onAnonymousSignIn}) => {
    
    return <div className='login-container'>
        <div onClick={onGoogleSignIn}>Sign in with Google</div>
        <div onClick={onAnonymousSignIn}>Sign in anonymously</div>
    </div>

}

export default Login