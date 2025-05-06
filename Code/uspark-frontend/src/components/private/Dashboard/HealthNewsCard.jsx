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
  CircularProgress,
  Paper,
  Box,
  useTheme,
  Container,
} from "@mui/material";
import axios from "axios";
import config from "../../../../config";
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
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const theme = useTheme();

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
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const currentArticle = articles[currentIndex];
  const BASE = config?.BASE;
  console.log("BASE", BASE);
  if (BASE === "STAGE") {
    return null;
  }
  return (
    <Container
      component={Paper}
      elevation={3}
      sx={{ p: 3, maxWidth: 900, mt: 5 }}
    >
      <Typography variant="h5" gutterBottom>
        Latest in Health News
      </Typography>

      <Card
        sx={{
          mt: 2,
          height: 500,
          transition: "opacity 0.5s ease-in-out, transform 0.3s ease",
          opacity: fade ? 0 : 1,
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
          // boxShadow: theme.shadows[4],
        }}
      >
        {currentArticle.urlToImage && (
          <CardMedia
            component="img"
            image={currentArticle.urlToImage}
            alt={currentArticle.title}
            sx={{
              height: 200,
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />
        )}
        <CardContent
          sx={{
            height: "calc(100% - 200px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              mb: 1,
              transition: "color 0.3s ease",
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {currentArticle.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              flexGrow: 1,
            }}
          >
            {currentArticle.description || "No description available."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={currentArticle.url}
            target="_blank"
            sx={{
              alignSelf: "flex-start",
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Read More
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HealthNewsCard;
