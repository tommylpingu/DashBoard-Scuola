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

    // Salva il voto nel cookie
    aggiungiVoto(materia, voto);

    // Stampa in console per verificare i dati salvati
    console.log("Voti attualmente nei cookie:", ottieniListaVoti());

    formVoto.reset();
  });
}