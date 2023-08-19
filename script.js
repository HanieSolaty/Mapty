'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const modalHeader = document.querySelector('.modal__header');

///////////////////////////////////////////////////////////////////////////////////////////

//Modal window functions
const openModal = function (str) {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  modalHeader.textContent = str;
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//global vars
let map, mapEvent;

//Showing map on user current locaction
navigator.geolocation.getCurrentPosition(
  function (pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    //BUG: Remove these lines and replace them with lat & lon
    const latWrong = 32.7052067;
    const lonWrong = 51.6844932;

    ////////Adding map based on current location
    //setView takes the coordinates of current center of map as arr and the num parameter is Zoom level
    map = L.map('map').setView([latWrong, lonWrong], 13);

    //OpenStreetMap is a free map, but any other map like google map is also usable
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    //Adding event listener for click on map
    function onMapClick(e) {
      //saving mapevent in order to use it for popups after submiting form
      mapEvent = e;
      form.classList.remove('hidden');
      //change the focus from map to input of form
      inputDistance.focus();
    }

    map.on('click', onMapClick);

    //TODO: remove this line
    console.log(`https://www.google.com/maps/search/${latWrong},${lonWrong}/`);
  },
  function () {
    openModal(`Something went wrong with loading the map!`);
  }
);

//Submiting form after filling it
form.addEventListener('submit', function (e) {
  //prevent from reloading the page
  e.preventDefault();

  const { lat, lng } = mapEvent.latlng;
  const markerLocation = L.marker([lat, lng]).addTo(map);
  const className =
    inputType.value === 'cycling' ? 'cycling-popup' : 'running-popup';
  markerLocation
    .bindPopup(`Wrokout`, {
      autoClose: false,
      closeOnClick: false,
      className: className,
    })
    .openPopup();
  //hiding form
  form.classList.add('hidden');
  //reseting form values
  inputCadence.value =
    inputDistance.value =
    inputDuration.value =
    inputElevation.value =
      '';
  inputType.value = 'running';
  inputElevation.closest('.form__row').classList.add('form__row--hidden');
  inputCadence.closest('.form__row').classList.remove('form__row--hidden');
});

//changing workout type in form
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
