import React from "react";
import { Paper, List, ListItem, ListItemText } from "@mui/material";

interface Message {
    text: string;
    sender: "user" | "bot";
}

interface ChatMessagesProps {
    messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
    // Function to convert newline characters into <br /> tags
    const formatMessageText = (text: string) => {
        return text.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    return (
        <List>
            {messages.map((msg, index) => (
                <ListItem
                    key={index}
                    sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}
                >
                    <Paper
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
                            color: msg.sender === "user" ? "white" : "black",
                            maxWidth: "85%",
                            wordWrap: "break-word", // Ensure word wrapping
                            overflow: "hidden", // Prevent overflow
                            whiteSpace: "pre-wrap", // Ensures that whitespace and newlines are preserved
                        }}
                    >
                        <ListItemText
                            primary={formatMessageText(msg.text)} // Use the function to format text
                            sx={{
                                wordWrap: "break-word", // Ensure word wrapping inside ListItemText
                            }}
                        />
                    </Paper>
                </ListItem>
            ))}
        </List>
    );
};

export default ChatMessages;
