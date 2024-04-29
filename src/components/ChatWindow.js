import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage, getModelDetails, getPartDetails } from "../api/api";
import analyzeAIResponseForAction from "../responseAnalysis/analyzeAIResponseForAction";
import { marked } from "marked";
import parsePartHtmlToJSON from "../parsingFunctions/parseHtmlToJSON";

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
  const [lastUserMessage, setLastUserMessage] = useState(null); // Track the last user message processed

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchAIResponse = async () => {
      if (lastUserMessage) {
        const aiResponse = await getAIMessage(allMessages);
        const response = analyzeAIResponseForAction(aiResponse);

        let info = "";
        if (response.type !== 'none') {
          const modelInfo = await getModelDetails(response.modelNumber);
          info = `The following is information on the model that I asked about to help you answer my question: \n${JSON.stringify(modelInfo)}`;

          if (response.type === "both"){
            const partHtml = await getPartDetails(response.partNumber);
            const partInfo = parsePartHtmlToJSON(partHtml);
            info += `\nThe following is information on the part that I asked about to help you answer my question: ${JSON.stringify(partInfo)}`;
          }
        }

        setAllMessages(prevMessages => [...prevMessages, { role: "assistant", content: aiResponse.content }, { role: "user", content: info }]);
        setDisplayMessages(prevMessages => [...prevMessages, { role: "assistant", content: aiResponse.content }]);
        setLastUserMessage(null); // Reset the last user message processed
      }
    };
    fetchAIResponse();
    scrollToBottom();
  }, [lastUserMessage]); // Depend on the lastUserMessage to trigger the effect

  const handleSend = (input) => {
    const trimmedInput = String(input).trim();
    if (trimmedInput) {
      const newUserMessage = { role: "user", content: trimmedInput };
      setAllMessages(prevMessages => [...prevMessages, newUserMessage]);
      setDisplayMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInput(""); // Clear input after sending
      setLastUserMessage(newUserMessage); // Update the last user message
    }
  };

  return (
    <div className="messages-container">
      {displayMessages.map((message, index) => (
        <div key={index} className={`${message.role}-message-container`}>
          {typeof message.content === 'string' ? (
            <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}} className={`message ${message.role}-message`}></div>
          ) : (
            <div>{JSON.stringify(message.content)}</div>  // Fallback rendering
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

const sysMessage = `You are operating as a chat agent for the PartSelect e-commerce website, specializing in refrigerator and dishwasher parts. Your role is to provide detailed product information and assist with customer inquiries, focusing exclusively on these appliance parts. You must prioritize accuracy, relevance, and user experience in your responses.

For effective assistance, consider the following scenarios based on user input:
1. If a user asks about a model but does not provide a model number, prompt the user to provide the model number. Ensure to restate the model number clearly in your response as "Model number: [number]".
2. If a user provides a model number, use this information to fetch relevant details from the PartSelect website API to answer their query. Always confirm the model number in your response using the format "Model number: [number]".
3. If a user asks about a part and provides a part number but not a model number, prompt them to provide the model number for compatibility and additional assistance. Include the part number in your response as "Part number: [number]" and ask for the model number explicitly.
4. If a user mentions a part and provides the model number but not the part number, request the part number to provide specific information or compatibility details. Restate the model number and request the part number using the format "Part number: [number]".
5. If a user provides both a model number and a part number in their query, use these details to offer comprehensive information about the compatibility and installation of the part. Confirm both details in your response by stating "Model number: [number]" and "Part number: [number]".

Always verify whether the user has provided necessary details such as a model number or a part number and guide them to furnish any missing information to ensure precise and helpful responses. This approach will aid in maintaining the focus on refrigerator and dishwasher issues and prepare the system for potential future expansions in product categories.`

export default ChatWindow;
