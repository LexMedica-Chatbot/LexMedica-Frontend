// Desc: Chat Messages component containing the bubble Messages between user and bot
// ** React Import
import React, { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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

    const loadingStages = [
        "Menelusuri dokumen hukum ",
        "Menganalisis hasil temuan ",
        "Menggabungkan informasi ",
        "Memverifikasi jawaban "
    ];

    const [loadingStageIndex, setLoadingStageIndex] = useState(0);

    const [dots, setDots] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + "." : "."));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isBotQnALoading) {
            setLoadingStageIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setLoadingStageIndex((prev) =>
                prev < loadingStages.length - 1 ? prev + 1 : prev
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [isBotQnALoading]);

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
                        {(isBotQnALoading && index === chatMessages.length - 1) && msg.message === "" ? (
                            <Paper
                                sx={{
                                    p: 1.5,
                                    px: 4,
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
                                <ListItemText primary={`${loadingStages[loadingStageIndex]}${dots}`}
                                    sx={{ wordWrap: "break-word" }}
                                />
                            </Paper>
                        ) : (
                            <>
                                {(msg.message !== "") ? (
                                    <Paper
                                        sx={{
                                            pt: msg.sender === "user" ? 1 : 3,
                                            pb: msg.sender === "user" ? 1 : 4,
                                            px: msg.sender === "user" ? 2 : 4,
                                            borderRadius: 2,
                                            bgcolor: msg.sender === "user" ? "primary.main" : "grey.100",
                                            color: msg.sender === "user" ? "white" : "black",
                                            maxWidth: "80%",
                                            wordBreak: "break-word",
                                            overflowWrap: "anywhere",
                                            whiteSpace: "pre-wrap",
                                            boxShadow: 2,
                                        }}
                                    >
                                        {/* QNA Message */}
                                        <Box px={2}>
                                            <ChatMarkdown message={msg.message} />
                                        </Box>

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
                                                            <Typography color="secondary.main" variant="body2" fontWeight={"bold"}>
                                                                {openAnnotations.includes(index)
                                                                    ? "Sembunyikan Anotasi"
                                                                    : "Tampilkan Anotasi"}
                                                            </Typography>
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
                                                                    mt: 2
                                                                }}
                                                            >
                                                                <Box width={"100%"}>
                                                                    <Typography
                                                                        fontWeight={"bold"}
                                                                        variant={"h6"}
                                                                        px={2}
                                                                        py={1}
                                                                    >
                                                                        Sumber Rujukan
                                                                    </Typography>

                                                                    <List sx={{ color: "black", px: 4 }}>
                                                                        {msg.documents.map((document, index) => (
                                                                            <>
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
                                                                                    {/* Document Button */}
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        disabled={document.source.url === undefined}
                                                                                        onClick={() => {
                                                                                            handleOpenDocumentViewer(document.source.url ?? "");
                                                                                            setSnippet(document.snippet.length > 20
                                                                                                ? document.snippet.slice(0, 20)
                                                                                                : document.snippet);
                                                                                        }}
                                                                                        sx={{ bgcolor: "secondary.main" }}
                                                                                    >
                                                                                        <Box display="flex" alignItems="center">
                                                                                            <DescriptionIcon sx={{ color: "white", mr: 1 }} />
                                                                                            <Typography
                                                                                                fontWeight="bold"
                                                                                                color="white"
                                                                                                fontSize={"0.8rem"}
                                                                                            >
                                                                                                {`${document.source.type} Nomor ${document.source.number} Tahun ${document.source.year}`}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    </Button>

                                                                                    {/* Metadata Box */}
                                                                                    <Box mt={1}>
                                                                                        {/* Tentang */}
                                                                                        <Box display="flex" alignItems="flex-start" mb={0.75}>
                                                                                            <Typography
                                                                                                fontSize={"0.9rem"}
                                                                                                fontWeight="bold"
                                                                                                sx={{ minWidth: '80px', flexShrink: 0 }}
                                                                                            >
                                                                                                Tentang
                                                                                            </Typography>
                                                                                            <Typography
                                                                                                fontSize={"0.9rem"} sx={{ whiteSpace: 'pre-wrap' }}>
                                                                                                {document.source.about}
                                                                                            </Typography>
                                                                                        </Box>

                                                                                        {/* Status */}
                                                                                        <Box display="flex" alignItems="flex-start">
                                                                                            <Typography
                                                                                                fontSize={"0.9rem"}
                                                                                                fontWeight="bold"
                                                                                                sx={{ minWidth: '80px', flexShrink: 0 }}
                                                                                            >
                                                                                                Status
                                                                                            </Typography>
                                                                                            <Paper sx={{
                                                                                                px: 1,
                                                                                                py: 0.3,
                                                                                                bgcolor: document.source.status === 'Berlaku' ? 'primary.light' : 'error.light'
                                                                                            }} >
                                                                                                <Typography
                                                                                                    fontSize={"0.7rem"}
                                                                                                    fontWeight={"bold"}
                                                                                                    color={document.source.status === 'Berlaku' ? 'secondary.main' : 'white'}
                                                                                                >
                                                                                                    {document.source.status}
                                                                                                </Typography>
                                                                                            </Paper>
                                                                                        </Box>
                                                                                    </Box>

                                                                                    <Typography
                                                                                        display="flex"
                                                                                        justifyContent={"center"}
                                                                                        fontWeight="bold"
                                                                                        fontSize={"0.9rem"}
                                                                                        gutterBottom
                                                                                    >
                                                                                        {document.clause}
                                                                                    </Typography>

                                                                                    {document.snippet.split("\n").map((line, idx) => {
                                                                                        const isBullet = /^[a-z]\.|^\d+\.|^[•]/.test(line.trim());
                                                                                        const match = line.match(/^(\(\d+\))\s?(.*)/);

                                                                                        return (
                                                                                            <Typography
                                                                                                key={idx}
                                                                                                component="div"
                                                                                                sx={{
                                                                                                    fontSize: "0.9rem",
                                                                                                    marginLeft: isBullet ? "1.5em" : 0,
                                                                                                    mb: 0.75,
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
                                                                                </ListItem>

                                                                                <Box my={2} ml={-1}>
                                                                                    <Divider sx={{ borderBottomWidth: 3 }} />
                                                                                </Box>
                                                                            </>
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
                                                                            primary={"Menganalisis potensi disharmoni regulasi ..."}
                                                                            sx={{ wordWrap: "break-word" }}
                                                                        />
                                                                    </Paper>
                                                                ) : (msg.disharmony && msg.disharmony.analysis && (
                                                                    <Box>
                                                                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} mr={3}>
                                                                            <Typography
                                                                                fontWeight={"bold"}
                                                                                variant={"h6"}
                                                                                pl={2}
                                                                            >
                                                                                Hasil Analisis Potensi Disharmoni Regulasi
                                                                            </Typography>
                                                                            <Chip
                                                                                label={
                                                                                    msg.disharmony.result
                                                                                        ? "Berpotensi Disharmoni"
                                                                                        : "Tidak Berpotensi Disharmoni"
                                                                                }
                                                                                color={msg.disharmony.result ? "error" : "primary"}
                                                                                sx={{
                                                                                    fontWeight: 'bold',
                                                                                    fontSize: '0.65rem',
                                                                                    ml: 2,
                                                                                    bgcolor: msg.disharmony.result ? 'error.light' : 'primary.light',
                                                                                    color: msg.disharmony.result ? 'white' : 'secondary.main',
                                                                                    borderRadius: '8px'
                                                                                }}
                                                                            />
                                                                        </Box>

                                                                        <Box px={2} mt={2}>
                                                                            <ChatMarkdown
                                                                                message={msg.disharmony.analysis}
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                )
                                                                )}
                                                            </Box>
                                                        </Collapse>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Paper>
                                ) : (
                                    <Paper
                                        sx={{
                                            py: 2,
                                            px: 4,
                                            borderRadius: 2,
                                            bgcolor: "grey.100",
                                            maxWidth: "80%",
                                            wordBreak: "break-word",
                                            overflowWrap: "anywhere",
                                            whiteSpace: "pre-wrap",
                                            boxShadow: 2,
                                        }}
                                    >
                                        <ListItemText
                                            primary="Terjadi kesalahan!"
                                            primaryTypographyProps={{ color: "error.light", fontWeight: "bold" }}
                                        />
                                    </Paper>
                                )}
                            </>
                        )}
                    </ListItem>
                ))}
            </List >

            {/* Document Viewer Modal */}
            < DocumentViewer
                isDocumentViewerOpened={isDocumentViewerOpened}
                onCloseDocumentViewer={handleCloseDocumentViewer}
                pdfUrl={pdfUrl}
                snippet={snippet}
            />
        </>
    );
};

export default ChatMessages;
