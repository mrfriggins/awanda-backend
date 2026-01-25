import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getMarketInsight =async ( symbol) => {
    const prompt = 'Analyze market trends for ${symbol} and give insights for traders.';
    const response = await
        client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
        });
        return
        response.choices[0].message.content;
};