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

navigator.geolocation.getCurrentPosition(
  function (pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    //BUG: Remove these lines and replace them with lat & lon
    const latWrong = 32.7052067;
    const lonWrong = 51.6844932;

    ////////Adding map based on current location
    //coords array Replace with lat and lon instead on wrong ones
    const coords = [latWrong, lonWrong];

    //setView takes the coordinates of current center of map as arr and the num parameter is Zoom level
    const map = L.map('map').setView(coords, 13);

    //OpenStreetMap is a free map, but any other map like google map is also usable
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const marker = L.marker(coords).addTo(map);

    ////////adding a popup to the marker
    marker.bindPopup('Hello world!<br/>I am a Popup.').openPopup();

    //Adding event listener for click on map
    function onMapClick(e) {
      const { lat, lng } = e.latlng;
      const coords = [lat, lng];
      const markerLocation = L.marker(coords).addTo(map);
      markerLocation
        .bindPopup(`you are at ${coords}`, {
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
        .openPopup();
    }

    map.on('click', onMapClick);

    console.log(`https://www.google.com/maps/search/${latWrong},${lonWrong}/`);
  },
  function () {
    openModal(`Something went wrong when we tried to load the map!`);
  }
);
