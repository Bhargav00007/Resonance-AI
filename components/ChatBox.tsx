"use client";
import { useState } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Resonance", // optional: can be dynamic
          task: "assist with creative and technical tasks",
          prompt: input,
          history: updatedMessages,
        }),
      });

      const data = await res.json();
      const aiMessage: Message = { sender: "ai", text: data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error talking to AI:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50 lg:mx-40">
      <div className="  mb-4 text-center">
        <div className="text-2xl font-bold">Resonance AI Chat</div>
        <p>
          (Still under development, works perfect locally...need money to deploy
          the .py backend server)
        </p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 lg:mt-10 mt-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-2xl text-sm max-w-[80%] break-words ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className=" text-black px-4 py-2  max-w-fit animate-pulse">
            <span className="dot-flash inline-block w-2 h-2 bg-black rounded-full mr-1 animate-bounce [animation-delay:-0.3s]" />
            <span className="dot-flash inline-block w-2 h-2 bg-black rounded-full mr-1 animate-bounce [animation-delay:-0.15s]" />
            <span className="dot-flash inline-block w-2 h-2 bg-black rounded-full animate-bounce" />
          </div>
        )}
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <input
          className="flex-1 border-2 border-black/30 text-black px-3 py-2 rounded-xl text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
