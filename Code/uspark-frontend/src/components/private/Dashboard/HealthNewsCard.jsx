/**
 * @file HealthNewsCard Component
 *
 * @namespace src.components.private.Dashboard.HealthNewsCard
 * @memberof src.components.private.Dashboard
 *
 * This component fetches and displays health-related news articles from an external API.
 * Features include:
 * - Fetching the latest health news from NewsAPI.
 * - Displaying articles with images, titles, and descriptions.
 * - Auto-rotating articles every 10 seconds with a fade transition.
 * - "Read More" button linking to the full article.
 */


import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import "../../../css/News.css";

/**
 * HealthNewsCard Component
 *
 * @memberof src.components.private.Dashboard.HealthNewsCard
 *
 * @returns {JSX.Element} - The HealthNewsCard component that displays health-related news
 * with auto-rotation and external links to full articles.
 *
 * @example
 * <HealthNewsCard />
 */

const HealthNewsCard = () => {
  /**
   * State for storing fetched news articles.
   * @property {Array} articles - The list of health news articles.
   */
  const [articles, setArticles] = useState([]);

  /**
   * State for tracking the currently displayed article index.
   * @property {number} currentIndex - The index of the current article.
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * State for controlling the fade-out transition effect.
   * @property {boolean} fade - Determines if the fade animation is active.
   */
  const [fade, setFade] = useState(false);

  /**
   * Fetches health-related news articles from NewsAPI.
   */
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "health",
            apiKey: "a9453d8149494997999a0a3747ed64c3",
            pageSize: 100,
          },
        });
        setArticles(response.data.articles);
      } catch (error) {
        console.error("Error fetching news articles:", error);
      }
    };

    fetchArticles();

    /**
     * Sets up an interval to change the news article every 10 seconds.
     * The fade-out effect occurs before switching to the next article.
     */
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
        setFade(false);
      }, 500); // Matches the transition duration for a smooth effect
    }, 10000);

    return () => clearInterval(interval);
  }, [articles.length]);

  // If no articles are available, show a loading message.
  if (articles.length === 0) {
    return <Typography>Loading health news...</Typography>;
  }

  /**
   * The currently displayed article based on currentIndex.
   * @property {string} title - The title of the article.
   * @property {string} description - The description of the article.
   * @property {string} url - The URL link to the full article.
   * @property {string} urlToImage - The image URL associated with the article.
   */
  const currentArticle = articles[currentIndex];

  return (
    <div className="news-card-container">
      <Card className={`news-card ${fade ? "fade-out" : ""}`}>
        {currentArticle.urlToImage && (
          <CardMedia
            component="img"
            className="news-image"
            image={currentArticle.urlToImage}
            alt={currentArticle.title}
          />
        )}
        <CardContent className="news-content">
          <Typography className="news-title">{currentArticle.title}</Typography>
          <Typography className="news-description">
            {currentArticle.description || "No description available."}
          </Typography>
          <Button
            variant="contained"
            className="read-more-button"
            href={currentArticle.url}
            target="_blank"
          >
            Read More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthNewsCard;
