import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInButton() {
    const navigate = useNavigate();

    const goToSignInPage = () => {navigate('/signin')}

    return (
        <button onClick={goToSignInPage}>Sign in</button>
    )
}