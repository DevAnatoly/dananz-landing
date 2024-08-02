//burger menu
const burgerButton = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.menu__list');
const Menu = document.querySelector('.menu');
const crossButton = document.createElement('div');
crossButton.classList.add('cross');
crossButton.innerHTML = '<img src="images/cross.svg" alt="close img">';

burgerButton.addEventListener('click', ()=>{
    mobileMenu.classList.add('menu__list--open');
    Menu.append(crossButton);

});
crossButton.addEventListener('click', () => {
    mobileMenu.classList.remove('menu__list--open');
    crossButton.remove();
});
