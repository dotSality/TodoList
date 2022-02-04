import React, {useCallback} from 'react';
import {TaskStatuses} from '../../../api/tasks-api';
import {AddItemForm} from '../../AddItemForm/AddItemForm';
import {EditableSpan} from '../../../EditableSpan';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../../state/store';
import {changeTodoFilter, changeTodoTitleTC, removeTodoTC} from '../../../state/todolists-reducer';
import {createTask} from '../../../state/tasks-reducer';
import {Task} from './Task/Task';
import {Button, ButtonGroup, IconButton, List, Typography} from '@mui/material';
import {Delete} from '@mui/icons-material';

type PropsType = {
    todolistId: string
    title: string
    demo?: boolean
}

export const Todolist = React.memo(function ({todolistId,title,demo}: PropsType) {

    const todoList = useAppSelector(state => state.todolists.filter(tl => tl.id === todolistId)[0])
    const tasks = useAppSelector(state => state.tasks[todolistId])
    const dispatch = useDispatch()

    const addTask = useCallback((title: string) => {
        if (demo) return
        dispatch(createTask({tlId: todoList.id, title}));
    }, [dispatch, todoList.id])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodoTitleTC(todoList.id, title));
    }, [dispatch, todoList.id])

    const removeTodolist = useCallback(() => {
        dispatch(removeTodoTC(todoList.id))
    },[dispatch, todoList.id])

    const onAllClickHandler = useCallback(() => dispatch(changeTodoFilter(
        {todoId: todolistId, filter: "all"})), [dispatch, todolistId]);
    const onActiveClickHandler = useCallback(() => dispatch(changeTodoFilter(
        {todoId: todolistId, filter: "active"})), [dispatch, todolistId]);
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodoFilter(
        {todoId: todolistId, filter: "completed"})), [dispatch, todolistId]);

    let tasksForRender = tasks;
    if (todoList.filter === "active") tasksForRender = tasks.filter(t => t.status === TaskStatuses.New);
    if (todoList.filter === "completed") tasksForRender = tasks.filter(t => t.status === TaskStatuses.Completed);

    return <div className={'todoList'}>
        <Typography align={'center'}>
            <EditableSpan disabled={todoList.entityStatus === 'loading'}
                setNewTitle={changeTodolistTitle} title={title}/>
            <IconButton disabled={todoList.entityStatus === 'loading'} onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </Typography>
        <AddItemForm disabled={todoList.entityStatus === 'loading'} addItem={addTask}/>
        <List>
            {
                tasksForRender && tasksForRender.map(t => {
                    return <Task key={t.id} task={t} todolistId={todolistId}/>
                })
            }
        </List>
        <div>
            <ButtonGroup variant={'outlined'} aria-label={'medium button group'} disableElevation>
                <Button variant={todoList.filter === 'all' ? 'contained' : 'outlined'}
                    disabled={todoList.entityStatus === 'loading'} onClick={onAllClickHandler}>All</Button>
                <Button variant={todoList.filter === 'active' ? 'contained' : 'outlined'}
                    disabled={todoList.entityStatus === 'loading'} onClick={onActiveClickHandler}>Active</Button>
                <Button variant={todoList.filter === 'completed' ? 'contained' : 'outlined'}
                    disabled={todoList.entityStatus === 'loading'} onClick={onCompletedClickHandler}>Completed</Button>
            </ButtonGroup>
        </div>
    </div>
})


