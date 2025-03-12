import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onHeightChange: (height: number) => void; // Callback to report height
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onHeightChange }) => {
    const [input, setInput] = useState<string>("");
    const inputRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input) return;  // Prevent sending empty messages
        onSendMessage(input); // Send the message with exact content
        setInput(""); // Clear input after sending
    };

    // Handle key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents new line
            handleSend();
        }
    };

    // Report input height to Chat.tsx
    useEffect(() => {
        if (inputRef.current) {
            onHeightChange(inputRef.current.offsetHeight);
        }
    }, [input]);

    return (
        <Box
            ref={inputRef}
            sx={{
                position: "fixed",

                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                bgcolor: "background.paper",
                p: 1,
                boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown} // Updated to handle Enter properly
                multiline
                maxRows={7} // Expands up to 7 lines
                sx={{
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                        padding: "10px",
                    },
                }}
            />
            <IconButton color="primary" onClick={handleSend} sx={{ ml: 1, alignSelf: "flex-end" }}>
                <SendIcon />
            </IconButton>
        </Box>
    );
};

export default ChatInput;
