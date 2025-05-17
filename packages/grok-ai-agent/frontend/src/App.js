import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';



function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
const utteranceRef = useRef(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chat]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInput(speechResult);
      setListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };
  }, []);

  // Text-to-Speech function for reading any text aloud
const speakText = (text, index) => {
  if (!window.speechSynthesis) {
    alert('Speech Synthesis API not supported in this browser.');
    return;
  }

  // If currently speaking this message, stop it
  if (window.speechSynthesis.speaking && speakingIndex === index) {
    window.speechSynthesis.cancel();
    setSpeakingIndex(null);
    return;
  }

  // Stop any other ongoing speech
  window.speechSynthesis.cancel();

  // Create and speak new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  utterance.onend = () => {
    setSpeakingIndex(null);
  };

  utterance.onerror = () => {
    setSpeakingIndex(null);
  };

  utteranceRef.current = utterance;
  window.speechSynthesis.speak(utterance);
  setSpeakingIndex(index);
};



  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/message", {
        message: input,
      });

      const reply = response.data.reply || response.data.choices?.[0]?.message?.content;

      setChat((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: reply },
      ]);

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: 20 }}>🧠 Groq AI Chat</h1>
      <div style={styles.chatBox} ref={chatBoxRef}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#007bff' : '#e4e6eb',
              color: msg.role === 'user' ? 'white' : 'black',
              position: 'relative',
            }}
          >
            <div style={styles.name}>
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div>{msg.content}</div>
            {/* Show speaker icon only for AI messages */}
        {msg.role === 'assistant' && (
  <button
    onClick={() => speakText(msg.content, index)}
    style={styles.speakerBtn}
    aria-label="Read aloud"
    title="Read aloud"
  >
    {speakingIndex === index ? '🔇' : '🔊'}
  </button>
)}


          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
        <button
          onClick={startListening}
          style={{
            ...styles.button,
            backgroundColor: listening ? '#dc3545' : '#28a745',
            width: 48,
            padding: 0,
            fontSize: 18,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={listening ? "Listening..." : "Start Voice Input"}
        >
          {listening ? '🎙️' : '🎤'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f5f5',
  },
  chatBox: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    background: 'white',
    padding: 15,
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    margin: '6px 0',
    borderRadius: 16,
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    opacity: 0.6,
  },
  speakerBtn: {
    position: 'absolute',
    bottom: 4,
    right: 10,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 20,
    color: '#555',
  },
  inputArea: {
    display: 'flex',
    width: '100%',
    maxWidth: 600,
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  button: {
    padding: '12px 20px',
    borderRadius: 8,
    background: '#faa48e',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
};

export default App;
