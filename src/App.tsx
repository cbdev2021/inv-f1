import React, { FunctionComponent, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Billing from './components/Billing';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Login from './components/Login';
import Register from './components/Register';

const App: FunctionComponent = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div>
            <Header onMenuClick={toggleDrawer} />
            <Drawer open={drawerOpen} onClose={toggleDrawer} />

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/billing" element={<Billing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/reports" element={<Reports />} />
            </Routes>
        </div>
    );
};

export default App;
