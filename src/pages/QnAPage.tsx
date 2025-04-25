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

// ** API Imports (updated with Supabase functions)
import {
    createChatSession,
    getChatSessions,
    deleteChatSession,
    createChatMessage,
    getChatMessages,
    streamChatCompletionQnaAnswer,
    streamChatCompletionDisharmonyAnalysis,
    createDisharmonyResult
} from "../services/chat";

// ** Context Imports
import { useAuthContext } from "../context/authContext";

// ** Types
import { ChatSession, ChatMessage } from "../types/Chat";
import { Document } from "../types/Document";

const QnAPage: React.FC = () => {
    const { handleLogout, user } = useAuthContext();

    const [selectedChatSessionId, setSelectedChatSessionId] = useState<number | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isBotQnAResponding, setIsBotQnAResponding] = useState(false);
    const [isBotDisharmonyResponding, setIsBotDisharmonyResponding] = useState(false);

    const documents: Document[] = [
        { title: "UU Nomor 36 Tahun 2009", source: "https://edxnjclbtbkyohvjkmcv.supabase.co/storage/v1/object/public/lexmedica/UU/Dicabut/UU%20Nomor%2036%20Tahun%202009.pdf" },
        { title: "Document 2", source: "https://example.com/doc2.pdf" }];

    // Chat History
    const chatHistoryRef = useRef<HTMLDivElement | null>(null);

    // Fetch Chat History from Supabase
    const fetchChatHistory = async (userId: string) => {
        try {
            const data = await getChatSessions(userId); // Use Supabase function
            setChatSessions(data);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchChatHistory(user.id); // Fetch chat history on mount
        }
    }, [user]);

    // End Message Ref
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [scrollBehavior, setScrollBehavior] = useState<"auto" | "smooth">("auto");
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    useEffect(() => {
        if (shouldAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: scrollBehavior });
            setScrollBehavior("auto");
        }
    }, [chatMessages, scrollBehavior, shouldAutoScroll]);

    // Send Message
    const botReplyQnARef = useRef("");
    const botReplyDisharmonyRef = useRef("");
    const controllerQnARef = useRef<AbortController | null>(null);
    const controllerDisharmonyRef = useRef<AbortController | null>(null);

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        // Abort previous request if still streaming
        if (controllerQnARef.current) {
            controllerQnARef.current.abort();
        }

        const controllerQnA = new AbortController();
        controllerQnARef.current = controllerQnA;

        const userMessage: ChatMessage = { message, sender: "user" };
        setChatMessages((prev) => [...prev, userMessage]);
        setIsBotQnAResponding(true);

        botReplyQnARef.current = "";

        const newBotMessage: ChatMessage = { message: "", sender: "bot" };
        setChatMessages((prev) => [...prev, newBotMessage]);

        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);

        streamChatCompletionQnaAnswer(
            message,
            (chunk) => {
                botReplyQnARef.current += chunk;

                setChatMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (lastIndex < 0) return updated; // No chatMessages yet
                    if (updated[lastIndex].sender === "bot") {
                        updated[lastIndex] = {
                            ...updated[lastIndex],
                            message: botReplyQnARef.current,
                        };
                    }

                    return updated;
                });
            },
            async () => {
                setIsBotQnAResponding(false);
                controllerQnARef.current = null;

                const finalMessages: ChatMessage[] = [
                    ...chatMessages,
                    userMessage,
                    { message: botReplyQnARef.current, sender: "bot" },
                ];

                let botMessageId = 0;

                if (user) {
                    if (selectedChatSessionId) {
                        const session = chatSessions.find((chat) => chat.id === selectedChatSessionId);
                        if (!session || !session.id) return;
                        try {
                            await createChatMessage(session.id, "user", message);
                            botMessageId = await createChatMessage(session.id, "bot", botReplyQnARef.current);
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

                            const newSessionId = await createChatSession(user.id, trimmedTitle);

                            if (newSessionId) {
                                await createChatMessage(newSessionId, "user", message);
                                botMessageId = await createChatMessage(newSessionId, "bot", botReplyQnARef.current);

                                await fetchChatHistory(user.id);
                                setSelectedChatSessionId(newSessionId);

                                const newMessages = await getChatMessages(newSessionId);
                                setChatMessages(newMessages);
                            }

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
                    // setChatMessages(finalMessages);
                    console.log("Anonymous user — QnA shown but not saved.");
                }

                botReplyDisharmonyRef.current = "";
                setIsBotDisharmonyResponding(true);

                // Abort previous request if still streaming
                if (controllerDisharmonyRef.current) {
                    controllerDisharmonyRef.current.abort();
                }

                const controllerDisharmony = new AbortController();
                controllerDisharmonyRef.current = controllerDisharmony;

                streamChatCompletionDisharmonyAnalysis(
                    botReplyQnARef.current,
                    (chunk) => {
                        botReplyDisharmonyRef.current += chunk;

                        setChatMessages((prev) => {
                            const updated = [...prev];
                            const lastIndex = updated.length - 1;
                            if (updated[lastIndex]?.sender === "bot") {
                                updated[lastIndex] = {
                                    ...updated[lastIndex],
                                    disharmony_result: {
                                        ...updated[lastIndex].disharmony_result,
                                        analysis: botReplyDisharmonyRef.current,
                                    }
                                };
                            }
                            return updated;
                        });
                    },
                    async () => {
                        setIsBotDisharmonyResponding(false);
                        if (user) {
                            try {
                                const session = chatSessions.find(chat => chat.id === selectedChatSessionId);
                                if (!session) return;

                                await createDisharmonyResult(botMessageId, botReplyDisharmonyRef.current);

                            } catch (err) {
                                console.error("Failed to save message or disharmony:", err);
                            }
                        } else {
                            console.log("Anonymous user — disharmony shown but not saved.");
                        }
                    },
                    (err) => {
                        console.error("Disharmony streaming error:", err);
                        setIsBotDisharmonyResponding(false);
                        controllerDisharmonyRef.current = null;
                    },
                    controllerDisharmony.signal
                );

                setScrollBehavior("smooth");
            },
            (err) => {
                console.error("Streaming error:", err);
                setIsBotQnAResponding(false);
                controllerQnARef.current = null;
            },
            controllerQnA.signal
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

    const handleSelectChatSession = async (chatId: number) => {
        if (controllerQnARef.current) {
            controllerQnARef.current.abort(); // stop ongoing response
            controllerQnARef.current = null;
        }

        if (controllerDisharmonyRef.current) {
            controllerDisharmonyRef.current.abort(); // stop ongoing response
            controllerDisharmonyRef.current = null;
        }

        setIsBotQnAResponding(false);
        setIsBotDisharmonyResponding(false);

        const selectedChatHistory = chatSessions.find(chat => chat.id === chatId);
        if (!selectedChatHistory || !selectedChatHistory.id) return;

        try {
            const fetchedMessages = await getChatMessages(chatId); // Fetch messages from Supabase
            setSelectedChatSessionId(chatId);
            setChatMessages(fetchedMessages);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }

        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeChatIndex, setActiveChatIndex] = useState<number | null>(null);

    const handleClickChatSessionMoreOptions = (
        event: MouseEvent<HTMLElement>,
        index: number
    ) => {
        if (isBotQnAResponding) return;
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
            const data = await deleteChatSession(sessionId); // Delete from Supabase
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
                {user && isHistoryChatVisible && (
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
                        <HistoryMenu chatSessionsRef={chatHistoryRef} chatSessions={chatSessions} selectedChatSessionId={selectedChatSessionId} onSelectChatSession={handleSelectChatSession} onMoreClick={handleClickChatSessionMoreOptions} />
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
                                {user && !isHistoryChatVisible && (
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
                                {!user ? (
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
                                        <Typography fontWeight="bold" variant="body2">{user.email}</Typography>
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
                    }}
                        onScroll={(e) => {
                            const target = e.currentTarget;
                            const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 10;
                            setShouldAutoScroll(isNearBottom);
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
                                    Silakan masukkan pertanyaan seputar hukum kesehatan Indonesia
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ width: '70%', bgcolor: 'secondary.main' }}>
                                <ChatMessages
                                    chatMessages={chatMessages}
                                    documents={documents}
                                    isBotQnALoading={botReplyQnARef.current === "" && isBotQnAResponding}
                                    isBotDisharmonyLoading={botReplyDisharmonyRef.current === "" && isBotDisharmonyResponding}
                                    onOpenDocumentViewer={handleOpenDocumentViewer} />
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
                                isBotQnALoading={isBotQnAResponding}
                                isBotDisharmonyLoading={isBotDisharmonyResponding}
                                setIsBotQnALoading={setIsBotQnAResponding}
                                setIsBotDisharmonyLoading={setIsBotDisharmonyResponding}
                                controllerQnARef={controllerQnARef}
                                controllerDisharmonyRef={controllerDisharmonyRef}
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
