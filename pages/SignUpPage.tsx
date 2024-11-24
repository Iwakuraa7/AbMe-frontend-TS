import { useEffect, useState } from "react"
import styles from "../styles/SignUpPage.module.css"
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const [apiResponse, setApiResponse] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    async function registerNewUser() {
        try
        {
            const response = await fetch("http://localhost:5078/api/account/register", {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Username: username,
                    Email: email,
                    Password: password
                })
            });

            const data = await response.json();
            if(data.succeeded)
            {
                setApiResponse(data.succeeded);
                localStorage.setItem('token', data.token);
                console.log(data);
                console.log(data.message);
            }
            else
                console.error(data.message)
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
        <div className={styles["column-three"]}>
            <div className={styles["up-component"]}>
                <label htmlFor='usernameField'>Username</label><br/>
                <input onChange={(e) => {setUsername(e.target.value)}} id='usernameField' type='text'/>
            </div>

            <div className={styles["middle-component"]}>
                <label htmlFor='emailField'>Email</label><br/>
                <input onChange={(e) => {setEmail(e.target.value)}} id='emailField' type='email'/>
            </div>

            <div className={styles["down-component"]}>
                <label htmlFor='passwordField'>Password</label><br/>
                <input onChange={(e) => {setPassword(e.target.value)}} id='passwordField' type='password'/>
            </div>

            <div className={styles["last-component"]} onClick={() => registerNewUser()}>
                Let's go!
            </div>
        </div>
        </>
    )
}