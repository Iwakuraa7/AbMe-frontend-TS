import { useContext, useState } from "react"
import styles from "../styles/SearchPage.module.css"
import NavBar from "../components/NavBar";
import { UserContext } from "../src/contexts/UserContext.jsx";
import ContextMessage from "../components/ContextMessage.jsx";

export interface bookDataType {
    title: string,
    imageUrl: string,
    author: string
}

export default function SearchBookPage() {
    const {API_KEY, contextMsg, fadeOut, showMessage} = useContext(UserContext);
    const notFoundImage = 'https://i.imgur.com/soXyjFr.jpeg';
    const [searchInput, setSearchInput] = useState<string>('');
    const [booksData, setBooksData] = useState<bookDataType[]>([]);
    const [currentBookData, setCurrentBookData] = useState<bookDataType | null>(null);

    async function handleSearch() {
        var response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=${API_KEY}`);
        var data = await response.json();

        if(data.items) {
            var filteredData = data.items.map(book => ({
                title: book.volumeInfo.title,
                imageUrl: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : notFoundImage,
                author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : "No author"
            }))

            setBooksData(filteredData);
            console.log(data.items);
        }
        else {
            console.error("sth went wrong during GET request...");
        }
    }

    async function addBookData(book: bookDataType) {
        try
        {
            var response = await fetch("http://54.86.55.158:8080/api/literature/create", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Title: book.title,
                    Author: book.author,
                    ImageUrl: book.imageUrl
                })
            })
        
            var data = await response.json();
        
            showMessage(data.message);
        }
        catch(err)
        {
            console.error(err);
        }
    }

    return (
        <>
        <NavBar/>
        <div className={styles["search-main-box"]}>
            {contextMsg && (<ContextMessage message={contextMsg} fadeOut={fadeOut}/>)}

            <div className={styles["search-input-box"]}>
                <h1>Add book to profile</h1>
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
                {booksData && booksData.map((book, index) => {
                    return(
                        <div
                        key={index}
                        className={styles["searchResultEntity"]}
                        onMouseEnter={() => {setCurrentBookData(book)}}
                        onMouseLeave={() => {setCurrentBookData(null)}}
                        >
                            <img src={book.imageUrl}></img><br/>
                            <h3>{book.title}</h3>
                            {currentBookData === book && (
                                <button onClick={() => addBookData(currentBookData)}>Add</button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
        </>
    )
}