import fetch  from "node-fetch";

export const fetchPrice = async (Symbol, type = "stock") => {
    try{
        let formatted = Symbol;
        if (type === "crypto") formatted = 'X:${Symbol}';
        if (type === "forex") formatted = 'C:${Symbol}';
        const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${formatted}/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`);
        const data = await res.json();
        return data.results[0].c || null; // closing price
        } catch (error) {
            console.error("Polygon error:", error);
            return null;
        }
    }