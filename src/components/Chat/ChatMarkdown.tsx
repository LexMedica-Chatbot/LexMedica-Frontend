// ** React Imports
import ReactMarkdown from "react-markdown";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface ChatMarkdownProps {
    message: string;
}

const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ message }) => {
    const formatMarkdown = (text: string) => {
        return text
            // Remove double line breaks after colons if followed by list or quote
            .replace(/:\n\n(?=(?:-|\d+\.|>|“|"))/g, ':')
            // Merge bullet points with less spacing
            .replace(/(-\s[^\n]+)\n\n(?=-\s)/g, '$1')
            .replace(/(\d+\.\s[^\n]+)\n\n(?=\d+\.\s)/g, '$1');
    };

    const formattedMessage = formatMarkdown(message);

    return (
        <ReactMarkdown
            children={formattedMessage}
            components={{
                p: ({ node, ...props }) => <Typography {...props} />,
                strong: ({ node, ...props }) => <strong {...props} />,
                em: ({ node, ...props }) => <em {...props} />,
                code: ({ node, ...props }) => (
                    <code style={{ background: "#f5f5f5", borderRadius: 4, padding: "0.2rem 0.4rem" }} {...props} />
                ),
                pre: ({ node, ...props }) => (
                    <Box component="pre" sx={{ background: "#f5f5f5", p: 2, borderRadius: 2, overflowX: "auto" }} {...props} />
                ),
                ol: ({ node, ...props }) => <ol style={{ paddingLeft: "2rem" }} {...props} />,
                ul: ({ node, ...props }) => <ul style={{ paddingLeft: "2rem" }} {...props} />,
                li: ({ node, ...props }) => <li {...props} />,
            }}
        />
    );
};

export default ChatMarkdown;