import React, {useCallback, useEffect} from 'react';
import './App.css';
import {AddItemForm} from './Components/AddItemForm';
import {createTodoTC, getTodoTC} from './state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType, useAppSelector} from './state/store';
import {Todolist1} from './Components/TodoList1';
import {TodoType} from './api/todolist-api';
import {Menu} from '@mui/icons-material';
import {AppBar, Button, Container, Grid, IconButton, LinearProgress, Paper, Toolbar, Typography} from '@mui/material';
import {ErrorSnackbar} from './Components/ErrorSnackbar';

function App() {

    const todoLists = useSelector<AppRootStateType, TodoType[]>(state => state.todolists)
    const {status} = useAppSelector(state => state.app)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTodoTC())
    }, [])

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodoTC(title))
    }, [dispatch])

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={14} style={{padding: '10px'}}>
                    <Todolist1
                        todolistId={tl.id}
                        title={tl.title}
                    />
                </Paper>
            </Grid>
        )
    })
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
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <Grid container style={{padding: '30px 0'}}>
                    <AddItemForm addItem={addTodoList}/>
                    <Grid container spacing={5}>
                        {todoListsComponents}
                    </Grid>
                </Grid>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default App;
