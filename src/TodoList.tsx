import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType, TaskType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';

type PropsType = {
    id: string
    filter: FilterValuesType
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string, todoListID: string) => void
    changeFilter: (value: FilterValuesType, todoListID: string) => void
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
        <h3>
            <EditableSpan setNewTitle={changeTodolistTitle} title={props.title}/>
            <button onClick={() => props.removeTodoLists(props.id)}>x</button>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                props.tasks.map(t => {

                    const removeTaskCallback = () => props.removeTask(t.id, props.id)

                    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)

                    const changeTitle = (title: string) => {
                        props.changeTaskTitle(t.id, title, props.id)
                    }

                    return <li className={t.isDone ? 'is-done' : ''}
                        key={t.id}>
                        <input onChange={changeTaskStatus}
                            type="checkbox" checked={t.isDone}/>
                        <EditableSpan setNewTitle={changeTitle} title={t.title}/>
                        <button onClick={removeTaskCallback}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={allClass} onClick={onAllClickHandler}>All</button>
            <button className={activeClass} onClick={onActiveClickHandler}>Active</button>
            <button className={completedClass} onClick={onCompletedClickHandler}>Completed</button>
        </div>
    </div>
}
