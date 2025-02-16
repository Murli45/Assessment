import React, { useState, useContext } from "react";
import classes from "./Dashboard.module.css";
import { AppContext } from "../store/AppContext";

const DEFAULT_IMAGE_URL =
  "https://mir-s3-cdn-cf.behance.net/project_modules/fs/aa8625109287767.5fd08439c7676.jpg";

export default function Dashboard() {
  const { articles, loading, error,searchTerm } = useContext(AppContext);
  // const { searchTerm } = useContext(SearchContext);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    author: "",
    startDate: "",
    endDate: "",
    type: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredArticles = articles.filter((article) => {
    const { author, startDate, endDate, type } = filters;
    const articleDate = new Date(article.publishedAt);

    const matchesSearchTerm = (field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      (!author ||
        article.author?.toLowerCase().includes(author.toLowerCase())) &&
      (!startDate || articleDate >= new Date(startDate)) &&
      (!endDate || articleDate <= new Date(endDate)) &&
      (!type ||
        article.source.name.toLowerCase().includes(type.toLowerCase())) &&
      (!searchTerm ||
        matchesSearchTerm(article.title) ||
        matchesSearchTerm(article.author) ||
        matchesSearchTerm(article.source.name) ||
        matchesSearchTerm(article.publishedAt))
    );
  });

  const handleResetFilters = () => {
    setFilters({
      author: "",
      startDate: "",
      endDate: "",
      type: "",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={classes.error}>Error: {error.message}</div>;
  }

  return (
    <div
      className={`${classes.container} ${darkMode ? classes["dark-mode"] : ""}`}
    >
      <div className={classes.headerRow}>
        <h2>Articles ({filteredArticles.length})</h2>
        <button
          onClick={toggleDarkMode}
          className={`${classes["toggle-button"]} ${
            darkMode ? classes["dark-mode"] : classes["light-mode"]
          }`}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
      <div className={classes.filters}>
        <input
          type="text"
          name="author"
          placeholder="Filter by author"
          value={filters.author}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="startDate"
          placeholder="Start date"
          value={filters.startDate}
          onChange={handleFilterChange}
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
        />
        <input
          type="text"
          name="endDate"
          placeholder="End date"
          value={filters.endDate}
          onChange={handleFilterChange}
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => (e.target.type = "text")}
        />
        <input
          type="text"
          name="type"
          placeholder="Filter by type"
          value={filters.type}
          onChange={handleFilterChange}
        />
        <button
          className={classes["reset-button"]}
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>
      <div className={classes.articles}>
        {filteredArticles.map((article, index) => (
          <div key={index} className={classes.card}>
            {
              <img
                src={article.urlToImage || DEFAULT_IMAGE_URL}
                alt={article.title}
                loading="lazy"
              />
            }
            <h3>{article.title}</h3>
            <p className={classes.author}>
              Author: {article.author || "Unknown"}
            </p>
            <p className={classes.date}>
              Date: {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <p className={classes.type}>Type: {article.source.name}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
