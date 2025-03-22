import { useState, useRef } from "react";
import { Box, createTheme, Grid, Typography, Button, IconButton, Toolbar } from "@mui/material";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import { themeOptions } from "../configs/themeOptions";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// ** React Import
import { Link } from 'react-router-dom'

interface Message {
    text: string;
    sender: "user" | "bot";
}

interface ChatHistory {
    title: string;
    messages: Message[];
}

const QnAPage: React.FC = () => {
    const theme = createTheme(themeOptions);

    const [inputHeight, setInputHeight] = useState<number>(56);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(true);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleNewChat = () => {
        setSelectedChat(null);
        setMessages([]);
    };

    const handleSelectChat = (chat: string) => {
        setSelectedChat(chat);
    };

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

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <Grid container sx={{ height: "100vh", display: "flex" }}>
            {/* Left Sidebar */}
            {isSidebarVisible && (
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
                        <IconButton onClick={toggleSidebar} sx={{ position: "absolute", left: 10, color: "white" }}>
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
                xs={isSidebarVisible ? 10 : 12}
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
                            {!isSidebarVisible && (
                                <IconButton onClick={toggleSidebar} sx={{ position: "absolute", left: 10, color: 'secondary.main' }}>
                                    <FormatListBulletedIcon />
                                </IconButton>
                            )}

                            <Typography fontWeight="bold" variant="h5" sx={{ ml: isSidebarVisible ? 0 : 5 }}>
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
