
var statusBotoMenu = false;

window.onload = () => {

    // Activació del listener al fer click en hamburguesa
    document.getElementById("botoMenu").addEventListener("click", gestionaMenu);
}


// Mostra el menú horitzonal quan es passa a >=820px.
window.onresize = () => {

    if (window.innerWidth >= 820) {     
        document.getElementById('menu').style.position = "relative";
        document.getElementById('menu').style.right = "0px";
        document.getElementById('menu').style.left = "0px";
        document.getElementById('menu').style.zIndex = "999";
    } 
}

// Mostra/oculta menú vertical al fer click a l'hamburguesa en resolució <820px.
const gestionaMenu = () =>  {

    if (statusBotoMenu) {
        document.getElementById('menu').style.position = 'absolute';
        document.getElementById('menu').style.left = '-150px';
        document.getElementById('menu').style.transition = 'left 1000ms linear';
    } else {
        document.getElementById('menu').style.position = 'absolute';
        document.getElementById('menu').style.top = '-2px';
        document.getElementById('menu').style.left = '170px';
        document.getElementById('menu').style.transition = 'left 1000ms linear';
    }
    statusBotoMenu = !statusBotoMenu;
}

