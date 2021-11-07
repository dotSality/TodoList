import {Button} from './Button';
import React from 'react';
import {Input} from './Input';

type FullInput = {
    title: string
    callBack: () => void
    setTitle: (title: string) => void
}

export const FullInput = (props: FullInput) => {

    const addTask = () => {
        if (props.title) {
            props.callBack();
            props.setTitle('');
        }
    }
    return (
        <div>
            <Input setTitle={props.setTitle} title={props.title} callBack={props.callBack}/>
            <Button name={'+'} callBack={addTask}/>
        </div>
    )
}