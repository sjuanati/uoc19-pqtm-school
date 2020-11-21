var idGrup;
var idProfessor;
var llistaParticipants;

window.onload = function() {

  // Deshabilitar botons de modificació, baixa i participants
  desactivaBotonsGrup();
  desactivaBotonsParticipants();

  // Obtenció del llistat de professors i escoles des del servidor
  obtenirProfessors();

  // Activació dels Listeners
  document.getElementById("alta").addEventListener("click", altaGrup);
  document.getElementById("modificar").addEventListener("click", modificacioGrup);
  document.getElementById("baixa").addEventListener("click", baixaGrup);
  document.getElementById("profesCombo").addEventListener("change", obtenirGrups);
  document.getElementById("participants").addEventListener("click", obtenirParticipants);

}


function activaBotonsGrup() {

  // Habilitar botons de modificació i baixa
  document.getElementById("modificar").style.display = "inline";
  document.getElementById("baixa").style.display = "inline";

}


function desactivaBotonsGrup() {

  // Deshabilitar botons de modificació i baixa
  document.getElementById("modificar").style.display = "none";
  document.getElementById("baixa").style.display = "none";

}


function activaBotonsParticipants() {

  // Habilita botó de participants
  document.getElementById("participants").style.opacity = "1";
  document.getElementById("participants").disabled = false;

}


function desactivaBotonsParticipants() {

  // Deshabilita botó de participants
  document.getElementById("participants").style.opacity = "0.5";
  document.getElementById("participants").disabled = true;
  document.getElementById("llistaParticipants").style.display = "none";

}


function netejaDescripcioGrup() {

  // Elimina el valor dels camps en secció Descripció grup
  document.getElementById("nom").value = '';
  document.getElementById("descripcio").value = '';
  document.getElementById("formador").value = '';
  document.getElementById("participants").innerHTML = 'Participants';
  document.getElementById("llistaParticipants").value = ''

}


function parametresConnexio(tipusOperacio) {

  switch (tipusOperacio) {

    case "AG":
      url = 'http://alcyon-it.com/PQTM/pqtm_alta_grupos.php';
      break;
    case "MG":
      url = 'http://alcyon-it.com/PQTM/pqtm_modificacion_grupos.php';
      break;
    case "BG":
      url = 'http://alcyon-it.com/PQTM/pqtm_baja_grupos.php';
      break;
    case "CP":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php';
      break;
    case "CG":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_grupos.php';
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


function fetchServidor() {

  // Llença la petició al servidor i mostra la resposta
  fetch (url, parametres)
  .then(function(resposta) {
    if (resposta.ok) {
      return resposta.text();
    } else {
      throw 'Error en la petició AJAX';
    }
  })
  .then(function(resultat) {
    console.log(resultat);
    alert("Resultat: "+resultat);

    //// Refresca llista de grups si l'alta és OK
    if (resultat.substring(0,2) == "00") {
      obtenirGrups()
    }
  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}


function comprovaDades(tipusOperacio) {

  // Obté el nom de grup i la descripció, eliminant espais en blanc a l'inici i la fi
  var nom = document.getElementById('nom').value.trim();
  var descripcio = document.getElementById('descripcio').value.trim();

  // Comprova que tots els camps estiguin informats
  if (nom.length == 0) {
    alert("Siusplau ompli el camp 'Nom'");
    return false;
  } else if (descripcio.length == 0) {
    alert("Siusplau ompli el camp 'Descripció'");
    return false;
  }

  // Encapsula dades
  dades = new FormData();
  dades.append('nombre',nom);
  dades.append('descripcion',descripcio);
  if (tipusOperacio == 'AG') {
    dades.append('idprofesor',idProfessor);
  } else if (tipusOperacio == 'MG') {
    dades.append('idgrupo',idGrup);
  }

  return true;

}


function obtenirProfessors() {

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

    // Afegim resultat de la consulta de professors en l'HTML
    for (i in resultat) {
      document.getElementById("profesCombo").innerHTML +=
      "<option value='" + resultat[i].idteacher + "'>" +
      resultat[i].nombre +
      "</option>"
    }

    // Al carregar-se la llista de professors al combo, es mostra els grups del primer professor
    obtenirGrups();

  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}

// Es llença sempre que canvi el combo de professors
function obtenirGrups() {

  // Elimina qualsevol valor antic en camps de Descripció grup
  netejaDescripcioGrup();
  // Desactivem botons de modificar i eliminar grup + botó de participants
  desactivaBotonsGrup();
  desactivaBotonsParticipants()

  // Obtenim l'id del professor seleccionat
  idProfessor = document.getElementById("profesCombo").value;

  // Actualitza el camp 'formador' a la secció 'Descripció grup'
  nomProfessor = document.getElementById("profesCombo").selectedOptions[0].text
  document.getElementById("formador").value = nomProfessor;

  // Encapsula dades
  dades = new FormData();
  dades.append('tipoconsulta','P');
  dades.append('idprofesor',idProfessor);

  // Estableix paràmetres de connexió amb el servidor
  parametresConnexio("CG");

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
    document.getElementById("profesTaula").innerHTML =
    "<th class ='width50px'> ID </th>" +
    "<th> Nom </th>" +
    "<th> Participants </th>"

    // Afegim llistat de grups a l'HTML
    for (i in resultat) {

      document.getElementById("profesTaula").innerHTML +=
      "<tr>" +
        "<td class ='width50px idgrup'>" + resultat[i].idgrupo + "</td>" +
        "<td class ='width300px'>" + resultat[i].nombregrupo + "</td>" +
        "<td>" + resultat[i].participantes + "</td>" +
      "</tr>";
    }

    // Recuperem totes les etiquetes <td> amb l'id de grup i afegim listeners
    var td = document.querySelectorAll("#profesTaula td")
    for (i=0; i<td.length; i++) {
      td[i].onclick = consultaGrup
    }

  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}


function consultaGrup() {

  // Elimina qualsevol valor antic en camps de Descripció grup
  netejaDescripcioGrup()

  // Recuperem les dades de la fila seleccionada
  var fila = this.closest("tr")

  // Treiem el background prèviament marcat
  var tr = document.querySelectorAll("#profesTaula tr")
  for (i=0; i<tr.length; i++) {
    tr[i].style.background = "transparent"
  }

  // Marquem fila seleccionada amb un color
  fila.style.background = "orange"

  // Recuperem l'identificador del professor
  idGrup = fila.querySelector('td.idgrup').innerText

  // Encapsula dades
  dades = new FormData();
  dades.append('tipoconsulta','G');
  dades.append('idgrupo',idGrup);

  // Estableix paràmetres de connexió amb el servidor
  parametresConnexio("CG");

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

    // Actualitza el camp 'formador' a la secció 'Descripció grup'
    nomProfessor = document.getElementById("profesCombo").selectedOptions[0].text
    document.getElementById("formador").value = nomProfessor;

    // Afegim resultat de la consulta en l'HTML
    document.getElementById("nom").value = resultat[0].nombregrupo
    document.getElementById("descripcio").value = resultat[0].descgrupo

    // Gestiona participants
    var numParticipants = resultat[0].numparticipantes;

    if (numParticipants == 0) {
      llistaParticipants = [];
      desactivaBotonsParticipants();
      document.getElementById("participants").innerHTML = "Participants";
    } else {
      activaBotonsParticipants();
      llistaParticipants = resultat[0].participantes;
      if (numParticipants == 1) {
        document.getElementById("participants").innerHTML = numParticipants + " Participant";
      } else {
        document.getElementById("participants").innerHTML = numParticipants + " Participants";
      }
    }

    // Habilitar botons de modificació i Baixa
    activaBotonsGrup()
  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}


function obtenirParticipants() {

  // Mostra textarea de participants
  document.getElementById("llistaParticipants").style.display = "inline";

  // Evita repetir llista de participants si fem múltiples clicks sobre botó
  if (document.getElementById("llistaParticipants").value == "") {
    for (i=0; i<llistaParticipants.length; i++) {
      document.getElementById("llistaParticipants").value += llistaParticipants[i].nombrealumno + '\n';
    }
  }


}


function altaGrup() {

  if (comprovaDades("AG")) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("AG");

    // Llença petició al servidor
    fetchServidor();

  }
}


function modificacioGrup() {

  if (comprovaDades("MG")) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("MG");

    // Llença petició al servidor
    fetchServidor();

  }
}


function baixaGrup() {

  // Confirmar abans d'eliminar
  if (confirm("Vols donar de baixa el grup?")) {

    dades = new FormData();
    dades.append('idgrupo',idGrup);

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("BG");

    // Llença petició al servidor
    fetchServidor();

  }
}
