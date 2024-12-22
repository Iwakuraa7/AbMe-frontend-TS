import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userInfoType from "../contexts/UserContext";

export type hobbyDataType = {
    id: number;
    title: string;
    imageUrl: string;
}

export default function useFetchUserData() {
    const params = useParams();
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [userColorOne, setUserColorOne] = useState<string>('#ff6347');
    const [userColorTwo, setUserColorTwo] = useState<string>('#ffd700');
    const [musicData, setMusicData] = useState<hobbyDataType[]>([]);
    const [booksData, setBooksData] = useState<hobbyDataType[]>([]);
    const [animeData, setAnimeData] = useState<hobbyDataType[]>([]);
    const [mangaData, setMangaData] = useState<hobbyDataType[]>([]);
    const [mediaData, setMediaData] = useState<hobbyDataType[]>([]);

    useEffect(() => {
        async function fetchHobbyData() {
                var response = await fetch(`http://54.86.55.158:8080/api/account/user-hobby-data/${params.username}`, {
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

    return {
        musicData, setMusicData,
        booksData, setBooksData,
        animeData, setAnimeData,
        mangaData, setMangaData,
        mediaData, setMediaData,
        userColorOne, setUserColorOne,
        userColorTwo, setUserColorTwo,
        isOwner
    }
}