import React, {ChangeEvent, KeyboardEvent} from 'react';

type InputType = {
    title: string
    callBack: () => void
    setTitle: (title: string) => void
}

export const Input = (props: InputType) => {

    const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => props.setTitle(e.currentTarget.value)
    const onKeyPressCallback = (e: KeyboardEvent<HTMLInputElement>) => {if (e.key === 'Enter') props.callBack()}

    return (
        <input
            value={props.title}
            placeholder='Enter your task...'
            onChange={onChangeCallback}
            onKeyPress={onKeyPressCallback}
        />
    )
}