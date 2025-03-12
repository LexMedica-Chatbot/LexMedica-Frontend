import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatProps {
    selectedChat: string | null;
}

interface Message {
    text: string;
    sender: "user" | "bot";
}

const Chat: React.FC<ChatProps> = ({ selectedChat }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputHeight, setInputHeight] = useState(56); // Default height of ChatInput

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (message: string) => {
        const newMessage: Message = { text: message, sender: "user" };
        const aiResponse: Message = { text: `Interesting question about "${message}"!`, sender: "bot" };

        setMessages((prev) => [...prev, newMessage, aiResponse]);
    };

    // Scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, inputHeight]);

    useEffect(() => {
        if (selectedChat === null) {
            // Load a new chat (clear messages)
            setMessages([]);
        } else {
            // Load the selected chat history (can replace with actual history)
            setMessages([{ text: `History of ${selectedChat}`, sender: "bot" }]);
        }
    }, [selectedChat]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
            {/* Chat Messages with Dynamic Padding */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", paddingBottom: `${inputHeight + 10}px` }}>
                <ChatMessages messages={messages} />
                <div ref={messagesEndRef} />
            </Box>

            {/* Chat Input (Updates its height dynamically) */}
            <Box alignItems={"center"}>
                <ChatInput onSendMessage={(msg) => setMessages((prev) => [...prev, { text: msg, sender: "user" }])} onHeightChange={setInputHeight} />
            </Box>
        </Box>
    );
};

export default Chat;
