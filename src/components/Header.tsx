// Header.tsx
import React, { FunctionComponent } from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const Header: FunctionComponent<HeaderProps> = ({ toggleDrawer }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Exo 2, sans-serif', fontSize: '1.8rem', fontWeight: 600, letterSpacing: '2px' }}>
                    Inv
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <SearchIcon />
                    <InputBase placeholder="Search..." sx={{ marginLeft: '5px', color: '#fff' }} />
                </div>
                <IconButton color="inherit">
                    <AccountCircleIcon />
                </IconButton>
                <IconButton color="inherit">
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
