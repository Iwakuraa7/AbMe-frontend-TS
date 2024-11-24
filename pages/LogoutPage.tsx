import React from "react";
import HomeButton from "../components/HomeButton";
import LogoutButton from "../components/LogoutButton";

export default function LogoutPage() {
    return (
        <>
        <h1>You should first logout in order to sign in/up</h1>
        <LogoutButton/>
        <HomeButton/>
        </>
    )
}