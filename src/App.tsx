import React, { FunctionComponent, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Billing from './components/Billing';
import Home from './components/Home';



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
                <Route path="/billing" element={<Billing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
};

export default App;
