import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import api from "../utils/Api";
import DeleteCardPopup from './DeleteCardPopup';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import {UserInfoContext} from '../contexts/CurrentUserContext';

function App() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = React.useState(false);
    const [cardIdDelete, setCardIdDelete] = React.useState('');
    const [selectedCard, setSelectedCard] = React.useState({isOpen:false, title: '', link: ''});
    const [currentUser, setCurrentUser] = React.useState({name:'', about: ''});
    const [cards,setCards] = React.useState([]);
    
    React.useEffect(() => {
        api.getInitialCards().then((res) => {
            setCards(Array.from(res));
        })
        .catch((err) => {
            console.log(err);
        })
},[])

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card.card.cardId,isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card.card.cardId ? newCard : c));
        });
    }

    function handleCardDelete() {
        setIsLoading(true);
        api.deleteCard(cardIdDelete).then(() => {
            setCards((state) => state.filter((c) => c._id !==  cardIdDelete));
            closeAllPopups();
        }).finally(() => {
            setIsLoading(false);
        });
    }

    React.useEffect(() => {
        api.getProfile().then((res) => {
            setCurrentUser(res);
        })
        .catch((err) => {
            console.log(err);
        })},[]);

        function handleUpdateUser(name,description) {
            setIsLoading(true);
            api.profileUpdate(name,description).then((userInfo) => {
                setCurrentUser(userInfo);
                closeAllPopups();
            }).finally(() => {
                setIsLoading(false);
            });
        }

        function handleUpdateAvatar(link,form) {
            setIsLoading(true);
            api.profileAvatarUpdate(link).then((userInfo) => {
                setCurrentUser(userInfo);
                closeAllPopups();
                form.reset();
            }).finally(() => {
                setIsLoading(false);
            });
        }

        function handleAddPlaceSubmit(name,link,form) {
            setIsLoading(true);
            api.addCard(name, link).then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
                form.reset();
            }).finally(() => {
                setIsLoading(false);
            });
        }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleDeleteCardClick(cardId) {
        setCardIdDelete(cardId);
        setIsDeleteCardPopupOpen(true);
    }

    function handleCardClick(props) {
        setSelectedCard({isOpen:true,title:props.card.name,link:props.card.link});
    }

    function closeAllPopups() {
        isDeleteCardPopupOpen ? setIsDeleteCardPopupOpen(false) : isEditProfilePopupOpen ? setIsEditProfilePopupOpen(false) : isAddPlacePopupOpen ? setIsAddPlacePopupOpen(false) : isEditAvatarPopupOpen ? setIsEditAvatarPopupOpen(false) : setSelectedCard({isOpen:false});
    }

    return (
        <UserInfoContext.Provider value={currentUser}>
        <div className="page">
            <Header />
            <Main onEditProfile = {handleEditProfileClick} onAddPlace = {handleAddPlaceClick} onEditAvatar = {handleEditAvatarClick} onDeleteCardPopup = {handleDeleteCardClick} onCardClick = {handleCardClick} cards = {cards} onCardLike = {handleCardLike}/>
            <Footer />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser = {handleUpdateUser} onLoading = {isLoading}/> 

            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar = {handleUpdateAvatar} onLoading = {isLoading}/>

            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace = {handleAddPlaceSubmit}  onLoading = {isLoading}/>

            <DeleteCardPopup isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onCardDelete = {handleCardDelete} onLoading = {isLoading}/>

            <ImagePopup card = {selectedCard} onClose = {closeAllPopups}/>
        </div>
        </UserInfoContext.Provider>
    )
}

export default App;