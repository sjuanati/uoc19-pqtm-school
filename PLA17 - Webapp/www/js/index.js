
// Variables globals
let imatges;
let nomImatge;

window.onload = () => {

    carregaLlocs();

    // Listener pel menú de navegació (/js.global.js)
    document.getElementById("hamburguer_navbar").addEventListener("click", gestionaMenu);
}

const carregaLlocs = () => {
    
    // Elimina imatges anteriors
    document.getElementById('places').innerHTML = '';

    // Recupera llocs de l'storage (Cal utilitzar JSON per guardar arrays i objectes al localStorage)
    llocs = JSON.parse(localStorage.getItem('llocs'));

    if ( (llocs === null) || (llocs.length === 0)) {

        // Proposem afegir un lloc
        document.getElementById('places').innerHTML = 
            `<div class='article_item'>` + 
                `<a href="afegir_lloc.html" class="navbar_item" id="afegir_lloc"> 
                    <h2> <i class="material-icons md-16"> playlist_add </i> Afegir Lloc </h2> 
                </a>` +
            `</div>`;

    } else {

        // Mostrem llocs a l'HTML
        llocs.forEach( (elem, index) => {

            if (elem.imatgeLloc === undefined) {
                elem.imatgeLloc = 'img/picture.png'
            }
            
            document.getElementById('places').innerHTML += 
                `<div class='article_item'>` + 
                    `<div class='image_container'>` +
                        `<img src='${elem.imatgeLloc}' class='imatge'>` +
                    `</div>` +
                    `<div class='text_container'>` +
                        `<p class="fontsize_16px fontbold"> ${elem.nomLloc} </p>` +
                        `<p> ${elem.descripcioLloc} </p>` +
                    `</div>` +
                    `<div id='posicio'> <div value='${index}'> </div> </div>` +
                `</div>`;
        })
    }



   // Afegeix listener a cada fila amb lloc
   imatges = document.querySelectorAll(".article_item");
   imatges.forEach(elem => {
       elem.onclick = detallLloc
   })
}

function detallLloc() {

    // Busquem la posició del lloc seleccionat d'entre tots els llocs
    let selectedPlace = this
    let allPlaces = this.parentNode
    let index = Array.prototype.indexOf.call(allPlaces.children, selectedPlace)

    // Guardem la posició del lloc seleccionat a l'storage
    localStorage.setItem('posicio', index);

    // Cridem a l'HTML de detall del lloc
    window.location = document.getElementById('detall_lloc').href;
}
