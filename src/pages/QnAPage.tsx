import { useEffect, useRef, useState, MouseEvent } from "react";
import { Link } from 'react-router-dom';

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// ** Components
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";

// ** API Imports
import {
    createChatSession,
    getChatSessions,
    createChatMessage,
    getChatMessages,
} from "../api/chat";

interface Message {
    message: string;
    sender: "user" | "bot";
}

interface ChatHistory {
    id?: number;
    title: string;
    messages: Message[];
}

const QnAPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is logged in
        const userId = localStorage.getItem("userIdLexMedica");
        const userEmail = localStorage.getItem("userEmailLexMedica");
        const userToken = localStorage.getItem("userTokenLexMedica");

        if (userId) {
            fetchChatHistory(userId as unknown as number);
        }
        if (userEmail) {
            setUserEmail(userEmail);
        }
        if (userToken) {
            setIsAuthenticated(true);
        }
    }, []);

    const chatHistoryRef = useRef<HTMLDivElement | null>(null);

    const fetchChatHistory = async (userId: number) => {
        try {
            const data = await getChatSessions(userId);
            setChatHistory(
                data.map(chat => ({
                    id: chat.id, // make sure to keep this!
                    title: chat.title,
                    messages: [],
                }))
            );
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const handleSendMessage = async (message: string) => {
        const userId = localStorage.getItem("userIdLexMedica");
        if (!userId) return;

        const userMessage: Message = { message, sender: "user" };
        const botReply: Message = {
            message: `Berikut adalah jawaban dari pertanyaan dengan topik ${message} ....`,
            sender: "bot",
        };

        // If there's already a selected chat
        if (selectedChat) {
            const session = chatHistory.find((chat) => chat.id === selectedChat);
            if (!session || !session.id) return;

            try {
                // Save user message to backend
                await createChatMessage(session.id, "user", message);
                // Save bot message to backend
                await createChatMessage(session.id, "bot", botReply.message);

                const updatedMessages = [...messages, userMessage, botReply];
                setMessages(updatedMessages);

                setChatHistory((prev) =>
                    prev.map((chat) =>
                        chat.id === selectedChat
                            ? { ...chat, messages: updatedMessages }
                            : chat
                    )
                );
            } catch (error) {
                console.error("Error saving messages:", error);
            }
        } else {
            // Create a new chat session
            try {
                const trimmedTitle =
                    message.trim().length > 20
                        ? message.trim().slice(0, 20) + " ..."
                        : message.trim();

                const newSession = await createChatSession(Number(userId), trimmedTitle);

                // Save user and bot messages to backend
                await createChatMessage(newSession.id, "user", message);
                await createChatMessage(newSession.id, "bot", botReply.message);

                const updatedMessages = [userMessage, botReply];

                const newHistory: ChatHistory = {
                    id: newSession.id,
                    title: newSession.title,
                    messages: updatedMessages,
                };

                setMessages(updatedMessages);
                setChatHistory((prev) => [newHistory, ...prev]);
                setSelectedChat(newSession.id);
            } catch (error) {
                console.error("Failed to create chat session or messages:", error);
            }
        }

        setTimeout(() => {
            if (chatHistoryRef.current) {
                chatHistoryRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 100);
    };

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const [isHistoryChatVisible, setIsHistoryChatVisible] = useState(false);

    const toggleHistoryChat = () => {
        setIsHistoryChatVisible(!isHistoryChatVisible);
    };

    const handleNewChat = () => {
        setSelectedChat(null);
        setMessages([]);
    };

    const handleSelectChat = async (chatId: number) => {
        const selectedChatHistory = chatHistory.find(chat => chat.id === chatId);
        if (!selectedChatHistory || !selectedChatHistory.id) return;

        try {
            const fetchedMessages = await getChatMessages(chatId);
            const formattedMessages = fetchedMessages.map(msg => ({
                message: msg.message,
                sender: msg.sender as "user" | "bot",
            }));

            setSelectedChat(chatId);
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    const handleLogout = () => {
        // Remove user data from local storage
        localStorage.removeItem("userIdLexMedica");
        localStorage.removeItem("userEmailLexMedica");
        localStorage.removeItem("userTokenLexMedica");
        localStorage.removeItem("userRefreshTokenLexMedica");

        // Refresh the page to reflect changes
        window.location.reload();
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeChatIndex, setActiveChatIndex] = useState<number | null>(null);

    const handleMoreClick = (
        event: MouseEvent<HTMLElement>,
        index: number
    ) => {
        event.stopPropagation(); // prevent triggering the chat select
        setAnchorEl(event.currentTarget);
        setActiveChatIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setActiveChatIndex(null);
    };

    const handleUpdate = () => {
        if (activeChatIndex !== null) {
            console.log("Update chat:", chatHistory[activeChatIndex]);
        }
        handleClose();
    };

    const handleDelete = () => {
        if (activeChatIndex !== null) {
            console.log("Delete chat:", chatHistory[activeChatIndex]);
        }
        handleClose();
    };

    return (
        <Grid container sx={{ height: "100vh", display: "flex" }}>
            {/* Left Sidebar */}
            {isAuthenticated && isHistoryChatVisible && (
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
                                <Box
                                    key={index}
                                    sx={{
                                        position: "relative",
                                        "&:hover .more-icon": {
                                            visibility: "visible",
                                        },
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        variant={selectedChat === chat.id ? "contained" : "text"}
                                        sx={{
                                            marginBottom: 1,
                                            justifyContent: "flex-start",
                                            textTransform: "none",
                                            backgroundColor: selectedChat === chat.id ? "primary.main" : "transparent",
                                            color: selectedChat === chat.id ? "white" : "black",
                                        }}
                                        onClick={() => handleSelectChat(chat.id!)}
                                    >

                                        <Typography variant="body1" noWrap color="white">
                                            {chat.title}
                                        </Typography>

                                        {/* More icon, shown on hover */}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMoreClick(e, index)}
                                            className="more-icon"
                                            sx={{
                                                position: "absolute",
                                                right: 8,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                visibility: "hidden",
                                                color: "white",
                                            }}
                                        >
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </Button>

                                    {/* Menu for More options */}
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                                        PaperProps={{
                                            sx: {
                                                backgroundColor: "lightgray",
                                                borderRadius: 2,
                                                px: 1,
                                                boxShadow: 3,
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={handleUpdate}>
                                            <DriveFileRenameOutlineIcon sx={{ mr: 1 }} />
                                            <Typography variant="body2">Rename</Typography>
                                        </MenuItem>

                                        <MenuItem onClick={handleDelete}>
                                            <DeleteIcon sx={{ mr: 1, color: 'red' }} />
                                            <Typography variant="body2" color="red">Delete</Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="gray" sx={{ textAlign: "center" }}>
                                Tidak ada riwayat chat
                            </Typography>
                        )}
                    </Box>
                </Grid>
            )
            }

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
                            {isAuthenticated && !isHistoryChatVisible && (
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
                            {!isAuthenticated ? (
                                <>
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
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Typography fontWeight="bold" variant="body2">{userEmail}</Typography>
                                    <Button variant="contained" color="error" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </Box>
                            )}
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
                        <Box sx={{ width: '70%', bgcolor: 'secondary.main' }}>
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
