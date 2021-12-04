import {v1} from 'uuid';
import {TodoListType} from '../App';
import {AddTlAC, ChangeTlFilterAC, ChangeTlTitleAC, RemoveTodolistAC, todolistReducer} from './todolist-reducer';

test('correct todolist should be removed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: TodoListType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to watch', filter: 'completed'},
    ]

    const endState = todolistReducer(startState, RemoveTodolistAC(todolistId1))

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

    const endState = todolistReducer(startState, AddTlAC(newTodoListTitle))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodoListTitle)
})

test('correct todolist should change own name', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodoListTitle = 'new todolist'

    const startState: TodoListType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to watch', filter: 'completed'},
    ]

    const endState = todolistReducer(startState, ChangeTlTitleAC(newTodoListTitle, todolistId2))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodoListTitle)
})

test('todolist should change it"s filter', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: TodoListType[] = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to watch', filter: 'completed'},
    ]

    const endState = todolistReducer(startState, ChangeTlFilterAC('completed', todolistId2))

    expect(endState[1].filter).toBe('completed')
    expect(endState[0].filter).toBe('all')
})