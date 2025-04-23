// ** React Imports
import ReactMarkdown from "react-markdown";

// ** MUI Imports
import Typography from "@mui/material/Typography";

interface ChatMarkdownProps {
    message: string;
}

const ChatMarkdown: React.FC<ChatMarkdownProps> = ({message}) => {
    // Function to format markdown text
    const formatMarkdown = (text: string) => {
        // Remove extra newlines between list items (lines starting with a number or dash)
        return text.replace(/(\d+\.\s[^\n]+)\n\n(?=\d+\.\s)/g, '$1\n')
            .replace(/(-\s[^\n]+)\n\n(?=-\s)/g, '$1\n');
    };
    return (
        <ReactMarkdown
            children={formatMarkdown(message)}
            components={{
                p: ({ node, ...props }) => (
                    <Typography variant="body1" {...props} />
                ),
                strong: ({ node, ...props }) => (
                    <strong style={{ fontWeight: 600 }} {...props} />
                ),
                em: ({ node, ...props }) => (
                    <em style={{ fontStyle: 'italic' }} {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul style={{ marginTop: '-1.25rem', paddingLeft: '2.5rem' }} {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol style={{ marginTop: '-1.25rem', paddingLeft: '2.5rem' }} {...props} />
                ),
                li: ({ node, ...props }) => (
                    <li
                        style={{
                            paddingLeft: '0.25rem',
                            marginTop: '-1.25rem',
                        }}
                        {...props}
                    />
                ),
                code: ({ node, ...props }) => (
                    <code
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                        }}
                        {...props}
                    />
                ),
            }}
        />
    )
}

export default ChatMarkdown;