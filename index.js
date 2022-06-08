const isVisible = 'is-visible';
const hidden = 'hidden';

const select = '.state-select';
const parksContainer = '.main-parks';
const park = '.park-card';
const button = 'button';
const findHeart = '.fa-heart'

const modal = '.modal-container';
const modalBg = '.park-modal';
const modalClose = '[data-close]';

const heart = 'fa-heart';
const favorite = 'favorite';
const favButton = '[data-favorite]';
const favoriteSection = '.favorite-section';
const favoriteHeader = '.fav-header';
const favoriteContainer = '.favorite-container';

const stateSelect = document.querySelector(select);
const mainContainer = document.querySelector(parksContainer);
const modalContainer = document.querySelector(modal);

const favOpen = document.querySelector(favButton);
const favPage = document.querySelector(favoriteSection);
const favHeader = document.querySelector(favoriteHeader);
const favClose = document.querySelector('.close');
const favContainer = document.querySelector(favoriteContainer);

let parks = [];
let favParks = [];
let favoriteIds = [];

const displayFavParks = (show) => {
    const favParks = favContainer.children
    for(const park of favParks) {
        show
        ? (park.classList.add(isVisible), park.classList.remove(hidden))
        : (park.classList.remove(isVisible), park.classList.add(hidden))
    }
}


favClose.addEventListener('click', () => {
    [favPage, favHeader].map((elm) => elm.classList.remove(isVisible));
    [favPage, favHeader].map((elm) => elm.classList.add(hidden));
    displayFavParks(false);
})

favOpen.addEventListener('click', () => {
    [favPage, favHeader].map((elm) => elm.classList.add(isVisible));
    [favPage, favHeader].map((elm) => elm.classList.remove(hidden));
    displayFavParks(true);
})

const findPark = (parkId, array) => {
    const park = array.find((park) => park.id === parkId);
    return park
}

const addToFavorites = (park) => {
    favParks.push(park);
    favoriteIds.push(park.id);
    renderDOM(favParks, favContainer);
}

const addToFavoritesCheck = (parkId) => {
    const park = findPark(parkId, parks);
    if (favoriteIds.includes(park.id)){
        console.log('duplicate');
    } else {
        addToFavorites(park);
        console.log(('add to '));
    }
}

const handleFavorite = (elm) => {
    const parkId = elm.dataset.open;
    addToFavoritesCheck(parkId)
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
                console.log('click'); // This is logging twice for each click.
                const elm = e.target;
                if((!elm.className.includes(button) && !elm.className.includes(heart))){
                    findParkId(elm);
                } else if (elm.tagName === 'I') {
                    handleFavorite(elm.parentElement);
                    elm.className.includes(favorite)
                    ? (console.log('remove from favorite'), elm.classList.remove(favorite))
                    : elm.classList.add(favorite);
                } else {
                    handleFavorite(elm);
                }
        })
    })
}

const renderDOM = (array, container) => {
    container.innerHTML = '';
    array.forEach((park) => {
        const {id, fullName} = park;
        const {altText, url} =park.images[0];
        const parkCard = document.createElement('div');
        parkCard.classList.add('park-card');
        parkCard.setAttribute("id", `${id}`);
        container === favContainer 
        ? (parkCard.classList.add(hidden), parkCard.id += 'fav') 
        : '';
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
        container.appendChild(parkCard);
    });
    handleParkClick();
    // handleFavoriteClick();
}

async function fetchData (value) {
    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${ value }&api_key=2hL7WMh7PeKnrwR39LONcMrAMvibH0MiBL8QMMSH`);
        const parkData = await response.json();
        parks = parkData.data;
        renderDOM(parks, mainContainer);
        
    } catch (error) {
        console.error(error)
    }
}

stateSelect.addEventListener('change', (e) => {
    const value = e.target.value.toLowerCase();
    fetchData(value);
});

