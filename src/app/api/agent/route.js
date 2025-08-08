import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getWeather(city) {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
  );
  return {
    city: res.data.name,
    temp: res.data.main.temp,
    description: res.data.weather[0].description,
    windSpeed: res.data.wind.speed,
    humidity: res.data.main.humidity,
  };
}

async function getNews(topic) {
  const res = await axios.get(
    `https://newsapi.org/v2/everything?q=${topic}&apiKey=${process.env.NEWS_API_KEY}&pageSize=3`
  );
  return res.data.articles.map(a => ({
    title: a.title,
    url: a.url,
  }));
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an AI agent with ONLY two tools:

1. getWeather(city) → Get current weather.
2. getNews(topic) → Get latest news.

The user will send a message.  
You MUST decide which tool to use and return ONLY a valid JSON in this exact format:  
{"tool": "getWeather", "args": {"city": "London"}}  
OR  
{"tool": "getNews", "args": {"topic": "technology"}}  

Do NOT add explanations, notes, or extra words.  
User request: "${message}"
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.candidates[0].content.parts[0].text.trim();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ reply: "Sorry, I couldn't parse the tool response." }),
        { status: 200 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return new Response(
        JSON.stringify({ reply: "Sorry, I couldn't parse the tool response." }),
        { status: 200 }
      );
    }

    let output;

    if (parsed.tool === "getWeather" && parsed.args.city) {
      const weatherData = await getWeather(parsed.args.city);

      const weatherPrompt = `
Given this weather data:

City: ${weatherData.city}
Temperature: ${weatherData.temp}°C
Condition: ${weatherData.description}
Wind Speed: ${weatherData.windSpeed} m/s
Humidity: ${weatherData.humidity}%

Write a friendly and natural weather summary sentence for the user.
`;

      const weatherResponse = await model.generateContent(weatherPrompt);
      output = weatherResponse.response.candidates[0].content.parts[0].text.trim();

    } else if (parsed.tool === "getNews" && parsed.args.topic) {
      const articles = await getNews(parsed.args.topic);
      const articlesText = articles
        .map((a, i) => `${i + 1}. ${a.title} (Read more: ${a.url})`)
        .join("\n");

      const newsPrompt = `
You are a helpful assistant.

Here are the latest news articles on the topic:

${articlesText}

Summarize these news articles briefly and naturally for the user.
`;

      const newsResponse = await model.generateContent(newsPrompt);
      output = newsResponse.response.candidates[0].content.parts[0].text.trim();

    } else {
      output = "Sorry, I couldn't understand which tool to use.";
    }

    return new Response(JSON.stringify({ reply: output }), { status: 200 });

  } catch (err) {
    console.error("Error in /api/agent:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
