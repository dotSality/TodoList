import React, {useCallback, useEffect} from 'react';
import {TaskStatuses, TaskType} from '../../../api/tasks-api';
import {AddItemForm} from '../../AddItemForm/AddItemForm';
import {EditableSpan} from '../../../EditableSpan';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType, useAppSelector} from '../../../state/store';
import {changeTodoFilterAC, changeTodoTitleTC, removeTodoTC, TodoDomainType} from '../../../state/todolists-reducer';
import {createTaskTC, getTasksTC} from '../../../state/tasks-reducer';
import {Task} from './Task/Task';
import {Button, ButtonGroup, IconButton, List, Typography} from '@mui/material';
import {Delete} from '@mui/icons-material';

type PropsType = {
    todolistId: string
    title: string
}

export const Todolist = React.memo(function (props: PropsType) {

    const todoList = useAppSelector(state => state.todolists.filter(tl => tl.id === props.todolistId)[0])
    const tasks = useAppSelector(state => state.tasks[props.todolistId])
    const dispatch = useDispatch()

    const addTask = useCallback((title: string) => {
        dispatch(createTaskTC(todoList.id, title));
    }, [dispatch, props.todolistId])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodoTitleTC(props.todolistId, title));
    }, [dispatch, props.todolistId])

    const removeTodolist = useCallback(() => {
        dispatch(removeTodoTC(props.todolistId))
    },[dispatch, props.todolistId])

    const onAllClickHandler = useCallback(() => dispatch(changeTodoFilterAC("all", props.todolistId)), [dispatch, props.todolistId]);
    const onActiveClickHandler = useCallback(() => dispatch(changeTodoFilterAC("active", props.todolistId)), [dispatch, props.todolistId]);
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodoFilterAC("completed", props.todolistId)), [dispatch, props.todolistId]);

    let tasksForRender = tasks;
    if (todoList.filter === "active") tasksForRender = tasks.filter(t => t.status === TaskStatuses.New);
    if (todoList.filter === "completed") tasksForRender = tasks.filter(t => t.status === TaskStatuses.Completed);

    return <div className={'todoList'}>
        <Typography align={'center'}>
            <EditableSpan disabled={todoList.entityStatus === 'loading'}
                setNewTitle={changeTodolistTitle} title={props.title}/>
            <IconButton disabled={todoList.entityStatus === 'loading'} onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </Typography>
        <AddItemForm disabled={todoList.entityStatus === 'loading'} addItem={addTask}/>
        <List>
            {
                tasksForRender && tasksForRender.map(t => {
                    return <Task key={t.id} task={t} todolistId={props.todolistId}/>
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

