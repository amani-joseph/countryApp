'use strict';
// const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  // const [...languages] = data.languages
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <h4 class="country__region">${data.subregion}</h4>
      <h4 class="country__region">Capital: ${data.capital}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}M people</p>
      <p class="country__row"><span>🗺</span>${
        data.area} SQKMs</p>


    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    // console.log(data);

    // Render country 1
    renderCountry(data);

    // Get neighbour country (2)
    const [neighbour] = data.borders;

    if (!neighbour) return;
    for (const element of data.borders) {
      // console.log(element);
      // AJAX call country 2
      const request2 = new XMLHttpRequest();
      request2.open('GET', `https://restcountries.com/v3.1/alpha/${element}`);
      request2.send();

      request2.addEventListener('load', function () {
        const [data2] = JSON.parse(this.responseText);
        // console.log(data2);

        renderCountry(data2, 'neighbour');

      });
    }
    function clearInputField(){
      myInput.value = ""
    }
    clearInputField();
  });
};

////////////////////////////////////
let typingTimer; //timer identifier
let doneTypingInterval = 2000; //time in ms (5 seconds)
let myInput = document.getElementById('search-box');

//on keyup, start the countdown
myInput.addEventListener('keyup', () => {
  clearTimeout(typingTimer);
  if (myInput.value) {
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }
});
myInput.addEventListener('focusin',()=> countriesContainer.style.opacity = 0);
// myInput.addEventListener('focusout',()=> countriesContainer.style.opacity = 1);

//user is "finished typing," do something
function doneTyping() {
  //do something
  getCountryAndNeighbour(`${myInput.value}`);
}

////////////////////////////////////////
