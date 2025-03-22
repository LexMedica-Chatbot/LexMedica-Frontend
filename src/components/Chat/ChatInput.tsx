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

interface ChatInputProps {
    onNewChat: () => void;
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onNewChat, onSendMessage }) => {
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
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={7}
                inputRef={inputRef} // Attach ref to input
                sx={{
                    border: "none",
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                        padding: "10px",
                    },
                }}
            />

            {/* Send Button */}
            <Tooltip title="Kirim" arrow>
                <IconButton
                    color="secondary"
                    onClick={handleSend}
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                        alignSelf: "flex-end"
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ChatInput;