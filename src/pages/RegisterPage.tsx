// Desc: Register page for LexMedica
// ** React Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useAuth } from "../hooks/useAuth";

// ** MUI Imports
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** MUI Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { handleRegister, error, loading } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const isValidPassword = Object.values(passwordValidations).every((v) => v);

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean>(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [successRegistration, setSuccessRegistration] = useState<boolean>(false);

    const validatePassword = (pwd: string) => {
        const validations = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            specialChar: /[^A-Za-z0-9]/.test(pwd),
        };
        setPasswordValidations(validations);
    };

    const validateConfirmPassword = (confirmPwd: string) => {
        setIsConfirmPasswordValid(confirmPwd === password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            setIsConfirmPasswordValid(false);
            return;
        }

        const response = await handleRegister(email, password);
        if (response) {
            setSuccessRegistration(true);
        }
    };

    return (
        <Box // Outermost container for the page
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(var(--vh, 1vh) * 100)",
                flexDirection: "column",
                p: { xs: 2, sm: 3 },
                // Removed page background color
            }}
        >
            <Box // Form container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: { xs: 1.25, md: 1.5 }, // Reduced gap between elements inside this box
                    backgroundColor: "white", // Kept form container background white
                    padding: { xs: 2.5, sm: 3, md: 4 },
                    borderRadius: 2,
                    boxShadow: { xs: 1, sm: 2, md: 3 },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: 500, md: 550 },
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                        textAlign: 'center',
                    }}
                >
                    Daftar Akun LexMedica
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display: 'flex', flexDirection: 'column', gap: { xs: 1.25, sm: 1.5 } }}> {/* Consistent gap for form elements */}
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);
                            setIsEmailValid(emailRegex.test(value));
                        }}
                        error={!isEmailValid}
                        helperText={!isEmailValid ? "Format email tidak valid" : ""}
                        size="small"
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            validatePassword(value);
                            if (confirmPassword) validateConfirmPassword(confirmPassword);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />

                    <Box sx={{ my: { xs: 0.5, sm: 0.75 } }}> {/* Reduced margin for this section for tighter fit */}
                        <Typography variant="subtitle2" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                            Password harus terdiri dari minimal:
                        </Typography>
                        {[
                            { label: "8 karakter", valid: passwordValidations.length },
                            { label: "1 huruf besar", valid: passwordValidations.uppercase },
                            { label: "1 huruf kecil", valid: passwordValidations.lowercase },
                            { label: "1 angka", valid: passwordValidations.number },
                            { label: "1 simbol", valid: passwordValidations.specialChar },
                        ].map((item, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                    color: item.valid ? "success.main" : "text.secondary",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    lineHeight: { xs: 1.4, sm: 1.5 }
                                }}
                            >
                                {item.valid ? "✅" : "❌"} {item.label}
                            </Typography>
                        ))}
                    </Box>

                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => {
                            const value = e.target.value;
                            setConfirmPassword(value);
                            validateConfirmPassword(value);
                        }}
                        error={!isConfirmPasswordValid}
                        helperText={!isConfirmPasswordValid ? "Password tidak cocok" : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 0.5 }}> {/* Adjusted margin */}
                            {error}
                        </Alert>
                    )}

                    <Button // Submit Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{
                            // mt: { xs: 1, sm: 1.5 }, // Top margin handled by form's gap
                            py: { xs: 0.8, sm: 1, md: 1.25 },
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9375rem' }
                        }}
                        disabled={
                            loading || email === "" || !isEmailValid ||
                            password === "" || !isValidPassword ||
                            confirmPassword === "" || !isConfirmPasswordValid
                        }
                    >
                        {loading ? "Loading..." : "Daftar"}
                    </Button>
                </Box> {/* End of component="form" Box */}


                <Grid container justifyContent="center" sx={{ mt: 0 }}> {/* mt removed/set to 0 */}
                    <Grid item>
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center' }}>
                            Sudah punya akun?{" "}
                            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2", fontWeight: 'medium' }}>
                                Masuk di sini
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center" sx={{ mt: 0, width: '100%' }}> {/* mt removed/set to 0 */}
                    <Grid item sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        <Link to={"/"} style={{ textDecoration: 'none', display: 'block' }}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 1,
                                    py: { xs: 0.8, sm: 1, md: 1.25 },
                                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9375rem' },
                                    borderColor: 'primary.main',
                                    color: 'primary.main'
                                }}
                            >
                                Akses Tanpa Akun
                                <ArrowForwardIcon sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }} />
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box> {/* End of form container Box */}

            {successRegistration && (
                <Dialog
                    open={successRegistration}
                    onClose={() => { }}
                    disableEscapeKeyDown
                    PaperProps={{
                        sx: {
                            width: { xs: '90%', sm: 'auto' },
                            maxWidth: { sm: 400, md: 500 }
                        }
                    }}
                >
                    <DialogTitle sx={{ textAlign: 'center', fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                        Registrasi Berhasil
                    </DialogTitle>
                    <DialogContent>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, textAlign: 'center' }}>
                            Silakan cek email untuk verifikasi akun Anda. Jika tidak menemukan email, periksa folder spam.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, justifyContent: 'center' }}>
                        <Button
                            onClick={() => navigate("/login")}
                            variant="contained"
                            autoFocus
                            sx={{ py: { xs: 0.8, sm: 1 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                            Masuk
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default RegisterPage;