# News & Weather AI Agent

## Purpose of the Project
This project is an AI-powered web application that serves as an intelligent agent to provide real-time weather updates and the latest news based on user queries. Users can type questions or requests, and the AI decides whether to fetch weather data for a city or news on a specific topic, then returns a natural language summary.

## How Tool/Function Calling is Implemented
The AI agent uses a Google Gemini model to interpret the user's message and determine which external tool (API) to invoke:

- **Tools available:**
  - `getWeather(city)`: Retrieves current weather data from the OpenWeatherMap API.
  - `getNews(topic)`: Fetches recent news articles from the NewsAPI.

The AI model receives a prompt instructing it to return a JSON object specifying which tool to use and the relevant arguments. The backend parses this JSON, calls the corresponding function to fetch live data, then uses the AI model again to generate a natural, friendly summary of the results. This enables dynamic tool usage based on natural language input.

## Technologies Used
- **Frontend:** React with Next.js (React server components with client hooks)
- **Backend:** Next.js API routes (Node.js)
- **AI Model:** Google Gemini API via `@google/generative-ai` package
- **External APIs:**
  - [OpenWeatherMap API](https://openweathermap.org/api) for weather data
  - [NewsAPI](https://newsapi.org/) for news articles
- **HTTP Client:** Axios

## Instructions for Running the App

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
