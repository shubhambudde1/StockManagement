// src/App.jsx
import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this with your actual API URL
  const api_base = import.meta.env.VITE_API_BASE_URL; // Vite env
  const API_URL = `${api_base}/api/stocks/news`;

  useEffect(() => {
    // 1️⃣ Load cached news from localStorage
    const cachedNews = localStorage.getItem("newsArticles");
    if (cachedNews) {
      setArticles(JSON.parse(cachedNews));
      setLoading(false); // show cached news immediately
    }

    // 2️⃣ Fetch latest news from backend
    const fetchNews = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const normalizedData = Array.isArray(data) ? data : [data];

        // Update state & localStorage
        setArticles(normalizedData);
        localStorage.setItem("newsArticles", JSON.stringify(normalizedData));
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading && articles.length === 0)
    return <p className="p-4">Loading news...</p>;

  return (
    <div className="">
      {articles.length === 0 ? (
        <p>No news available.</p>
      ) : (
        articles.map((article, idx) => <NewsCard key={idx} article={article} />)
      )}
    </div>
  );
}

export default News;
