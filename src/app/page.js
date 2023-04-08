"use client";
import {useEffect, useState} from 'react';
import {useSearchParams} from "next/navigation";
import { Kanit } from "next/font/google";
import Image from "next/image";
import logo from "public/logo.jpg";
import Link from "next/link";
import axios from 'axios';
import {AnimatePresence, motion} from "framer-motion";
// import {Configuration, OpenAIApi} from "openai";

const kanit = Kanit({
    subsets: ["latin"],
    weight: ["400", "700", "800"]
});


export default function Page() {
    // const NEWS_API_KEY = process.env.NEWS_API_KEY;
    const searchParams = useSearchParams();
    const search = searchParams.get('search')
    const [query, setQuery] = useState(search ? search : '');
    const [factChecks, setFactChecks] = useState([]);
    const [articles, setArticles] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorFacts, setIsErrorFacts] = useState(false);
    const [isErrorNews, setIsErrorNews] = useState(false);

    // const OPENAI_API_KEY = "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"
    //
    // async function getResponse() {
    //     const options = {
    //         method: 'POST',
    //         headers: {
    //             "Authorization": `Bearer ${OPENAI_API_KEY}`,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             model: "text-davinci-003",
    //             messages: [{role: "user", content: "How are you"}],
    //             max_tokens: 64,
    //         })
    //     }
    //
    //     try {
    //         const response = await fetch("https://api.openai.com/v1/chat/completions", options)
    //         const data = await response.json()
    //         console.log(data)
    //
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const getArticles = async (query) => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&page=1&pagesize=10&language=en&apiKey=c727a28d08b84681a92931c904b93a02`
            );
            setArticles(response.data.articles);
        } catch (error) {
            setIsErrorNews(true);
        }
    };

    async function handleSearch() {
        setIsLoading(true)
        setIsErrorFacts(false)
        setIsErrorNews(false)
        try {
            const response = await fetch(`/api/factcheck?query=${encodeURIComponent(query)}`);
            const results = await response.json();
            setFactChecks(results);
        } catch (error) {
            setIsErrorFacts(true)
        }
        getArticles(query)
        setIsSearched(true)
        setIsLoading(false)
    }

    function clearButton() {
        setFactChecks([])
        setIsSearched(false)
        setQuery('')
    }

    useEffect(()=> {
        if (query) {
            handleSearch()
        } else {
            setFactChecks([])
        }

        const handleEscapeKeyPress = (event) => {
            if (event.key === "Escape") {
                setIsModalOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscapeKeyPress);
        return () => {
            document.removeEventListener("keydown", handleEscapeKeyPress);
        };

    }, [])

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <main className={`${kanit.className} relative w-full min-h-[100svh] flex flex-col justify-center items-center gap-10 py-16 px-10`}>

            {/*<button onClick={getResponse}>response</button>*/}
            <nav className={"bg-[#f1f1f1] w-full shadow-md fixed top-0 py-2 px-4 flex flex-row justify-between items-center z-10"}>
                <Link href={"/"}><Image className={"rounded-full w-auto h-10 border-2 border-[#121212]"} width={100} height={100} src={logo} alt={"Fake Or Not Logo"} /></Link>
                <div className={"flex flex-row gap-4"}>
                    <button onClick={() => setIsModalOpen(true)}>Motive</button>
                    <a target={"_blank"} href="https://github.com/BreakTos/Fake-News-Detection/">Download Extension</a>
                </div>
            </nav>

            <motion.div layout className={""}>
                <h1 className={"text-9xl text-[#121212]"}>News Verifier</h1>
            </motion.div>

            <motion.div layout className={"flex flex-row relative gap-2"}>
                <input required onKeyDown={handleKeyPress} autoFocus={true} placeholder={"Write Your Query Here..."} className={"px-5 border border-black rounded-lg min-w-[38vw] h-[5vh]"} type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className={" hover:bg-[#62C370] h-[5vh] px-5 right-0 border-2 border-gray-900 rounded-lg"} onClick={handleSearch}>Search</button>
                {isSearched && (
                    <button className={"h-[5vh] px-5 right-0 border-2 border-gray-900 rounded-lg hover:bg-red-400"} onClick={clearButton}>Clear</button>
                )}
            </motion.div>

            <div>{
                isLoading ?
                    <div className="flex justify-center items-center">
                        <div className="flex space-x-2">
                            <motion.div
                                className="h-4 w-4 bg-[#00FFFF] rounded-full"
                                animate={{ y: [-10, 0, -10] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <motion.div
                                className="h-4 w-4 bg-[#FF00FF] rounded-full"
                                animate={{ y: [-10, 0, -10] }}
                                transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                            />
                            <motion.div
                                className="h-4 w-4 bg-[#FFFF00] rounded-full"
                                animate={{ y: [-10, 0, -10] }}
                                transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
                            />
                            <motion.div
                                className="h-4 w-4 bg-black rounded-full"
                                animate={{ y: [-10, 0, -10] }}
                                transition={{ duration: 1, delay: 0.6, repeat: Infinity }}
                            />
                        </div>
                    </div> : null
            }</div>

            {isSearched &&
                // <div className={"flex flex-row min-w-[40vw] justify-between gap-10"}>
                //     <p>Related News: {factChecks.length}</p>
                //     <button onClick={clearButton}>Clear</button>
                // </div>
                <motion.div initial={{opacity: 0}} animate={{opacity:1}} className={"flex lg:flex-row flex-col gap-4"}>
                    <ul className={"flex flex-col gap-6 lg:w-2/3 h-fit"}>
                        <div className={"border-b text-lg"}>
                            <h2>Fact Checks</h2>
                        </div>
                        {isErrorFacts && <div>No Query found in our database :(</div>}
                        {/*{factChecks.length === 0 && <li>No results</li>}*/}
                        {factChecks.map((factCheck) => (
                            // eslint-disable-next-line react/jsx-key
                            <AnimatePresence>
                                <motion.li layoutId={factCheck.claimReview[0].url} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.5 }} className={"border border-black rounded-lg py-4 px-6 flex flex-row justify-between"} key={factCheck.claimReview[0].url}>
                                    <a target={"_blank"} className={"line-clamp-1 hover:text-[#62C370]"} href={factCheck.claimReview[0].url}>{factCheck.claimReview[0].title}</a>
                                    {factCheck.claimReview[0].textualRating === "True" ?
                                        <p className={"ml-10 text-green-500 line-clamp-1"}>{factCheck.claimReview[0].textualRating}</p> :
                                        <p className={"ml-10 text-red-500 line-clamp-1"}>{factCheck.claimReview[0].textualRating}</p>}
                                    {/*<p className={"ml-10"}>{factCheck.claimReview[0].textualRating}</p>*/}
                                </motion.li>
                            </AnimatePresence>
                        ))}
                    </ul>

                    {/*<button onClick={handleButtonClick}>Get Articles</button>*/}
                    <div className={"flex flex-col gap-6 lg:w-fit h-fit"}>
                        <div className={"border-b text-lg"}>
                            <h2>Relevant News</h2>
                        </div>
                        {isErrorNews && <div>No Query found in our database :(</div>}
                        {/*{articles.length === 0 && <li>No results</li>}*/}
                        {articles.map((article) => (
                            // eslint-disable-next-line react/jsx-key
                            <AnimatePresence>
                                <motion.div layoutId={article.url} className={"border border-black rounded-lg py-4 px-6 h-max"} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.5 }} >
                                    <a target={"_blank"} className={"hover:text-[#62C370]"} key={article.title} href={article.url}><h2>{article.title}</h2></a>
                                </motion.div>
                            </AnimatePresence>
                        ))}
                    </div>
                </motion.div>
            }

            <div>
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <div
                                className="bg-white rounded-lg overflow-hidden max-w-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-3 py-4">
                                    <p>
                                        The motive for creating a news verifier app is to address the growing problem of fake news and misinformation that is prevalent in today&amp;s society. With the rise of social media and the ease of sharing information, it has become increasingly difficult to discern what information is true and what is false.
                                    </p>
                                </div>
                                <div className="flex justify-end p-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-200 rounded-lg px-4 py-2 text-gray-800 hover:bg-gray-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </main>
    );
}