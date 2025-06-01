// Desc: QNA Page, contains chat history component
// ** React Imports
import { useEffect, useRef, useState, MouseEvent } from "react";
import { Link } from 'react-router-dom';

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// ** MUI Icons
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// ** Components
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import HistoryMenu from "../components/History/HistoryMenu";
import HistoryMoreOptions from "../components/History/HistoryMoreOptions";
import UserMenu from "../components/User/UserMenu";

// ** API Imports (updated with Supabase functions)
import { createChatSession, getChatSessions, deleteChatSession } from "../services/chatSession";
import { createChatMessage, getChatMessages } from "../services/chatMessage";
import { createChatMessageDocuments, getDocument } from "../services/document";
import { fetchQnaAnswer } from "../services/qna";
import { createDisharmonyResult, fetchDisharmonyAnalysis } from "../services/disharmony";

// ** Context Imports
import { useAuthContext } from "../context/authContext";

// ** Types
import { ChatSession, ChatMessage, ChatDisharmony } from "../types/Chat";
import { Document } from "../types/Document";

// ** Utility Imports
import { normalizeLegalText } from "../utils/formatter";

const QnAPage: React.FC = () => {
    const { user } = useAuthContext();

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
    const regulationsRef = useRef("");
    const resolvedDocumentsRef = useRef<Document[]>([]);
    const botReplyDisharmonyRef = useRef<ChatDisharmony>({ result: false, analysis: "" });
    const controllerQnARef = useRef<AbortController | null>(null);
    const controllerDisharmonyRef = useRef<AbortController | null>(null);

    const handleSendMessage = async (message: string, modelUrl: string, embedding: string) => {
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
        setIsBotDisharmonyResponding(true);

        botReplyQnARef.current = "";
        botReplyDisharmonyRef.current.analysis = "";
        botReplyDisharmonyRef.current.result = false;
        regulationsRef.current = "";

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
            embedding,
            historyPairs,
            async (data) => {
                botReplyQnARef.current += data.answer;

                const resolvedDocuments = await Promise.all(
                    (data.referenced_documents || []).map(async (doc: any) => {
                        const type = doc.metadata?.jenis_peraturan;
                        const number = doc.metadata?.nomor_peraturan;
                        const year = doc.metadata?.tahun_peraturan;
                        const data = type && number && year ? await getDocument(type, number, year) : null;

                        regulationsRef.current += JSON.stringify({
                            dokumen: doc.description,
                            pasal: doc.metadata?.tipe_bagian,
                            ayat: doc.content,
                        });

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

                // Bot QNA response completed
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
                                    ? message.trim().slice(0, 20) + "..."
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
                }

                // Check the disharmony after getting the regulations
                if (regulationsRef.current !== "") {

                    // Abort previous request if still streaming
                    if (controllerDisharmonyRef.current) {
                        controllerDisharmonyRef.current.abort();
                    }

                    const controllerDisharmony = new AbortController();
                    controllerDisharmonyRef.current = controllerDisharmony;

                    // Fetch disharmony analysis
                    fetchDisharmonyAnalysis(
                        regulationsRef.current,
                        async (data) => {
                            botReplyDisharmonyRef.current.analysis += data.analysis;
                            botReplyDisharmonyRef.current.result = data.result;

                            setChatMessages((prev) => {
                                const updated = [...prev];
                                const lastIndex = updated.length - 1;
                                if (updated[lastIndex]?.sender === "bot") {
                                    updated[lastIndex] = {
                                        ...updated[lastIndex],
                                        disharmony: {
                                            ...updated[lastIndex].disharmony,
                                            analysis: data.analysis,
                                            result: data.result,
                                        }
                                    };
                                }
                                return updated;
                            });

                            if (user) {
                                if (botReplyDisharmonyRef.current.analysis !== "") {
                                    await createDisharmonyResult(botMessageId, botReplyDisharmonyRef.current);
                                }
                            }
                            setIsBotDisharmonyResponding(false);

                        },
                        (err) => {
                            console.error("Disharmony streaming error:", err);
                            setIsBotDisharmonyResponding(false);
                            controllerDisharmonyRef.current = null;
                        },
                        controllerDisharmony.signal
                    );

                    setScrollBehavior("smooth");
                }
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
            const fetchedMessages = await getChatMessages(chatId);
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

    const theme = useTheme();
    // Example: Define toolbar height for consistent spacing
    const toolbarHeight = { xs: '56px' };

    // This media query can be used for more drastic layout changes
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Grid container sx={{ height: "100vh", display: "flex", overflow: 'hidden' /* Prevent body scroll */ }}>
                {/* Left Sidebar: Show only on md+ */}
                {/* Desktop Sidebar */}
                {user && isHistoryChatVisible && !isMobile && (
                    <Grid
                        item
                        xs={user && isHistoryChatVisible && !isMobile ? 3 : 0}
                        sm={user && isHistoryChatVisible && !isMobile ? 3.5 : 0}
                        lg={user && isHistoryChatVisible && !isMobile ? 2 : 0}
                        sx={{
                            height: "100vh",
                            bgcolor: '#160100',
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 11,
                        }}
                    >
                        <HistoryMenu
                            chatSessionsRef={chatHistoryRef}
                            chatSessions={chatSessions}
                            selectedChatSessionId={selectedChatSessionId}
                            onSelectChatSession={handleSelectChatSession}
                            onMoreClick={handleClickChatSessionMoreOptions}
                            onClose={toggleHistoryChat}
                        />
                    </Grid>
                )}

                {/* Mobile Drawer */}
                <Drawer
                    anchor="left"
                    open={isHistoryChatVisible && isMobile}
                    onClose={toggleHistoryChat}
                    PaperProps={{
                        sx: {
                            width: { xs: '75vw', sm: '65vw' },
                            maxWidth: 250,
                            bgcolor: '#160100',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                        }
                    }}
                >
                    <HistoryMenu
                        chatSessionsRef={chatHistoryRef}
                        chatSessions={chatSessions}
                        selectedChatSessionId={selectedChatSessionId}
                        onSelectChatSession={handleSelectChatSession}
                        onMoreClick={handleClickChatSessionMoreOptions}
                        onClose={toggleHistoryChat}
                    />
                </Drawer>

                {/* HistoryMoreOptions - ensure this component is also responsive */}
                <HistoryMoreOptions activeChatIndex={activeChatIndex} anchorElHistoryMoreOptions={anchorEl} chatSessions={chatSessions} onClose={handleCloseChatSessionMoreOptions} onDelete={handleDelete} />

                {/* Right Content*/}
                <Grid
                    item
                    // Adjust based on sidebar visibility; this logic is generally fine.
                    xs={user && isHistoryChatVisible && !isMobile ? 9 : 12}
                    sm={user && isHistoryChatVisible && !isMobile ? 8.5 : 12}
                    lg={user && isHistoryChatVisible && !isMobile ? 10 : 12}
                    sx={{
                        display: "flex",
                        height: "100vh",
                        flexDirection: "column",
                        overflow: 'hidden', // Ensure this container manages its own overflow
                    }}
                >
                    {/* Second Box: Toolbar (Fixed Header) */}
                    <Box
                        component="header" // Semantic element
                        sx={{
                            height: toolbarHeight, // Use defined height
                            bgcolor: { xs: 'primary.main', md: 'transparent' },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "fixed", // Stays at the top
                            top: 0,
                            // Adjust left offset if sidebar is visible and fixed (not drawer)
                            left: { xs: 0 },
                            width: { xs: '100%' },
                            right: 0, // Ensure it spans to the right
                            px: 2,
                            zIndex: 10,
                        }}
                    >
                        <Toolbar
                            disableGutters
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center", // Vertically align items
                            }}
                        >
                            {/* Left Section: App Name & Optional History Toggle */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {user && !isHistoryChatVisible && (
                                    <IconButton
                                        onClick={toggleHistoryChat}
                                        sx={{
                                            color: { xs: "white", md: "primary.main" },
                                            "&:hover": { color: "text.primary" }
                                        }}
                                    >
                                        <FormatListBulletedIcon />
                                    </IconButton>
                                )}

                                {/* App Name */}
                                <Typography
                                    fontWeight="bold"
                                    variant={isMobile ? "h6" : "h5"} // Responsive font size
                                    sx={{ color: { xs: "white", md: "primary.main" } }}
                                >
                                    LexMedica
                                </Typography>
                            </Box>

                            {/* Right Section: Account Buttons */}
                            <Box sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
                                {!user ? (
                                    <>
                                        <Link to="/login" style={{ textDecoration: "none" }}>
                                            <Button variant="contained" size={isMobile ? "small" : "medium"}>
                                                Masuk
                                            </Button>
                                        </Link>
                                        <Link to="/register" style={{ textDecoration: "none" }}>
                                            <Button variant="outlined" size={isMobile ? "small" : "medium"} sx={{
                                                color: "primary.main",
                                                border: "2px solid",
                                                borderColor: "primary.main"
                                            }}>
                                                Daftar
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <UserMenu user={user} />
                                )}
                            </Box>
                        </Toolbar>
                    </Box>

                    {/* Fourth Box: Chat Messages */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            overflowY: "auto",
                            // scrollbarWidth: "none",
                            justifyContent: "center",
                            pt: { xs: `calc(${toolbarHeight.xs})`, md: 0 },
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
                                    alignItems: "center",
                                    height: "100%",
                                    px: 2,
                                }}
                            >
                                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" color={"primary.main"}>
                                    Selamat datang di LexMedica!
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                                    Silakan ajukan pertanyaan seputar hukum kesehatan Indonesia
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{
                                width: {
                                    xs: '90%',
                                    md: isHistoryChatVisible && !isMobile ? '70%' : '60%',
                                    lg: isHistoryChatVisible && !isMobile ? '60%' : '50%',
                                },
                                maxWidth: '900px',
                                mx: 'auto',
                            }}>
                                <ChatMessages
                                    chatMessages={chatMessages}
                                    isBotQnALoading={isBotQnAResponding}
                                    isBotDisharmonyLoading={isBotDisharmonyResponding} />
                                <div ref={messagesEndRef} />
                            </Box>
                        )}
                    </Box>

                    {/* Fifth Box: Fixed Chat Input */}
                    <Box
                        component="footer"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            pb: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: {
                                    xs: '90%',
                                    md: isHistoryChatVisible && !isMobile ? '70%' : '60%',
                                    lg: isHistoryChatVisible && !isMobile ? '60%' : '50%',
                                },
                                maxWidth: '900px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mx: 'auto'
                            }}
                        >
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
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 1,
                                    fontSize: { xs: '0.55rem', sm: '0.7rem', md: '0.8rem' },
                                    textAlign: 'center', color: theme.palette.text.secondary
                                }}>
                                Jawaban digenerasi dengan AI sehingga mungkin melakukan kesalahan
                            </Typography>
                        </Box>
                    </Box>
                </Grid >
            </Grid >
        </>
    );
};

export default QnAPage;
