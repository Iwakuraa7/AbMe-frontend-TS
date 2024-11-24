import { useNavigate } from "react-router-dom";
import styles from "../styles/NavBar.module.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../src/contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import userInfoType from "../src/contexts/UserContext";

export default function NavBar() {
    const navigate = useNavigate();
    const {userInfo, setUserInfo} = useContext(UserContext);
    const [isAdd, setIsAdd] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token !== null)
        {
            var decodedToken: userInfoType = jwtDecode(token === null ? "" : token);
            setUserInfo(decodedToken);
            console.log(decodedToken);
        }
    }, [localStorage.getItem('token')])

    return (
        <div className={styles["nav-bar-box"]}>
            <div
            className={`${styles["nav-bar-element"]}`}
            onClick={() => navigate('/home')}
            >
                Home
            </div>

            <div
            className={`${styles["nav-bar-element"]} ${styles["add-bar-element"]}`}
            onMouseEnter={() => setIsAdd(true)}
            onMouseLeave={() => setIsAdd(false)}
            >
                Add...
                <div className={styles["dropdown-container"]} style={{ display: isAdd ? 'block' : 'none' }}>
                    <div onClick={() => navigate('/search/music')}>Music</div>
                    <div onClick={() => navigate('/search/book')}>Books</div>
                    <div onClick={() => navigate('/search/anime')}>Anime</div>
                    <div onClick={() => navigate('/search/manga')}>Manga</div>
                    <div onClick={() => navigate('/search/movie')}>Media</div>
                </div>
            </div> 

            <div
            className={`${styles["nav-bar-element"]}`}
            onClick={() => navigate(`/user/${userInfo.given_name}`)}
            >
                My profile
            </div>

            <div
            className={`${styles["nav-bar-element"]}`}
            onClick={() => {
                navigate('/');
                localStorage.removeItem('token');
            }}
            >
                Logout
            </div>   
        </div>
    )
}