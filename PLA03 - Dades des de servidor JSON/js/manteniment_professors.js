
// Listeners

//window.onload=function() {
//  document.getElementById("nou").addEventListener("click", nouProfessor);
//}

window.onload=obtenirProfessors()

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
      var i;
      for (i in resultat) {
        document.getElementById("dadesProfes").innerHTML += "<tr><td> "+resultat[i].idteacher+" </td><td> "+resultat[i].nombre+" </td><td>"+resultat[i].tipo+"</td></tr>";
      }
    })
    .catch(function(error) {
      console.log(error);
      alert("Error: "+error);
    });


}
