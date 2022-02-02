import {AppInitStateType, appReducer, setAppError, setAppStatus} from './app-reducer';
import {start} from 'repl';


let startState: AppInitStateType;

beforeEach(() => {
    startState = {
        status: 'idle',
        error: null,
        isInit: false,
    }
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppError({error: 'error'}))

    expect(endState.error).toBe('error')
    expect(endState.status).toBe('idle')
})

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatus({status: 'succeeded'}))

    expect(endState.status).toBe('succeeded')
    expect(endState.isInit).toBeFalsy()
})