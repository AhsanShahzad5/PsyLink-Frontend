import React, { useState, useRef, useEffect } from "react";

const AIChatbotPage: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isNewChatActive, setIsNewChatActive] = useState<boolean>(false);
  const [savedChats, setSavedChats] = useState<
    { id: number; messages: { sender: string; text: string }[] }[]
  >([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedChats");
    if (saved) {
      setSavedChats(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("savedChats", JSON.stringify(savedChats));
  }, [savedChats]);

  // Scroll on new messages
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleNewChatClick = () => {
    setIsNewChatActive(true);
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSavedChatClick = (chatId: number) => {
    const chat = savedChats.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setActiveChatId(chat.id);
      setIsNewChatActive(false);
    }
  };

  useEffect(() => {
    handleNewChatClick();
  }, []);

  const formatMessageText = (text: string) => {
    return text.split('\n').map((paragraph, i) => {
      if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
        return (
          <div key={i} className="flex items-start mb-1 ml-4">
            <span className="mr-2">•</span>
            <span>{paragraph.substring(1).trim()}</span>
          </div>
        );
      } else if (/^\d+\./.test(paragraph)) {
        return (
          <div key={i} className="flex items-start mb-1 ml-4">
            <span className="mr-2">{paragraph.match(/^\d+\./)?.[0]}</span>
            <span>{paragraph.replace(/^\d+\./, '').trim()}</span>
          </div>
        );
      }
      return (
        <p key={i} className="mb-2 last:mb-0">
          {paragraph}
        </p>
      );
    });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = { sender: "user", text: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const promptPrefix = `
      You are a compassionate AI assistant supporting a mental health patient. 
      Format all responses with these rules:
      - NEVER use markdown (** or #)
      - Use proper spacing between paragraphs
      - Use bullet points with • instead of *
      - Use numbered lists when needed
      - Keep sentences short and compassionate
      - Add blank lines between sections
      - Use emojis sparingly for warmth

      Here's the user's concern:
      `;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCbOzt8rPBDQ5zW-PsVRTvW4NQY1pTeT_w",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${promptPrefix}\n\n${userInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let reply = "No response";
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        reply = data.candidates[0].content.parts[0].text
          .replace(/\*\*/g, '')
          .replace(/\*/g, '•')
          .replace(/#/g, '')
          .replace(/\n\n/g, '\n');
      } else if (data.error) {
        reply = `Error: ${data.error.message}`;
      }

      const botMessage = { sender: "bot", text: reply };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);

      if (activeChatId !== null) {
        setSavedChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: updatedMessages } : chat
          )
        );
      } else {
        const newId = Date.now();
        const newChat = { id: newId, messages: updatedMessages };
        setSavedChats((prev) => [...prev, newChat]);
        setActiveChatId(newId);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong! Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center w-full p-4 mt-4 mb-4 bg-white shadow-md fixed top-16 left-0 right-0 z-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-80px)] pb-4 w-full">
        {/* Sidebar */}
        <div className="bg-white border-r border-gray-300 h-full flex flex-col">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="font-semibold text-3xl">Chats</h2>
            <button
              onClick={handleNewChatClick}
              className={`flex items-center px-4 py-2 rounded-lg shadow-md transition ${
                isNewChatActive ? "bg-[#047D72] text-white font-medium hover:bg-[#064034]" : "bg-white hover:bg-gray-100"
              }`}
            >
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {savedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSavedChatClick(chat.id)}
                className={`p-4 rounded-2xl border cursor-pointer hover:shadow ${
                  activeChatId === chat.id ? "bg-[#047D72] text-white" : "bg-white text-black"
                }`}
              >
                {chat.messages[0]?.text?.slice(0, 30) || "New Chat"}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="col-span-3 flex flex-col h-full overflow-y-auto">
          <div ref={chatRef} className="flex-grow flex flex-col p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center">
                <img
                  src="/src/assets/patient/landingPage/Allen.png"
                  alt="Chatbot"
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <p className="text-center px-6 text-gray-700">
                  Meet <strong>Allen</strong>, PsyLink's AI chatbot, here to help you release stress in a safe space. 
                  Use Allen to express your frustrations and receive calming, supportive responses.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`my-2 p-4 rounded-xl max-w-xl ${
                      msg.sender === "user"
                        ? "bg-[#047D72] text-white self-end"
                        : "bg-gray-100 text-black self-start"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {formatMessageText(msg.text)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="my-2 p-4 bg-gray-100 text-black self-start rounded-xl max-w-xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-gray-300 flex items-center px-4 py-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message here..."
              className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#047D72]"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className={`ml-4 p-3 rounded-full ${
                isLoading ? "bg-gray-400" : "bg-[#047D72] hover:bg-[#064034]"
              } text-white transition-colors`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "➤"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotPage;