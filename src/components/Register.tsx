import React, { FunctionComponent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { setCredentials, setToken } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useRegisterMutation } from "../slices/usersApiSlice";
import { useNavigate } from 'react-router-dom';

const isValidEmail = (email: string) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

const Register: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleEmailValidation = (email: string) => {
    console.log("ValidateEmail was called with", email);

    const isValid = isValidEmail(email);

    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verificar si los términos y condiciones han sido aceptados
      if (!acceptTerms) {
        toast.warning('Por favor, acepta nuestros términos y condiciones.');
        return;
      }

      if (!name || !email || !password) {
        toast.error('Por favor, completa todos los campos.');
        return;
      }

      if (!handleEmailValidation(email)) {
        toast.error('Por favor, ingresa un email válido.');
        return;
      }


      const userData = await registerMutation({ name, email, password });
      console.log('Usuario registrado:', userData);
      //dispatch(setCredentials({ ...userData }));
      navigate('/login');
      toast.info('Usuario registrado exitosamente');

    } catch (err) {
      console.error('Error de registro:', err);
      const errorMessage = err as Error;
      toast.error(errorMessage.message || 'Error de registro');
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

        <form onSubmit={handleRegister} className={"form"} style={{ width: '100%' }}>
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
              onChange={(e) => setName(e.target.value)}
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
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
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
