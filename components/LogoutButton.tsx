import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();
    
    function handleLogout() {
        navigate('/');
        localStorage.removeItem('token');
        console.log("Succesfully logged out");
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}