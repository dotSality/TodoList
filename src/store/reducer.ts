export const sum = (a: number, b: number): number => a + b;
export const sub = (a: number, b: number): number => a - b;
export const mult = (a: number, b: number): number => a * b;
export const div = (a: number, b: number): number => a / b;

export type ActionType = {
    type: 'SUM' | 'SUB' |'MULT' | 'DIV'
    number: number
}

export const calculator = (state: number, action: ActionType) => {
    switch (action.type) {
        case 'SUM':
            return state + action.number;
        case 'SUB':
            return state - action.number
        case 'MULT':
            return state * action.number
        case 'DIV':
            return state / action.number
        default: return state
    }
}