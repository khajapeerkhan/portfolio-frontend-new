// pages/api/ai-agent.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    const pyRes = await fetch("https://portfolio-backend-64l0.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: query }),
    });

    if (!pyRes.ok) {
      const text = await pyRes.text();
      console.error("Python server response:", text);
      return res.status(500).json({ error: "Python server error" });
    }

    const data = await pyRes.json();
    return res.status(200).json({ answer: data.answer });

  } catch (error) {
    console.error("AI Agent Error:", error);
    return res.status(500).json({ error: "AI Agent failed." });
  }
}
