// Desc: Chat input component for user to send messages to bot
// ** React Imports
import React, { useState, useRef } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

// ** MUI Icons
import SendIcon from "@mui/icons-material/Send";
import CreateIcon from '@mui/icons-material/Create';
import StopCircleIcon from '@mui/icons-material/StopCircle';

interface ChatInputProps {
    isBotQnALoading: boolean;
    isBotDisharmonyLoading: boolean;
    setIsBotQnALoading: (state: boolean) => void;
    setIsBotDisharmonyLoading: (state: boolean) => void;
    onNewChat: () => void;
    onSendMessage: (message: string) => void;
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

    // Handle sending message
    const handleSend = () => {
        if (!input) return;  // Prevent sending empty messages
        onSendMessage(input);
        setInput(""); // Clear input after sending
        setTimeout(() => inputRef.current?.focus(), 100); // Auto-focus after state update
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
        setInput(""); // Clear input
        setTimeout(() => inputRef.current?.focus(), 100); // Auto-focus after state update
    };

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: "lightgray",
                p: 1,
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
                    color="secondary"
                    onClick={handleNewChat}
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                        alignSelf: "flex-start"
                    }}
                >
                    <CreateIcon />
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
                inputRef={inputRef} // Attach ref to input
                sx={{
                    bgcolor: "white",
                    borderRadius: 1,
                    decoration: "none",
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                        padding: "10px",
                    },
                }}
            />

            {isBotQnALoading || isBotDisharmonyLoading ? (
                <>
                    {/* Send Button */}
                    <Tooltip title="Stop" arrow>
                        <span>
                            <IconButton
                                color="error"
                                onClick={() => {
                                    setIsBotQnALoading(false);
                                    setIsBotDisharmonyLoading(false);
                                    if (controllerQnARef.current) controllerQnARef.current.abort();
                                    controllerQnARef.current = null;
                                    if (controllerDisharmonyRef.current) controllerDisharmonyRef.current.abort();
                                    controllerDisharmonyRef.current = null;
                                }}
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    alignSelf: "flex-end"
                                }}
                            >
                                <StopCircleIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </>
            ) : (
                <>
                    {/* Send Button */}
                    <Tooltip title="Kirim" arrow>
                        <span>
                            <IconButton
                                color="secondary"
                                onClick={handleSend}
                                disabled={!input.trim()}
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    alignSelf: "flex-end"
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </>
            )}
        </Box >
    );
};

export default ChatInput;