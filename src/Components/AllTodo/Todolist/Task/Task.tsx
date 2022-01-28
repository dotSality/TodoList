import {useDispatch} from 'react-redux';
import {deleteTaskTC, updateTaskStatusTC, changeTaskTitleTC} from '../../../../state/tasks-reducer';
import React, {ChangeEvent, useCallback} from 'react';
import {EditableSpan} from '../../../../EditableSpan';
import {TaskStatuses, TaskType} from '../../../../api/tasks-api';
import {Checkbox, IconButton, ListItem} from '@mui/material';
import {Delete} from '@mui/icons-material';

type TaskPropsType = {
    task: TaskType,
    todolistId: string,
}

export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useDispatch()
    const removeTaskCallback = useCallback(() => dispatch(deleteTaskTC(props.todolistId, props.task.id)),
        [dispatch, props.task.id, props.todolistId])
    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskStatusTC(props.todolistId, props.task.id, value))
    }, [dispatch, props.task.id, props.todolistId])

    const changeTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleTC(props.todolistId, props.task.id, title))
    }, [dispatch, props.task.id, props.todolistId])
    return <ListItem
        style={{padding: '0', display: 'flex', justifyContent: 'space-between'}}
        alignItems={'center'}
        className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            onChange={changeTaskStatus}
            checked={props.task.status === TaskStatuses.Completed}
            color={'primary'}
            size={'small'}/>
        <EditableSpan setNewTitle={changeTitle} title={props.task.title}/>
        <IconButton size={'small'} onClick={removeTaskCallback}>
            <Delete fontSize={'small'}/>
        </IconButton>
    </ListItem>
})