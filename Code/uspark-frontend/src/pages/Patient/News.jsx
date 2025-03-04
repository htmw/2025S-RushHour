import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import "../../css/News.css";

const HealthNewsCard = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

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

    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
        setFade(false);
      }, 500); // Matches the transition duration for a smooth effect
    }, 10000); // Change article every 10 seconds

    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) {
    return <Typography>Loading health news...</Typography>;
  }

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
