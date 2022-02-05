import {useDispatch} from 'react-redux';
import {deleteTask, updateTask} from '../../../../state/tasks-reducer';
import React, {ChangeEvent, useCallback} from 'react';
import {EditableSpan} from '../../../../EditableSpan';
import {TaskStatuses, TaskType} from '../../../../api/tasks-api';
import {Checkbox, IconButton, ListItem} from '@mui/material';
import {Delete} from '@mui/icons-material';

type TaskPropsType = {
    task: TaskType,
    todolistId: string,
}

export const Task = React.memo(({task, todolistId}: TaskPropsType) => {

    const dispatch = useDispatch()
    const removeTaskCallback = useCallback(() => dispatch(deleteTask({tlId: todolistId, taskId: task.id})),
        [dispatch, task.id, todolistId])
    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTask({todoId: todolistId, taskId: task.id, model: {status}}))
    }, [dispatch, task.id, todolistId])

    const changeTitle = useCallback((title: string) => {
        dispatch(updateTask({todoId: todolistId, taskId: task.id, model: {title}}))
    }, [dispatch, task.id, todolistId])
    return <ListItem
        style={{padding: '0', display: 'flex', justifyContent: 'space-between'}}
        alignItems={'center'}
        className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            onChange={changeTaskStatus}
            checked={task.status === TaskStatuses.Completed}
            color={'primary'}
            size={'small'}/>
        <EditableSpan setNewTitle={changeTitle} title={task.title}/>
        <IconButton size={'small'} onClick={removeTaskCallback}>
            <Delete fontSize={'small'}/>
        </IconButton>
    </ListItem>
})