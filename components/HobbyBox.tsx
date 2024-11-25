import React from "react";
import styles from "../styles/UserPage.module.css"
import { hobbyDataType } from '../src/hooks/useFetchUserData';

type hobbyBoxPropsType = {
    setExpandedHobby: (expandedHobby: string) => void;
    hobbyName: string;
    hobbyData: hobbyDataType[];
}

export default function HobbyBox(props: hobbyBoxPropsType) {
    return(
        <div
        onClick={() => props.setExpandedHobby(props.hobbyName.toLocaleLowerCase())}
        className={props.hobbyName === 'Music' ? styles["userHobbyBox"] : `${styles["userHobbyBox"]} ${styles["bookImagesRes"]}`}
        >
            <div className={styles["userHobbyBoxImages"]}>
                {props.hobbyData && (
                    props.hobbyData.slice(0, props.hobbyName === 'Music' ? 4 : 8).map(media => (
                        <img key={media.id} src={media.imageUrl} alt={`${props.hobbyName} photo ${media.id + 1}`}/>
                    ))
                )}
            </div>
            <div className={styles["userHobbyBoxTitle"]}>
                <strong>{props.hobbyName}</strong>
            </div>
        </div>        
    )
}