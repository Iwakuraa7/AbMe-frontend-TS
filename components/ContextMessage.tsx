import styles from "../styles/SearchPage.module.css";

type ContextMessageProps = {
    message: string;
    fadeOut: boolean;
}

export default function ContextMessage({
    message,
    fadeOut
}: ContextMessageProps) {

    return(
        <div className={`${styles["context-msg-box"]} ${fadeOut ? styles["fade-out"] : ""}`}>
            {message}
        </div>
    )
}