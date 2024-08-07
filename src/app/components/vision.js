import React from 'react';
import { OpenAI } from 'openai';
import { useEffect, useState } from 'react';

export default function Vision() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const runModel = async () => {
      try {
        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1", 
          apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
          dangerouslyAllowBrowser: true, 
        });

        const response = await openai.chat.completions.create({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are a helpful llama assistant.",
            },
            {
              role: "user",
              content: "What is the fastest animal?",
            },
          ],
        });
    
        setResponse(response.choices[0].message.content);
      } catch (err) {
        console.error('Error running the model:', err);
        setError('Failed to get a response. Please try again later.');
      }
    };

    runModel();
  }, []);

  return (
    <div>
      <h1>OpenAI Vision</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : response ? (
        <p>{response}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}