import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    
    if (!apiKey) {
      console.warn("RAPIDAPI_KEY is not defined in environment variables");
      return NextResponse.json({ error: "API Key missing configuration" }, { status: 500 });
    }

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
       console.error("RapidAPI Error: ", response.status, response.statusText);
       return NextResponse.json({ error: "Failed to fetch jobs from provider" }, { status: response.status });
    }

    const data = await response.json();
    
    // jSearch wraps results in a `data` array object
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Job Search API Exception:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
