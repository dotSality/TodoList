import React, {ChangeEvent} from 'react';
import {FilterValuesType, TaskType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, ButtonGroup, Checkbox, IconButton, List, ListItem, Typography} from '@material-ui/core';
import {Delete} from '@material-ui/icons';

type PropsType = {
    id: string
    filter: FilterValuesType
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string, todoListID: string) => void
    changeFilter: (value: FilterValuesType, odoListID: string) => void
    addTask: (title: string, todoListID: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
    removeTodoLists: (todoListID: string) => void
    changeTaskTitle: (taskID: string, title: string, todoListID: string) => void
    changeTodolistTitle: (todoListID: string, title: string) => void
}

export function Todolist(props: PropsType) {

    const addTask = (title: string) => {
        props.addTask(title, props.id);
    }

    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(title, props.id);
    }

    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);

    const allClass = props.filter === 'all' ? 'active-filter' : ''
    const activeClass = props.filter === 'active' ? 'active-filter' : ''
    const completedClass = props.filter === 'completed' ? 'active-filter' : ''

    return <div className={'todoList'}>
        <Typography align={'center'}>
            <EditableSpan setNewTitle={changeTodolistTitle} title={props.title}/>
            <IconButton onClick={() => props.removeTodoLists(props.id)}>
                <Delete/>
            </IconButton>
        </Typography>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                props.tasks.map(t => {

                    const removeTaskCallback = () => props.removeTask(t.id, props.id)

                    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)

                    const changeTitle = (title: string) => {
                        props.changeTaskTitle(t.id, title, props.id)
                    }

                    return <ListItem
                        style={{padding: '0', display: 'flex', justifyContent: 'space-between'}}
                        alignItems={'center'}
                        className={t.isDone ? 'is-done' : ''}
                        key={t.id}>
                        <Checkbox
                            onChange={changeTaskStatus}
                            checked={t.isDone}
                            color={'primary'}
                            size={'small'}/>
                        <EditableSpan setNewTitle={changeTitle} title={t.title}/>
                        <IconButton size={'small'} onClick={removeTaskCallback}>
                            <Delete fontSize={'small'}/>
                        </IconButton>
                    </ListItem>
                })
            }
        </List>
        <div>
            <ButtonGroup variant={'contained'} size={'small'} disableElevation>
                <Button color={props.filter === 'all' ? 'secondary' : 'primary'} onClick={onAllClickHandler}>All</Button>
                <Button color={props.filter === 'active' ? 'secondary' : 'primary'} onClick={onActiveClickHandler}>Active</Button>
                <Button color={props.filter === 'completed' ? 'secondary' : 'primary'} onClick={onCompletedClickHandler}>Completed</Button>
            </ButtonGroup>
        </div>
    </div>
}
