import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchCountry = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

searchCountry.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry(e) {
  let currentName = e.target.value.trim();
  if (currentName === '') {
    return (ul.innerHTML = ''), (div.innerHTML = '');
  }

  fetchCountries(currentName)
    .then(response => {
      console.log(response[0].name.official);

      if (response.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      }

      if (response.length === 1) {
        // Если результат запроса это массив с одной страной,
        // в интерфейсе отображается разметка карточки с данными о стране: флаг, название, столица, население и языки.
        renderCountry(response);
      } else {
        removeMarkupCountry(response);
      }

      if (response.length > 1 && response.length < 10) {
        // Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран.
        // Каждый элемент списка состоит из флага и имени страны.
        renderAnyCountries(response);
      } else {
        removeMarkupAnyCountries(response);
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
    });
}

// Разметка для рендера нескольких стран
function renderAnyCountries(country) {
  let markup = country
    .map(el => {
      return `
              <li class="any-countries__item">
                  <img class="any-countries__image" src="${el.flags.svg}" alt="The flag of ${el.name.official} country">
                  <h1 class="any-countries__title"><b>${el.name.official}</b></h1> 
              </li>
              `;
    })
    .join('');
  ul.innerHTML = markup;
}

// Разметка для рендера одной страны
function renderCountry(country) {
  let markup = country
    .map(el => {
      return `
                <div class="country__name">
                  <img class="country__image" src="${el.flags.svg}" alt="The flag of ${
        el.name.official
      } country">
                  <h1 class="country__title"><b>${el.name.official}</b></h1> 
                </div>

                <ul class="country-list__description">
                  <li class="country-list__item"><b>Capital</b>: ${el.capital}</li>
                  <li class="country-list__item"><b>Population</b>: ${el.population}</li>
                  <li class="country-list__item"><b>Languages</b>: ${Object.values(
                    el.languages,
                  )}</li>
                <ul>
              `;
    })
    .join('');
  div.innerHTML = markup;
}

function removeMarkupAnyCountries(country) {
  return (ul.innerHTML = '');
}

function removeMarkupCountry(country) {
  return (div.innerHTML = '');
}
