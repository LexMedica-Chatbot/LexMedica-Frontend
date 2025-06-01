// Desc: Chat input component for user to send messages to bot
// ** React Imports
import React, { useState, useRef } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

// ** MUI Icons
import SendIcon from "@mui/icons-material/Send";
import CreateIcon from '@mui/icons-material/Create';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Typography from "@mui/material/Typography";

interface ChatInputProps {
    isBotQnALoading: boolean;
    isBotDisharmonyLoading: boolean;
    setIsBotQnALoading: (state: boolean) => void;
    setIsBotDisharmonyLoading: (state: boolean) => void;
    onNewChat: () => void;
    onSendMessage: (message: string, modelUrl: string, embedding: string) => void;
    controllerQnARef: React.MutableRefObject<AbortController | null>;
    controllerDisharmonyRef: React.MutableRefObject<AbortController | null>;
}

const ChatInput: React.FC<ChatInputProps> = ({
    isBotQnALoading,
    isBotDisharmonyLoading,
    setIsBotQnALoading,
    setIsBotDisharmonyLoading,
    onNewChat,
    onSendMessage,
    controllerQnARef,
    controllerDisharmonyRef }
) => {
    const [input, setInput] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null); // Reference input field

    const simpleRAGUrl = process.env.REACT_APP_SIMPLE_RAG_URL || "";
    const multiAgentRAGUrl = process.env.REACT_APP_MULTI_AGENT_RAG_URL || "";

    // Model options
    const [selectedModelUrl, setSelectedModelUrl] = useState(simpleRAGUrl);
    // Embedding options
    const [selectedEmbedding, setSelectedEmbedding] = useState("small");

    // Handle sending message
    const handleSend = () => {
        if (!input) return;
        onSendMessage(input, selectedModelUrl, selectedEmbedding);
        setInput("");
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents new line
            handleSend();
        }
    };

    // Handle new chat
    const handleNewChat = () => {
        onNewChat();
        setInput("");
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const models = [
        { label: 'Simple RAG', value: simpleRAGUrl },
        { label: 'Multi-Agent RAG', value: multiAgentRAGUrl },
    ];

    const embeddings = [
        { label: 'Small', value: "small" },
        { label: 'Large', value: "large" },
    ]

    return (
        <Box
            sx={{
                width: "100%",
                p: 1,
                bgcolor: "primary.main",
                boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder={
                    isBotQnALoading || isBotDisharmonyLoading
                        ? "Bot sedang menjawab..."
                        : "Tulis pertanyaan hukum kesehatan Indonesia"
                }
                disabled={isBotQnALoading || isBotDisharmonyLoading}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={7}
                inputRef={inputRef}
                sx={{
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                        padding: 1,
                        color: 'white',

                        '& fieldset': {
                            border: 'none',
                        },
                        '&:hover fieldset': {
                            border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                            border: 'none',
                        },
                    },

                    // Input text
                    '& .MuiInputBase-input': {
                        color: 'white',
                        fontSize: { xs: '0.75rem', md: '0.9rem' },
                    },

                    // Placeholder color
                    '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        opacity: 1,
                    },

                    // Disabled input text
                    '& .Mui-disabled .MuiInputBase-input': {
                        WebkitTextFillColor: 'rgba(255, 255, 255, 0.6)',
                        color: 'rgba(255, 255, 255, 0.6)',
                    },

                    '& .Mui-disabled .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)',
                        opacity: 1,
                    },
                }}
            />

            {/* Control Row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Left Section: New Chat */}
                <Tooltip title="Chat Baru" arrow>
                    <IconButton
                        onClick={handleNewChat}
                        size="small"
                        sx={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                            px: 1,
                        }}
                    >
                        <CreateIcon sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" } }} />
                        <Typography fontSize={{ xs: "0.5rem", sm: "0.6rem", md: "0.7rem" }} color="white">
                            New Chat
                        </Typography>
                    </IconButton>
                </Tooltip>

                {/* Right Section: Embedding + Model Selectors + Send/Stop */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Embedding Selector */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3, mr: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", pb: 0.2 }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                                    color: "white",
                                    mr: 0.5
                                }}>
                                Embedding
                            </Typography>
                            <Tooltip arrow
                                title={
                                    <Typography variant={"body2"} sx={{ color: "white" }}>
                                        <div>Model kemiripan semantik antara pertanyaan dengan dokumen.</div>
                                        <Box display="flex">
                                            <Box mr={1}><strong>Small</strong>:</Box>
                                            <Box>Komputasi efisien namun lebih kurang akurat.</Box>
                                        </Box>
                                        <Box display="flex">
                                            <Box mr={1}><strong>Large</strong>:</Box>
                                            <Box>Lebih akurat namun memerlukan komputasi lebih banyak</Box>
                                        </Box>
                                    </Typography>
                                }>
                                <InfoOutlinedIcon
                                    sx={{
                                        fontSize: { xs: "0.9rem", md: "1rem" },
                                        color: "white",
                                        cursor: "pointer"
                                    }} />
                            </Tooltip>
                        </Box>
                        <Select
                            size="small"
                            value={selectedEmbedding}
                            onChange={(e) => setSelectedEmbedding(e.target.value)}
                            variant="standard"
                            disableUnderline
                            sx={{
                                fontWeight: "bold",
                                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                                borderRadius: 1,
                                height: "1.5rem",
                                py: 0.7,
                                '& .MuiSelect-select': {
                                    py: 0.5,
                                    px: 1.5,
                                }
                            }}
                        >
                            {embeddings.map((model) => (
                                <MenuItem key={model.value} value={model.value} sx={{ fontWeight: "bold" }}>
                                    {model.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Model Selector */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3, mr: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", pb: 0.2 }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                                    color: "white",
                                    mr: 0.5
                                }}>
                                Model
                            </Typography>
                            <Tooltip arrow title={
                                <Typography variant={"body2"} sx={{ color: "white" }}>
                                    <div>Agen pada model RAG yang digunakan.</div>
                                    <Box display="flex" width={"100%"}>
                                        <Box width={"28%"}><strong>Simple RAG</strong>:</Box>
                                        <Box width={"72%"}>Model RAG dengan agen sederhana dengan komputasi lebih cepat</Box>
                                    </Box>
                                    <Box display="flex" width={"100%"}>
                                        <Box width={"28%"}><strong>Multi-Agent</strong>:</Box>
                                        <Box width={"72%"}>Melibatkan agen tambahan, hasil dapat lebih akurat namun memerlukan waktu lebih lama</Box>
                                    </Box>
                                </Typography>
                            }>
                                <InfoOutlinedIcon
                                    sx={{
                                        fontSize: { xs: "0.9rem", md: "1rem" },
                                        color: "white",
                                        cursor: "pointer"
                                    }} />
                            </Tooltip>
                        </Box>
                        <Select
                            size="small"
                            value={selectedModelUrl}
                            onChange={(e) => setSelectedModelUrl(e.target.value)}
                            variant="standard"
                            disableUnderline
                            sx={{
                                fontWeight: "bold",
                                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                                borderRadius: 1,
                                height: "1.5rem",
                                py: 0.7,
                                '& .MuiSelect-select': {
                                    py: 0.5,
                                    px: 1.5,
                                }
                            }}
                        >
                            {models.map((model) => (
                                <MenuItem key={model.value} value={model.value} sx={{ fontWeight: "bold" }}>
                                    {model.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Send / Stop Button */}
                    {isBotQnALoading || isBotDisharmonyLoading ? (
                        <Tooltip title="Stop" arrow>
                            <span>
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        setIsBotQnALoading(false);
                                        setIsBotDisharmonyLoading(false);
                                        controllerQnARef.current?.abort();
                                        controllerDisharmonyRef.current?.abort();
                                    }}
                                    sx={{
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "8px",
                                        px: { xs: 1, md: 2 },
                                    }}
                                >
                                    <StopCircleIcon sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" } }} />
                                    <Typography fontSize={{ xs: "0.5rem", sm: "0.6rem", md: "0.7rem" }} color="white">
                                        Stop
                                    </Typography>
                                </IconButton>
                            </span>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Kirim" arrow>
                            <span>
                                <IconButton
                                    onClick={handleSend}
                                    size="small"
                                    disabled={!input.trim() || isBotQnALoading || isBotDisharmonyLoading}
                                    sx={{
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "8px",
                                        px: { xs: 1, md: 2 },
                                    }}
                                >
                                    <SendIcon
                                        sx={{
                                            fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                                            color:
                                                !input.trim() || isBotQnALoading || isBotDisharmonyLoading
                                                    ? "rgba(255, 255, 255, 0.5)"
                                                    : "white",
                                        }} />
                                    <Typography
                                        fontSize={{ xs: "0.5rem", sm: "0.6rem", md: "0.7rem" }}
                                        sx={{
                                            color:
                                                !input.trim() || isBotQnALoading || isBotDisharmonyLoading
                                                    ? "rgba(255, 255, 255, 0.5)"
                                                    : "white",
                                        }}
                                    >
                                        Send
                                    </Typography>
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box >
    );
};

export default ChatInput;