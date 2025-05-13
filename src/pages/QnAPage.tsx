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
import HistoryMenu from "../components/History/HistoryMenu";
import HistoryMoreOptions from "../components/History/HistoryMoreOptions";

// ** API Imports (updated with Supabase functions)
import { createChatSession, getChatSessions, deleteChatSession } from "../services/chatSession";
import { createChatMessage, getChatMessages } from "../services/chatMessage";
import { createChatMessageDocuments, getDocument } from "../services/document";
import { fetchQnaAnswer } from "../services/qna";
import { streamChatCompletionDisharmonyAnalysis, createDisharmonyResult } from "../services/disharmony";

// ** Context Imports
import { useAuthContext } from "../context/authContext";

// ** Types
import { ChatSession, ChatMessage } from "../types/Chat";
import { Document } from "../types/Document";

// ** Utility Imports
import { normalizeLegalText } from "../utils/formatter";

const QnAPage: React.FC = () => {
    const { handleLogout, user } = useAuthContext();

    const [selectedChatSessionId, setSelectedChatSessionId] = useState<number | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isBotQnAResponding, setIsBotQnAResponding] = useState(false);
    const [isBotDisharmonyResponding, setIsBotDisharmonyResponding] = useState(false);

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
    const resolvedDocumentsRef = useRef<Document[]>([]);
    const botReplyDisharmonyRef = useRef("");
    const controllerQnARef = useRef<AbortController | null>(null);
    const controllerDisharmonyRef = useRef<AbortController | null>(null);

    const handleSendMessage = async (message: string, modelUrl: string) => {
        if (!message.trim()) return;
        if (modelUrl === "") return;

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

        const historyPairs: string[] = [];
        let pairsFound = 0;

        for (let i = chatMessages.length - 1; i >= 1 && pairsFound < 3; i--) {
            const botMessage = chatMessages[i];
            const userMessage = chatMessages[i - 1];

            if (botMessage.sender === "bot" && userMessage.sender === "user") {
                historyPairs.unshift(`Question: ${userMessage.message}\nAnswer: ${botMessage.message}`);
                pairsFound++;
                i--; // Skip the user message we just processed
            }
        }

        fetchQnaAnswer(
            message,
            modelUrl,
            historyPairs,
            async (data) => {
                botReplyQnARef.current += data.answer;

                const resolvedDocuments = await Promise.all(
                    (data.referenced_documents || []).map(async (doc: any) => {
                        const type = doc.metadata?.jenis_peraturan;
                        const number = doc.metadata?.nomor_peraturan;
                        const year = doc.metadata?.tahun_peraturan;
                        const data = type && number && year ? await getDocument(type, number, year) : null;

                        return {
                            document_id: data?.id || 0,
                            clause: doc.metadata?.tipe_bagian,
                            snippet: normalizeLegalText(doc.content),
                            source: {
                                about: data?.about,
                                type: data?.type,
                                number: data?.number,
                                year: data?.year,
                                status: data?.status,
                                url: data?.url,
                            },
                        };
                    })
                );

                // Update the documents for display
                resolvedDocumentsRef.current = resolvedDocuments;

                // Also update in chatMessages
                setChatMessages((prev) => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (lastIndex < 0) return updated;

                    if (updated[lastIndex].sender === "bot") {
                        updated[lastIndex] = {
                            ...updated[lastIndex],
                            message: botReplyQnARef.current,
                            documents: resolvedDocuments,
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
                    { message: botReplyQnARef.current, sender: "bot", documents: resolvedDocumentsRef.current },
                ];

                let botMessageId = 0;

                if (user) {
                    if (selectedChatSessionId) {
                        const session = chatSessions.find((chat) => chat.id === selectedChatSessionId);
                        if (!session || !session.id) return;
                        try {
                            await createChatMessage(session.id, "user", message);
                            botMessageId = await createChatMessage(session.id, "bot", botReplyQnARef.current);
                            await createChatMessageDocuments(botMessageId, resolvedDocumentsRef.current);

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
                                await createChatMessageDocuments(botMessageId, resolvedDocumentsRef.current);

                                await fetchChatHistory(user.id);
                                setSelectedChatSessionId(newSessionId);
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
                                    disharmony: {
                                        ...updated[lastIndex].disharmony,
                                        analysis: botReplyDisharmonyRef.current,
                                        // TODO: CHANGE THIS RESULT TO BOOLEAN
                                        result: false,
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
            console.log("Fetched messages:", fetchedMessages);
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
                                    <IconButton
                                        onClick={toggleHistoryChat}
                                        sx={{ position: "absolute", left: 10, color: 'secondary.main' }}
                                    >
                                        <FormatListBulletedIcon />
                                    </IconButton>
                                )}

                                {/* App Name */}
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
                                    isBotQnALoading={botReplyQnARef.current === "" && isBotQnAResponding}
                                    isBotDisharmonyLoading={botReplyDisharmonyRef.current === "" && isBotDisharmonyResponding} />
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
                </Grid >
            </Grid >
        </>
    );
};

export default QnAPage;
