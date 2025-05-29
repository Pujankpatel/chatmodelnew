import React, { useState } from "react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const handleSend = async () => {
    if (!message) return;

    const userEntry = { sender: "user", text: message };
    setChatLog((prev) => [...prev, userEntry]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();

      const botEntry = { sender: "bot", text: data.response || data.error };
      setChatLog((prev) => [...prev, botEntry]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Chat with Gemini</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300 }}>
        {chatLog.map((entry, index) => (
          <div key={index} style={{ margin: "5px 0", textAlign: entry.sender === "user" ? "right" : "left" }}>
            <strong>{entry.sender === "user" ? "You" : "Gemini"}:</strong> {entry.text}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ width: "80%", padding: 10, marginTop: 10 }}
        placeholder="Type your message..."
      />
      <button onClick={handleSend} style={{ padding: 10, marginLeft: 10 }}>Send</button>
    </div>
  );
};

export default Chat;
