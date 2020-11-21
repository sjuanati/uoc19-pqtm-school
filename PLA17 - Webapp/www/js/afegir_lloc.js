let lat = 0;
let long = 0;
let imatgeLloc;
let llocs;

window.onload = () => {

    // Listener Menú de navegació (/js.global.js)
    document.getElementById("hamburguer_navbar").addEventListener("click", gestionaMenu);

    // Listener Botó tornar enrere
    document.getElementById("vesEnrere").addEventListener("click", vesEnrere);

    // Listener Botó guardar lloc
    document.getElementById("guardarLloc").addEventListener("click", guardarLloc);

    // Recupera llocs de l'storage
    llocs = JSON.parse(localStorage.getItem('llocs'));
}

let app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {

        // Listener del botó per fer foto
        document.getElementById('ferFoto').onclick = ferFoto;

        // Busquem posició GPS actual
        navigator.geolocation.getCurrentPosition(
            onMapSuccess,
            onMapError,
            { enableHighAccuracy: true});
    }
};

app.initialize();

const onMapSuccess = (position) => {     

    // Guardem la posició actual GPS
    lat = position.coords.latitude;
    long = position.coords.longitude;
}

const onMapError = (error) => {

    // Mostrem l'error (si és el cas)
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function ferFoto() {

    // Utilitzem la funcionalitat de fer foto de Cordova
    navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, { 
        quality: 50,
        correctOrientation: true,
        destinationType: Camera.DestinationType.FILE_URI
        });
}

function onPhotoSuccess(imageURI) {

    // Guardem la foto si tot ha anat correctament
    let image = document.getElementById('imatge');
    image.src  = imageURI;
    imatgeLloc = imageURI;
}

function onPhotoFail(message) {

    // Mostrem error si ha fallat quelcom al fer la foto
    alert('Photo failed because: ' + message);
}

const guardarLloc = () => {

    // Guardem les dades del nou lloc
    let dadesLloc = {
        'nomLloc':          document.getElementById('nomLloc').value.trim(),
        'descripcioLloc':   document.getElementById('descripcioLloc').value.trim(),
        'imatgeLloc':       imatgeLloc,
        'latitud':          lat,
        'longitud':         long
    }

    // Comprovem que l'array de llocs no sigui null (1er cop q s'executa l'app)
    if (llocs === null) {
        llocs = llocs || [];
    }

    // Afegim el nou lloc a l'array de llocs
    llocs.push(dadesLloc);

    // Guardem l'array actualitzat de llocs a l'storage
    localStorage.setItem('llocs', JSON.stringify(llocs));

    // Tornem enrere
    vesEnrere();
}

const vesEnrere = () => {

    // Tornem a la pàgina anterior
    window.history.back();
}