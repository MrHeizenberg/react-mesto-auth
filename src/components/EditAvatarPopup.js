import PopupWithForm from "./PopupWithForm";
import React from "react";

function EditAvatarPopup(props) {

    const inputAvatarValue = React.useRef();

    const [avatarValid, setAvatarValid] = React.useState(true);
    const [avatarErrorMessage,setAvatarErrorMessage] = React.useState('');

    function handleAvatarChange(e) {
        inputAvatarValue.current = e.target.value;
        setAvatarValid(e.target.validity.valid)
        if (!e.target.validity.valid) {
            const errorMessage = e.target.validationMessage;
            setAvatarErrorMessage(errorMessage);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target.closest("form");
        props.onUpdateAvatar(inputAvatarValue.current,form);
    }

    return (
        <PopupWithForm title='Обновить аватар' name='profileUpdate' buttonvalue={!props.onLoading ? 'Сохранить' : 'Сохранить...'} isOpen={props.isOpen} onClose={props.onClose} onSubmit = {handleSubmit}>
            <fieldset className="popup__inputarea">
                <input id="avatar" type="url" name="avatar" className={!avatarValid ? `popup__text popup__text_type_error` : `popup__text`} placeholder="Название" onChange={handleAvatarChange} required />
                <span id="avatar-error" className="popup__text-error">{!avatarValid ? `${avatarErrorMessage}` : ``}</span>
            </fieldset>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;