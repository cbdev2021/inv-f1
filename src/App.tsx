// App.tsx
import React, { FunctionComponent, useState } from 'react';
import Header from './components/Header';
import Drawer from './components/Drawer';

const App: FunctionComponent = () => {
    const [state, setState] = useState({
        left: false,
    });

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ left: open });
            };

    return (
        <div>
            <Header toggleDrawer={toggleDrawer} />
            <Drawer open={state.left} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} />
        </div>
    );
};

export default App;
