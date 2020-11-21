
// Constants
const patro =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

window.onload = function() {

  // Obtenció del llistat de professors i escoles des del servidor
  obtenirProfessors(1)
  obtenirEscoles()
  // Deshabilitar botons de modificació i baixa
  desactivaBotons()
  // Activació dels Listeners
  document.getElementById("modificar").addEventListener("click", modificacioProfessor);
  document.getElementById("baixa").addEventListener("click", baixaProfessor);
  document.getElementById("alta").addEventListener("click", altaProfessor);

}


function refrescaProfessors(pagina) {

  // Esborrem dades personals prèviament seleccionades
  document.getElementById("formulari").reset();
  // Eliminem llistat anterior de professors i pàgines
  document.getElementById("dadesProfes").innerHTML = "";
  document.getElementById("paginacio").innerHTML = "";
  //Refresquem llistat de Professors
  obtenirProfessors(pagina);
  // Deshabilitar botons de modificació i Baixa
  desactivaBotons();
}


function activaBotons() {

  // Habilitar botons de modificació i baixa
  document.getElementById("modificar").style.display = "inline";
  document.getElementById("baixa").style.display = "inline";
}


function desactivaBotons() {

  // Deshabilitar botons de modificació i baixa
  document.getElementById("modificar").style.display = "none";
  document.getElementById("baixa").style.display = "none";
}


function parametresConnexio(tipusOperacio) {

  switch (tipusOperacio) {
    case "A":
      url = 'http://alcyon-it.com/PQTM/pqtm_alta_profesores.php';
      break;
    case "M":
      url = 'http://alcyon-it.com/PQTM/pqtm_modificacion_profesores.php';
      break;
    case "B":
      url = 'http://alcyon-it.com/PQTM/pqtm_baja_profesores.php';
      break;
    case "C":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php';
      break;
    case "E":
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

    //No refrescar si és una Alta i l'usuari ja existeix
    if (resultat.substring(0,2) != "20") {
      refrescaProfessors(1);
    }
  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}


function comprovaDades() {

  // Obté les dades personals del professor seleccionat
  var nom = document.getElementById('nom').value;
  var usuari = document.getElementById('usuari').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var tipus = document.getElementById('tipus').value;
  var escola = document.getElementById('escola').value;

  // Comprova que tots els camps estiguin informats
  if (nom.length == 0) {
    alert("Siusplau ompli el camp 'Nom'");
    return false;
  } else if (usuari.length == 0) {
    alert("Siusplau ompli el camp 'Usuari'");
    return false;
  } else if (email.length == 0) {
    alert("Siusplau ompli el camp 'Email'");
    return false;
  } else if (password.length == 0) {
    alert("Siusplau ompli el camp 'Password'");
    return false;
  } else if (patro.test(email) == false) {
    alert("Siusplau ompli el camp 'Email' amb una adreça vàlida");
    return false;
  } else if (tipus.length == 0) {
    alert("Siusplau ompli el camp 'Tipus'");
    return false;
  }

  // Encapsula dades
  dades = new FormData();
  dades.append('idprofesor',idprofessor);
  dades.append('nombre',nom);
  dades.append('email',email);
  dades.append('password',password);
  dades.append('usuario',usuari);
  dades.append('tipo',tipus);
  dades.append('colegio',escola);

  return true;

}

function obtenirEscoles() {

  // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("E");

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

      //Eliminem escola per defecte
      document.getElementById("escola").innerHTML = ""

      // Afegim llistat d'escoles a l'HTML
      for (i in resultat) {
        document.getElementById("escola").innerHTML +=
        "<option value='" + resultat[i].idcolegio + "'>" +
        resultat[i].nombre +
        "</option>";
      }

    })
    .catch(function(error) {
      console.log(error);
      alert("Error: "+error);
    });
}


function obtenirProfessors(pagina) {

    // Encapsula dades
    dades = new FormData();
    dades.append('tipoconsulta','T');
    dades.append('pag',pagina);

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

      // Afegim capçaleres
      document.getElementById("dadesProfes").innerHTML =
      "<th> ID </th>" +
      "<th> Professor </th>" +
      "<th> Tipus </th>"

      // Afegim llistat de professors a l'HTML
      for (i in resultat[0]) {
        document.getElementById("dadesProfes").innerHTML +=
        "<tr>" +
          "<td class='idprofessor'>" + resultat[0][i].idteacher + "</td>" +
          "<td class ='width150px'>" + resultat[0][i].nombre + "</td>" +
          "<td>" + resultat[0][i].tipo + "</td>" +
        "</tr>";
      }

      // Recuperem totes les etiquetes <td> amb l'id de #dadesProfes i afegim listeners
      var td = document.querySelectorAll("#dadesProfes td")
      for (i=0; i<td.length; i++) {
        td[i].onclick = consultaProfessor
      }

      // Afegim les pàgines
      for (j=1; j<=resultat[1]; j++) {
        document.getElementById("paginacio").innerHTML +=
        //"<code> <span class='numPagina'>" + j + "</span> </code>";
        "<span class='numPagina'>" + j + " </span>";
      }

      // Recuperem totes les etiquetes <span> i afegim listeners
      var span = document.querySelectorAll("#paginacio span")
      for (j=0; j<span.length; j++) {
        span[j].onclick = anarPagina
      }

    })
    .catch(function(error) {
      console.log(error);
      alert("Error: "+error);
    });
}


function anarPagina() {

  // Recuperem les dades de la pàgina seleccionada
  //var pag = this.closest("code")
  //seleccionaPagina = pag.querySelector('span.numPagina').innerText
  seleccionaPagina = this.innerText;

  refrescaProfessors(seleccionaPagina);

}


function consultaProfessor() {

  // Recuperem les dades de la fila seleccionada
  var fila = this.closest("tr")

  // Treiem el background prèviament marcat
  var tr = document.querySelectorAll("#dadesProfes tr")
  for (i=0; i<tr.length; i++) {
    tr[i].style.background = "transparent"
  }

  // Marquem fila seleccionada amb un color
  fila.style.background = "orange"

  // Recuperem l'identificador del professor
  idprofessor = fila.querySelector('td.idprofessor').innerText

  // Encapsula dades
  dades = new FormData();
  dades.append('tipoconsulta','P');
  dades.append('id',idprofessor);

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
    for (i in resultat) {
      console.log(resultat[i])
      document.getElementById("nom").value = resultat[i].nombre
      document.getElementById("usuari").value = resultat[i].user
      document.getElementById("email").value = resultat[i].email
      document.getElementById("password").value = resultat[i].password
      document.getElementById("tipus").value = resultat[i].tipo
      document.getElementById("escola").value = resultat[i].colegio
    }
      // Habilitar botons de modificació i Baixa
      activaBotons()
  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });
}


function altaProfessor() {

  if (comprovaDades()) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("A");

    // Llença petició al servidor
    fetchServidor();
  }
}


function modificacioProfessor() {

  if (comprovaDades()) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("M");

    // Llença petició al servidor
    fetchServidor();
  }

}


function baixaProfessor() {

  // Comprova que l'identificador del professor estigui informat
  if (idprofessor.length == 0) {
    alert("Cap professor seleccionat");
    return;
  }

  // Encapsula dades
  dades = new FormData();
  dades.append('idprofesor',idprofessor);

  // Estableix paràmetres de connexió amb el servidor
  parametresConnexio("B");

  // Llença petició al servidor
  fetchServidor();

}
