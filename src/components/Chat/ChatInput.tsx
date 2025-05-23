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

    const singleAgentUrl = process.env.REACT_APP_SINGLE_AGENT_URL || "";
    const multiAgentUrl = process.env.REACT_APP_MULTI_AGENT_URL || "";

    // Model options
    const [selectedModelUrl, setSelectedModelUrl] = useState(singleAgentUrl);
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
        { label: 'Single-Agent', value: singleAgentUrl },
        { label: 'Multi-Agent', value: multiAgentUrl },
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
                alignItems: "center",
                gap: 1,
            }}
        >
            {/* New Chat Button */}
            <Tooltip title="Chat Baru" arrow>
                <IconButton
                    onClick={handleNewChat}
                    size="small"
                    sx={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                        alignSelf: 'flex-start',
                    }}
                >
                    <CreateIcon sx={{ color: 'white' }} />
                    <Typography fontSize={"0.7rem"} color="white">
                        New Chat
                    </Typography>
                </IconButton>
            </Tooltip>

            {/* Input Field */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder={isBotQnALoading || isBotDisharmonyLoading ? "Bot sedang menjawab..." : "Tulis pertanyaan hukum kesehatan Indonesia"}
                disabled={isBotQnALoading || isBotDisharmonyLoading}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={7}
                inputRef={inputRef}
                sx={{
                    bgcolor: "grey.200",
                    borderRadius: 1,
                    decoration: "none",
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                        padding: "10px",
                        borderRadius: 1,
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'primary.dark',
                        },
                    },
                }}
            />

            <Box display={"flex"} alignItems={"center"} sx={{ height: "100%" }} gap={1}>
                {/* Embedding Selector */}
                <Select
                    size="small"
                    value={selectedEmbedding}
                    onChange={(e) => setSelectedEmbedding(e.target.value)}
                    variant="standard"
                    disableUnderline
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        borderRadius: 1,
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

                {/* Model Selector */}
                <Select
                    size="small"
                    value={selectedModelUrl}
                    onChange={(e) => setSelectedModelUrl(e.target.value)}
                    variant="standard"
                    disableUnderline
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        borderRadius: 1,
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
                {isBotQnALoading || isBotDisharmonyLoading ? (
                    <>
                        {/* Send Button */}
                        <Tooltip title="Stop" arrow>
                            <span>
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        setIsBotQnALoading(false);
                                        setIsBotDisharmonyLoading(false);
                                        if (controllerQnARef.current) controllerQnARef.current.abort();
                                        controllerQnARef.current = null;
                                        if (controllerDisharmonyRef.current) controllerDisharmonyRef.current.abort();
                                        controllerDisharmonyRef.current = null;
                                    }}
                                    sx={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '8px',
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    <StopCircleIcon />
                                    <Typography fontSize={"0.7rem"} color="white">
                                        Stop
                                    </Typography>
                                </IconButton>
                            </span>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        {/* Send Button */}
                        < Tooltip title="Kirim" arrow>
                            <span>
                                <IconButton
                                    onClick={handleSend}
                                    size="small"
                                    disabled={!input.trim()}
                                    sx={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '8px',
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    <SendIcon />
                                    <Typography fontSize={"0.7rem"} color={!input.trim() ? "primary.dark" : "white"}>
                                        Send
                                    </Typography>
                                </IconButton>
                            </span>
                        </Tooltip>
                    </>
                )}
            </Box>
        </Box >
    );
};

export default ChatInput;