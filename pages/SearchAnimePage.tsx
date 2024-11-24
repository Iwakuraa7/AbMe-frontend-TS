import { useContext, useState } from "react";
import styles from "../styles/SearchPage.module.css";
import NavBar from "../components/NavBar";
import ContextMessage from "../components/ContextMessage";
import { UserContext } from "../src/contexts/UserContext";

export interface animeEntityType {
    title: [string, string?];
    imageUrl: string;
}

export default function SearchAnimePage() {
    const {contextMsg, fadeOut, showMessage} = useContext(UserContext);
    const [searchInput, setSearchInput] = useState<string>("");
    const [currentAnimeData, setCurrentAnimeData] = useState<animeEntityType | null>(null);
    const [animeData, setAnimeData] = useState<animeEntityType[]>([]);

    async function handleSearch() {
        var response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchInput}`);
        var data = await response.json();

        var filteredData = data.data.map(anime => ({
            title: [anime.title_english, anime.title],
            imageUrl: anime.images.jpg.image_url
        }))

        setAnimeData(filteredData);

        console.log(filteredData);
        console.log(data.data);
    }

    async function addAnimeData () {
        var response = await fetch("http://localhost:5078/api/anime/create", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: currentAnimeData?.title[0],
                ImageUrl: currentAnimeData?.imageUrl
            })
        });

        var data = await response.json();

        showMessage(data.message);
    }

    return (
        <>
        <NavBar/>
        <div className={styles["search-main-box"]}>
            {contextMsg && (<ContextMessage message={contextMsg} fadeOut={fadeOut}/>)}

            <div className={styles["search-input-box"]}>
                <h1>Add anime to profile</h1>
                <div className={styles["search-and-button-rel"]}>
                    <input
                    type='text'
                    onChange={(e) => {setSearchInput(e.target.value)}}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter')
                            handleSearch();
                    }}
                    />
                    <button onClick={handleSearch}>Search</button><br/>
                </div>
            </div>

            <div className={styles["searchBox"]}>
                {animeData && animeData.map((anime, index) => {
                    return(
                        <div
                        key={index}
                        className={styles["searchResultEntity"]}
                        onMouseEnter={() => {setCurrentAnimeData(anime)}}
                        onMouseLeave={() => {setCurrentAnimeData(null)}}
                        >
                            <img src={anime.imageUrl}/><br/>
                            <h3>{anime.title[0] !== null ? anime.title[0] : anime.title[1]}</h3>
                            {currentAnimeData === anime && (
                                <button onClick={() => addAnimeData()}>Add</button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
        </>
    )
}
