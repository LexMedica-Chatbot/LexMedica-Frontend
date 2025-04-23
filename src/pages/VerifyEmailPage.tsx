// Desc: Email Verification page for LexMedica
// ** React Imports
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// ** Supabase
import { supabase } from "../utils/supabase";

// ** Hooks
import { useAuthContext } from "../context/authContext";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

// ** Icon Imports
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const { loading, handleResendEmailVerification } = useAuthContext();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<boolean>(false);
    const [successResend, setSuccessResend] = useState<boolean>(false);

    const email = searchParams.get("email");

    useEffect(() => {
        document.title = "Verifikasi Email | LexMedica";

        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                setStatus(true);
            } else {
                setStatus(false);
            }
        };

        checkSession();
    }, []);

    const handleResend = async () => {
        if (!email) return;
        const response = await handleResendEmailVerification(email);
        if (response) {
            setSuccessResend(true);
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
            ) : status ? (
                <Dialog open>
                    <DialogTitle>Verifikasi Berhasil</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Email Anda berhasil diverifikasi.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => navigate("/")} variant="contained" autoFocus>
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
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={handleResend} disabled={!email} variant="contained">
                                Kirim Ulang Verifikasi Email
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Static message after resend */}
                    {successResend && (
                        <>
                            <Typography sx={{ mt: 4, maxWidth: 400, color: "white" }}>
                                Email verifikasi telah dikirim ulang. Silakan cek inbox atau folder spam Anda.
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography fontWeight={"bold"}>Akses Tanpa Akun</Typography>
                                <ArrowForwardIcon />
                            </Button>
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default VerifyEmailPage;
