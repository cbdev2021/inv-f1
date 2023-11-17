import React, { FunctionComponent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Typography, TextField, Button } from '@mui/material';


const Billing: FunctionComponent = () => {

    return (
        <div className="contenedor" style={{ display: 'flex' }}>
            <div className="mitad-izquierda" style={{ flex: '1' }}>

                <form className={"form"} style={{ width: '100%' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Home
                    </Typography>

                    <div className="form-elements-container">

                    </div>
                </form>
            </div>
        </div>
    );
};

export default Billing;
