const initial = 'initial';

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

const body = document.querySelector('body');
const heroBg = document.querySelector('.hero-bg.initial');

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

const renderDOM = (array, container) => {
    container.innerHTML = '';
    array.forEach((park) => {
        const {id, fullName} = park;
        const {altText, url} =park.images[0];
        const parkCard = document.createElement('div');
        parkCard.classList.add('park-card');
        parkCard.setAttribute("id", `${id}`);
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
}

const displayFavParks = (show) => {
    const favParks = favContainer.children
    for(const park of favParks) {
        show
        ? (park.classList.add(isVisible), park.classList.remove(hidden))
        : (park.classList.remove(isVisible), park.classList.add(hidden))
    }
}

favClose.addEventListener('click', () => {
    [favContainer, favPage, favHeader].map((elm) => elm.classList.remove(isVisible));
    [favContainer, favPage, favHeader].map((elm) => elm.classList.add(hidden));
    displayFavParks(false);
});

const changeHearColor = () => {
    const hearts = favContainer.querySelectorAll(findHeart);
    hearts.forEach((heart) => { 
         (!heart.className.includes(favorite)) && heart.classList.add(favorite);
    })
}

favOpen.addEventListener('click', () => {
    [favContainer, favPage, favHeader].map((elm) => elm.classList.add(isVisible));
    [favContainer, favPage, favHeader].map((elm) => elm.classList.remove(hidden));
    displayFavParks(true);
    handleParkClick(favContainer);
    renderDOM(favParks, favContainer);
    changeHearColor();
    // handleParkClick(favContainer);
    // I'm considering using a different function here to handle the nonsense
})

const findPark = (parkId, array) => {
    const park = array.find((park) => park.id === parkId);
    return park
}

const addToFavoritesCheck = (parkId, park) => {
    if(!favoriteIds.includes(parkId)){
        const index = parks.findIndex((park) => park.id === parkId);
        console.log('parks above', parks);
        const newFav = parks.slice(index, (index + 1));
        console.log('parks below', parks);
        newFav[0].id += 'fav';
        favoriteIds.push(park.id);
        favParks.push(newFav[0]);
    } 
}

// I can probably get rid of this function and do this above

const handleFavorite = (elm, park) => {
    const parkId = elm.dataset.open;
    addToFavoritesCheck(parkId, park);
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
    // console.log('find', elm);
    if(elm.className.includes('park-card')) {
        console.log('park', elm.id);
        console.log('parks', parks);

        modalOpen(elm.id);
    } else {
        findParkId(elm.parentElement);
    }
}

// I only want this to be triggered from the favOpen function
const updateHearts = (parkId) => {
    const button = mainContainer.querySelector(`button[data-open='${parkId}']`);
    for (const heart of button.children) {
        if (heart.className.includes(favorite)){
            heart.classList.remove(favorite);
            console.log('heart', heart );
        }
    }
}

// This function is called by handleParkClick

const removeFromFavorite = (park) => {
    console.log('remove');
    const parkId = park.id
    const i = favParks.findIndex((park) => park.id === parkId);
    favParks.splice(i, 1);
    const index = favoriteIds.findIndex((park) => park.id === parkId);
    favoriteIds.splice(index, 1);
    console.log('remove array', favParks);
    console.log('fav ids', favoriteIds);
}

const handleParkClick = (container) => {
    const parks = container.querySelectorAll(park);
    parks.forEach((park) => {
            park.addEventListener('click', (e) => {
                const elm = e.target;
                if((!elm.className.includes(button) && !elm.className.includes(heart))){
                    findParkId(elm);
                } else if (elm.tagName === 'I' ) {
                    elm.className.includes(favorite)
                    ? (removeFromFavorite(park) , elm.classList.remove(favorite))
                    : (handleFavorite(elm.parentElement, park), elm.classList.add(favorite));
                } else {
                    handleFavorite(elm, park);
                }
        })
    })
}

async function fetchData (value) {
    try {
        const response = await fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${ value }&api_key=2hL7WMh7PeKnrwR39LONcMrAMvibH0MiBL8QMMSH`);
        const parkData = await response.json();
        parks = parkData.data;
        renderDOM(parks, mainContainer);
        [body, heroBg].map((elm) => elm.classList.remove('initial'))
        handleParkClick(mainContainer);
        
    } catch (error) {
        console.error(error)
    }
}

stateSelect.addEventListener('change', (e) => {
    const value = e.target.value.toLowerCase();
    fetchData(value);
});
