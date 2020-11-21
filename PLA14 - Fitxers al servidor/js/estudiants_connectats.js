
const print = (x) => {console.log(x)} 

window.onload = () => {

    // Obtenció del llistat de professors i els seus alumnes des del servidor
    obtenirProfessors();

    // Activació dels Listeners
    document.getElementById("profesCombo").addEventListener("change", obtenirAlumnes);
}

function parametresConnexio(tipusOperacio) {

    switch (tipusOperacio) {

        case "CP":
            url = 'http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php';
            break;
        case "CA":
            url = 'http://alcyon-it.com/PQTM/pqtm_consulta_alumnos.php';
            break;
        case "CAC":
            url = 'http://alcyon-it.com/PQTM/pqtm_consulta_alumnos_logued.php';
            break;
        default:
            url = ""
            alert("Paràmetres de connexió desconeguts!")
            break;
    }
  
    parametres = {
      method: 'post',
      body: dades,
      mode: 'cors',
      cache: 'no-cache'
    };
  
  }

const obtenirProfessors = () => {

    // Encapsula dades
    dades = new FormData();
    dades.append('tipoconsulta','A');
  
    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("CP");
  
    // Llença la petició al servidor i mostra la resposta
    fetch (url, parametres)
    .then(function(resposta) {
      if (resposta.ok) {
        return resposta.json();
      } else {
        throw 'Error en la petició AJAX';
      }
    })
    .then(function(resultat) {
  
        // Afegim l'opció 'Tots els professors' al combo
        document.getElementById("profesCombo").innerHTML =
        "<option value=0> Tots els professors </option>"

        // Afegim resultat de la consulta de professors al combo
        for (i in resultat) {
        document.getElementById("profesCombo").innerHTML +=
        "<option value='" + 
            resultat[i].idteacher + "'>" +
            resultat[i].nombre +
        "</option>"
        }
  
      // Mostra els alumnes vinculats al professor seleccionat al combo
      obtenirAlumnes();
  
    })
    .catch(function(error) {
        print(error);
        alert("Error: "+error);
    })
  }


const obtenirAlumnes = () => {

    // Netejar mapa d'una possible selecció anterior
    //document.getElementById("mapa").innerHTML('');

    // Obtenim l'id del professor seleccionat
    let idProfessor = document.getElementById("profesCombo").value

    // Encapsula dades
    dades = new FormData();
    dades.append('tipoconsulta','T');
    dades.append('idprofesor',idProfessor);

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("CAC");

    // Llença la petició al servidor i mostra la resposta
    fetch (url, parametres)
    .then(function(resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            throw 'Error en la petició AJAX';
        }
    })
    .then(function(resultat) {

        // Afegim capçaleres
        document.getElementById("llistaAlumnes").innerHTML =
        "<th class ='width50px'> ID </th>" +
        "<th> Alumne </th>" +
        "<th> Professor </th>"
        
        // Afegim llistat de grups a l'HTML
        for (i in resultat) {
            document.getElementById("llistaAlumnes").innerHTML +=
            "<tr>" +
            "<td class ='width50px idAlumne'>" + resultat[i].idalumno + "</td>" +
            "<td class ='width300px'>" + resultat[i].nombre + "</td>" +
            "<td class ='width300px'>" + resultat[i].profesor + "</td>" +
            "</tr>";
        }

        // Recuperem totes les etiquetes <td> amb l'id de l'alumne i afegim listeners
        let td = document.querySelectorAll("#llistaAlumnes td")
        td.forEach(elem => {
            elem.onclick = localitzacioAlumne
        })

    })
    .catch(function(error) {
        print(error);
        alert("Error: " + error);
    });
}

//const localitzacioAlumne = () => {
function localitzacioAlumne() {

    // Recuperem les dades de la fila seleccionada
    let fila = this.closest("tr")

    // Treiem el background prèviament marcat
    let tr = document.querySelectorAll("#llistaAlumnes tr")
    for (i=0; i<tr.length; i++) {
    tr[i].style.background = "transparent"
    }

    // Marquem fila seleccionada amb un color
    fila.style.background = "orange"

    // Recuperem l'identificador del professor
    idAlumne = fila.querySelector('td.idAlumne').innerText

    // Encapsula dades
    dades = new FormData();
    dades.append('tipoconsulta', 'A');
    dades.append('id', idAlumne);

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("CA");

    // Llença la petició al servidor i mostra la resposta
    fetch (url, parametres)
    .then(function(resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            throw 'Error en la petició AJAX';
        }
    })
    .then(function(resultat) {

        // Mostra posició de l'alumne en el mapa
        mostraMapa(resultat[0].nombre, resultat[0].lat, resultat[0].long)
        // Mostra foto de l'alumne
        if ((resultat[0].foto) != null) {
            document.getElementById('fotoAlumne').src = "http://alcyon-it.com/PQTM/img/" + resultat[0].foto;
          } else {
            document.getElementById('fotoAlumne').src = '';
          }
    })
    .catch(function(error) {
        print(error);
        alert("Error: " + error);
    });
}


function mostraMapa(nom, lat, long) {

    let latlngmarks = new google.maps.LatLng(lat, long);

    let opcionsMapa = {
        center: latlngmarks,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID //TERRAIN
    };
    
    let map = new google.maps.Map(document.getElementById("mapa"), opcionsMapa);

    let mapMarker = new google.maps.Marker({ 
        position: latlngmarks, 
        title: "Estàs aquí.",
    }); 

    let infoWindow = new google.maps.InfoWindow({content: nom});

    mapMarker.addListener('mouseover', () => infoWindow.open(map, mapMarker));

    mapMarker.addListener('mouseout', () => infoWindow.close(map, mapMarker));

    mapMarker.setMap(map);



}
