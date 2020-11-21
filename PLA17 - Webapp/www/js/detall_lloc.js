let llocs;

window.onload = () => {

    // Listener menú de navegació (/js.global.js)
    document.getElementById("hamburguer_navbar").addEventListener("click", gestionaMenu);

    // Listener botó eliminar
    document.getElementById("elimina").addEventListener("click", eliminaLlocDialeg);

    // Listener botó enrere
    document.getElementById("vesEnrere").addEventListener("click", vesEnrere);

    mostraLloc();
}


const mostraLloc = () => {

    // Recupera llocs de l'storage
    llocs = JSON.parse(localStorage.getItem('llocs'));

    // Recupera posició del lloc seleccionat de l'storage
    posicio = localStorage.getItem('posicio')

    // Guarda dades del lloc en variables
    let nomLloc = llocs[posicio].nomLloc;
    let descripcioLloc = llocs[posicio].descripcioLloc;
    let imatgeLloc = llocs[posicio].imatgeLloc;
    let lat = llocs[posicio].latitud;
    let long = llocs[posicio].longitud;

    if (imatgeLloc === undefined) {
        imatgeLloc = 'img/picture.png'
    }

    // Mostra dades del lloc a l'HTML
    document.getElementById('places').innerHTML += 
    `<div class='detail_item_container'>` + 
        `<div class='text_container'> <h1> ${nomLloc} </h1> </div>` +
        `<div class='text_container'> ${descripcioLloc} </div>` +
        `<div class='image_container'>` +
            `<img src='${imatgeLloc}' class='imatge'>` +
        `</div>` +
    `</div>`;

    mostraMapa(nomLloc, lat, long)
}


const mostraMapa = (nom, lat, long) => {

    // Creem un objecte de coordenades (google)
    let latlngmarks = new google.maps.LatLng(lat, long);

    // Assignem coordenades, zoom i tipus de terreny al mapa
    let opcionsMapa = {
        center: latlngmarks,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID //TERRAIN
    };

    // Creem un objecte de mapa (google)
    let map = new google.maps.Map(document.getElementById("mapa"), opcionsMapa);

    // Creem un objecte de marcador al mapa (google)
    let mapMarker = new google.maps.Marker({ 
        position: latlngmarks, 
        title: "Estàs aquí.",
    }); 

    // Creem un objecte d'informació al mapa (google)
    let infoWindow = new google.maps.InfoWindow({content: nom});

    // Listeners sobre el mapa segons la posició del mouse
    mapMarker.addListener('mouseover', () => infoWindow.open(map, mapMarker));
    mapMarker.addListener('mouseout', () => infoWindow.close(map, mapMarker));
    mapMarker.setMap(map);
}

const eliminaLlocDialeg = () => {

    // Obrim diàleg de confirmació abans d'eliminar un lloc
    // Mode app
    try {
        navigator.notification.confirm(
            "Estàs segur/a que vol eliminar la foto?", 
            eliminaCallback, 
            "Eliminar", 
            ["OK", "Cancel·lar"])
    }
    // Mode browser
    catch {
        if (confirm('you sure?')) {
            eliminaLloc();
       } 
    }
}

function eliminaCallback(buttonIndex) {

    if (buttonIndex === 1) {
        
        eliminaLloc();
    } 
}

const eliminaLloc = () => {

    // Eliminem el lloc
    llocs.splice(posicio,1);

    // Guardem el nou array de llocs a l'storage sense el darrer lloc eliminat 
    localStorage.setItem('llocs', JSON.stringify(llocs));

    vesEnrere()
}

const vesEnrere = () => {

    // Tornem a la pàgina anterior
    window.history.back();
}