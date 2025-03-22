// Desc: Chat messages component containing the bubble messages between user and bot
// ** React Import
import React from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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

                        {msg.sender === "bot" && (
                            <Box sx={{ backgroundColor: "white", border: "1px solid", borderRadius: 2, padding: 1, marginTop: 1 }}>
                                <Box display={"flex"} alignItems={"center"} gap={1}>
                                    <ErrorOutlineIcon color="error" />
                                    <Typography fontWeight={"bold"} variant={"h6"}> Terdapat potensi disharmoni regulasi </Typography>
                                </Box>
                                <Box>
                                    <ListItemText
                                        primary={formatMessageText("Regulasi pada pasal sekian memiliki potensi disharmoni dengan pasal berikut ....")} // Use the function to format text
                                        sx={{
                                            wordWrap: "break-word", // Ensure word wrapping inside ListItemText
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </ListItem>
            ))}
        </List>
    );
};

export default ChatMessages;
