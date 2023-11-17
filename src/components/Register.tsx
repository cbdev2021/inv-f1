import React, { FunctionComponent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { setCredentials, setToken } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useLoginMutation } from "../slices/usersApiSlice";
import { useNavigate } from 'react-router-dom';

const Register: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Verificar si los términos y condiciones han sido aceptados
      if (!acceptTerms) {
        toast.warning('Por favor, acepta nuestros términos y condiciones.');
        return;
      }

      // Tu lógica de inicio de sesión aquí...

    } catch (err) {
      console.error(err);
      toast.error('Hubo un error al iniciar sesión');
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  }, []);

  return (
    <div className="contenedor" style={{ display: 'flex' }}>
      <div className="mitad-izquierda" style={{ flex: '1' }}>

        <form onSubmit={submitHandler} className={"form"} style={{ width: '100%' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>

          <div className="form-elements-container">

          <Typography align="center" style={{ lineHeight: '1.5em' }}>
            <b>Welcome</b>, we want that you use <b>Inv</b> for your business to obtain the best results.
            To start to use our web app, complete the next register form!            
          </Typography>


            <TextField
              color="primary"
              variant="outlined"
              type="text"
              name="name"
              id="name"
              label="Name"
              placeholder="Insert Name"
              size="medium"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="name"
            />
            <TextField
              color="primary"
              variant="outlined"
              type="text"
              name="cellphone"
              id="cellphone"
              label="Cellphone"
              placeholder="Insert Cellphone"
              size="medium"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="cellphone"
            />
            <TextField
              color="primary"
              variant="outlined"
              type="text"
              name="email"
              id="email"
              label="Email"
              placeholder="Insert Email"
              size="medium"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
            <TextField
              color="primary"
              variant="outlined"
              type="password"
              name="password"
              id="password"
              label="Password"
              placeholder="Insert password"
              size="medium"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <FormControlLabel
              control={<Checkbox color="primary" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} />}
              label={
                <Typography variant="body1">
                  Acepta nuestros <b>términos y condiciones </b>
                </Typography>
              }
            />

            <Button
              variant="contained"
              name="iniciar"
              id="idIniciar"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Register
            </Button>
          </div>
        </form>
      </div>

      <div className="mitad-derecha" style={{ flex: '1', backgroundColor: '#e0e0e0', padding: '20px' }}>
        <Typography variant="h6" align="center" style={{ lineHeight: '1.5em' }}>
          ya estás registrado?
          inicia sesión para comenzar!!
        </Typography>
      </div>
    </div>
  );
};

export default Register;
