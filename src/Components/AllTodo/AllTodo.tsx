import {Grid, Paper} from '@mui/material';
import {Todolist} from './Todolist/Todolist';
import React, {useCallback, useEffect} from 'react';
import {createTodoTC, getTodoTC} from '../../state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType, useAppSelector} from '../../state/store';
import {TodoType} from '../../api/todolist-api';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {Navigate} from 'react-router-dom';
import {setAppStatusAC} from '../../state/app-reducer';

export const AllTodo = () => {

    const todoLists = useSelector<AppRootStateType, TodoType[]>(state => state.todolists)
    const {isLoggedIn} = useAppSelector(state => state.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        if(!isLoggedIn) {
            return
        }
        dispatch(getTodoTC())
    }, [])

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodoTC(title))
    }, [dispatch])

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={14} style={{padding: '10px'}}>
                    <Todolist
                        todolistId={tl.id}
                        title={tl.title}
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