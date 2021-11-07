import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from 'uuid';

export type TaskType = {
    _id: string
    title: string
    isDone: boolean
}

export type  FilterValuesType = 'all' | 'active' | 'completed'

function App() {
    let [tasks, setTasks] = useState<Array<TaskType>>([
        {_id: v1(), title: 'HTML', isDone: true},
        {_id: v1(), title: 'CSS', isDone: true},
        {_id: v1(), title: 'JS, REACT', isDone: false},
        {_id: v1(), title: 'Redux', isDone: false},
        {_id: v1(), title: 'Rest API', isDone: false},
    ])

    const removeTask = (taskId: string) => {
        setTasks(tasks.filter(task => task._id !== taskId));
    }

    const addTask = (title: string) => {
        const newTask: TaskType = {
            _id: v1(),
            title: title,
            isDone: false
        }
        setTasks([newTask, ...tasks]);
    }

    return (
        <div className="App">
            <TodoList
                tasks={tasks}
                title={'What to learn'}
                removeTask={removeTask}
                addTask={addTask}
            />
        </div>
    );
}

export default App;
