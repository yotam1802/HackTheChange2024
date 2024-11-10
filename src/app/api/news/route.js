// app/api/news/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "conflict"; // Default to "conflict" if no query provided

  if (!NEWS_API_KEY) {
    return NextResponse.json({ error: "API key not found." }, { status: 500 });
  }

  try {
    // Fetch news articles based on the provided query parameter
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        sortBy: "publishedAt",
        language: "en",
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
  }
}
