import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://chatapp-2pim.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("load_messages", (msgs) => setChat(msgs));
    socket.on("receive_message", (data) => setChat((prev) => [...prev, data]));
    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    const msgData = { user: username || "Anonymous", text: message };
    socket.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "40px auto",
      padding: 0,
      fontFamily: "Segoe UI, Arial, sans-serif",
      background: "#f7f7fa",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
    }}>
      <div style={{
        background: "#4f46e5",
        color: "#fff",
        padding: "18px 24px",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        textAlign: "center",
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: 1
      }}>
        💬 Chat App
      </div>
      <div style={{ padding: "16px 24px" }}>
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: 15
          }}
        />
        <div style={{
          border: "1px solid #e5e7eb",
          background: "#fff",
          padding: "12px",
          height: "260px",
          overflowY: "auto",
          marginBottom: 12,
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
        }}>
          {chat.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.user === username ? "flex-end" : "flex-start",
                marginBottom: 10
              }}
            >
              <span style={{
                background: msg.user === username ? "#6366f1" : "#e0e7ff",
                color: msg.user === username ? "#fff" : "#333",
                padding: "8px 14px",
                borderRadius: 18,
                maxWidth: "80%",
                wordBreak: "break-word",
                fontSize: 15,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
              }}>
                <b style={{ fontWeight: 500 }}>{msg.user}:</b> {msg.text}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 15
            }}
            onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0 18px",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;