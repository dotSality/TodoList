import {Grid, Paper} from '@mui/material';
import {Todolist} from './Todolist/Todolist';
import React, {useCallback, useEffect} from 'react';
import {createTodo, fetchTodos} from '../../state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {RootStateType, useAppSelector} from '../../state/store';
import {TodoType} from '../../api/todolist-api';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {Navigate} from 'react-router-dom';

type PropsType = {
    demo?: boolean
}

export const AllTodo = ({demo}: PropsType) => {

    const todoLists = useSelector<RootStateType, TodoType[]>(state => state.todolists)
    const {isLoggedIn} = useAppSelector(state => state.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        if(demo || !isLoggedIn) return
        dispatch(fetchTodos())
    }, [])

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodo(title))
    }, [dispatch])

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={14} style={{padding: '10px'}}>
                    <Todolist
                        todolistId={tl.id}
                        title={tl.title}
                        demo={demo}
                    />
                </Paper>
            </Grid>
        )
    })

    if (!isLoggedIn) {
        return <Navigate to={'login'}/>
    }

    return (
        <Grid container style={{padding: '30px 0'}}>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={5}>
                {todoListsComponents}
            </Grid>
        </Grid>
    )
}