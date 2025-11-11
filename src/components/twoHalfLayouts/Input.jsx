import React, { useRef, useState, useEffect } from "react";
import { imgAssets } from "../../assets";
import toast, { Toaster } from "react-hot-toast";

const Input = ({ handleChange, value, handleSubmit, inputRef }) => {
  const [listening, setListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const transcriptRef = useRef("");

  // Initialize Speech Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
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
      handleChange({ target: { value: currentTranscript } }); // update input
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
      // Send transcript as a message
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white border border-gray-300 rounded-full w-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-400 transition"
    >
      <Toaster position="top-center" />
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        value={value}
        placeholder="Type or speak..."
        className="flex-1 bg-transparent outline-none border-none text-gray-800 placeholder-gray-400 px-2"
      />

      {/* Mic Button */}
      <button
        type="button"
        onClick={handleVoiceToggle}
        className={`ml-2 p-2 rounded-full transition ${
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
        className="ml-2 p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition"
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
