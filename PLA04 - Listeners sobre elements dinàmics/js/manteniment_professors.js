
window.onload = function() {

  // Obtenció del llistat de professors des del servidor
  obtenirProfessors()

  // Deshabilitar botons de modificació i Baixa
  document.getElementById("modificar").style.display = "none";
  document.getElementById("baixa").style.display = "none";

}

function obtenirProfessors() {

    // Encapsula dades
    var dades = new FormData();
    dades.append('tipoconsulta','A');

    // Paràmetres de connexió amb el servidor
    var url = 'http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php';
    var parametres = {
      method: 'post',
      body: dades,
      mode: 'cors',
      cache: 'no-cache'
    };

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
      var i;
      for (i in resultat) {
        document.getElementById("dadesProfes").innerHTML +=
        "<tr><td class='idprofessor'> " + resultat[i].idteacher +
        " </td><td> " + resultat[i].nombre +
        " </td><td>" +resultat[i].tipo +
        "</td></tr>";
      }

      // Recuperem totes les etiquetes i afegim listeners a l'id dels professors <td>
      var td = document.querySelectorAll("#dadesProfes td")
      for (i=0; i<td.length; i++) {
        td[i].onclick = consultaProfessor
      }

    })
    .catch(function(error) {
      console.log(error);
      alert("Error: "+error);
    });
}


function consultaProfessor() {

  // Recuperem l'id de la fila seleccionada
  var fila = this.closest("tr")

  // Treiem el background prèviament marcat
  var tr = document.querySelectorAll("#dadesProfes tr")
  for (i=0; i<tr.length; i++) {
    tr[i].style.background = "transparent"
  }

  // Marquem fila seleccionada amb un color
  fila.style.background = "orange"

  // Recuperem l'identificador del professor
  var idprofessor = fila.querySelector('td.idprofessor').innerText

  // Encapsula dades
  var dades = new FormData();
  dades.append('tipoconsulta','P');
  dades.append('id',idprofessor);

  // Paràmetres de connexió amb el servidor
  var url = 'http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php';
  var parametres = {
    method: 'post',
    body: dades,
    mode: 'cors',
    cache: 'no-cache'
  };

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
      document.getElementById("tipus").value = resultat[i].tipo
    }
      // Habilitar botons de modificació i Baixa
      document.getElementById("modificar").style.display = "inline";
      document.getElementById("baixa").style.display = "inline";
  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });
}
