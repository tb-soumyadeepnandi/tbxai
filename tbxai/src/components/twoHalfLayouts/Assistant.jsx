import React, { useRef } from "react";
import logo from "../../assets/techbridge-logo.png";
import Input from "./Input";
import { imgAssets } from "../../assets";

const Assistant = () => {
  const [chatInput, setChatInput] = React.useState("");
  const [chatData, setChatData] = React.useState([]);
  const inputRef = useRef(null);

  // Auto-focus on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle chat submit
  const handleChat = (e) => {
    e.preventDefault();
    if(!e.target.value) return; 
    if (!chatInput.trim()) return;

    setChatData((prev) => [...prev, { text: chatInput, from: "user" }]);
    setChatInput("");

    // Ensure focus is returned after rerender
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleOnChange = (e) => setChatInput(e.target.value);
  const hasChats = chatData.length > 0;

  return (
    <div className="relative flex flex-col h-screen bg-linear-to-r from-blue-400 to-blue-600">
      {/* Header visible only when chats exist */}
      {hasChats && (
        <header className="sticky top-0 bg-white z-10 border-b border-gray-200 flex items-center gap-3 px-5 py-3 shadow-sm">
          <img
            src={logo}
            alt="techbridge-ai-logo"
            className="h-8 w-8 object-contain"
          />
          <h2 className="font-semibold text-gray-800 text-lg">
            TechBridge Assistant
          </h2>
        </header>
      )}

      {/* Chat area */}
      {!hasChats ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 px-5">
          <img
            src={imgAssets.logo}
            alt="techbridge-ai-logo"
            className="h-20 w-20 object-contain opacity-90"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              TechBridge Assistant
            </h1>
            <p className="text-gray-500 text-sm">
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
          <div className="flex-1 overflow-y-auto p-5 pb-28 space-y-1">
            {chatData.map((chat, index) => (
              <div
                key={index}
                className={`px-3 py-2 text-sm rounded-2xl max-w-[30%] mb-1 wrap-break-words whitespace-pre-wrap break-all overflow-hidden leading-snug ${
                  chat.from === "user"
                    ? "bg-sky-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {chat.text}{" "}
              </div>
            ))}
          </div>

          {/* Floating Input */}
          <div className="absolute bottom-4 left-0 w-full flex justify-center px-4">
            <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-full shadow-lg p-2">
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
