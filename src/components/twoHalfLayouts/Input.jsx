import React, { useRef, useState, useEffect } from "react";
import { imgAssets } from "../../assets";
import toast, { Toaster } from "react-hot-toast";

const Input = ({ handleChange, value, handleSubmit, inputRef }) => {
  const [listening, setListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const transcriptRef = useRef("");

  // Initialize Speech Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Speech Recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setListening(true);
      toast("🎤 Listening...");
      transcriptRef.current = "";
    };

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      transcriptRef.current = currentTranscript;
      handleChange({ target: { value: currentTranscript } });
    };

    recognition.onerror = (e) => {
      toast.error(`❌ ${e.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    setRecognitionInstance(recognition);
  }, [handleChange]);

  // Mic toggle logic
  const handleVoiceToggle = () => {
    if (!recognitionInstance) {
      toast.error("Speech Recognition not initialized");
      return;
    }

    if (listening) {
      recognitionInstance.stop();
      toast("🧠 Processing...");
      setListening(false);
      if (transcriptRef.current.trim()) {
        handleSubmit({
          preventDefault: () => {},
          target: { value: transcriptRef.current },
        });
      }
    } else {
      transcriptRef.current = "";
      recognitionInstance.start();
    }
  };

  // Keyboard handling (Shift+Enter = newline, Enter = submit)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea height like ChatGPT
  useEffect(() => {
    const el = inputRef?.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px"; // cap height
    }
  }, [value]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    handleSubmit(e);
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex items-end bg-white border border-gray-300 rounded-2xl w-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-400 transition"
      style={{ minHeight: "50px" }}
    >
      <Toaster position="top-center" />

      {/* ChatGPT-style Textarea */}
      <textarea
        ref={inputRef}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        placeholder="Speak or Type a message..."
        className="flex-1 bg-transparent outline-none border-none text-gray-800 placeholder-gray-400 resize-none overflow-y-auto leading-snug max-h-[200px]"
        style={{
          paddingRight: "0.5rem",
          paddingTop: "0.4rem",
          paddingBottom: "0.4rem",
          fontSize: "0.95rem",
          lineHeight: "1.4rem",
        }}
      />

      {/* Mic Button */}
      <button
        type="button"
        onClick={handleVoiceToggle}
        className={`ml-2 p-2 rounded-full transition shrink-0 ${
          listening
            ? "bg-red-500 text-white animate-pulse"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title={listening ? "Stop listening" : "Start voice input"}
      >
        <img src={imgAssets.mic} alt="mic" className="w-5 h-5 object-contain" />
      </button>

      {/* Send Button */}
      <button
        type="submit"
        className="ml-2 p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition shrink-0"
        title="Send message"
      >
        <img
          src={imgAssets.send}
          alt="send"
          className="w-5 h-5 object-contain"
        />
      </button>
    </form>
  );
};

export default Input;
