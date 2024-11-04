"use client";

import { runGeminiAi } from "@/actions/geminiai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ChatFeed, Message as ChatMessage } from "react-chat-ui";

export default function Contact() {
  const [message, $message] = useState<string>("");
  const [messages, $messages] = useState<ChatMessage[]>([]);
  const [isLoading, $isLoading] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const userMessage = new ChatMessage({
      id: 0,
      message,
    });
    $messages((prevMessages) => [...prevMessages, userMessage]);
    $message("");
    $isLoading(true);
    try {
      const botResponse = await runGeminiAi(message);
      const botMessage = new ChatMessage({
        id: 1,
        message: botResponse ?? "No response",
      });
      $messages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error running Gemini AI:", error);
    } finally {
      $isLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    $message(e.target.value);
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chat with AI Assistant</h1>
      <div className="chat-box mb-4 max-h-96 overflow-y-auto">
        <ChatFeed
          messages={messages}
          isTyping={isLoading}
          hasInputField={false}
          showSenderName={false}
          bubblesCentered={false}
        />
        <div ref={lastMessageRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          className="flex-1"
          placeholder="Type your message..."
          value={message}
          onChange={handleInputChange}
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  );
}
