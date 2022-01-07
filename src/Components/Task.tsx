import {useDispatch} from 'react-redux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../state/tasks-reducer';
import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from '@material-ui/core';
import {EditableSpan} from '../EditableSpan';
import {Delete} from '@material-ui/icons';
import {TaskType} from '../AppWithRedux';

type TaskPropsType = {
    task: TaskType,
    todolistId: string,
}

export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useDispatch()
    const removeTaskCallback = useCallback(() => dispatch(removeTaskAC(props.task.id, props.todolistId)),
        [dispatch, props.task.id, props.todolistId])

    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(props.task.id, e.currentTarget.checked, props.todolistId))
    }, [dispatch, props.task.id, props.todolistId])

    const changeTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(props.task.id, title, props.todolistId))
    }, [dispatch, props.task.id, props.todolistId])
    return <ListItem
        style={{padding: '0', display: 'flex', justifyContent: 'space-between'}}
        alignItems={'center'}
        className={props.task.isDone ? 'is-done' : ''}>
        <Checkbox
            onChange={changeTaskStatus}
            checked={props.task.isDone}
            color={'primary'}
            size={'small'}/>
        <EditableSpan setNewTitle={changeTitle} title={props.task.title}/>
        <IconButton size={'small'} onClick={removeTaskCallback}>
            <Delete fontSize={'small'}/>
        </IconButton>
    </ListItem>
})