// Desc: Chat input component for user to send messages to bot
// ** React Imports
import React, { useState, useEffect, useRef } from "react";

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
    onHeightChange: (height: number) => void; // Callback to report height
}

const ChatInput: React.FC<ChatInputProps> = ({ onNewChat, onSendMessage, onHeightChange }) => {
    const [input, setInput] = useState<string>("");
    const inputRef = useRef<HTMLDivElement>(null);

    // Handle sending message
    const handleSend = () => {
        if (!input) return;  // Prevent sending empty messages
        onSendMessage(input); // Send the message with exact content
        setInput(""); // Clear input after sending
    };

    // enter key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents new line
            handleSend();
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            onHeightChange(inputRef.current.offsetHeight);
        }
    }, [input]);

    return (
        <Box
            ref={inputRef}
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

            <Box>
                <Tooltip title="Chat Baru" arrow>
                    <IconButton
                        color="secondary"
                        onClick={onNewChat}
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
            </Box>

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
                    border: "none",
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                        padding: "10px",
                    },
                }}
            />
            <Box>
                <Tooltip title="Kirim" arrow>
                    <IconButton color="secondary"
                        onClick={handleSend} // Handle the action
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
        </Box>
    );
};

export default ChatInput;
