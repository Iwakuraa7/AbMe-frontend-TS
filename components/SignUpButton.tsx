import React from "react";
import { useNavigate } from "react-router-dom";

export default function SignInButton() {
    const navigate = useNavigate();

    const goToSignUpPage = () => {navigate('/signup')}

    return (
        <button onClick={goToSignUpPage}>Sign up</button>
    )
}