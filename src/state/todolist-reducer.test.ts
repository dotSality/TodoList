import {v1} from 'uuid';
import {TodoListType} from '../AppWithRedux';
import {addTlAC, changeTlFilterAC, changeTlTitleAC, removeTodolistAC, todolistsReducer} from './todolists-reducer';

let todolistId1: string;
let todolistId2: string;

let startState: TodoListType[];

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to watch', filter: 'completed'},
    ]
})


test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
    expect(endState[0]).toStrictEqual({id: todolistId2, title: 'What to watch', filter: 'completed'})

})

test('correct todolist should be added', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodoListTitle = 'new todolist'

    const startState: TodoListType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to watch', filter: 'completed'},
    ]

    const endState = todolistsReducer(startState, addTlAC(newTodoListTitle))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodoListTitle)
})

test('correct todolist should change own name', () => {
    let newTodoListTitle = 'new todolist'

    const endState = todolistsReducer(startState, changeTlTitleAC(newTodoListTitle, todolistId2))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodoListTitle)
})

test('todolist should change it"s filter', () => {

    const endState = todolistsReducer(startState, changeTlFilterAC('completed', todolistId2))

    expect(endState[1].filter).toBe('completed')
    expect(endState[0].filter).toBe('all')
})