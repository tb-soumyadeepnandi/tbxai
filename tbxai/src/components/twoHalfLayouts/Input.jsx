import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { imgAssets } from "../../assets";

const Input = ({ handleChange, value, handleSubmit, inputRef }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      handleChange({ target: { value: transcript } });
    }
  }, [transcript]);

  React.useEffect(() => {
    // Refocus input when listening stops
    if (!listening && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
  }

  const handleVoiceToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white border border-gray-300 rounded-full w-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-400 transition"
    >
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
        <img
          src={imgAssets.mic}
          alt="mic"
          className="w-5 h-5 object-contain"
        />
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
