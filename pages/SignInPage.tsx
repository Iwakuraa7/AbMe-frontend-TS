import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SignInPage.module.css"

export default function SingInPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [apiResponse, setApiResponse] = useState<boolean>(false);
    const navigate = useNavigate();

    async function signInUser() {
        try
        {
            const response = await fetch("http://54.86.55.158:8080/api/account/login", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({
                    Username: username,
                    password: password
                })
            })

            const data = await response.json();

            if(data.succeeded)
            {
                setApiResponse(data.succeeded);
                localStorage.setItem('token', data.userInfo.token);
                console.log(data.message);
                console.log(data);
            }
            else
                console.error(data.message);
        }
        catch(err)
        {
            console.error(err);
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token') !== null) {
            navigate('/logout');
        }
    })

    useEffect(() => {
        if(apiResponse) {
            navigate('/home');
        }
    }, [apiResponse])

    return(
        <>
        <div className={styles["column-fifty-fifty"]}>
            <div className={styles["up-component"]}>
                <label htmlFor='usernameField'>Username</label><br/>
                <input onChange={(e) => {setUsername(e.target.value)}} id='usernameField' type='text'/>
            </div>

            <div className={styles["middle-component"]}>
                <label htmlFor='passwordField'>Password</label><br/>
                <input onChange={(e) => {setPassword(e.target.value)}} id='passwordField' type='password'/>
            </div>

            <div className={styles["down-component"]} onClick={() => signInUser()}>
                Let's go!
            </div>
        </div>
        </>
    )
}