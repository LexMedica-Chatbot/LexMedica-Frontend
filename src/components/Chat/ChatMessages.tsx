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
import Collapse from "@mui/material/Collapse";

// ** MUI Icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// ** Types Import
import { ChatMessage } from "../../types/Chat";
import { Document } from "../../types/Document";

// ** Components Import
import ChatMarkdown from "./ChatMarkdown";

interface ChatMessagesProps {
    chatMessages: ChatMessage[];
    documents: Document[];
    isBotQnALoading: boolean;
    isBotDisharmonyLoading: boolean;
    onOpenDocumentViewer: (url: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
    chatMessages,
    documents,
    isBotQnALoading,
    isBotDisharmonyLoading,
    onOpenDocumentViewer,
}) => {
    const [openAnnotations, setOpenAnnotations] = React.useState<number[]>([]);

    const toggleAnnotation = (index: number) => {
        setOpenAnnotations((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return (
        <List>
            {chatMessages.map((msg, index) => (
                <ListItem
                    key={index}
                    sx={{
                        justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    }}
                >
                    {isBotQnALoading && index === chatMessages.length - 1 ? (
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
                                p: 2,
                                borderRadius: 2,
                                bgcolor:
                                    msg.sender === "user" ? "primary.main" : "grey.100",
                                color: msg.sender === "user" ? "white" : "black",
                                maxWidth: "80%",
                                wordBreak: "break-word",
                                overflowWrap: "anywhere",
                                whiteSpace: "pre-wrap",
                                boxShadow: 2,
                            }}
                        >
                            {/* QNA Message */}
                            <ChatMarkdown message={msg.message} />

                            {/* Anotation */}
                            {msg.sender === "bot" && (
                                <>
                                    {isBotDisharmonyLoading &&
                                        index === chatMessages.length - 1 ? (
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                maxWidth: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 2,
                                                bgcolor: "white",
                                                color: "black",
                                                mt: 1,
                                                border: "2px solid",
                                                borderColor: "primary.main",
                                            }}
                                        >
                                            <CircularProgress size={16} sx={{ mr: 2 }} />
                                            <ListItemText
                                                primary={"Bot sedang menganalisis regulasi ..."}
                                                sx={{ wordWrap: "break-word" }}
                                            />
                                        </Paper>
                                    ) : (
                                        <>
                                            {msg.disharmony_result && (
                                                <>
                                                    <Button
                                                        onClick={() => toggleAnnotation(index)}
                                                        endIcon={
                                                            openAnnotations.includes(index) ? (
                                                                <ExpandLessIcon />
                                                            ) : (
                                                                <ExpandMoreIcon />
                                                            )
                                                        }
                                                        sx={{ mt: 1, width: "100%" }}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        {openAnnotations.includes(index)
                                                            ? "Sembunyikan Anotasi"
                                                            : "Tampilkan Anotasi"}
                                                    </Button>

                                                    <Collapse
                                                        in={openAnnotations.includes(index)}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <Box
                                                            sx={{
                                                                backgroundColor: "white",
                                                                border: "2px solid",
                                                                borderRadius: 2,
                                                                borderColor: "primary.main",
                                                                padding: 1,
                                                                marginTop: 1,
                                                            }}
                                                        >
                                                            {documents.length > 0 && (
                                                                <>
                                                                    <Box
                                                                        display={"flex"}
                                                                        alignItems={"center"}
                                                                        gap={0.75}
                                                                    >
                                                                        <DescriptionIcon />
                                                                        <Typography
                                                                            fontWeight={"bold"}
                                                                            variant={"h6"}
                                                                        >
                                                                            Sumber Dokumen Rujukan
                                                                        </Typography>
                                                                    </Box>
                                                                    <List sx={{ color: "black", pl: 2 }}>
                                                                        {documents.map((document, index) => (
                                                                            <ListItem
                                                                                key={index}
                                                                                disableGutters
                                                                                sx={{
                                                                                    display: "list-item",
                                                                                    listStyleType: "disc",
                                                                                    py: 0,
                                                                                    ml: 4,
                                                                                }}
                                                                            >
                                                                                <Button
                                                                                    onClick={() =>
                                                                                        onOpenDocumentViewer(
                                                                                            document.source
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {document.title}
                                                                                </Button>
                                                                            </ListItem>
                                                                        ))}
                                                                    </List>
                                                                </>
                                                            )}
                                                            <Box
                                                                display={"flex"}
                                                                alignItems={"center"}
                                                                gap={0.75}
                                                                mb={1}
                                                                mt={2}
                                                            >
                                                                <ErrorOutlineIcon />
                                                                <Typography
                                                                    fontWeight={"bold"}
                                                                    variant={"h6"}
                                                                >
                                                                    Hasil Analisis Potensi Disharmoni Regulasi
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <ChatMarkdown
                                                                    message={msg.disharmony_result.analysis}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Collapse>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Paper>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

export default ChatMessages;
