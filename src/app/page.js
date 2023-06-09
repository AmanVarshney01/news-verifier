"use client";
import {useEffect, useState} from 'react';
import {useSearchParams} from "next/navigation";
import { Kanit } from "next/font/google";
import Image from "next/image";
import logo from "public/logo.jpg";
import Link from "next/link";
import {AnimatePresence, motion} from "framer-motion";

const kanit = Kanit({
    subsets: ["latin"],
    weight: ["400", "700", "800"]
});


export default function Page() {
    const searchParams = useSearchParams();
    const search = searchParams.get('search')
    const [query, setQuery] = useState(search ? search : '');
    const [factChecks, setFactChecks] = useState([]);
    const [articles, setArticles] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorFacts, setIsErrorFacts] = useState(false);
    const [isErrorNews, setIsErrorNews] = useState(false);


    async function getLatestNews() {
        setIsSearched(false)
        setIsLoading(true)
        const result = await fetch(`/api/latestNews`);
        const data = await result.json();
        setLatestNews(data);
        setIsLoading(false)
    }

    async function handleSearch() {
        setIsLoading(true)
        setIsErrorFacts(false)
        setIsErrorNews(false)
        if (query === '') {
            setIsErrorFacts(true)
        } else {
            try {
                const response = await fetch(`/api/factcheck?query=${encodeURIComponent(query)}`);
                const results = await response.json();
                setFactChecks(results);
            } catch (error) {
                setIsErrorFacts(true)
            }
        }

        if (query === '') {
            setIsErrorNews(true)
        } else {
            try {
                const result = await fetch(`/api/news?query=${query}`);
                const data = await result.json();

                setArticles(data);
            } catch (error) {
                setIsErrorNews(true)
            }
        }

        setIsSearched(true)
        setIsLoading(false)
        setLatestNews([])
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

    function clearButton() {
        setFactChecks([])
        setIsSearched(false)
        setQuery('')
        setLatestNews([])
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <main className={`${kanit.className} relative w-full min-h-[100svh] flex flex-col justify-center items-center lg:gap-10 gap-6 lg:py-16 lg:px-10 px-5 py-8`}>

            {/*<button onClick={getResponse}>response</button>*/}
            <nav className={"bg-[#f1f1f1] w-full shadow-md fixed top-0 py-2 px-4 flex flex-row justify-between items-center z-10"}>
                <motion.div whileHover={{rotateZ: 20}} whileTap={{rotateZ: 200}}><Link href={"/"}><Image className={"rounded-full w-auto lg:h-10 h-8 border-2 border-[#121212]"} width={100} height={100} src={logo} alt={"News Verifier Logo"} /></Link></motion.div>
                <div className={"flex flex-row lg:gap-4 gap-2 text-sm lg:text-lg"}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={getLatestNews}>Latest News</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)}>Motive</motion.button>
                    <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} target={"_blank"} href="https://github.com/BreakTos/Fake-News-Detection/">Download Extension</motion.a>
                </div>
            </nav>


            <motion.div layout className={"lg:my-0 my-4"}>
                <h1 className={"lg:text-9xl text-8xl text-[#121212]"}>News Verifier</h1>
            </motion.div>

            <motion.div layout className={"flex lg:flex-row flex-col relative gap-2"}>
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

            {latestNews.length > 0 && (
                <div className={"flex flex-col gap-6 lg:w-fit h-fit"}>
                    <div className={"border-b text-lg flex flex-row justify-between"}>
                        <h2>Latest News</h2>
                        <p>{latestNews.length} Results Found</p>
                    </div>
                    {latestNews.map((article) => (
                        // eslint-disable-next-line react/jsx-key
                        <AnimatePresence>
                            <motion.div layoutId={article.url} className={"border border-black rounded-lg py-4 px-6 h-max"} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.5 }} >
                                <a target={"_blank"} className={"hover:text-[#62C370]"} key={article.title} href={article.url}><h2>{article.title}</h2></a>
                            </motion.div>
                        </AnimatePresence>
                    ))}
                </div>
            )}

            {isSearched &&
                // <div className={"flex flex-row min-w-[40vw] justify-between gap-10"}>
                //     <p>Related News: {factChecks.length}</p>
                //     <button onClick={clearButton}>Clear</button>
                // </div>
                <motion.div initial={{opacity: 0}} animate={{opacity:1}} className={"flex lg:flex-row flex-col gap-4"}>
                    <ul className={"flex flex-col gap-6 lg:w-2/3 w-full h-fit"}>
                        <div className={"border-b text-lg flex flex-row justify-between"}>
                            <h2>Fact Checks</h2>
                            <p>{factChecks.length} Results Found</p>
                        </div>
                        {isErrorFacts && <div>No Results found in our database :(</div>}
                        {/*{factChecks.length === 0 && <li>No results</li>}*/}
                        {factChecks.map((factCheck) => (
                            // eslint-disable-next-line react/jsx-key
                            <AnimatePresence>
                                <motion.li layoutId={factCheck.claimReview[0].url} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.5 }} className={"border border-black rounded-lg lg:py-4 lg:px-6 px-3 py-2 flex flex-row justify-between"} key={factCheck.claimReview[0].url}>
                                    <a target={"_blank"} className={" hover:text-[#62C370]"} href={factCheck.claimReview[0].url}>{factCheck.claimReview[0].title}</a>
                                    {factCheck.claimReview[0].textualRating === "True" ?
                                        <p className={"ml-10 text-green-500"}>{factCheck.claimReview[0].textualRating}</p> :
                                        <p className={"ml-10 text-red-500"}>{factCheck.claimReview[0].textualRating}</p>}
                                    {/*<p className={"ml-10"}>{factCheck.claimReview[0].textualRating}</p>*/}
                                </motion.li>
                            </AnimatePresence>
                        ))}
                    </ul>

                    {/*<button onClick={handleButtonClick}>Get Articles</button>*/}
                    <div className={"flex flex-col gap-6 lg:w-fit h-fit"}>
                        <div className={"border-b text-lg flex flex-row justify-between"}>
                            <h2>Relevant News</h2>
                            <p>{articles.length} Results Found</p>
                        </div>
                        {isErrorNews && <div>No Results found in our database :(</div>}
                        {/*{articles.length === 0 && <li>No results</li>}*/}

                        {articles.length > 0 && articles.map((article) => (
                            // eslint-disable-next-line react/jsx-key
                            <AnimatePresence>
                                <motion.div layoutId={article.url} className={"border border-black rounded-lg lg:py-4 lg:px-6 px-3 py-2 h-max"} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.5 }} >
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
                                <div className="p-4 text-lg flex flex-col gap-4">
                                    <p>
                                        The motive for creating a news verifier app is to address the growing problem of fake news and misinformation that is prevalent in today&apos;s society. With the rise of social media and the ease of sharing information, it has become increasingly difficult to discern what information is true and what is false.
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