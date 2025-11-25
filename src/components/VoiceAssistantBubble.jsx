import { useState } from "react";
import { Mic, Loader2 } from "lucide-react";

export default function VoiceAssistantBubble() {
  const [listening, setListening] = useState(false);

  const toggleMic = () => {
    setListening(!listening);
  };

  return (
    <button
      onClick={toggleMic}
      className="
        fixed bottom-6 right-6 z-50
        p-4 rounded-full
        bg-gradient-to-br from-purple-500 to-indigo-600
        shadow-xl text-white
        hover:scale-105 active:scale-95
        transition-all duration-300
      "
    >
      {listening ? <Loader2 className="animate-spin" size={28} /> : <Mic size={28} />}
    </button>
  );
}
