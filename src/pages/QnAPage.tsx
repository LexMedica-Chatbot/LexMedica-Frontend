// Desc: Main QnA page for LexMedica
// ** React Imports
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// ** Components
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";

interface Message {
    text: string;
    sender: "user" | "bot";
}

interface ChatHistory {
    title: string;
    messages: Message[];
}

const QnAPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

    // Handling send message and chat history
    const chatHistoryRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = (message: string) => {
        const newMessage: Message = { text: message, sender: "user" };
        const aiResponse: Message = { text: `Berikut adalah jawaban dari pertanyaan dengan topik ${message} ....`, sender: "bot" };

        const updatedMessages = [...messages, newMessage, aiResponse];
        setMessages(updatedMessages);

        setChatHistory((prev) => {
            if (selectedChat) {
                // Update existing chat session
                return prev.map((chat) =>
                    chat.title === selectedChat ? { ...chat, messages: updatedMessages } : chat
                );
            } else {
                // Create new chat session if none selected
                // trim title to max 20 characters and add "..." if longer
                const trimmedTitle = message.trim().length > 20 ? message.trim().slice(0, 20) + " ..." : message.trim();
                const newHistory: ChatHistory = { title: trimmedTitle, messages: updatedMessages };
                return [newHistory, ...prev];
            }
        });

        // If it's a new chat, set the title
        if (!selectedChat) setSelectedChat(message);

        // Scroll to top after adding new chat
        setTimeout(() => {
            if (chatHistoryRef.current) {
                chatHistoryRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 100);
    };

    // Adjust auto scroll to newest message
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // History Chat visibility
    const [isHistoryChatVisible, setIsHistoryChatVisible] = useState(false);

    const toggleHistoryChat = () => {
        setIsHistoryChatVisible(!isHistoryChatVisible);
    };

    // New Chat
    const handleNewChat = () => {
        setSelectedChat(null);
        setMessages([]);
    };

    // Selecting history chat
    const handleSelectChat = (chatTitle: string) => {
        const selectedChatHistory = chatHistory.find((chat) => chat.title === chatTitle);
        if (selectedChatHistory) {
            setSelectedChat(chatTitle);
            setMessages(selectedChatHistory.messages);
        }
    };

    return (
        <Grid container sx={{ height: "100vh", display: "flex" }}>
            {/* Left Sidebar */}
            {isHistoryChatVisible && (
                <Grid
                    item
                    xs={2}
                    sx={{
                        height: "100vh",
                        bgcolor: 'secondary.dark',
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* First Box: History Chat Toggle Button */}
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <IconButton onClick={toggleHistoryChat} sx={{ position: "absolute", left: 10, color: "white" }}>
                            <FormatListBulletedIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: "white" }}>
                            Riwayat Chat
                        </Typography>
                    </Box>

                    {/* Third Box: History Chat List */}
                    <Box
                        ref={chatHistoryRef}
                        sx={{
                            flex: 9,
                            display: "flex",
                            flexDirection: "column",
                            padding: 2,
                            overflowY: "auto"
                        }}>
                        {chatHistory.length > 0 ? (
                            chatHistory.map((chat, index) => (
                                <Button
                                    key={index}
                                    fullWidth
                                    variant={selectedChat === chat.title ? "contained" : "text"}
                                    sx={{
                                        marginBottom: 1,
                                        justifyContent: "flex-start",
                                        textTransform: "none",
                                        backgroundColor: selectedChat === chat.title ? "primary.main" : "transparent",
                                        color: selectedChat === chat.title ? "white" : "black",
                                    }}
                                    onClick={() => handleSelectChat(chat.title)}
                                >
                                    <Typography variant="body1" noWrap color="white">
                                        {chat.title}
                                    </Typography>
                                </Button>
                            ))
                        ) : (
                            <Typography variant="body2" color="gray" sx={{ textAlign: "center" }}>
                                Tidak ada riwayat chat
                            </Typography>
                        )}
                    </Box>
                </Grid>
            )}

            {/* Right Content*/}
            <Grid
                item
                xs={isHistoryChatVisible ? 10 : 12}
                sx={{
                    display: "flex",
                    height: "100vh",
                    flexDirection: "column",
                }}
            >
                {/* Second Box: Toolbar */}
                <Box sx={{ flex: 1, bgcolor: 'lightgray', display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Toolbar sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", px: 2 }}>

                        {/* Left Section: LexMedica App Name */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {!isHistoryChatVisible && (
                                <IconButton onClick={toggleHistoryChat} sx={{ position: "absolute", left: 10, color: 'secondary.main' }}>
                                    <FormatListBulletedIcon />
                                </IconButton>
                            )}

                            <Typography fontWeight="bold" variant="h5" sx={{ ml: isHistoryChatVisible ? 0 : 5 }}>
                                LexMedica
                            </Typography>
                        </Box>

                        {/* Right Section: Account Buttons */}
                        <Box sx={{ display: "flex", gap: 2, marginLeft: "auto" }}>
                            <Link to="/login" style={{ textDecoration: "none" }}>
                                <Button variant="contained">
                                    <Typography fontWeight="bold">Masuk</Typography>
                                </Button>
                            </Link>
                            <Link to="/register" style={{ textDecoration: "none" }}>
                                <Button variant="outlined" sx={{ border: "2px solid" }}>
                                    <Typography fontWeight="bold">Daftar</Typography>
                                </Button>
                            </Link>
                        </Box>
                    </Toolbar>
                </Box>

                {/* Fourth Box: Chat Messages */}
                <Box sx={{
                    flex: 8.5,
                    display: "flex",
                    position: "relative",
                    overflowY: "auto", // Only this box will be scrollable
                    justifyContent: "center"
                }}>
                    {messages.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Typography variant="h5" color="white">
                                Selamat datang di LexMedica!
                            </Typography>
                            <Typography variant="body1" color="white">
                                Silakan masukkan pertanyaan seputar hukum kesehatan
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ width: '70%' }}>
                            <ChatMessages messages={messages} />
                            <div ref={messagesEndRef} />
                        </Box>
                    )}
                </Box>

                {/* Fifth Box: Fixed Chat Input */}
                <Box sx={{ justifyContent: "center", display: "flex", flex: 0.5, position: 'relative', px: 2, pb: 2 }}>
                    <Box sx={{ width: '80%' }}>
                        <ChatInput onNewChat={handleNewChat} onSendMessage={handleSendMessage} />
                    </Box>
                </Box>
            </Grid>
        </Grid >
    );
};

export default QnAPage;
