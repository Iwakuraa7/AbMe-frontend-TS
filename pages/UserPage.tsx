import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import {jwtDecode } from "jwt-decode";
import styles from "../styles/UserPage.module.css"
import mainPageStyles from "../styles/MainPage.module.css"
import NavBar from "../components/NavBar";
import { UserContext } from "../src/contexts/UserContext";
import ContextMessage from "../components/ContextMessage";
import userInfoType from "../src/contexts/UserContext";

type hobbyDataType = {
    id: number;
    title: string;
    imageUrl: string;
}

type randomDimension = {
    width: number;
    height: number;
}

export default function UserPage() {
    const {contextMsg, fadeOut, showMessage} = useContext(UserContext);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isColorSettings, setIsColorSettings] = useState<boolean>(false);
    const [userColorOne, setUserColorOne] = useState<string>('#ff6347');
    const [userColorTwo, setUserColorTwo] = useState<string>('#ffd700');
    const [musicData, setMusicData] = useState<hobbyDataType[]>([]);
    const [booksData, setBooksData] = useState<hobbyDataType[]>([]);
    const [animeData, setAnimeData] = useState<hobbyDataType[]>([]);
    const [mangaData, setMangaData] = useState<hobbyDataType[]>([]);
    const [mediaData, setMediaData] = useState<hobbyDataType[]>([]);
    const [randomDimensions, setRandomDimensions] = useState<randomDimension[]>([]);
    const [expandedHobby, setExpandedHobby] = useState<string | null>(null);
    const [dataToDelete, setDataToDelete] = useState<number | null>(null);
    const params = useParams();

    useEffect(() => {
        async function fetchHobbyData() {
                var response = await fetch(`http://localhost:5078/api/account/user-hobby-data/${params.username}`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem('token'),
                        "Content-Type": "application/json",
                    }
                })

                var data = await response.json();

                if(data.succeeded) {
                    setMusicData(data.musicData);
                    setBooksData(data.booksData);
                    setAnimeData(data.animeData);
                    setMangaData(data.mangaData);
                    setMediaData(data.mediaData);
                    setUserColorOne(data.userColors.firstColor);
                    setUserColorTwo(data.userColors.secondColor);
                    console.log(data);
                }

                else
                    console.error(data.message);
        }

        function checkOwnership() {
            var token = localStorage.getItem('token');

            if(token === null)
                return;

            var userInfo: userInfoType = jwtDecode(token);

            if(userInfo.given_name === params.username)
                setIsOwner(true);

            else
                setIsOwner(false);
        }

        fetchHobbyData();
        checkOwnership();
    }, [params.username])

    async function deleteRelevantData(dataId: number) {
        try
        {
            var response = await fetch(`http://localhost:5078/api/${expandedHobby}/delete/${dataId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }                
            })

            var data = await response.json();

            showMessage(data.message);

            if(data.succeeded)
            {
                switch(expandedHobby)
                {
                    case 'music':
                        setMusicData((prevData) => prevData.filter(m => m.id !== dataId));
                    case 'book':
                        setBooksData((prevData) => prevData.filter(b => b.id !== dataId));
                    case 'anime':
                        setAnimeData((prevData) => prevData.filter(a => a.id !== dataId));
                    case 'manga':
                        setMangaData((prevData) => prevData.filter(m => m.id !== dataId));
                    case 'movie':
                        setMediaData((prevData) => prevData.filter(m => m.id != dataId));
                    default:
                        return;
                }
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }

    async function handleUserColorUpdate() {
        var response = await fetch("http://localhost:5078/api/user-color/update", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                FirstColor: userColorOne,
                SecondColor: userColorTwo
            })
        })

        var data = await response.json();

        showMessage(data.message);
    }

    function findRelevantData() {
        switch(expandedHobby)
        {
            case 'music':
                return musicData;
            case 'book':
                return booksData;
            case 'anime':
                return animeData;
            case 'manga':
                return mangaData;
            case 'movie':
                return mediaData;
            default:
                return null;
        }        
    }

    useEffect(() => {
        function createRandomDimensions() {
            const dimensions: randomDimension[] = [];

            var relevantData = findRelevantData();

            if(relevantData === null)
                return;

            relevantData.forEach(data => {
                const randomWidth = expandedHobby === 'book' ? Math.floor(Math.random() * 100 + 100) : Math.floor(Math.random() * 100 + 200);
                const randomHeight = expandedHobby === 'music' ? randomWidth : randomWidth * 1.5;
                dimensions[data.id] = { width: randomWidth, height: randomHeight };
            });
            setRandomDimensions(dimensions);
        }

        if(expandedHobby !== null)
            createRandomDimensions();
    }, [expandedHobby])

    const renderRelevantContent = () => {
        var relevantData = findRelevantData();

        if(relevantData === null)
            return;
    
        return (
            <div>
                {contextMsg && (<ContextMessage message={contextMsg} fadeOut={fadeOut}/>)}

                <div className={styles["center-upper-elements"]}>
                    <h2>{params.username}'s {expandedHobby} taste</h2>
                    <button className={mainPageStyles["button-style"]} onClick={() => setExpandedHobby(null)}>Back</button>
                </div>

                <div className={styles["random-box"]}>
                    {relevantData.map(data => (
                        <div
                            key={data.id}
                            style={{
                                maxWidth: randomDimensions[data.id]?.width,
                                maxHeight: randomDimensions[data.id]?.height,
                                margin: randomDimensions[data.id]?.width - (expandedHobby === 'book' ? 100 : 200),
                            }}
                            className={styles["expanded-hobby-entity-box"]}
                            onMouseEnter={() => setDataToDelete(data.id)}
                            onMouseLeave={() => setDataToDelete(null)}
                        >
                            <img className={styles["hobby-image"]} src={data.imageUrl} alt={`Data photo ${data.id + 1}`} />
                            <h2 style={{ textAlign: "center", fontSize: "1rem", margin: "5px 0" }}>{data.title}</h2>
                            {isOwner && dataToDelete && (
                                <button
                                style={{display: dataToDelete === data.id ? "block" : "none"}}
                                onClick={() => deleteRelevantData(dataToDelete)}
                                className={styles["button-style"]}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
        <NavBar/>
        {expandedHobby !== null
        ?
        <>
        {renderRelevantContent()}
        </>
        :
        (
        <>
        <div className={styles["user-page-main-box"]}>

        {contextMsg && (<ContextMessage message={contextMsg} fadeOut={fadeOut}/>)}

        <div className={styles["center-upper-elements"]}>
            <div
            className={mainPageStyles["morphing-shape"]}
            style={{
                background: `radial-gradient(circle at 50% 50%, ${userColorOne}, ${userColorTwo})`,
                boxShadow: `0 0 0px ${userColorOne}, 0 0 40px ${userColorTwo}, 0 0 100px ${userColorOne}`
            }}
            >
                {params.username}
                {isOwner && (
                    <>
                    <img
                    className={styles["settings-image"]}
                    src="https://i.imgur.com/7zR6056.png"
                    onClick={() => setIsColorSettings(!isColorSettings)}
                    />
                    <div className={styles["color-settings-box"]} style={{display: isColorSettings ? "flex" : "none"}}>
                        Color settings
                        <div className={styles["color-input-box"]}>
                            <input className={styles["color-picker"]} type="color" onChange={(e) => {setUserColorOne(e.target.value)}}/>
                            <input className={styles["color-picker"]} type="color" onChange={(e) => {setUserColorTwo(e.target.value)}}/>
                        </div>
                        <button onClick={() => handleUserColorUpdate()}>Save</button>
                    </div>
                    </>
                )}                
            </div>
        </div>
        
        <div className={styles["user-hobby-main-box"]}>
            <div onClick={() => setExpandedHobby('music')} className={styles["userHobbyBox"]}>
                <div className={styles["userHobbyBoxImages"]}>
                    {musicData && (
                        musicData.slice(0, 4).map(music => (
                            <img key={music.id} src={music.imageUrl} alt={`Music photo ${music.id + 1}`}/>
                        ))
                    )}
                </div>
                <div className={styles["userHobbyBoxTitle"]}>
                    <strong>Music</strong>
                </div>
            </div>

            <div onClick={() => setExpandedHobby('book')} className={`${styles["userHobbyBox"]} ${styles["bookImagesRes"]}`}>
                <div className={styles["userHobbyBoxImages"]}>
                    {booksData && (
                        booksData.slice(0, 8).map(book => (
                            <img key={book.id} src={book.imageUrl} alt={`Book photo ${book.id + 1}`}/>
                        ))
                    )}
                </div>
                <div className={styles["userHobbyBoxTitle"]}>
                    <strong>Literature</strong>
                </div>
            </div>

            <div onClick={() => setExpandedHobby('anime')} className={`${styles["userHobbyBox"]} ${styles["bookImagesRes"]}`}>
                <div className={styles["userHobbyBoxImages"]}>
                    {animeData && (
                        animeData.slice(0, 8).map(anime => (
                            <img key={anime.id} src={anime.imageUrl} alt={`Anime photo ${anime.id + 1}`}/>
                        ))
                    )}
                </div>
                <div className={styles["userHobbyBoxTitle"]}>
                    <strong>Anime</strong>
                </div>
            </div>

            <div onClick={() => setExpandedHobby('manga')} className={`${styles["userHobbyBox"]} ${styles["bookImagesRes"]}`}>
                <div className={styles["userHobbyBoxImages"]}>
                    {mangaData && (
                        mangaData.slice(0, 8).map(manga => (
                            <img key={manga.id} src={manga.imageUrl} alt={`Manga photo ${manga.id + 1}`}/>
                        ))
                    )}
                </div>
                <div className={styles["userHobbyBoxTitle"]}>
                    <strong>Manga</strong>
                </div>
            </div>

            <div onClick={() => setExpandedHobby('movie')} className={`${styles["userHobbyBox"]} ${styles["bookImagesRes"]}`}>
                <div className={styles["userHobbyBoxImages"]}>
                    {mediaData && (
                        mediaData.slice(0, 8).map(media => (
                            <img key={media.id} src={media.imageUrl} alt={`Media photo ${media.id + 1}`}/>
                        ))
                    )}
                </div>
                <div className={styles["userHobbyBoxTitle"]}>
                    <strong>Media</strong>
                </div>
            </div>
        </div>

        </div>
        </>
        )}
        </>
    )
}