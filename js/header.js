const sidebar = document.getElementById('sidebar')

function opensb(){
    sidebar.classList.toggle('opensidebar')
}

const menu = document.getElementById('menu')

let isClicked = false;

function openMenu() {
    if (!isClicked) {
        menu.classList.toggle('openmenu');
        sidebar.classList.remove('opensidebar');
        isClicked = true;
    }
}
