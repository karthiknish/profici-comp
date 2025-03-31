"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react"; // Import Loader2
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner"; // Import toast for error handling

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you learn about Profici today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false); // State for typing indicator
  const scrollAreaRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Optional: Reset messages when opening
    // if (!isOpen) {
    //   setMessages([{ sender: 'bot', text: 'Hello! How can I help you learn about Profici today?' }]);
    //   setInputValue('');
    //   setIsBotTyping(false);
    // }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Scroll to bottom when messages change or bot starts typing
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "div[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        // Use setTimeout to ensure scroll happens after DOM update
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 0);
      }
    }
  }, [messages, isBotTyping]); // Add isBotTyping dependency

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage || isBotTyping) return; // Prevent sending empty messages or while bot is typing

    // Add user message optimistically
    const newUserMessage = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsBotTyping(true); // Show typing indicator

    // Get current history to send to API (limit context)
    const currentHistory = messages.slice(-6); // Send last 6 messages

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: currentHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from bot.");
      }

      const data = await response.json();
      const botResponse = {
        sender: "bot",
        text: data.reply || "Sorry, I couldn't process that.",
      };

      // Add bot response
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message to chatbot API:", error);
      toast.error("Chatbot Error", { description: error.message });
      // Optionally add an error message to the chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Sorry, an error occurred: ${error.message}` },
      ]);
    } finally {
      setIsBotTyping(false); // Hide typing indicator
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg"
        size="icon"
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-80 md:w-96" // Adjusted width
          >
            <Card className="flex flex-col h-[500px] shadow-xl border">
              {" "}
              {/* Fixed height */}
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    Profici Assistant
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow p-0 overflow-hidden">
                {/* Use Shadcn ScrollArea */}
                <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {/* Typing Indicator */}
                    {isBotTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center space-x-1">
                          <span className="text-muted-foreground">Typing</span>
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <form
                  onSubmit={handleSendMessage}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-grow"
                    autoComplete="off"
                    disabled={isBotTyping} // Disable input while bot is typing
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim() || isBotTyping} // Disable button too
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
