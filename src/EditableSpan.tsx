import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from '@material-ui/core';
import {Edit} from '@material-ui/icons';

type EditableSpanProps = {
    title: string
    setNewTitle: (title: string) => void
}

export const EditableSpan = React.memo((props: EditableSpanProps) => {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)

    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        setEditMode(false)
        props.setNewTitle(title)
    }

    const onKeyPressOffEditMode = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter')
            offEditMode()
    }

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
            editMode ? <TextField
                    style={{width: '148px'}}
                    value={title}
                    onBlur={offEditMode}
                    autoFocus onChange={changeTitle}
                    onKeyPress={onKeyPressOffEditMode}/>
            : <span onDoubleClick={onEditMode} style={{display: 'inline-block', margin: '0 auto 0 0'}}>{props.title}
            <IconButton style={{display: 'inline-block'}} size={'small'} onClick={onEditMode}>
                <Edit fontSize={'small'}/>
            </IconButton>
        </span>
    )
})