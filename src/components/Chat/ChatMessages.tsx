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
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// ** Types Import
import { ChatMessage } from "../../types/Chat";
import { Document } from "../../types/Document";

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
    const [pageNumber, setPageNumber] = useState<number>(1);

    const handleOpenDocumentViewer = (url: string) => {
        setPdfUrl(url);
        setIsDocumentViewerOpened(true);
    };

    const handleCloseDocumentViewer = () => {
        setIsDocumentViewerOpened(false);
        setPdfUrl(null);
    };

    const loadingStages = [
        "Menelusuri dokumen hukum",
        "Menganalisis hasil temuan",
        "Menggabungkan informasi",
        "Memverifikasi jawaban",
        "Menyusun jawaban akhir",
        "Melakukan validasi akhir"
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

    const isDocumentSourceComplete = (document: Document) => {
        // Check if document and document.source exist first
        if (!document || !document.source) {
            return false;
        }

        const { url, type, number, year, about, status } = document.source;
        return (
            url !== undefined &&
            type !== undefined &&
            number !== undefined &&
            year !== undefined &&
            about !== undefined &&
            status !== undefined
        );
    };

    const formatProcessingTime = (ms = 0) => {
        if (ms === 0) {
            return '0.0'; // Handle zero case directly
        }
        const seconds = ms / 1000;
        const roundedUpSeconds = Math.ceil(seconds * 10) / 10;
        return roundedUpSeconds.toFixed(1);
    };

    const [copyAnswerTooltip, setCopyAnswerTooltip] = React.useState("Salin");
    const [copyDisharmonyTooltip, setCopyDisharmonyTooltip] = React.useState("Salin");

    return (
        <>
            <List>
                {chatMessages.map((msg, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            px: 0,
                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                        }}
                    >
                        {((isBotQnALoading || isBotDisharmonyLoading) && index === chatMessages.length - 1) ? (
                            <Paper
                                sx={{
                                    p: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    position: "relative",
                                    overflow: "hidden",
                                    bgcolor: "grey.100",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    // Improved Shimmer effect
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: "-150%",
                                        width: "250%",
                                        height: "100%",
                                        background: `linear-gradient(
                                        100deg,
                                        transparent 25%,
                                        rgba(232, 176, 62, 0.4) 50%,
                                        transparent 75%
                                        )`,
                                        animation: "shimmer 1.8s infinite linear",
                                    },

                                    "@keyframes shimmer": {
                                        "0%": {
                                            left: "-150%",
                                        },
                                        "100%": {
                                            left: "150%",
                                        },
                                    },
                                }}
                            >
                                <Box
                                    display={"flex"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                    sx={{
                                        mr: 2,
                                        width: { xs: 16, sm: 18, md: 20 },
                                        height: { xs: 16, sm: 18, md: 20 },
                                    }}
                                >
                                    <CircularProgress
                                        size="100%"
                                    />
                                </Box>
                                <ListItemText
                                    primary={
                                        msg.message !== "" && isBotDisharmonyLoading
                                            ? `Menganalisis potensi disharmoni${dots}`
                                            : `${loadingStages[loadingStageIndex]}${dots}`
                                    }
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: { xs: "0.75rem", sm: "1rem" },
                                            wordBreak: "break-word",
                                        }
                                    }}
                                />
                            </Paper>
                        ) : (
                            <>
                                {(msg.message !== "") && (
                                    <Paper
                                        sx={{
                                            position: 'relative',
                                            pt: msg.sender === "user" ? 1 : { xs: 0.5, sm: 2 },
                                            pb: msg.sender === "user" ? 1 : { xs: 2, sm: 4 },
                                            px: msg.sender === "user" ? 2 : { xs: 2, sm: 4 },
                                            borderRadius: 2,
                                            bgcolor: msg.sender === "user" ? "secondary.light" : "grey.100",
                                            color: msg.sender === "user" ? "white" : "black",
                                            maxWidth: "100%",
                                            wordBreak: "break-word",
                                            overflowWrap: "anywhere",
                                            whiteSpace: "pre-wrap",
                                            boxShadow: 2,
                                        }}
                                    >
                                        {/* Info Icon */}
                                        {((msg.processing_time_ms && msg.processing_time_ms !== 0) || (msg.disharmony?.processing_time_ms && msg.disharmony.processing_time_ms !== 0)) && (
                                            <Box sx={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 1 }}>
                                                {/* Copy Answer Icon */}
                                                <Tooltip title={copyAnswerTooltip}>
                                                    <ContentCopyIcon
                                                        sx={{
                                                            fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                            color: "primary.main",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(msg.message);
                                                            setCopyAnswerTooltip("Jawaban disalin!");

                                                            // Reset back to default after 2-3 seconds
                                                            setTimeout(() => {
                                                                setCopyAnswerTooltip("Salin");
                                                            }, 3000);
                                                        }
                                                        }
                                                    />
                                                </Tooltip>

                                                <Tooltip
                                                    arrow
                                                    enterTouchDelay={0}
                                                    leaveTouchDelay={5000}
                                                    title={
                                                        <Typography variant="body2" sx={{ color: "white" }}>
                                                            <div>Waktu Pemrosesan</div>
                                                            <Box display="flex">
                                                                <Box mr={1}><strong>Tanya Jawab Hukum RAG</strong>:</Box>
                                                                <Box>{formatProcessingTime(msg.processing_time_ms) ?? 0} s</Box>
                                                            </Box>
                                                            <Box display="flex">
                                                                <Box mr={1}><strong>Analisis Potensi Disharmoni</strong>:</Box>
                                                                <Box>{formatProcessingTime(msg.disharmony?.processing_time_ms) ?? 0} s</Box>
                                                            </Box>
                                                        </Typography>
                                                    }
                                                >
                                                    <InfoOutlinedIcon
                                                        sx={{
                                                            fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                            color: "primary.main",
                                                            cursor: "pointer"
                                                        }}
                                                    />
                                                </Tooltip>
                                            </Box>
                                        )}

                                        {/* QNA Message */}
                                        <Box>
                                            {msg.sender === "bot" ? (
                                                <ChatMarkdown message={msg.message} />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                        width: "100%"
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: "0.75rem", sm: "1rem" },
                                                            textAlign: "right",
                                                            wordBreak: "break-word",
                                                            overflowWrap: "anywhere",
                                                            whiteSpace: "pre-wrap",
                                                        }}
                                                    >
                                                        {msg.message}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Anotation */}
                                        {msg.sender === "bot" && (
                                            <>
                                                {(msg.documents || msg.disharmony) && (
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
                                                            sx={{ mt: 1, width: "100%", fontSize: { xs: "0.7rem", sm: "0.9rem" } }}
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
                                                                    padding: { xs: 0, sm: 1 },
                                                                    mt: 2
                                                                }}
                                                            >
                                                                {msg.documents &&
                                                                    msg.documents.length > 0 &&
                                                                    msg.documents.every(isDocumentSourceComplete) && (
                                                                        <Box width={"100%"}>
                                                                            <Typography
                                                                                fontWeight={"bold"}
                                                                                variant={"h6"}
                                                                                px={2}
                                                                                py={1}
                                                                                sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                                                                            >
                                                                                Sumber Rujukan
                                                                            </Typography>

                                                                            <List sx={{ color: "black", pl: { xs: 3, sm: 4 } }}>
                                                                                {msg.documents.map((document, index) => (
                                                                                    <Box key={index}>
                                                                                        <ListItem
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
                                                                                                    fontSize: { xs: "0.7rem", sm: "0.9rem" },
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
                                                                                                    setPageNumber(document.page_number);
                                                                                                }}
                                                                                                sx={{
                                                                                                    bgcolor: "secondary.main",
                                                                                                    fontSize: { xs: "0.6rem", sm: "0.9rem" }
                                                                                                }}
                                                                                            >
                                                                                                <DescriptionIcon sx={{
                                                                                                    mr: 1,
                                                                                                    fontSize: { xs: "0.9rem", sm: "1.2rem" }
                                                                                                }} />
                                                                                                {`${document.source.type} No. ${document.source.number} Tahun ${document.source.year} ${document.clause}`}
                                                                                            </Button>

                                                                                            {/* Metadata Box */}
                                                                                            <Box mt={1}>
                                                                                                {/* Tentang */}
                                                                                                <Box display="flex" alignItems="flex-start" mb={0.8} sx={{ pr: { xs: 2, sm: 3, md: 4 } }}>
                                                                                                    <Typography
                                                                                                        fontWeight="bold"
                                                                                                        sx={{
                                                                                                            minWidth: { xs: '60px', sm: '80px' },
                                                                                                            flexShrink: 0,
                                                                                                            fontSize: { xs: "0.7rem", sm: "0.9rem" }
                                                                                                        }}
                                                                                                    >
                                                                                                        Tentang
                                                                                                    </Typography>
                                                                                                    <Typography
                                                                                                        sx={{
                                                                                                            whiteSpace: 'pre-wrap',
                                                                                                            fontSize: { xs: "0.7rem", sm: "0.9rem" }
                                                                                                        }}>
                                                                                                        {document.source.about}
                                                                                                    </Typography>
                                                                                                </Box>

                                                                                                {/* Status */}
                                                                                                <Box display="flex" alignItems="center">
                                                                                                    <Typography
                                                                                                        fontWeight="bold"
                                                                                                        sx={{
                                                                                                            minWidth: { xs: '60px', sm: '80px' },
                                                                                                            flexShrink: 0,
                                                                                                            fontSize: { xs: "0.7rem", sm: "0.9rem" }
                                                                                                        }}
                                                                                                    >
                                                                                                        Status
                                                                                                    </Typography>
                                                                                                    <Typography
                                                                                                        sx={{
                                                                                                            color: document.source.status === "Berlaku" ? 'success.light' : 'error.light',
                                                                                                            whiteSpace: 'pre-wrap',
                                                                                                            fontSize: { xs: "0.7rem", sm: "0.9rem" },
                                                                                                            fontWeight: 'bold'
                                                                                                        }}>
                                                                                                        {document.source.status}
                                                                                                    </Typography>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </ListItem>

                                                                                        <Box my={2} ml={-1} sx={{ pr: { xs: 2, sm: 3, md: 4 } }}>
                                                                                            <Divider sx={{ borderBottomWidth: 3 }} />
                                                                                        </Box>
                                                                                    </Box>
                                                                                ))}
                                                                            </List>
                                                                        </Box>
                                                                    )}

                                                                {msg.disharmony && msg.disharmony.analysis && (
                                                                    <Box mt={1}>
                                                                        <Box
                                                                            display="flex"
                                                                            flexDirection={{ xs: "column", sm: "row" }}
                                                                            alignItems={{ xs: "flex-start", sm: "center" }}
                                                                            justifyContent="space-between"
                                                                            gap={1}
                                                                            px={2}
                                                                        >
                                                                            <Box display={'flex'} gap={1} alignItems={"center"}>
                                                                                <Typography
                                                                                    fontWeight="bold"
                                                                                    variant="h6"
                                                                                    sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                                                                                >
                                                                                    Analisis Potensi Disharmoni
                                                                                </Typography>

                                                                                {/* Copy Disharmony Icon */}
                                                                                <Tooltip title={copyDisharmonyTooltip}>
                                                                                    <ContentCopyIcon
                                                                                        sx={{
                                                                                            fontSize: { xs: "0.9rem", md: "1.1rem" },
                                                                                            color: "primary.main",
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                        onClick={() => {
                                                                                            navigator.clipboard.writeText(msg.disharmony!.analysis);
                                                                                            setCopyDisharmonyTooltip("Analisis disalin!");

                                                                                            // Reset back to default after 2-3 seconds
                                                                                            setTimeout(() => {
                                                                                                setCopyDisharmonyTooltip("Salin");
                                                                                            }, 3000);
                                                                                        }
                                                                                        }
                                                                                    />
                                                                                </Tooltip>
                                                                            </Box>

                                                                            <Chip
                                                                                label={
                                                                                    msg.disharmony.result
                                                                                        ? "Berpotensi Disharmoni"
                                                                                        : "Tidak Berpotensi Disharmoni"
                                                                                }
                                                                                sx={{
                                                                                    fontWeight: "bold",
                                                                                    fontSize: { xs: "0.7rem", sm: "0.9rem" },
                                                                                    bgcolor: msg.disharmony.result ? "error.main" : "success.light",
                                                                                    color: "white",
                                                                                    borderRadius: "4px",
                                                                                }}
                                                                            />
                                                                        </Box>

                                                                        <Box px={2} mt={2}>
                                                                            <ChatMarkdown message={msg.disharmony.analysis} />
                                                                        </Box>
                                                                    </Box>

                                                                )}
                                                            </Box>
                                                        </Collapse>
                                                    </>
                                                )}
                                            </>
                                        )}
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
                pageNumber={pageNumber}
            />
        </>
    );
};

export default ChatMessages;
