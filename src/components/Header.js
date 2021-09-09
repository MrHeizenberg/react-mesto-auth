import vector from '../images/Vector.svg';

function Header() {
    return (
        <header className="header root">
            <img src={vector} alt="Лого" className="header__logo" />
        </header>
    )
}

export default Header;
