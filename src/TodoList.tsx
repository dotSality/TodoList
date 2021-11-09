import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType, TaskType} from './App';

type PropsType = {
    id: string
    filter: FilterValuesType
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string, todoListID: string) => void
    changeFilter: (value: FilterValuesType, todoListID: string) => void
    addTask: (title: string, todoListID: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
    removeTodoLists: (todoListID :string) => void
}

export function Todolist(props: PropsType) {

    let [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const addTask = () => {
        const trimmedTitle = title.trim();
        setTitle("");
        if (trimmedTitle) {
            props.addTask(trimmedTitle, props.id);
        } else {
            setError(true);
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTask();
        }
    }

    const onAllClickHandler = () => props.changeFilter("all",props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);

    const allClass = props.filter === 'all' ? 'active-filter' : ''
    const activeClass = props.filter === 'active' ? 'active-filter' : ''
    const completedClass = props.filter === 'completed' ? 'active-filter' : ''
    const errorMessage = error && <div style={{color: 'red'}}>Title is required</div>

    return <div className={'todoList'}>
        <h3>
            {props.title}
            <button onClick={() => props.removeTodoLists(props.id)}>x</button>
        </h3>
        <div>
            <input
                className={error ? 'error' : ''}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
            />
            <button onClick={addTask}>+</button>
            {errorMessage}
        </div>
        <ul>
            {
                props.tasks.map(t => {

                    const onClickHandler = () => props.removeTask(t.id, props.id)

                    const changeCheckbox = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)

                    return <li className={t.isDone ? 'is-done' : ''}
                        key={t.id}>
                        <input onChange={changeCheckbox}
                            type="checkbox" checked={t.isDone}/>
                        <span>{t.title}</span>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button
                className={allClass}
                onClick={onAllClickHandler}>All
            </button>
            <button
                className={activeClass}
                onClick={onActiveClickHandler}>Active
            </button>
            <button
                className={completedClass}
                onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}
