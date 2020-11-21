let arrayFototeca = [];
let arrayGaleria = [];
let posArrayGaleria = 0;

window.onload = function() {

    // Inicialitza array de fotos
    generarArray();

    // Carrega fototeca
    mostrarFototeca();

    // Carrega galeria (prèviament guardada a l'storage)
    carregarGaleriaStorage();

    // Activació dels Listeners
    document.getElementById("imatgeAmpliada").addEventListener("click", tancarImatgeAmpliada);
    document.getElementById("vesEnrere").addEventListener("click", vesEnrere);
    document.getElementById("vesEndavant").addEventListener("click", vesEndavant);
}


function generarArray() {
    for (let i=1; i<9; i++) {
        arrayFototeca[i] = `casa${i}.jpg`;
    }
}


function mostrarFototeca() {

    // Construeix el codi HTML amb la ruta i nom de les fotos
    let imatges = '';
    for (let i=1; i<arrayFototeca.length; i++) {
        imatges += `<img src="img/${arrayFototeca[i]}" class="img_fototeca">`;
    }

    // Mostra les imatges en l'HTML
    document.getElementById('fototeca').innerHTML = imatges;

    // Afegim listeners a cada foto
    imatges = document.querySelectorAll("#fototeca img");
    for (let i=0; i<imatges.length; i++) {
        imatges[i].ondblclick = mostrarGaleria;
    }
}


function mostrarGaleria() {

    let foto = this.getAttribute('src');

    //Comprova que la foto no s'hagi afegit anteriorment
    if (arrayGaleria.includes(foto)) {
        alert('La foto ja existeix a la galeria');
        return 
    }

    // Afegeix imatge a la galeria
    arrayGaleria.push(foto);

    carregarGaleria();
}


function carregarGaleria() {
    
    let imatges = '';
    for (let i=0; i<arrayGaleria.length; i++) {
        imatges += 
        `<div class='imatgesGaleria'>` +
            `<img class="img_galeria" src="${arrayGaleria[i]}">` +
            `<img class='boto_esborrar' src='img/borrar.png'>` +
        `</div>`;
    }

    // Mostra galeria a l'HTML
    document.getElementById('galeria').innerHTML = imatges;

    // Afegim listeners a cada botó d'eliminar foto
    botoEsborrar = document.querySelectorAll(".boto_esborrar");
    for (let i=0; i<botoEsborrar.length; i++) {
        botoEsborrar[i].onclick = esborrarFoto;
    }

    botoImatge = document.querySelectorAll(".img_galeria");
    for (let i=0; i<botoImatge.length; i++) {
        botoImatge[i].onclick = mostrarFoto;
    }

    // Guardar imatges de la galeria en fitxer
    guardarGaleria();
}


function mostrarFoto() {

    // Obtenim la posició de la foto a mostrar dins de l'array Galeria
    let foto = this.getAttribute('src');
    posArrayGaleria = arrayGaleria.indexOf(foto);
    
    // Afegim la foto en el <img> corresponent
    document.getElementById('ampliaFoto').src = arrayGaleria[posArrayGaleria];

    // Fem visible la foto
    $('#imatgeAmpliada').fadeIn(500, 'linear');
    document.getElementById('imatgeAmpliada').style.display = 'flex';
    document.getElementById('imatgeAmpliada').style.justifyContent = 'center';
    document.getElementById('imatgeAmpliada').style.alignItems = 'center';
}


function esborrarFoto() {

    // Busquem l'índex que ocupa la foto en l'HTML, que coincidirà amb l'index de l'array de la galeria
    let caixaContenidoraImatge = this.parentNode;
    let seccioGaleria = this.parentNode.parentNode;
    let indexFoto = Array.prototype.indexOf.call(seccioGaleria.children, caixaContenidoraImatge);

    // Eliminem la foto de la galeria
    arrayGaleria.splice(indexFoto,1);

    // Eliminem la foto de l'HTML
    seccioGaleria.removeChild(caixaContenidoraImatge);

    // Guardar imatges de la galeria en fitxer
    guardarGaleria();
}


function tancarImatgeAmpliada() {

    //document.getElementById('imatgeAmpliada').style.display = 'none';
    $('#imatgeAmpliada').fadeOut(500, 'linear')
}


function vesEndavant(event) {
    
    // Evitem que s'activi el listener de tancar la imatge
    event.stopPropagation();

    // Si estem a la darrera imatge, tornem al principi
    if (posArrayGaleria === (arrayGaleria.length - 1)) {
        posArrayGaleria = 0;
    } else {
        posArrayGaleria++;
    }

    // Afegim la foto en el <img> corresponent
    document.getElementById('ampliaFoto').src = arrayGaleria[posArrayGaleria];
}


function vesEnrere(event) {

    // Evitem que s'activi el listener de tancar la imatge
    event.stopPropagation();

    // Si estem a la darrera imatge, tornem al principi
    if (posArrayGaleria === 0) {
        posArrayGaleria = arrayGaleria.length - 1;
    } else {
        posArrayGaleria--;
    }

    // Afegim la foto en el <img> corresponent
    document.getElementById('ampliaFoto').src = arrayGaleria[posArrayGaleria];
}


function guardarGaleria() {
    
    if (arrayGaleria.length > 0) {

        // Conversió de galeria a un sol string separant els elements amb '//'
        let arrayText = arrayGaleria.join('//');
        
        // Guardem arrayText a l'storage
        localStorage.setItem('galeria', arrayText);
    } else {

        // Eliminem l'storage si l'array està buit
        localStorage.removeItem('galeria');
    }
}


function carregarGaleriaStorage() {

    if (localStorage.getItem('galeria') != undefined) {

        // Recuperem el contingut de l'storage
        let arrayText = localStorage.getItem('galeria');

        // Convertim string en elements d'array
        arrayGaleria = arrayText.split('//');

        // Mostrem la galeria al carregar la pàgina d'inici
        carregarGaleria();

    }
}
