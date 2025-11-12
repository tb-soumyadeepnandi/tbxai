import React, { useRef, useEffect, useState } from "react";
import logo from "../../assets/techbridge-logo.png";
import Input from "./Input";
import { imgAssets } from "../../assets";

const Assistant = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatData, setChatData] = useState([]);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatData]);

  const handleChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatData((prev) => [...prev, { text: chatInput, from: "user" }]);
    setChatInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleOnChange = (e) => setChatInput(e.target.value);
  const hasChats = chatData.length > 0;

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-linear-to-r from-blue-400 to-blue-600">
      {/* HEADER */}
      {hasChats && (
        <header className="sticky top-0 z-20 backdrop-blur-md bg-white/60 border-b border-white/30 shadow-sm flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-sky-400 blur-md opacity-40"></div>
              <img
                src={logo}
                alt="techbridge-ai-logo"
                className="h-9 w-9 object-contain relative z-10"
              />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                tbXMS Assistant
              </h2>
              <p className="text-xs text-gray-600 -mt-0.5">
                Your AI-powered companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="hidden sm:block">Online</span>
          </div>
        </header>
      )}

      {/* CHAT AREA */}
      {!hasChats ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 px-5 overflow-hidden">
          <img
            src={imgAssets.logo}
            alt="techbridge-ai-logo"
            className="h-20 w-20 object-contain opacity-90"
          />
          <div>
            <h1 className="text-xl font-semibold text-white">
              tbXMS Assistant
            </h1>
            <p className="text-white text-sm">
              Ask me anything to get started
            </p>
          </div>

          <div className="w-full max-w-md">
            <Input
              handleChange={handleOnChange}
              value={chatInput}
              handleSubmit={handleChat}
              inputRef={inputRef}
            />
          </div>
        </div>
      ) : (
        <>
          {/* SCROLLABLE CHAT */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 pt-5 pb-24 space-y-2"
          >
            {chatData.map((chat, index) => (
              <div
                key={index}
                className={`px-3 py-2 text-sm rounded-2xl max-w-[30%] leading-snug wrap-break-words ${
                  chat.from === "user"
                    ? "bg-sky-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {chat.text}
              </div>
            ))}
          </div>

          {/* FIXED INPUT */}
          <div className="absolute bottom-0 left-0 w-full bg-linear-to-r from-blue-600 to- blue-500 pt-4 pb-4 px-4">
            <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-full shadow-lg p-2">
              <Input
                handleChange={handleOnChange}
                value={chatInput}
                handleSubmit={handleChat}
                inputRef={inputRef}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Assistant;
