import React, {useCallback} from 'react';
import {TaskType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, ButtonGroup, IconButton, List, Typography} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TodoListType} from './AppWithRedux';
import {addTaskAC} from './state/tasks-reducer';
import {changeTlFilterAC, changeTlTitleAC, removeTodolistAC} from './state/todolists-reducer';
import {Task} from './Task';

type PropsType = {
    todolistId: string
    title: string
}


export const Todolist1 = React.memo(function (props: PropsType) {

    const todoList = useSelector<AppRootStateType, TodoListType>(state => state.todolists.filter(tl => tl.id === props.todolistId)[0])
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.todolistId])
    const dispatch = useDispatch()

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, props.todolistId));
    }, [dispatch, props.todolistId])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTlTitleAC(title, props.todolistId));
    }, [dispatch, props.todolistId])

    const onAllClickHandler = useCallback(() => dispatch(changeTlFilterAC("all", props.todolistId)), [dispatch, props.todolistId]);
    const onActiveClickHandler = useCallback(() => dispatch(changeTlFilterAC("active", props.todolistId)), [dispatch, props.todolistId]);
    const onCompletedClickHandler = useCallback(() => dispatch(changeTlFilterAC("completed", props.todolistId)), [dispatch, props.todolistId]);

    let tasksForRender = tasks;
    if (todoList.filter === "active") tasksForRender = tasks.filter(t => !t.isDone);
    if (todoList.filter === "completed") tasksForRender = tasks.filter(t => t.isDone);

    return <div className={'todoList'}>
        <Typography align={'center'}>
            <EditableSpan setNewTitle={changeTodolistTitle} title={props.title}/>
            <IconButton onClick={() => dispatch(removeTodolistAC(props.todolistId))}>
                <Delete/>
            </IconButton>
        </Typography>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                tasksForRender.map(t => {
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


