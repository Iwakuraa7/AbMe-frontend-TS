import { useContext, useState } from "react";
import styles from "../styles/SearchPage.module.css";
import NavBar from "../components/NavBar";
import { UserContext } from "../src/contexts/UserContext.jsx";
import ContextMessage from "../components/ContextMessage.jsx";

export interface mangaDataType {
    title: [string, string],
    imageUrl: string
}

export default function SearchMangaPage() {
    const {contextMsg, fadeOut, showMessage} = useContext(UserContext);
    const [searchInput, setSearchInput] = useState<string>('');
    const [currentMangaData, setCurrentMangaData] = useState<mangaDataType | null>(null);
    const [mangaData, setMangaData] = useState<mangaDataType[]>([]);

    async function handleSearch() {
        var response = await fetch(`https://api.jikan.moe/v4/manga?q=${searchInput}`);
        var data = await response.json();

        var filteredData = data.data.map(manga => ({
            title: [manga.title_english, manga.title],
            imageUrl: manga.images.jpg.image_url
        }))

        setMangaData(filteredData);

        console.log(filteredData);
        console.log(data.data);
    }

    async function addMangaData () {
        if(!currentMangaData)
            return;

        var response = await fetch("http://54.86.55.158:8080/api/manga/create", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: currentMangaData.title[0],
                ImageUrl: currentMangaData.imageUrl
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
                <h1>Add manga to profile</h1>
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
                {mangaData && mangaData.map((manga, index) => {
                    return(
                        <div
                        key={index}
                        className={styles["searchResultEntity"]}
                        onMouseEnter={() => {setCurrentMangaData(manga)}}
                        onMouseLeave={() => {setCurrentMangaData(null)}}
                        >
                            <img src={manga.imageUrl}/><br/>
                            <h3>{manga.title[0] !== null ? manga.title[0] : manga.title[1]}</h3>
                            {currentMangaData === manga && (
                                <button onClick={() => addMangaData()}>Add</button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
        </>
    )
}
