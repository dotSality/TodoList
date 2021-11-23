import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type EditableSpanProps = {
    title: string
    setNewTitle: (title: string) => void
}

export const EditableSpan = (props: EditableSpanProps) => {

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
        editMode ? <input value={title}
                onBlur={offEditMode}
                autoFocus onChange={changeTitle}
                onKeyPress={onKeyPressOffEditMode}
            />
        : <span onDoubleClick={onEditMode}>{props.title}
            <button onClick={onEditMode}>edit</button>
        </span>
    )
}