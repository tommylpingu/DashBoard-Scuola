function setCookie(nome, valore, giorni) {
  let scadenza = "";
  if (giorni) {
    const d = new Date();
    d.setTime(d.getTime() + (giorni * 24 * 60 * 60 * 1000));
    scadenza = "; expires=" + d.toUTCString();
  }
  document.cookie = nome + "=" + encodeURIComponent(valore) + scadenza + "; path=/; SameSite=Lax";
}

function getCookie(nome) {
  const nameEQ = nome + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

function aggiungiVoto(materia, voto) {
  let votiAttuali = getCookie("votiScolastici") || "";
  
  if (votiAttuali !== "") {
    votiAttuali += ",";
  }
  
  votiAttuali += materia + ":" + voto;
  setCookie("votiScolastici", votiAttuali, 30);
}

function ottieniListaVoti() {
  const votiStringa = getCookie("votiScolastici");
  if (!votiStringa) return [];
  return votiStringa.split(",");
}


const btnSwitch = document.getElementById('btn-switch');
const sezioneOrario = document.getElementById('sezione-orario');
const sezioneVoti = document.getElementById('sezione-voti');
const titoloPagina = document.getElementById('titolo-pagina');

btnSwitch.addEventListener('click', () => {
  // Controlla se sono nella sezione orario
  const isOrario = sezioneOrario.classList.contains('active');

  if (isOrario) {
    // Passa alla sezione Voti
    sezioneOrario.classList.remove('active');
    sezioneVoti.classList.add('active');
    titoloPagina.textContent = 'Registro Voti';
    btnSwitch.innerHTML = '<span class="icon-text">Orario</span> ';
  } else {
    // passa alla sezione Orario
    sezioneVoti.classList.remove('active');
    sezioneOrario.classList.add('active');
    titoloPagina.textContent = 'Orario Settimanale';
    btnSwitch.innerHTML = '<span class="icon-text">Voti</span> ';
  }
});

const formVoto = document.getElementById('form-voto');

if (formVoto) {
  formVoto.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const materia = document.getElementById('materia-select').value;
    const voto = document.getElementById('voto-input').value;

 
    aggiungiVoto(materia, voto);

     aggiornaTabellaVoti();

    formVoto.reset();
  });
}
aggiornaTabellaVoti(); //aggiorna tabella alla fine


// Funzione per rimuovere un singolo voto dato il suo indice nell'array
function rimuoviVoto(indiceDaRimuovere) {
  const lista = ottieniListaVoti(); // Recupera l'array di stringhe
  
  // Rimuove 1 elemento alla posizione indicata
  lista.splice(indiceDaRimuovere, 1);
  
  // Sovrascrive il cookie con la nuova lista unita da virgole
  const nuovaStringaCookie = lista.join(",");
  setCookie("votiScolastici", nuovaStringaCookie, 30);
  
  // Ricarica la tabella aggiornata a schermo
  aggiornaTabellaVoti();
}

// Funzione aggiornata per mostrare i voti con il tasto elimina
function aggiornaTabellaVoti() {
  const lista = ottieniListaVoti();

  // Contenitori HTML per i voti
  const containerMatematica = document.getElementById('voti-matematica');
  const containerInformatica = document.getElementById('voti-informatica');

  if (containerMatematica) containerMatematica.innerHTML = '';
  if (containerInformatica) containerInformatica.innerHTML = '';

  let haMatematica = false;
  let haInformatica = false;

  // Scorriamo i voti tenendo traccia dell'indice originale per la rimozione
  lista.forEach((item, index) => {
    if (item) {
      const parti = item.split(':');
      const materia = parti[0];
      const voto = parti[1];

      // Creiamo un badge grafico per il voto con il pulsante X
      const badge = document.createElement('span');
      badge.className = 'voto-badge';
      badge.innerHTML = `
        ${voto} 
        <button class="btn-elimina-voto" onclick="rimuoviVoto(${index})" title="Elimina voto">&times;</button>
      `;

      if (materia === "Matematica" && containerMatematica) {
        containerMatematica.appendChild(badge);
        haMatematica = true;
      } else if (materia === "Informatica" && containerInformatica) {
        containerInformatica.appendChild(badge);
        haInformatica = true;
      }
    }
  });

  // Se una materia non ha voti, mostriamo "--"
  if (containerMatematica && !haMatematica) containerMatematica.textContent = '--';
  if (containerInformatica && !haInformatica) containerInformatica.textContent = '--';
}