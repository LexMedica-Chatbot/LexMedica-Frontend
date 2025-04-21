// Desc: Chat messages component containing the bubble messages between user and bot
// ** React Import
import React from "react";
import ReactMarkdown from "react-markdown";

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

interface Message {
    message: string;
    sender: "user" | "bot";
}

interface ChatMessagesProps {
    messages: Message[];
    isBotLoading: boolean;
    handleOpenViewer: (url: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isBotLoading, handleOpenViewer }) => {
    return (
        <List>
            {messages.map((msg, index) => (
                <ListItem
                    key={index}
                    sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}
                >
                    {isBotLoading && index === messages.length - 1 ? (
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
                            <ReactMarkdown
                                children={msg.message}
                                components={{
                                    p: ({ node, ...props }) => <Typography variant="body1" sx={{ mb: 1 }} {...props} />,
                                    strong: ({ node, ...props }) => <strong style={{ fontWeight: 600 }} {...props} />,
                                    em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
                                    ol: ({ node, ...props }) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
                                    li: ({ node, ...props }) => <li {...props} />,
                                    code: ({ node, ...props }) => <code style={{ backgroundColor: '#f5f5f5', padding: '0.2rem 0.4rem', borderRadius: '4px' }} {...props} />
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
                                            primary={"Regulasi pada pasal sekian memiliki potensi disharmoni dengan pasal berikut ...."}
                                            sx={{ wordWrap: "break-word" }}
                                        />
                                        <Button onClick={() => handleOpenViewer(`${process.env.REACT_APP_BACKEND_URL}/docs/UU Nomor 17 Tahun 2023.pdf`)}>
                                            UU Nomor 73 Tahun 2023
                                        </Button>
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
