
// Listeners
window.onload=function() {
  document.getElementById("alta").addEventListener("click", altaUsuari);
}

function comprovaDades() {

  // Recupera dades del formulari
  nom = document.getElementById('nom').value;
  usuari = document.getElementById('usuari').value;
  email = document.getElementById('email').value;
  password = document.getElementById('password').value;
  patro = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;

  // Comprova format de l'email i que tots els camps estiguin informats
  if (nom.length == 0) {
    alert("Siusplau omple el camp 'Nom'");
    return false;
  } else if (usuari.length == 0) {
    alert("Siusplau omple el camp 'Usuari'");
    return false;
  } else if (email.length == 0) {
    alert("Siusplau omple el camp 'Email'");
    return false;
  } else if (password.length == 0) {
    alert("Siusplau omple el camp 'Password'");
    return false;
  } else if (patro.test(email) == false) {
    alert("Siusplau omple el camp 'Email' amb una adreça vàlida");
    return false;
  } else {
    return true;
  }
}

function altaUsuari() {

  if (comprovaDades() == true) {

    // Encapsula dades
    var dades = new FormData();
    dades.append('nombre',nom);
    dades.append('email',email);
    dades.append('usuario',usuari);
    dades.append('tipo','profe');
    dades.append('password',password);

    // Algunes comprovacions abans de l'enviament
    /*
    for (var pair of dades.entries()) {
      console.log(pair[0]+', '+pair[1]);
    }
    console.log('nom:',nom)
    */

    // Paràmetres de connexió amb el servidor
    var url = 'http://alcyon-it.com/PQTM/pqtm_alta_profesores.php';
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
        return resposta.text();
      } else {
        throw 'Error en la petició AJAX';
      }
    })
    .then(function(resultat) {
      console.log(resultat);
      alert("Resultat: "+resultat);
    })
    .catch(function(error) {
      console.log(error);
      alert("Error: "+error);
    });

  }

}
