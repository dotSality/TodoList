import React, {useEffect} from 'react';
import './App.css';
import {useDispatch} from 'react-redux';
import {useAppSelector} from './state/store';
import {Menu} from '@mui/icons-material';
import {AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Toolbar, Typography} from '@mui/material';
import {ErrorSnackbar} from './Components/ErrorSnackbar/ErrorSnackbar';
import {AllTodo} from './Components/AllTodo/AllTodo';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from './Components/Login/Login';
import {ErrorPage} from './Components/Error/Error';
import {logout} from './state/auth-reducer';
import { initApp } from './state/app-reducer';

type PropsType = {
    demo?: boolean
}

function App({demo}: PropsType) {

    const {status, isInit} = useAppSelector(state => state.app)
    const dispatch = useDispatch()
    const {isLoggedIn, login} = useAppSelector(state => state.auth)

    useEffect(() => {
        if(!demo) dispatch(initApp())
    }, [isLoggedIn])

    const logoutHandler = () => dispatch(logout())

    if (!isInit) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className={'App'}>
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography
                        variant="h6">
                        Todolists
                    </Typography>
                    {isLoggedIn && <div>
                        <span style={{padding: '20px'}}>
                            {login}
                        </span>
                        <Button
                          onClick={logoutHandler}
                          color="inherit"
                          variant={"outlined"}
                        >
                            Logout
                        </Button>
                    </div>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<AllTodo demo={demo}/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/error-page'} element={<ErrorPage/>}/>
                    <Route path={'*'} element={<Navigate to={'/error-page'}/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default App;
