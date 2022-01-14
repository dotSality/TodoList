import React, {useCallback, useEffect} from 'react';
import {TaskStatuses, TaskType} from '../api/tasks-api';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from '../EditableSpan';
import {Button, ButtonGroup, IconButton, List, Typography} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {changeTodoFilterAC, changeTodoTitleAC, changeTodoTitleTC, removeTodolistAC, removeTodoTC, TodoDomainType} from '../state/todolists-reducer';
import {createTaskTC, getTasksTC} from '../state/tasks-reducer';
import {Task} from './Task';

type PropsType = {
    todolistId: string
    title: string
}

export const Todolist1 = React.memo(function (props: PropsType) {

    const todoList = useSelector<AppRootStateType, TodoDomainType>(state => state.todolists.filter(tl => tl.id === props.todolistId)[0])
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.todolistId])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTasksTC(todoList.id))
    },[])

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
            <EditableSpan setNewTitle={changeTodolistTitle} title={props.title}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </Typography>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                tasksForRender && tasksForRender.map(t => {
                    return <Task key={t.id} task={t} todolistId={props.todolistId}/>
                })
            }
        </List>
        <div>
            <ButtonGroup variant={'contained'} size={'small'} disableElevation>
                <Button color={todoList.filter === 'all' ? 'secondary' : 'primary'} onClick={onAllClickHandler}>All</Button>
                <Button color={todoList.filter === 'active' ? 'secondary' : 'primary'} onClick={onActiveClickHandler}>Active</Button>
                <Button color={todoList.filter === 'completed' ? 'secondary' : 'primary'} onClick={onCompletedClickHandler}>Completed</Button>
            </ButtonGroup>
        </div>
    </div>
})


