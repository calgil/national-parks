const isVisible = 'is-visible';
const hidden = 'hidden';

const select = '.state-select';
const parksContainer = '.main-parks';
const park = '.park-card';
const button = 'button';

const modal = '.modal-container';
const modalBg = '.park-modal';
const modalClose = '[data-close]';



const heart = 'fa-heart';
const favorite = 'favorite';
const favButton = '[data-favorite]';
const favoriteContainer = '.favorite-container';
const favoriteHeader = '.fav-header';

const stateSelect = document.querySelector(select);
const mainContainer = document.querySelector(parksContainer);
const modalContainer = document.querySelector(modal);

const favOpen = document.querySelector(favButton);
const favContainer = document.querySelector(favoriteContainer);
const favHeader = document.querySelector(favoriteHeader);
const favClose = document.querySelector('.close');

let parks = [];
let favParks = [];



favClose.addEventListener('click', () => {
    [favContainer, favHeader].map((elm) => elm.classList.remove(isVisible));
    [favContainer, favHeader].map((elm) => elm.classList.add(hidden));
})

favOpen.addEventListener('click', () => {
    [favContainer, favHeader].map((elm) => elm.classList.add(isVisible));
    [favContainer, favHeader].map((elm) => elm.classList.remove(hidden));
})

const findPark = (parkId, array) => {
    const park = array.find((park) => park.id === parkId);
    return park
}

const addToFavorites = (parkId) => {
    const park = findPark(parkId, parks);
    // I want to push these parks to another array, assuming that array does not already have have this park
    // const parkIdentity = park.id += 'fav';
    // console.log('add', findPark(park.id, favParks));
    // const duplicate = findPark(park.id, favParks) 
    // duplicate === undefined
    findPark(parkIdentity, favParks) === undefined
    ? favParks.push(park)
    : console.log('duplicate');

    // favParks.map((park) => park.id += 'fav');

    console.log('favs', favParks);
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

const closeModal = () => {
    document.addEventListener('keyup', (e) => {
        if(e.key === 'Escape'){
            modalContainer.innerHTML = '';
        }
    });
    document.addEventListener('click', (e) => {
        if(e.target === document.querySelector(modalBg)){
            modalContainer.innerHTML = '';
        }
    })
    const closeModalButton = document.querySelector(modalClose);
    closeModalButton.addEventListener('click', () => {
        modalContainer.innerHTML = '';
    });
};

const buildModal = (park) => {
    const {fullName, description} = park;
    const {altText, url} = park.images[1];
    const parkModal = document.createElement('div');
    parkModal.classList.add('park-modal');
    parkModal.innerHTML = 
    `
    <div class="modal-dialog">
        <div class="modal-header">
            <h3>${fullName}</h3>
            <i class="fas fa-times" data-close></i>
        </div>
        <div class="modal-body">
            <div class="modal-img-wrapper">
                <img src="${url}" alt="${altText}">
            </div>
            <p class="description"> ${description}
            </p>
        </div
    </div>
    `
    modalContainer.appendChild(parkModal);
    closeModal();
}

const modalOpen = (parkId) => {
    const park = findPark(parkId, parks);
    buildModal(park);
}

const findParkId = (elm) => {
    elm.className.includes('park-card')
    ? modalOpen(elm.id)
    : findParkId(elm.parentElement);
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

