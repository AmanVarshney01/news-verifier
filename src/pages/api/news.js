import axios from 'axios';

export default async (req, res) => {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;

    const { query } = req;
    const apiUrl = `https://newsapi.org/v2/everything?q=${query.query}&sortBy=popularity&page=1&pagesize=10&language=en&apiKey=${NEWS_API_KEY}`;

    try {
        const response = await axios.get(apiUrl);
        const news = response.data.articles;

        res.status(200).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch news from NewsAPI.',
        });
    }
};