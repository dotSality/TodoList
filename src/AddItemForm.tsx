import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from '@material-ui/core';
import {AddOutlined} from '@material-ui/icons';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = (props: AddItemFormPropsType) => {

    let [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addItem();
        }
    }

    const addItem = () => {
        const trimmedTitle = title.trim();
        setTitle("");
        if (trimmedTitle) {
            props.addItem(trimmedTitle);
        } else {
            setError(true);
        }
    }

    const errorInputStyles = {
        border: '2px solid red',
        borderRadius: '3px',
        outline: 'none',
    }
    const inputStyles = {
        border: '2px solid black',
        borderRadius: '3px',
        outline: 'none'
    }

    return (
        <div>
            <TextField
                error={error}
                helperText={error && 'Title is required'}
                label={'Enter title'}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
            />
            <IconButton size={'small'} onClick={addItem}>
                <AddOutlined fontSize={'large'}/>
            </IconButton>
        </div>
    )
}