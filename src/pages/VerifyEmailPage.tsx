// Desc: Email Verification page for LexMedica
// ** React Imports
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// ** Hooks
import { useAuth } from "../hooks/useAuth";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const { verifyEmail, resendEmailVerification, loading } = useAuth();
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [email, setEmail] = useState("");
    const [resendMessage, setResendMessage] = useState("");

    useEffect(() => {
        document.title = "Verifikasi Email | LexMedica";
        if (token) {
            verifyEmail(token).then(res => {
                setStatus(res.success ? "success" : "error");
                if (!res.success) {
                    const payload = parseJwt(token);
                    if (payload?.email) setEmail(payload.email);
                }
            });
        }
    }, [token, verifyEmail]);

    const handleResend = async () => {
        const res = await resendEmailVerification(email);
        if (res.success) {
            setResendMessage("Email verifikasi telah dikirim ulang. Silakan cek inbox atau folder spam Anda.");
        }
    };

    const parseJwt = (token: string) => {
        try {
            const base64Payload = token.split(".")[1];
            const jsonPayload = decodeURIComponent(
                atob(base64Payload)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                bgcolor: "secondary.main",
                px: 2,
                textAlign: "center"
            }}
        >
            {loading ? (
                <CircularProgress />
            ) : status === "success" ? (
                <Dialog open>
                    <DialogTitle>Verifikasi Berhasil</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Email Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => navigate("/login")} variant="contained" autoFocus>
                            Masuk
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <>
                    <Dialog open>
                        <DialogTitle>Verifikasi Gagal</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Token tidak valid atau telah expired. Klik tombol di bawah untuk mengirim ulang verifikasi email.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }} >
                            <Button onClick={handleResend} disabled={!email} variant="contained">
                                Kirim Ulang Verifikasi Email
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Static message after resend */}
                    {resendMessage && (
                        <Typography sx={{ mt: 4, maxWidth: 400, color: "white" }}>
                            {resendMessage}
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
};

export default VerifyEmailPage;
