import { useState, useEffect, useRef } from "react";
import { Box, createTheme, Typography } from "@mui/material";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";

import { themeOptions } from "../configs/themeOptions";

interface ChatProps {
    selectedChat: string | null;
}

interface Message {
    text: string;
    sender: "user" | "bot";
}

const QnAPage = () => {
    const theme = createTheme(themeOptions);

    const [selectedChat, setSelectedChat] = useState<string | null>(null); // Store selected chat

    const handleNewChat = () => {
        setSelectedChat(null); // Reset chat selection to start a new one
    };

    const handleSelectChat = (chat: string) => {
        setSelectedChat(chat); // Load the selected chat history
    };


    const [messages, setMessages] = useState<Message[]>([]);
    const [inputHeight, setInputHeight] = useState(56); // Default height of ChatInput

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (message: string) => {
        const newMessage: Message = { text: message, sender: "user" };
        const aiResponse: Message = { text: `Berikut adalah jawaban dari pertanyaan dengan topik ${message} ....`, sender: "bot" };

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
        <Box
            display={"flex"}
            justifyContent={"center"}
            sx={{height: "100%", minHeight: "90.9vh" }} >
            <Box
                sx={{
                    overflowY: "auto",
                    width: "50%",
                }}
            >
                <Box display={"flex"} justifyContent={"center"} sx={{ flexDirection: "column", minHeight: "100%" }}>
                    {/* Chat Messages with Dynamic Padding */}
                    <Box sx={{ flexGrow: 1, overflowY: "auto", paddingBottom: 10 }}>
                        <ChatMessages messages={messages} />
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Chat Input (Centered) */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "fixed",
                            width: "50%",
                            bottom: 0,
                            pb: 2,
                            pt: 1,
                            height: inputHeight,
                            backgroundColor: theme.palette.secondary.main,
                        }}>
                        <ChatInput onSendMessage={(msg) => handleSendMessage(msg)} onHeightChange={setInputHeight} />
                    </Box>
                </Box>

                {/* Fixed Centered Welcome Message (Hidden if there's a chat) */}
                {messages.length == 0 && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            padding: "16px",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="h5" color="white">
                            Selamat datang di LexMedica!
                        </Typography>
                        <Typography variant="body1" color="white">
                            Silakan masukkan pertanyaan seputar hukum kesehatan
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box >
    );
};

export default QnAPage;
