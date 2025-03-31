"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Added CardFooter import
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Newspaper, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import Image from "next/image"; // Use Next.js Image for optimization

const NewsSection = ({ query }) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      setArticles([]); // Clear previous articles
      try {
        const response = await fetch(
          `/api/news?query=${encodeURIComponent(query)}&max=6`
        ); // Fetch 6 articles
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch news");
        }
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err.message || "Could not fetch news.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [query]); // Re-fetch when query changes

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <Card className="w-full">
      <CardHeader>
        {/* Enhanced Heading Style */}
        <CardTitle className="text-xl font-semibold pb-2 border-b flex items-center">
          <Newspaper className="mr-2 h-5 w-5" /> Recent News: "{query}"
        </CardTitle>
        <CardDescription>
          Latest news articles related to your query.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading news...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-6 text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" /> Error: {error}
          </div>
        )}
        {!isLoading && !error && articles.length === 0 && (
          <div className="py-6 text-center text-muted-foreground">
            No recent news articles found for "{query}".
          </div>
        )}
        {!isLoading && !error && articles.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {articles.map((article, index) => (
              <motion.div
                key={article.url || index}
                variants={itemVariants}
                custom={index}
              >
                <Card className="h-full flex flex-col overflow-hidden border hover:shadow-md transition-shadow">
                  {article.image && (
                    <div className="relative w-full h-40">
                      <Image
                        src={article.image}
                        alt={article.title || "News article image"}
                        layout="fill"
                        objectFit="cover"
                        unoptimized // Use if external images cause issues with Next.js optimizer
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base leading-snug">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors line-clamp-2"
                      >
                        {article.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground flex-grow line-clamp-3">
                    {article.description}
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 flex justify-between items-center">
                    <span>{article.source?.name}</span>
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
