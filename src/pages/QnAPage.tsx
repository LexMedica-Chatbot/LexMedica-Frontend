// Desc: QNA Page, contains chat history component
// ** React Imports
import { useEffect, useRef, useState, MouseEvent } from "react";
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
import DocumentViewer from "../components/Document/DocumentViewer";
import HistoryMenu from "../components/History/HistoryMenu";
import HistoryMoreOptions from "../components/History/HistoryMoreOptions";

// ** API Imports
import {
    createChatSession,
    getChatSessions,
    deleteChatSession,
    createChatMessage,
    getChatMessages,
    streamChatCompletion
} from "../api/chat";

// ** Types
import { ChatSession, ChatMessage } from "../types/Chat";

const QnAPage: React.FC = () => {
    const [selectedChatSessionId, setSelectedChatSessionId] = useState<number | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isBotResponding, setIsBotResponding] = useState(false);

    // User check
    useEffect(() => {
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

    // End Message Ref
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [scrollBehavior, setScrollBehavior] = useState<"auto" | "smooth">("auto");

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: scrollBehavior });
            // Reset after scroll to avoid side-effects
            setScrollBehavior("auto");
        }
    }, [chatMessages, scrollBehavior]);


    // Chat History
    const chatHistoryRef = useRef<HTMLDivElement | null>(null);

    const fetchChatHistory = async (userId: number) => {
        try {
            const data = await getChatSessions(userId);
            if (!data) return;
            setChatSessions(
                data.map(chat => ({
                    id: chat.id,
                    user_id: chat.user_id,
                    title: chat.title,
                    started_at: chat.started_at
                }))
            );
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    // Send Message
    const botReplyRef = useRef("");
    const controllerRef = useRef<AbortController | null>(null);

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        // Abort previous request if still streaming
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        const userMessage: ChatMessage = { message, sender: "user" };
        setChatMessages((prev) => [...prev, userMessage]);
        setIsBotResponding(true);

        botReplyRef.current = "";

        const newBotMessage: ChatMessage = { message: "", sender: "bot" };
        setChatMessages((prev) => [...prev, newBotMessage]);

        streamChatCompletion(
            message,
            (chunk) => {
                botReplyRef.current += chunk;

                setChatMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (lastIndex < 0) return updated; // No chatMessages yet
                    if (updated[lastIndex].sender === "bot") {
                        updated[lastIndex] = {
                            ...updated[lastIndex],
                            message: botReplyRef.current,
                        };
                    }

                    return updated;
                });
            },
            async () => {
                setIsBotResponding(false);
                controllerRef.current = null;

                const finalMessages: ChatMessage[] = [
                    ...chatMessages,
                    userMessage,
                    { message: botReplyRef.current, sender: "bot" },
                ];

                if (isAuthenticated) {
                    const userId = localStorage.getItem("userIdLexMedica");
                    if (!userId) return;

                    if (selectedChatSessionId) {
                        const session = chatSessions.find((chat) => chat.id === selectedChatSessionId);
                        if (!session || !session.id) return;
                        try {
                            await createChatMessage(session.id, "user", message);
                            await createChatMessage(session.id, "bot", botReplyRef.current);

                            setChatSessions((prev) =>
                                prev.map((chat) =>
                                    chat.id === selectedChatSessionId
                                        ? { ...chat, chatMessages: finalMessages }
                                        : chat
                                )
                            );
                        } catch (error) {
                            console.error("Error saving chatMessages:", error);
                        }
                    } else {
                        try {
                            const trimmedTitle =
                                message.trim().length > 20
                                    ? message.trim().slice(0, 20) + " ..."
                                    : message.trim();

                            const newSession = await createChatSession(Number(userId), trimmedTitle);
                            await createChatMessage(newSession.id, "user", message);
                            await createChatMessage(newSession.id, "bot", botReplyRef.current);

                            setChatSessions((prev) => [newSession, ...prev]);
                            setSelectedChatSessionId(newSession.id);

                            setTimeout(() => {
                                if (chatHistoryRef.current) {
                                    chatHistoryRef.current.scrollTo({ top: 0, behavior: "smooth" });
                                }
                            }, 100);
                        } catch (error) {
                            console.error("Failed to create chat session or chatMessages:", error);
                        }
                    }
                } else {
                    setChatMessages(finalMessages);
                }

                setScrollBehavior("smooth");
            },
            (err) => {
                console.error("Streaming error:", err);
                setIsBotResponding(false);
                controllerRef.current = null;
            },
            controller.signal
        );
    };

    const [isHistoryChatVisible, setIsHistoryChatVisible] = useState(false);

    const toggleHistoryChat = () => {
        setIsHistoryChatVisible(!isHistoryChatVisible);
    };

    const handleNewChat = () => {
        setSelectedChatSessionId(null);
        setChatMessages([]);
    };

    const handleSelectChat = async (chatId: number) => {
        if (controllerRef.current) {
            controllerRef.current.abort(); // stop ongoing response
            controllerRef.current = null;
        }

        setIsBotResponding(false);

        const selectedChatHistory = chatSessions.find(chat => chat.id === chatId);
        if (!selectedChatHistory || !selectedChatHistory.id) return;

        try {
            const fetchedMessages = await getChatMessages(chatId);
            setSelectedChatSessionId(chatId);
            setChatMessages(fetchedMessages);
        } catch (error) {
            console.error("Error fetching chat chatMessages:", error);
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

    const handleClickChatSessionMoreOptions = (
        event: MouseEvent<HTMLElement>,
        index: number
    ) => {
        if (isBotResponding) return;
        event.stopPropagation(); // prevent triggering the chat select
        setAnchorEl(event.currentTarget);
        setActiveChatIndex(index);
    };

    const handleCloseChatSessionMoreOptions = () => {
        setAnchorEl(null);
        setActiveChatIndex(null);
    };

    const handleDelete = async (sessionId: number) => {
        try {
            const data = await deleteChatSession(sessionId);
            if (data.message) {
                setChatSessions((prev) => prev.filter((chat) => chat.id !== sessionId));
                setSelectedChatSessionId(null);
                setChatMessages([]);
            }
        } catch (error) {
            console.error("Error delete chat history:", error);
        } finally {
            handleCloseChatSessionMoreOptions();
        }
    };

    // Document Viewer Properties
    const [isDocumentViewerOpened, setIsDocumentViewerOpened] = useState<boolean>(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const handleOpenDocumentViewer = (url: string) => {
        setPdfUrl(url);
        setIsDocumentViewerOpened(true);
    };

    const handleCloseDocumentViewer = () => {
        setIsDocumentViewerOpened(false);
        setPdfUrl(null);
    };

    return (
        <>
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
                        <HistoryMenu chatSessionsRef={chatHistoryRef} chatSessions={chatSessions} selectedChatSessionId={selectedChatSessionId} onSelectChatSession={handleSelectChat} onMoreClick={handleClickChatSessionMoreOptions} />
                    </Grid>
                )}

                <HistoryMoreOptions activeChatIndex={activeChatIndex} anchorElHistoryMoreOptions={anchorEl} chatSessions={chatSessions} onClose={handleCloseChatSessionMoreOptions} onDelete={handleDelete} />

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
                        {chatMessages.length === 0 ? (
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
                                <ChatMessages chatMessages={chatMessages} isBotLoading={botReplyRef.current === "" && isBotResponding} onOpenDocumentViewer={handleOpenDocumentViewer} />
                                <div ref={messagesEndRef} />
                            </Box>
                        )}
                    </Box>

                    {/* Fifth Box: Fixed Chat Input */}
                    <Box sx={{ justifyContent: "center", display: "flex", flex: 0.5, position: 'relative', px: 2, pb: 2 }}>
                        <Box sx={{ width: '80%' }}>
                            <ChatInput
                                onNewChat={handleNewChat}
                                onSendMessage={handleSendMessage}
                                isBotLoading={isBotResponding}
                                setIsBotLoading={setIsBotResponding}
                                controllerRef={controllerRef}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid >

            {/* Document Viewer Modal */}
            <DocumentViewer isDocumentViewerOpened={isDocumentViewerOpened} onCloseDocumentViewer={handleCloseDocumentViewer} pdfUrl={pdfUrl} />
        </>
    );
};

export default QnAPage;
