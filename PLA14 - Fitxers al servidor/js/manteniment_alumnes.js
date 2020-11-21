// Constants
const patro =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const print = (x) => {console.log(x)} 

// Variables globals
let idAlumne;
let idProfessor = '';
let llistaGrups;
let dades;
let pagina = 1;


window.onload = function() {

  // Deshabilitat botons de modificació i baixa d'estudiants
  desactivaBotonsAlumne();

  // Obtenció del llistat de professors i escoles des del servidor. Inicialment a 1
  obtenirProfessors(pagina);

  // Activació dels Listeners
  document.getElementById("alta").addEventListener("click", altaAlumne);
  document.getElementById("modificar").addEventListener("click", modificacioAlumne);
  document.getElementById("baixa").addEventListener("click", baixaAlumne);
  document.getElementById("neteja").addEventListener("click", netejaDadesPersonals);
  document.getElementById("triaFotoAlumne").addEventListener("change", actualitzaFoto);
}


const refrescaAlumnes = (pagina) => {

  //Refresquem llistat de Professors
  obtenirProfessors(pagina);

}


const activaBotonsAlumne = () => {

  // Habilitar botons de modificació i baixa
  document.getElementById("modificar").style.display = "inline";
  document.getElementById("baixa").style.display = "inline";
  // Habilita textarea de grups de l'alumne
  document.getElementById("participaGrups").style.display = "inline";
  document.getElementById("participaGrupsParagraph").style.display = "inline";

}


const desactivaBotonsAlumne = () => {

  // Deshabilitar botons de modificació i baixa
  document.getElementById("modificar").style.display = "none";
  document.getElementById("baixa").style.display = "none";
  // Deshabilita textarea de grups de l'alumne
  document.getElementById("participaGrups").style.display = "none";
  document.getElementById("participaGrupsParagraph").style.display = "none";

}


const netejaDadesPersonals = () => {

  document.getElementById("paginacio").innerHTML = '';
  document.getElementById("grupsComboDades").innerHTML = "";
  document.getElementById("formulari").reset();

}


function parametresConnexio(tipusOperacio) {

  switch (tipusOperacio) {

    case "AA":
      url = 'http://alcyon-it.com/PQTM/pqtm_alta_alumnos.php';
      break;
    case "MA":
      url = 'http://alcyon-it.com/PQTM/pqtm_modificacion_alumnos.php';
      break;
    case "BA":
      url = 'http://alcyon-it.com/PQTM/pqtm_baja_alumnos.php';
      break;
    case "CP":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php';
      break;
    case "CA":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_alumnos.php';
      break;
    case "CG":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_grupos.php';
      break;
    case "CGA":
      url = 'http://alcyon-it.com/PQTM/pqtm_consulta_grupos_alumno.php';
      break;
    default:
      url = ""
      alert("Paràmetres de connexió desconeguts!");
      break;
  }

  parametres = {
    method: 'post',
    body: dades,
    mode: 'cors',
    cache: 'no-cache'
  };

}


const fetchServidor = () => {

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
      obtenirAlumnes(pagina);
    }
  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}


const comprovaDades = (tipusOperacio) => {

  // Obté les dades personals del professor seleccionat
  let nom = document.getElementById('nom').value.trim();
  let usuari = document.getElementById('usuari').value.trim();
  let email = document.getElementById('email').value.trim();
  let profe = document.getElementById('profesComboDades').value;
  let grup = document.getElementById('grupsComboDades').value;
  let foto = document.getElementById('triaFotoAlumne').files[0];
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
  } else if (patro.test(email) == false) {
    alert("Siusplau ompli el camp 'Email' amb una adreça vàlida");
    return false;
  } else if ((profe.length == 0) || (profe == '0')) {
    alert("Siusplau ompli el camp 'Formador'");
    return false;
  } else if (((grup.length == 0) || (grup == '0')) && (tipusOperacio == 'AA')) {
    alert("Siusplau ompli el camp 'Grup (afegir a)'");
    return false;
  }

  // Encapsula dades
  dades = new FormData();
  dades.append('nombre',nom);
  dades.append('usuario',usuari);
  dades.append('email',email);
  dades.append('profesor',profe);
  dades.append('foto',foto);

  if (tipusOperacio == "AA") {
    dades.append('opcion','AA');
    dades.append('grupo',grup);
  } else if (tipusOperacio == "MA") {
    dades.append('idalumno',idAlumne);
  }

  return true;

}


const obtenirProfessors = (pagina) => {

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

    // Afegim valor 'Tots els professors' als combos formador
    document.getElementById("profesCombo").innerHTML = "<option value='0'> Tots els professors </option>"
    document.getElementById("profesComboDades").innerHTML = "<option value='0'> Tots els professors </option>"

    // Afegim els professors als combos formador
    for (i in resultat) {
      document.getElementById("profesCombo").innerHTML +=
      "<option value='" + resultat[i].idteacher + "'>" +
        resultat[i].nombre +
      "</option>"
    }
    for (i in resultat) {
      document.getElementById("profesComboDades").innerHTML +=
      "<option value='" + resultat[i].idteacher + "'>" +
        resultat[i].nombre +
      "</option>"
    }

    // Al carregar-se la llista de professors al combo, es mostra els alumnes del primer professor
    obtenirAlumnes(pagina);


  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });

}


// Es llença sempre que canvii el combo de professors
const obtenirAlumnes = (novaPagina) => {

  desactivaBotonsAlumne();

  // Elimina qualsevol valor antic en camps de Descripció grup
  netejaDadesPersonals();

  // Obtenim l'id del professor seleccionat
  //if (idProfessor == '') {
    idProfessor = document.getElementById("profesCombo").value;
  //}

  // Actualitza el camp 'formador' a la secció 'Dades personals' 
  document.getElementById('profesComboDades').value = document.getElementById('profesCombo').value

  // Encapsula dades
  dades = new FormData();
  dades.append('tipoconsulta', 'T');
  dades.append('id', idProfessor);
  dades.append('pag', novaPagina);

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

    // Afegim capçaleres
    document.getElementById("estudiantsTaula").innerHTML =
    "<th class ='width50px'> ID </th>" +
    "<th> Nom </th>" +
    "<th> Professor </th>"

    // Afegim llistat de grups a l'HTML
    for (i in resultat[0]) {

      document.getElementById("estudiantsTaula").innerHTML +=
      "<tr>" +
        "<td class ='width50px idAlumne'>" + resultat[0][i].idalumno + "</td>" +
        "<td class ='width600px'>" + resultat[0][i].nombre + "</td>" +
        "<td class ='width600px'>" + resultat[0][i].profesor + "</td>" +
      "</tr>";
    }

    // Afegim listeners a cada cel.la
    let td = document.querySelectorAll("#estudiantsTaula td")
    td.forEach(elem => {
      elem.onclick = consultaAlumne
    })

    // Afegim les pàgines
    for (j=1; j<=resultat[1]; j++) {
      document.getElementById("paginacio").innerHTML +=
      "<span class='numPagina'> " + j + " </span>";
    }

    // Afegim listeners a les pàgines
    let span = document.querySelectorAll("#paginacio span")
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
  pagina = this.innerText;
  obtenirAlumnes(pagina);

}


// Es llença quan fem click a un alumne
function consultaAlumne() {

  //netejaDadesPersonals();

  // Recuperem les dades de la fila seleccionada
  let fila = this.closest("tr");

  // Treiem el background prèviament marcat
  let tr = document.querySelectorAll("#estudiantsTaula tr");
  for (i=0; i<tr.length; i++) {
    tr[i].style.background = "transparent";
  }

  // Marquem fila seleccionada amb un color
  fila.style.background = "orange";

  // Recuperem l'identificador de l'alumne
  idAlumne = fila.querySelector('td.idAlumne').innerText;

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

    // Afegim resultat de la consulta en l'HTML
    document.getElementById("nom").value = resultat[0].nombre;
    document.getElementById("usuari").value = resultat[0].user;
    document.getElementById("email").value = resultat[0].email;
    document.getElementById('profesComboDades').value = resultat[0].idprofesor;
    if ((resultat[0].foto) != null) {
      document.getElementById('fotoAlumne').src = "http://alcyon-it.com/PQTM/img/" + resultat[0].foto;
    } else {
      document.getElementById('fotoAlumne').src = '';
    }
    

    // Habilitar botons de modificació i Baixa
    activaBotonsAlumne();

    // Consulta els grups al que l'alumne està inscrit
    idProfessor = resultat[0].idprofesor;
    consultaGrupsAlumne();

  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });
}


const consultaGrupsAlumne = () => {

  // Encapsula dades
  dades = new FormData();
  dades.append('tipoconsulta','A');
  dades.append('id',idAlumne);
  dades.append('idprofesor',idProfessor);

  // Estableix paràmetres de connexió amb el servidor
  parametresConnexio("CGA");

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

    // Mostra textarea de participants
    //document.getElementById("llistaParticipants").style.display = "inline";

    // Mostra els grups en el textarea
    document.getElementById("participaGrups").value = '';
    for (i=0; i<resultat.length; i++) {
      document.getElementById("participaGrups").value += resultat[i].nombregrupo + '\n';
    }

    // Actualitza la secció 'Afegir a' en base al professor actual
    consultaGrupsProfessor();

  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });
}


// Ex.5
const consultaGrupsProfessor = () => {

  // Recuperem id del professor seleccionat al combo de dades personals
  let idProfessorDades = document.getElementById("profesComboDades").value;

  // Encapsula dades
  dades = new FormData();
  dades.append('tipoconsulta', 'P');
  dades.append('idprofesor', idProfessorDades);

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

    // Afegim valor 'Selecciona un grup' als combo 'Afegir a'
    document.getElementById("grupsComboDades").innerHTML =
    "<option value='0'> Selecciona un grup </option>"

    // Afegim els professors als combos formador
    for (i in resultat) {
      document.getElementById("grupsComboDades").innerHTML +=
      "<option value='" + resultat[i].idgrupo + "'>" +
        resultat[i].nombregrupo +
      "</option>"
    }

  })
  .catch(function(error) {
    console.log(error);
    alert("Error: "+error);
  });
}


const altaAlumne = () => {

  if (comprovaDades("AA")) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("AA");

    // Llença petició al servidor
    fetchServidor();
    document.getElementById('fotoAlumne').src = ''

    // Actualitzarem el valor de la combo del professor de la llista amb el id del professor seleccionat a la combo del formulari
    document.getElementById('profesCombo').value = document.getElementById('profesComboDades').value
  }
}


const modificacioAlumne = () => {

  if (comprovaDades("MA")) {

    // Estableix paràmetres de connexió amb el servidor
    parametresConnexio("MA");

    // Llença petició al servidor
    fetchServidor();
    document.getElementById('fotoAlumne').src = ''
  }
}


const baixaAlumne = () => {

  // Confirmar abans d'eliminar
  if (confirm("Vols donar de baixa l'alumne?")) {

    if (idAlumne != '') {
      dades = new FormData();
      dades.append('idalumno',idAlumne);

      // Estableix paràmetres de connexió amb el servidor
      parametresConnexio("BA");

      // Llença petició al servidor
      fetchServidor(1);
      document.getElementById('fotoAlumne').src = ''

    } else {
      alert("ID de l'alumne no informat!");
    }
  }
}


function actualitzaFoto() {
  
  // Mostrem foto a l'HTML després de seleccionar el fitxer
  document.querySelector('#fotoAlumne').src = window.URL.createObjectURL(this.files[0]);

}
