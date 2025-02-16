import React, { createContext, useState, useEffect } from 'react';
import { saveArticles,getArticles } from '../utils/OfflineMode';
export const AppContext = createContext();

const API_KEY = "b6b80381f8584264887101e947e8d3aa";

export const AppProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
        ); // Replace with your News API key
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setArticles(data.articles);
        saveArticles(data.articles);
        setLoading(false);
      } catch (error) {
        setError(error);
        const offlineArticles = await getArticles();
        if (offlineArticles.length > 0) {
          setArticles(offlineArticles);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    };

    fetchArticles();
  }, []);

  return (
    <AppContext.Provider value={{ articles, loading, error, searchTerm, setSearchTerm }}>
      {children}
    </AppContext.Provider>
  );
};