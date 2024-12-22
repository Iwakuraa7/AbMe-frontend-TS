import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavBar from "../components/NavBar";
import styles from "../styles/MainPage.module.css"
import searchStyles from "../styles/SearchPage.module.css"
import { UserContext } from "../src/contexts/UserContext";

type userInfoType = {
    aud: string
    email: string
    exp: number
    given_name: string
    iat: number
    iss: string
    nameid: string
    nbf: number
}

export default function MainPage() {
    const {setUserInfo} = useContext(UserContext);
    const [userSearchQuery, setUserSearchQuery] = useState<string | null>("");
    const [userSearchResult, setUserSearchResult] = useState<string[] | null>([]);
    const navigate = useNavigate();

    useEffect(() => {
        var token = localStorage.getItem('token');
        if(token === null) {
            navigate('/');
            return;
        }

        var decodedToken: userInfoType = jwtDecode(token);
        setUserInfo(decodedToken);
    }, [])

    async function handleUserSearch() {
        var response = await fetch(`http://54.86.55.158:8080/api/account/user-search/${userSearchQuery}`);
        var data = await response.json();

        if(data.succeeded)
            setUserSearchResult(data.usernames);
        else
            console.error("Sth went wrong while finding usernames by the value...")
    }

    return(
        <>
        <NavBar/>
        <div className={styles["mainPage-back"]}>
            <div className={styles["morphing-shape"]}>
                AbMe
            </div>
            <div className={styles["search-user-input-box"]}>
                <label>Searching for someone?</label>
                <div className={searchStyles["search-and-button-rel"]}>
                    <input onChange={(e) => setUserSearchQuery(e.target.value)} type="text"/>
                    <button className={styles["button-style"]} onClick={() => handleUserSearch()}>Find</button>
                </div>
            </div>

            {userSearchResult &&
            (<div className={styles["usernames-box"]}>
                {userSearchResult.map(u => {
                    return (
                        <div className={styles["usernameEntity-box"]} onClick={() => navigate(`/user/${u}`)}>
                            <h3>{u}</h3>
                        </div>
                    )
                })}
            </div>)}
        </div>
        </>
    )
}