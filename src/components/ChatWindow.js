import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage, getModelDetails, getPartDetails, findPart } from "../api/api";
import analyzeAIResponseForAction from "../responseAnalysis/analyzeAIResponseForAction";
import { marked } from "marked";

function ChatWindow() {
  const initialDisplayMessage = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }];

  const initialMessages = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }, {
    role: "system",
    content: sysMessage
  }];

  const [displayMessages, setDisplayMessages] = useState(initialDisplayMessage);
  const [allMessages, setAllMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [lastUserMessage, setLastUserMessage] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchAIResponse = async () => {
      if (lastUserMessage) {
        const response = await analyzeAIResponseForAction(allMessages);
        let info = "";
        
        if (response.type !== 'none') {
          const modelData = await getModelDetails(response.modelNumber);
          const modelInfo = modelData.content;
          info = `The following is information on the model that I asked about to help you answer my question: \n${JSON.stringify(modelInfo)}`;
          
          if (response.type === "both" && response.partNumber != null){
            const partData = await findPart(response.partNumber, response.modelNumber);
            const partInfo = partData.content;

            if (partInfo.length > 0) {
              const partUrl = partInfo[0].partUrl;
              const partData = await getPartDetails(partUrl);
              const partDetails = partData.content;
              info += `\nThe following is information on the part that I asked about to help you answer my question: ${JSON.stringify(partDetails)}`;
            }
            }
        }
        if (info) {
          setAllMessages(prevMessages => [...prevMessages, { role: "user", content: info }]);
        }
        const aiResponse = await getAIMessage(allMessages);

        setAllMessages(prevMessages => [...prevMessages, { role: "assistant", content: aiResponse.content }]);
        setDisplayMessages(prevMessages => [...prevMessages, { role: "assistant", content: aiResponse.content }]);
        setLastUserMessage(null);
      }
    };
    fetchAIResponse();
    scrollToBottom();
  });

  const handleSend = (input) => {
    const trimmedInput = String(input).trim();
    if (trimmedInput) {
      const newUserMessage = { role: "user", content: trimmedInput };
      setAllMessages(prevMessages => [...prevMessages, newUserMessage]);
      setDisplayMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInput(""); 
      setLastUserMessage(newUserMessage);
    }
  };

  return (
    <div className="messages-container">
      {displayMessages.map((message, index) => (
        <div key={index} className={`${message.role}-message-container`}>
          {typeof message.content === 'string' ? (
            <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}} className={`message ${message.role}-message`}></div>
          ) : (
            <div>{JSON.stringify(message.content)}</div> 
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(input);
              e.preventDefault();
            }
          }}
          rows="3"
        />
        <button className="send-button" onClick={() => handleSend(input)}>Send</button>
      </div>
    </div>
  );
}

const sysMessage = `You’re a chatbot for PartSelect, your expertise lies in fridge and dishwasher parts. Your responses should be friendly, informative, and precise.

- If the user hasn’t given a model number, gently ask for it with: "May I have the model number to assist you better?"
- When you receive a model number, pull up specific information and reconfirm by saying, "Thanks! For model number: [number], here's what I found..."
- If presented with a part number but no model number, ask for the latter kindly: "To ensure perfect compatibility, could you provide the model number too?"
- If there’s a model number but no part number, inquire politely: "Could you also give me the part number for more detailed assistance?"
- If given both numbers, provide comprehensive support, reaffirming with "For model number: [number] and part number: [number], here’s the complete info..."

Remember to always clarify necessary details like model or part numbers to offer targeted help. Keep this approach friendly and informative, and stay adaptable for service expansions.`
export default ChatWindow;
