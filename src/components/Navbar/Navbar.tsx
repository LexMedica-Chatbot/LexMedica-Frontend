// ** React Import
import { Link } from 'react-router-dom'

// ** MUI Import
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// ** MUI Icons
import CreateIcon from '@mui/icons-material/Create';
import Tooltip from '@mui/material/Tooltip'

const Navbar = () => {

    return (
        <Box sx={{ mb: 10 }}>
            <AppBar position="fixed">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left side buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box>
                            <Tooltip title="Chat Baru" arrow>
                                <IconButton
                                    onClick={() => window.scrollTo(0, 0)} // Handle the action
                                    sx={{
                                        p: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <CreateIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography fontWeight="bold" variant="h5">
                            LexMedica
                        </Typography>
                    </Box>

                    {/* Right side buttons (only visible on 'sm' and up) */}
                    <Box sx={{ display: { xs: 'flex' }, gap: 2 }}>
                        <Link to={'/login'}>
                            <Button
                                variant={"contained"}
                                sx={{ backgroundColor: 'black' }}
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <Typography fontWeight={'bold'}>Masuk</Typography>
                            </Button>
                        </Link>

                        <Link to={'/register'}>
                            <Button
                                variant={"contained"}
                                sx={{ backgroundColor: 'gray' }}
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                <Typography fontWeight={'bold'}>Daftar</Typography>
                            </Button>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>

    )
}

export default Navbar
