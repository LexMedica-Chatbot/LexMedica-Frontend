import React, { useState } from "react";
import { Box, TextField, IconButton, Paper, List, ListItem, ListItemText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Message {
    text: string;
    sender: "user" | "bot";
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const newMessage: Message = { text: input, sender: "user" };
        const aiResponse: Message = { text: `Interesting question about "${input}"!`, sender: "bot" };

        setMessages((prev) => [...prev, newMessage, aiResponse]);
        setInput("");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}>
            {/* Chat Messages (Scrollable) */}
            <Paper
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: 2,
                    borderRadius: 2,
                    mb: 2, // Space for input field
                }}
            >
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index} sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                            <Paper
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
                                    color: msg.sender === "user" ? "white" : "black",
                                    maxWidth: "75%",
                                }}
                            >
                                <ListItemText primary={msg.text} />
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Input Field (Fixed at Bottom) */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "background.paper",
                    p: 1,
                    boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
                    display: "flex",
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <IconButton color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Chat;
