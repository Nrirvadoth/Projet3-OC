import { myApi, token } from "./config.js";
import { displayModale } from "./popup.js";
const userLoggedIn = token ? true : false;

//initialisation page
export const categories = await getCategories();
generateFilters(categories);
addFiltersListener();
generateGallery();

if (userLoggedIn) {
    launchEditionMode();
}

async function getCategories() {
    const categoriesJson = await fetch(`${myApi}/categories`);
    const cats = await categoriesJson.json();
    return cats;
}

export async function getWorks() {
    const worksJson = await fetch(`${myApi}/works`);
    const worksList = await worksJson.json();
    return worksList;
}

// génération des filtres catégories
function generateFilters(categories) {

    const filtersContainer = document.querySelector(".filters");

    const filterList = document.createElement("ul");
    const filterAll = document.createElement("li");

    filterAll.innerText = "Tous";

    filtersContainer.appendChild(filterList);
    filterList.appendChild(filterAll);

    for (let i = 0; i < categories.length; i++) {
        
        const filterItem = document.createElement("li");
      
        filterItem.innerText = categories[i].name;
        filterList.appendChild(filterItem);
    }
}

// eventslisteners filtres
function addFiltersListener() {
    const filters = document.querySelectorAll(".filters ul li");

    filters[0].classList.add("active");

    for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener("click", () => {
            const items = document.querySelectorAll(".portfolio");
            
            //style filtre actif
            for (let j = 0; j < filters.length; j++) {
                filters[j].classList.remove("active");
            };
            filters[i].classList.add("active");

            //affichage des projets selon filtre
            if (i === 0) {        
                for (let z = 0; z < items.length; z++) {
                    items[z].classList.remove("hide");
                }
            } else {
                for (let z = 0; z < items.length; z++) {
                    if (items[z].dataset.category === `${i}`) {
                        items[z].classList.remove("hide") ;
                    } else {
                        items[z].classList.add("hide");
                    }
                }
            }
        });
    }
}


// génération de la galerie
export async function generateGallery() {

    const works = await getWorks();
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = "";

    for (let i = 0; i < works.length; i++) {

        const item = works[i];

        const galleryItem = document.createElement("figure");
        galleryItem.classList.add("portfolio");
        galleryItem.dataset.category = item.categoryId;
        const galleryItemImage = document.createElement("img");
        const galleryItemCaption = document.createElement("figcaption");

        galleryItemImage.src = item.imageUrl;
        galleryItemImage.alt = item.title;
        galleryItemCaption.innerText = item.title;

        sectionGallery.appendChild(galleryItem);
        galleryItem.appendChild(galleryItemImage);
        galleryItem.appendChild(galleryItemCaption);
    }
}

//mode édition

function launchEditionMode() {
    //bandeau top
    const editWrapper = document.createElement("div");
    editWrapper.classList.add("edit-wrapper");
    editWrapper.innerHTML = `<p><i class="fa-regular fa-pen-to-square" aria-hidden="true"></i> Mode édition`

    const body = document.querySelector("body");
    const container = document.getElementById("main-container");

    body.insertBefore(editWrapper, container);

    //menu
    const logout = document.getElementById("menu-logout")
    const login = document.getElementById("menu-login")
    login.classList.toggle("hide");
    logout.classList.toggle("hide");

    logout.addEventListener("click", () => {
        login.classList.toggle("hide");
        logout.classList.toggle("hide");
        sessionStorage.removeItem("token");
        location.reload()
    });

    // filters et edition
    document.querySelector(".filters").style.visibility = 'hidden';
   
    const editButton = document.createElement("span")
    editButton.classList.add("edit-button");
    editButton.innerHTML = `<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i> Modifier`

    document.querySelector(".title").appendChild(editButton);

    editButton.addEventListener("click", () => { 
        displayModale();
    });
}