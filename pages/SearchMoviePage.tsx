import { useContext, useState } from "react"
import NavBar from "../components/NavBar";
import styles from "../styles/SearchPage.module.css";
import { UserContext } from "../src/contexts/UserContext.jsx";
import ContextMessage from "../components/ContextMessage.jsx";

export interface mediaDataType {
    posterPath: string,
    name?: string,
    title?: string
}

export default function SearchMoviePage() {
    const {READ_ACCESS_TOKEN, contextMsg, fadeOut, showMessage} = useContext(UserContext);
    const [searchInput, setSearchInput] = useState<string>('');
    const [mediaData, setMediaData] = useState<mediaDataType[]>([]);
    const [currentMedia, setCurrentMedia] = useState<mediaDataType | null>(null);

    async function handleSearch() {
        var response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchInput}&include_adult=false&language=en-US&page=1$include_images=true`, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: "Bearer " + READ_ACCESS_TOKEN
            }
        })
        
        var data = await response.json();

        var filteredData = data.results.map(media => ({
            posterPath: media.poster_path,
            name: media.name,
            title: media.title
        }))
        
        console.log(data);

        setMediaData(filteredData);
    }

    async function addMediaData() {
        if(!currentMedia)
            return;

        var response = await fetch("http://localhost:5078/api/movie/create", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: currentMedia.name ? currentMedia.name : currentMedia.title,
                ImageUrl: `https://image.tmdb.org/t/p/original${currentMedia.posterPath}`
            })
        })

        var data = await response.json();

        showMessage(data.message);
    }

    return (
        <>
        <NavBar/>
        <div className={styles["search-main-box"]}>
            {contextMsg && (<ContextMessage message={contextMsg} fadeOut={fadeOut}/>)}

            <div className={styles["search-input-box"]}>
                <h1>Add movie or show to profile</h1>
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
                {mediaData && mediaData.map((media, index) => {
                    const mediaImage = `https://image.tmdb.org/t/p/original${media.posterPath}`;

                    return(
                        <div
                        key={index}
                        className={styles["searchResultEntity"]}
                        onMouseEnter={() => {setCurrentMedia(media)}}
                        onMouseLeave={() => {setCurrentMedia(null)}}
                        >
                            <img src={mediaImage} style={{width: "300px", height: "450px"}}/><br/>
                            <h3>{media.name ? media.name : media.title}</h3>
                            {currentMedia === media && (
                                <button onClick={() => addMediaData()}>Add</button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
        </>
    )
}