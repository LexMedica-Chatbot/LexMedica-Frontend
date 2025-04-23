// Desc: Chat Messages component containing the bubble Messages between user and bot
// ** React Import
import React from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// ** Types Import
import { ChatMessage } from "../../types/Chat";
import { Document } from "../../types/Document";

// ** Components Import
import ChatMarkdown from "./ChatMarkdown";

interface ChatMessagesProps {
    chatMessages: ChatMessage[];
    documents: Document[];
    isBotLoading: boolean;
    isFoundDisharmony: boolean;
    onOpenDocumentViewer: (url: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatMessages, documents, isBotLoading, isFoundDisharmony, onOpenDocumentViewer }) => {
    return (
        <List>
            {chatMessages.map((msg, index) => (
                <ListItem
                    key={index}
                    sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}
                >
                    {isBotLoading && index === chatMessages.length - 1 ? (
                        <Paper
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: "grey.300",
                                color: "black",
                                maxWidth: "85%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                            <ListItemText
                                primary={"Bot sedang memproses ..."}
                                sx={{ wordWrap: "break-word" }}
                            />
                        </Paper>
                    ) : (
                        <Paper
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
                                color: msg.sender === "user" ? "white" : "black",
                                maxWidth: "85%",
                                wordWrap: "break-word",
                                overflow: "hidden",
                                whiteSpace: "pre-wrap",
                            }}
                        >

                            {/* QNA Message */}
                            <ChatMarkdown message={msg.message} />

                            {/* Anotation */}
                            {msg.sender === "bot" && isFoundDisharmony && (
                                <Box sx={{ backgroundColor: "white", border: "1px solid", borderRadius: 2, padding: 1, marginTop: 1 }}>
                                    <Box display={"flex"} alignItems={"center"} gap={1}>
                                        <ErrorOutlineIcon color="error" />
                                        <Typography fontWeight={"bold"} variant={"h6"}> Terdapat potensi disharmoni regulasi </Typography>
                                    </Box>
                                    <Box>

                                        {/* Disharmony Analysis */}
                                        <ChatMarkdown message={msg.message} />

                                        {/* Document Source */}
                                        {documents.map((document, index) => (
                                            <Button key={index} onClick={() => onOpenDocumentViewer(`${process.env.REACT_APP_BACKEND_URL}/docs/${document.title}`)}>
                                                {document.title}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    )}
                </ListItem>
            ))}
        </List>

    );
};

export default ChatMessages;
