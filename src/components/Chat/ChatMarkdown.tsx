import React from "react";
import { Typography, Box } from "@mui/material";

// Helper: Apply bold and italic styles
function applyInlineStyles(text: string): React.ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        } else if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
}

// Helper: Detect and format paragraphs and lists
function parseMarkdownParagraph(text: string): React.ReactNode {
    const lines = text.split("\n");

    return (
        <Typography component="div" mt={1}>
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                const indentLevel = Math.floor((line.match(/^\s*/)?.[0].length || 0) / 2);

                const match = trimmed.match(/^(\(\d+\))\s?(.*)/);
                const bulletMatch = trimmed.match(/^([-•]|\d+\.)\s(.*)/);

                const content = match
                    ? applyInlineStyles(match[2])
                    : bulletMatch
                        ? applyInlineStyles(bulletMatch[2])
                        : applyInlineStyles(trimmed);

                const bullet = match
                    ? null
                    : bulletMatch
                        ? bulletMatch[1]
                        : null;

                return (
                    <Box
                        key={idx}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: bullet ? "auto 1fr" : "1fr",
                            gap: 1,
                            alignItems: "start",
                            ml: `${1.25 * indentLevel}em`,
                            mb: 1,
                        }}
                    >
                        {bullet && (
                            <Typography
                                component="span"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", sm: "1rem" },
                                    lineHeight: 1.5,
                                }}
                            >
                                {bullet}
                            </Typography>
                        )}
                        <Typography
                            component="div"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "1rem" },
                                flex: 1,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {match ? (
                                <>
                                    <strong>{match[1]}</strong> {applyInlineStyles(match[2])}
                                </>
                            ) : (
                                content
                            )}
                        </Typography>
                    </Box>
                );
            })}
        </Typography>
    );
}

interface ChatMarkdownProps {
    message: string;
}

const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ message }) => {
    return (
        <Box>
            {message
                .split("\n\n")
                .map((block, idx) => (
                    <React.Fragment key={idx}>
                        {parseMarkdownParagraph(block)}
                    </React.Fragment>
                ))}
        </Box>
    );
};

export default ChatMarkdown;
