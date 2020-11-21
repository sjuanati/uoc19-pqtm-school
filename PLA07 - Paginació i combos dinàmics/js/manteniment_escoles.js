
window.onload = function() {

  // Obtenció del llistat d'escoles des del servidor
  obtenirEscoles()

}


function refrescaEscoles() {

  // Esborrem dades personals prèviament seleccionades
  document.getElementById("formulari").reset();
  // Eliminem llistat anterior de professors
  document.getElementById("dadesEscoles").innerHTML = "";
  //Refresquem llistat de Professors
  obtenirEscoles();

}

function parametresConnexio(tipusOperacio) {

  switch (tipusOperacio) {
    case "A":
      url = 'http://alcyon-it.com/PQTM/pqtm_alta_colegios.php';
      break;
    case "M":
      url = 'http://alcyon-it.com/PQTM/pqtm_modificacion_colegios.php';
      break;
    case "B":
      url = 'http://alcyon-it.com/PQTM/pqtm_baja_colegios.php';
      break;
    case "C":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_colegios.php';
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
  }

}


function fetchServidor(tipusOperacio) {

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

    //No refrescar si és una Alta i l'usuari ja existeix
    if (resultat.substring(0,2) != "20") {
      refrescaEscoles();
    }
  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}


function obtenirEscoles() {

    // Encapsula dades
    dades = new FormData();
    dades.append('tipoconsulta','P');

  // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("C");

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
      // Afegim resultat de la consulta en l'HTML

      document.getElementById("dadesEscoles").innerHTML =
      "<th> ID  </th>" +
      "<th> Escola </th>" +
      "<tr>" +
        "<td class='idescola'>  </td>" +
        "<td> <input type='text' id='nomEscola' class='height22px'> </td>" +
        "<td> <div> <button id='alta' type='button' class='boto boto_ok width100px'>" +
                   "<i class='material-icons md-16'>add</i> Alta </button> </div> </td>" +
      "</tr>"

      for (i in resultat) {

        document.getElementById("dadesEscoles").innerHTML +=
        "<tr>" +
          // Identificador d'escola
          "<td class='idEscola'> " + resultat[i].idcolegio + "</td>" +
          "<td> <input type='text' id='nomEscola' value='" + resultat[i].nombre + "' class='height22px'> </td>" +
          // Botó modificar
          //"<td> <div> <button id='" + idBotoModificar + "' type='button' class='boto boto_modificar width100px'>" +
          "<td> <div id='modifica'> <button type='button' class='boto boto_modificar width100px'>" +
          "<i class='material-icons md-16'>check</i> Modificar </button></div> </td>" +
          // Botó eliminar
          "<td> <div> <button id='baixa' type='button' class='boto boto_eliminar'>" +
          "<i class='material-icons md-16'>close</i> </button></div> </td>" +
        "</tr>";
      }

      // Afegim listener als botons de modificar
      var modi = document.querySelectorAll(".boto_modificar")
      for (i=0; i<modi.length; i++) {
        modi[i].onclick = modificacioEscola
      }

      // Afegim listener als botons d'eliminar
      var eli = document.querySelectorAll(".boto_eliminar")
      for (i=0; i<eli.length; i++) {
        eli[i].onclick = baixaEscola
      }

      // Afegim listener al botó d'alta
      var alt = document.querySelectorAll(".boto_ok")
      for (i=0; i<alt.length; i++) {
        alt[i].onclick = altaEscola
      }

    })
    .catch(function(error) {
      console.log(error);
      alert("Error: "+error);
    });
}


function comprovaDades(tipusOperacio) {

  var nomEscolaPolit

  if (tipusOperacio == "A" || tipusOperacio == "M") {

    // elimina espais en blanc al principi i a la fi
    nomEscolaPolit = nomEscola.trim();

    // Comprova que el nom de l'escola estigui informat
    if (nomEscolaPolit.length == 0) {
      alert("Siusplau ompli el camp 'Escola'");
      return false;
    }
  }

  // Encapsula dades
  dades = new FormData();
  if (tipusOperacio == "A" || tipusOperacio == "M") {
    dades.append('nombre',nomEscolaPolit);
  }
  if (tipusOperacio == "B" || tipusOperacio == "M") {
    dades.append('idcolegio',idEscola);
  }

  return true;

}


function altaEscola() {

  // Obtenim el nom de l'escola
  var fila = this.closest("tr")
  nomEscola = fila.querySelector('#nomEscola').value

  if (comprovaDades("A")) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("A");

    // Llença petició al servidor
    fetchServidor("A");
  }

}


function modificacioEscola() {

  // Obtenim el nom i l'id de l'escola
  var fila = this.closest("tr")
  nomEscola = fila.querySelector('#nomEscola').value
  idEscola = fila.querySelector('td.idEscola').innerText

  if (comprovaDades("M")) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("M");

    // Llença petició al servidor
    fetchServidor("M");
  }

}


function baixaEscola() {

  // Obtenim l'id de l'escola
  var fila = this.closest("tr")
  idEscola = fila.querySelector('td.idEscola').innerText

  if (comprovaDades("B")) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("B");

    // Llença petició al servidor
    fetchServidor("B");
  }

}
