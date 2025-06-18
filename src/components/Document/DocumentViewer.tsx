// Desc: Document Viewer Component for LexMedica
// ** React Imports
import React from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

interface DocumentViewerProps {
    isDocumentViewerOpened: boolean;
    pdfUrl: string | null;
    pageNumber: number | null;
    onCloseDocumentViewer: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ isDocumentViewerOpened, onCloseDocumentViewer, pdfUrl, pageNumber }) => {
    return (
        <>
            {/* Document Viewer Modal */}
            <Modal open={isDocumentViewerOpened} onClose={onCloseDocumentViewer}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '90%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    outline: 'none',
                    borderRadius: 2
                }}>
                    {pdfUrl && (
                        <iframe
                            src={`${pdfUrl}#page=10`}
                            title="PDF Viewer"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default DocumentViewer;