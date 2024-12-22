import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import styles from "../styles/UserPage.module.css"
import mainPageStyles from "../styles/MainPage.module.css"
import NavBar from "../components/NavBar";
import { UserContext } from "../src/contexts/UserContext";
import ContextMessage from "../components/ContextMessage";
import useFetchUserData, { hobbyDataType } from "../src/hooks/useFetchUserData";
import HobbyBox from "../components/HobbyBox";
import React from "react";

type randomDimension = {
    width: number;
    height: number;
}

export default function UserPage() {
    const {contextMsg, fadeOut, showMessage} = useContext(UserContext);
    const { musicData, setMusicData, booksData, setBooksData, animeData,
            setAnimeData, mangaData, setMangaData, mediaData, setMediaData,
            userColorOne, setUserColorOne, userColorTwo, setUserColorTwo, isOwner } = useFetchUserData();
    const [isColorSettings, setIsColorSettings] = useState<boolean>(false);
    const [randomDimensions, setRandomDimensions] = useState<randomDimension[]>([]);
    const [expandedHobby, setExpandedHobby] = useState<string | null>(null);
    const [dataToDelete, setDataToDelete] = useState<number | null>(null);
    const params = useParams();

    async function deleteRelevantData(dataId: number) {
        try
        {
            var response = await fetch(`http://54.86.55.158:8080/api/${expandedHobby}/delete/${dataId}`, {
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
                        break;
                    case 'literature':
                        setBooksData((prevData) => prevData.filter(b => b.id !== dataId));
                        break;
                    case 'anime':
                        setAnimeData((prevData) => prevData.filter(a => a.id !== dataId));
                        break;
                    case 'manga':
                        setMangaData((prevData) => prevData.filter(m => m.id !== dataId));
                        break;
                    case 'media':
                        setMediaData((prevData) => prevData.filter(m => m.id != dataId));
                        break;
                    default:
                        break;
                }
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }

    async function handleUserColorUpdate() {
        var response = await fetch("http://54.86.55.158:8080/api/user-color/update", {
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

    useEffect(() => {
        function createRandomDimensions() {
            const dimensions: randomDimension[] = [];

            var relevantData = findRelevantData();

            if(relevantData === null)
                return;

            relevantData.forEach(data => {
                const randomWidth = expandedHobby === 'literature' ? Math.floor(Math.random() * 100 + 100) : Math.floor(Math.random() * 100 + 200);
                const randomHeight = expandedHobby === 'music' ? randomWidth : randomWidth * 1.5;
                dimensions[data.id] = { width: randomWidth, height: randomHeight };
            });
            setRandomDimensions(dimensions);
        }

        if(expandedHobby !== null)
            createRandomDimensions();
    }, [expandedHobby])

    function findRelevantData() {
        var data: hobbyDataType[] | null;
        switch(expandedHobby)
        {
            case 'music':
                data = musicData;
                break;
            case 'literature':
                data = booksData;
                break;
            case 'anime':
                data = animeData;
                break;
            case 'manga':
                data = mangaData;
                break;
            case 'media':
                data = mediaData;
                break;
            default:
                data = null;
                break;
        }
        
        return data;
    }

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
                                margin: randomDimensions[data.id]?.width - (expandedHobby === 'literature' ? 100 : 200),
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
            <HobbyBox setExpandedHobby={setExpandedHobby} hobbyName="Music" hobbyData={musicData}/>

            <HobbyBox setExpandedHobby={setExpandedHobby} hobbyName="Literature" hobbyData={booksData}/>

            <HobbyBox setExpandedHobby={setExpandedHobby} hobbyName="Anime" hobbyData={animeData}/>

            <HobbyBox setExpandedHobby={setExpandedHobby} hobbyName="Manga" hobbyData={mangaData}/>

            <HobbyBox setExpandedHobby={setExpandedHobby} hobbyName="Media" hobbyData={mediaData}/>
        </div>

        </div>
        </>
        )}
        </>
    )
}