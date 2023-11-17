import React, { FunctionComponent } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: FunctionComponent<HeaderProps> = ({ onMenuClick }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div">
                    Inv
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
