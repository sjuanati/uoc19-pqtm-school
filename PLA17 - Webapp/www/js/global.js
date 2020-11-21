
// Variables globals
let isActiveHamburguer = false;


window.onresize = () => {

    // Mostra el menú horitzonal si resolució >= 550px
    if (window.innerWidth >=550) {
        document.getElementById('navbar_normal').style.display = 'flex';
        document.getElementById('navbar_normal').style.position = "relative";
        document.getElementById('navbar_normal').style.top = '0px';
        document.getElementById('navbar_normal').style.left = "0px";
        document.getElementById('navbar_normal').style.zIndex = "999";
    }

    // Mostra el menú horitzonal si resolució < 550px
    if (window.innerWidth < 550) {
        document.getElementById('navbar_normal').style.display = 'none';
    }
}

// Mostra/amaga menú vertical quan es clicka l'hamburguesa a resolució <550px
const gestionaMenu = () => {

    isActiveHamburguer = !isActiveHamburguer;

/************ TODO TRANSICIÓ SUAU ******************* */
/************ TODO TRANSICIÓ SUAU ******************* */
/************ TODO TRANSICIÓ SUAU ******************* */
/************ TODO TRANSICIÓ SUAU ******************* */
/************ TODO TRANSICIÓ SUAU ******************* */

    // Mostra/amaga el menú vertical
    if (isActiveHamburguer) {
        document.getElementById('navbar_normal').style.display = 'flex';
        document.getElementById('navbar_normal').style.position = 'absolute';
        document.getElementById('navbar_normal').style.top = '70px';
        document.getElementById('navbar_normal').style.left = '0px';
        document.getElementById('navbar_normal').style.zIndex = "999";
    } else {
        document.getElementById('navbar_normal').style.position = 'absolute';
        document.getElementById('navbar_normal').style.top = '70px';
        document.getElementById('navbar_normal').style.left = '-150px';
    }
  
}
