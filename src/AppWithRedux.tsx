import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from './Components/AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {addTlAC} from './state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {Todolist1} from './Components/TodoList1';

export type FilterValuesType = "all" | "active" | "completed";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TaskType[]
}

function AppWithRedux() {

    const todoLists = useSelector<AppRootStateType, TodoListType[]>(state => state.todolists)

    const dispatch = useDispatch()

    const addTodoList = useCallback((title: string) => {
        dispatch(addTlAC(title))
    },[dispatch])

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
            <Container fixed>
                <Grid container style={{padding: '30px 0'}}>
                    <AddItemForm addItem={addTodoList}/>
                    <Grid container spacing={5}>
                        {todoListsComponents}
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default AppWithRedux;
