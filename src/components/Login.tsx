import React, { FunctionComponent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { setCredentials, setToken } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, TextField, Button } from '@mui/material';
import { useLoginMutation } from "../slices/usersApiSlice";
import { useNavigate } from 'react-router-dom';

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginMutation, { isLoading }] = useLoginMutation();

  //const { userInfo } = useSelector((state: any) => state.auth);
  const userInfo = useSelector((state: any) => state);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginMutation({ email, password }).unwrap();
      // console.log("res");
      // console.log(res);

      dispatch(setCredentials({
        userInfo: {
          _id: res._id,
          name: res.name,
          email: res.email,
          token: res.token
        },
        token: res.token
      }));

      console.log("inicio - userInfo.token:");
      console.log(userInfo);

      console.log("inicio - res.token:", res.token); // Agregar un console.log aquí                                    

      navigate('/billing');
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
            Login
          </Typography>

          <div className="form-elements-container">
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
              placeholder="Insert Password"
              size="medium"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
              Sing In
            </Button>
          </div>
        </form>
      </div>

      <div className="mitad-derecha" style={{ flex: '1', backgroundColor: '#e0e0e0', padding: '20px' }}>
        <Typography variant="h6" align="center" style={{ lineHeight: '1.5em' }}>
          Obten un mejor control de tus inventarios,
          inicia sesión para comenzar!!
        </Typography>
      </div>
    </div>
  );
};

export default Login;
