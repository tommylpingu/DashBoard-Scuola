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