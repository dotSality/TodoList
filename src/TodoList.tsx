import React, {useState} from "react";
import {FilterValuesType, TaskType} from "./App";
import {Button} from './components/Button';
import {FullInput} from './components/FullInput';

type TodoListPropsType = {
    tasks: TaskType[]
    title: string
    removeTask: (taskID: string) => void
    addTask: (title: string) => void
}

export const TodoList = (props: TodoListPropsType) => {
    const [title, setTitle] = useState<string>('');
    const deleteTaskCallback = (tID: string) => props.removeTask(tID)

    const addTask = () => {
        if (title) {
            props.addTask(title);
            setTitle('');
        }
    }

    const [filter, setFilter] = useState<FilterValuesType>('all')

    let tasksForRender = props.tasks

    if (filter === 'active') {
        tasksForRender = props.tasks.filter(t => !t.isDone )
    }

    if (filter === 'completed') {
        tasksForRender = props.tasks.filter(t => t.isDone)
    }

    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter)
    }

    const filterButton = (value: FilterValuesType) => {
        changeFilter(value)
    }

    const outputElements = tasksForRender.map(t => {
        return (
            <li key={t._id}>
                <input type='checkbox' checked={t.isDone}/>
                <span>{t.title}</span>
                <Button name={'x'} callBack={() => (deleteTaskCallback(t._id))}/>
            </li>)
    })
    return (
        <div className='todoList'>
            <h3>{props.title}</h3>
            <FullInput callBack={addTask} title={title} setTitle={setTitle}/>
            {/*<div>*/}
            {/*    <input*/}
            {/*        value={title}*/}
            {/*        placeholder='Enter your task...'*/}
            {/*        onChange={onChangeCallback}*/}
            {/*        onKeyPress={onKeyPressCallback}*/}
            {/*    />*/}
            {/*    <Button name={'+'} callBack={addTask}/>*/}
            {/*</div>*/}
            <ul>
                {outputElements}
            </ul>
            <div>
                <Button name={'All'} callBack={() => (filterButton('all'))}/>
                <Button name={'Active'} callBack={() => (filterButton('active'))}/>
                <Button name={'Completed'} callBack={() => (filterButton('completed'))}/>
            </div>
        </div>
    )
}
