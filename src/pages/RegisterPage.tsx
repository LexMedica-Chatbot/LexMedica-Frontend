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
            return;
        }

        const response = await handleRegister(email, password);
        if (response) {
            setSuccessRegistration(true);
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
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    backgroundColor: "white",
                    px: 4,
                    py: 3,
                    borderRadius: 2,
                    boxShadow: 2,
                    maxWidth: 500,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Daftar Akun LexMedica
                </Typography>

                {/* Registration Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                    {/* Email input */}
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);
                            setIsEmailValid(emailRegex.test(value));
                        }}
                        error={!isEmailValid}
                        helperText={!isEmailValid ? "Format email tidak valid" : ""}
                    />

                    {/* Password input */}
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            validatePassword(value);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: "primary.main" }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Password validation criteria */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>Password harus terdiri dari minimal:</Typography>
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
                                    color: item.valid ? "green" : "gray",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
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
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => {
                            const value = e.target.value;
                            setConfirmPassword(value);
                            validateConfirmPassword(value);
                        }}
                        error={!isConfirmPasswordValid}
                        helperText={
                            !isConfirmPasswordValid ? "Password tidak cocok" : ""
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Error or Success Message */}
                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {successRegistration && (
                        <Dialog
                            open={successRegistration}
                            onClose={() => { }}
                            disableEscapeKeyDown
                            BackdropProps={{ onClick: () => { } }}
                        >
                            <DialogTitle>Registrasi Berhasil</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    Silakan cek email untuk verifikasi akun Anda. Jika tidak menemukan email, periksa folder spam.
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={() => navigate("/login")} variant="contained" autoFocus>
                                    Masuk
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}

                    {/* Submit button */}
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ mt: 1 }}
                        disabled={
                            loading ||
                            email === "" ||
                            !isEmailValid ||
                            password === "" ||
                            !isValidPassword ||
                            confirmPassword === "" ||
                            !isConfirmPasswordValid
                        }
                    >
                        {loading ? "Loading" : "Daftar"}
                    </Button>
                </Box>

                {/* Link to Login */}
                <Grid container justifyContent="center" sx={{ mt: 1 }}>
                    <Grid item>
                        <Typography variant="body1">
                            Sudah punya akun?{" "}
                            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
                                Masuk di sini
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center">
                    <Grid item>
                        <Link to={"/"}>
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                Akses Tanpa Akun
                                <ArrowForwardIcon />
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default RegisterPage;
