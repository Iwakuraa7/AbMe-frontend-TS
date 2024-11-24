import React from "react";
import { useNavigate } from "react-router-dom"

export default function HomeButton() {
    const navigate = useNavigate();

    const goToHomePage = () => {navigate('/home')};

    return(
        <button onClick={goToHomePage}>Go back</button>
    )
}