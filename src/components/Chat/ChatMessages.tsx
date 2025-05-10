// Desc: Chat Messages component containing the bubble Messages between user and bot
// ** React Import
import React, { useState } from "react";

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
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// ** Types Import
import { ChatMessage } from "../../types/Chat";

// ** Components Import
import ChatMarkdown from "./ChatMarkdown";
import DocumentViewer from "../Document/DocumentViewer";

interface ChatMessagesProps {
    chatMessages: ChatMessage[];
    isBotQnALoading: boolean;
    isBotDisharmonyLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
    chatMessages,
    isBotQnALoading,
    isBotDisharmonyLoading
}) => {
    const [openAnnotations, setOpenAnnotations] = React.useState<number[]>([]);

    const toggleAnnotation = (index: number) => {
        setOpenAnnotations((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    // Document Viewer Properties
    const [isDocumentViewerOpened, setIsDocumentViewerOpened] = useState<boolean>(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [snippet, setSnippet] = useState<string | null>(null);

    const handleOpenDocumentViewer = (url: string) => {
        setPdfUrl(url);
        setIsDocumentViewerOpened(true);
    };

    const handleCloseDocumentViewer = () => {
        setIsDocumentViewerOpened(false);
        setPdfUrl(null);
    };

    return (
        <>
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
                                    py: msg.sender === "user" ? 1 : 2,
                                    px: msg.sender === "user" ? 3 : 4,
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
                                        {msg.documents && msg.documents.length > 0 && (
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
                                                    variant="contained"
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
                                                            marginTop: 1
                                                        }}
                                                    >
                                                        <Box width={"100%"}>
                                                            <Typography
                                                                fontWeight={"bold"}
                                                                variant={"h6"}
                                                                pl={2}
                                                            >
                                                                Sumber Rujukan
                                                            </Typography>
                                                            <List sx={{ color: "black", px: 4 }}>
                                                                {msg.documents.map((document, index) => (
                                                                    <ListItem
                                                                        key={index}
                                                                        disableGutters
                                                                        alignItems="center"
                                                                        sx={{
                                                                            display: "list-item",
                                                                            listStyleType: "decimal",
                                                                            py: 0,
                                                                            pl: 1.5,
                                                                            ml: 0.5,
                                                                            width: "100%",
                                                                            '&::marker': {
                                                                                fontSize: '1rem',
                                                                                fontWeight: 'bold'
                                                                            },
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            variant="contained"
                                                                            disabled={document.source.url === ""}
                                                                            onClick={() => {
                                                                                handleOpenDocumentViewer(document.source.url)
                                                                                setSnippet(document.snippet.length > 20
                                                                                    ? document.snippet.slice(0, 20)
                                                                                    : document.snippet)
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                display={"flex"}
                                                                                alignItems={"center"}
                                                                                gap={0.75}
                                                                            >
                                                                                <DescriptionIcon />
                                                                                <Typography
                                                                                    fontWeight={"bold"}
                                                                                    variant={"body2"}
                                                                                    color={"black"}
                                                                                >
                                                                                    {document.source.title}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Button>

                                                                        <Typography component="div" mt={1}>
                                                                            {document.snippet.split("\n").map((line, idx) => {
                                                                                const isBullet = /^[a-z]\.|^\d+\.|^[•-]/.test(line.trim());
                                                                                const match = line.match(/^(\(\d+\))\s?(.*)/); // Match (1) at the start

                                                                                return (
                                                                                    <Typography
                                                                                        key={idx}
                                                                                        component="div"
                                                                                        sx={{
                                                                                            fontSize: "0.95rem",
                                                                                            marginLeft: isBullet ? "1.5em" : 0,
                                                                                            mb: 1.5,
                                                                                        }}
                                                                                    >
                                                                                        {match ? (
                                                                                            <>
                                                                                                <strong>{match[1]}</strong> {match[2]}
                                                                                            </>
                                                                                        ) : (
                                                                                            line
                                                                                        )}
                                                                                    </Typography>
                                                                                );
                                                                            })}
                                                                        </Typography>
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Box>
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
                                                        ) : (msg.disharmony && msg.disharmony.result && (
                                                            <>
                                                                <Box
                                                                    display={"flex"}
                                                                    alignItems={"center"}
                                                                    gap={0.75}
                                                                    mb={1}
                                                                >
                                                                    <Typography
                                                                        fontWeight={"bold"}
                                                                        variant={"h6"}
                                                                    >
                                                                        Hasil Analisis Potensi Disharmoni Regulasi
                                                                    </Typography>
                                                                </Box>
                                                                <Box>
                                                                    <ChatMarkdown
                                                                        message={msg.disharmony.result}
                                                                    />
                                                                </Box>
                                                            </>
                                                        )
                                                        )}
                                                    </Box>
                                                </Collapse>
                                            </>
                                        )}
                                    </>
                                )}
                            </Paper>
                        )}
                    </ListItem>
                ))}
            </List>

            {/* Document Viewer Modal */}
            <DocumentViewer
                isDocumentViewerOpened={isDocumentViewerOpened}
                onCloseDocumentViewer={handleCloseDocumentViewer}
                pdfUrl={pdfUrl}
                snippet={snippet}
            />
        </>
    );
};

export default ChatMessages;
