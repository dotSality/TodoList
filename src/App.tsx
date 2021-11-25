import React, {useState} from 'react';
import './App.css';
import {Todolist} from './TodoList';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';

export type FilterValuesType = "all" | "active" | "completed";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {

    const todoList_ID1 = v1()
    const todoList_ID2 = v1()

    const [todoLists, setTodoLists] = useState<TodoListType[]>([
        {id: todoList_ID1, title: 'What to learn', filter: 'all'},
        {id: todoList_ID2, title: 'What to watch', filter: 'completed'},
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todoList_ID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todoList_ID2]: [
            {id: v1(), title: "React kabzda", isDone: true},
            {id: v1(), title: "Social network", isDone: true},
            {id: v1(), title: "Guitar tutorials", isDone: false},
        ]
    })

    function removeTask(taskID: string, todoListID: string) {
        tasks[todoListID] = tasks[todoListID].filter(t => t.id !== taskID)
        setTasks({...tasks})
    }

    function addTask(title: string, todoListID: string) {
        let task = {id: v1(), title: title, isDone: false};
        setTasks({...tasks, [todoListID]: [task, ...tasks[todoListID]]});
    }

    const changeTaskStatus = (taskID: string, isDone: boolean, todoListID: string) => {
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].map(task => task.id === taskID ? {...task, isDone} : task)
        })
    }

    const changeTaskTitle = (taskID: string, title: string, todoListID: string) => {
        setTasks({...tasks, [todoListID]: tasks[todoListID].map(t => t.id === taskID ? {...t, title} : t)})
    }

    function changeFilter(filter: FilterValuesType, todoListID: string) {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter} : tl))
    }

    const changeTodolistTitle = (title: string, todoListID: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, title} : tl))
    }

    function removeTodoLists(todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
    }

    function addTodoList(title: string) {
        const newTodoList: TodoListType = {
            id: v1(),
            title: title,
            filter: 'all'
        }
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasks, [newTodoList.id]: []})
    }

    const todoListsComponents = todoLists.map(tl => {
        let tasksForRender: TaskType[] = tasks[tl.id];
        if (tl.filter === "active") tasksForRender = tasks[tl.id].filter(t => !t.isDone);
        if (tl.filter === "completed") tasksForRender = tasks[tl.id].filter(t => t.isDone);

        return (
            <Grid item key={tl.id}>
                <Paper elevation={14} style={{padding: '10px'}}>
                    <Todolist
                        id={tl.id}
                        filter={tl.filter}
                        title={tl.title}
                        tasks={tasksForRender}
                        changeTaskStatus={changeTaskStatus}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        removeTodoLists={removeTodoLists}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                </Paper>
            </Grid>
        )
    })
    return (
        <div className={'App'}>
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography
                        variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '30px 0'}}>
                    <AddItemForm addItem={addTodoList}/>
                    <Grid container spacing={5}>
                        {todoListsComponents}
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default App;
