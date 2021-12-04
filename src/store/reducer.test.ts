import {ActionType, calculator, sum} from './reducer';

const num1 = 10;
const num2 = 5;

test('sum test', () => {

    const result = sum(num1, num2);

    expect(result).toBe(15)
})

test('calculator test', () => {
    const actionSum: ActionType = {type: 'SUM', number: num2}
    const actionSub: ActionType = {type: 'SUB', number: num2}
    const actionMult: ActionType = {type: 'MULT', number: num2}
    const actionDiv: ActionType = {type: 'DIV', number: num2}
    const resultSum = calculator(num1, actionSum)
    const resultSub = calculator(num1, actionSub)
    const resultMult = calculator(num1, actionMult)
    const resultDiv = calculator(num1, actionDiv)

    expect(resultSum).toBe(15)
    expect(resultSub).toBe(5)
    expect(resultMult).toBe(50)
    expect(resultDiv).toBe(2)
})