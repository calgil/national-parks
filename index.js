
const select = '.state-select';
const parksContainer = '.main-parks';
const park = '.park-card';
const button = 'button';
const heart = 'fa-heart';
const favorite = 'favorite';

const stateSelect = document.querySelector(select);
const mainContainer = document.querySelector(parksContainer);

let parks = [];

const findPark = (parkId, array) => {
    const park = array.find((park) => park.id === parkId);
    return park
}

const addToFavorites = (parkId) => {
    const park = findPark(parkId, parks);
    console.log(park);
}

const handleFavorite = (elm) => {
    const parkId = elm.dataset.open;
    elm.className.includes(favorite)
    ? console.log('remove from fav') 
    : addToFavorites(parkId)
    // console.log('favorite', parkId);
}

const getFavoriteData = (elm) => {
    elm.dataset.open === undefined
    ? getFavoriteData(elm.parentElement)
    : handleFavorite(elm)
}

const modalOpen = (parkId) => {
    const park = findPark(parkId, parks);
    console.log(park);
}

const findParkId = (elm) => {
    // console.log('find', elm);
    elm.className.includes('park-card')
    ? modalOpen(elm.id)
    : findParkId(elm.parentElement);
    
    // ? console.log('has id', elm)
    // : console.log('does not have id');
}


const handleParkClick = () => {
    const parks = document.querySelectorAll(park);
    parks.forEach((park) => {
            park.addEventListener('click', (e) => {
                const elm = e.target;
                elm.className.includes(button)
                ? handleFavorite(elm)
                : elm.className.includes(heart)
                ? getFavoriteData(elm)
                : findParkId(elm);
        })
    })
    // console.log('here', parks);
    
}

const renderDOM = (array) => {
    mainContainer.innerHTML = '';
    array.forEach((park) => {
        const {id, fullName} = park;
        const {altText, url} =park.images[0];
        const parkCard = document.createElement('div');
        parkCard.setAttribute("id", `${id}`);
        parkCard.classList.add('park-card');
        parkCard.innerHTML = 
        `
        <div class="img-wrapper">
        <img class="park-img" src="${url}" alt="${altText}">
        </div>
       <div class="park-text">
        <h4>${fullName}</h4>
        <button class="button" data-open="${id}"><i class="fa-solid fa-heart"></i></button>
       </div>
        `
        mainContainer.appendChild(parkCard);
    });
    handleParkClick();
}

async function fetchData (value) {
    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${ value }&api_key=2hL7WMh7PeKnrwR39LONcMrAMvibH0MiBL8QMMSH`);
        const parkData = await response.json();
        parks = parkData.data;
        // console.log('here',parks);
        renderDOM(parks);
        
    } catch (error) {
        console.error(error)
    }
}

stateSelect.addEventListener('change', (e) => {
    const value = e.target.value.toLowerCase();
    fetchData(value);
});

