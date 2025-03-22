// ** React Imports
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

// ** MUI Imports
import { Box, createTheme, Grid, Typography, Button, IconButton, Toolbar } from "@mui/material";
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

    const [inputHeight, setInputHeight] = useState<number>(56);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(true);

    // Handling send message
    const handleSendMessage = (message: string) => {
        const newMessage: Message = { text: message, sender: "user" };
        const aiResponse: Message = { text: `Berikut adalah jawaban dari pertanyaan dengan topik ${message} ....`, sender: "bot" };

        setMessages((prev) => [...prev, newMessage, aiResponse]);

        const newHistory: ChatHistory = {
            title: message,
            messages: [...messages, newMessage, aiResponse],
        };
        setChatHistory((prev) => [...prev, newHistory]);
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
    const handleSelectChat = (chat: string) => {
        setSelectedChat(chat);
    };

    return (
        <Grid container sx={{ height: "100vh", display: "flex" }}>
            {/* Left Sidebar */}
            {isHistoryChatVisible && (
                <Grid
                    item
                    xs={2}
                    sx={{
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
                    <Box sx={{ flex: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        Third Box
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

                {/* Fixed Chat Input */}
                <Box sx={{ justifyContent: "center", display: "flex", flex: 0.5, position: 'relative', px: 2, pb: 2 }}>
                    <Box sx={{ width: '80%' }}>
                        <ChatInput onSendMessage={handleSendMessage} onHeightChange={setInputHeight} />
                    </Box>
                </Box>
            </Grid>
        </Grid >
    );
};

export default QnAPage;
