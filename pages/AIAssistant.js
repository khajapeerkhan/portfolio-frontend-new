"use client";
import { useState, useRef, useEffect } from "react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Dragging state
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const circleRef = useRef(null);

  // Place in bottom-right on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPosition({
        x: Math.max(16, window.innerWidth - 88),
        y: Math.max(16, window.innerHeight - 88),
      });
    }
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle drag
  const handleDoubleClick = () => setDragging(true);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const R = 36;
    const nextX = e.clientX - R;
    const nextY = e.clientY - R;

    const maxX = window.innerWidth - 72 - 8;
    const maxY = window.innerHeight - 72 - 8;
    const clampedX = Math.min(Math.max(8, nextX), maxX);
    const clampedY = Math.min(Math.max(8, nextY), maxY);

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Send chat
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, newMsg, { role: "ai", text: "typing..." }]);
    setInput("");

    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: newMsg.text }),
      });
      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          text: data.answer || "Sorry, I couldn’t understand.",
        };
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          text: "Error fetching response.",
        };
        return updated;
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      {/* Floating AI Button with Robot Icon */}
      <div
        ref={circleRef}
        onClick={() => setOpen((o) => !o)}
        onDoubleClick={handleDoubleClick}
        className={`fixed flex items-center justify-center rounded-full shadow-xl cursor-${
          dragging ? "grabbing" : "grab"
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: 72,
          height: 72,
          zIndex: 1000,
          background:
            "radial-gradient(120% 120% at 30% 30%, #60a5fa 0%, #2563eb 55%, #111827 110%)",
        }}
      >
        {/* Robot Icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          alt="robot"
          className="w-8 h-8 pointer-events-none"
        />

        {/* Live dot */}
        <span className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full shadow" />
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white shadow-2xl rounded-2xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold">🤖-Khajapeer Khan</span>
            <button
              onClick={() => setMessages([])}
              className="text-sm text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>

          {/* Chat body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full p-2 border rounded-lg outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
