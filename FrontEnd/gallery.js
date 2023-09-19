import { myApi } from "./config.js";
import { displayModale } from "./popup.js";
const galleryJson = await fetch(`${myApi}/works`);
export const gallery = await galleryJson.json();
const userLoggedIn = (sessionStorage.getItem("token")) ? true : false;

//initialisation page
export const categories = await getCategories();
generateFilters(categories);
addFiltersListener(categories);
generateGallery(gallery);

if (userLoggedIn) {
    launchEditionMode();
}

async function getCategories() {
    const categoriesJson = await fetch(`${myApi}/categories`);
    const cats = await categoriesJson.json();
    return cats;
};

export async function updateGallery() {
    let galleryJson = await fetch(`${myApi}/works`);
    let gallery = await galleryJson.json();
    document.querySelector(".gallery").innerHTML = "";
    generateGallery(gallery);
};

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
    };
};

// eventslisteners filtres

function addFiltersListener(categories) {
    const filters = document.querySelectorAll(".filters ul li");

    filters[0].classList.add("active");

    for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener("click", () => {
            for (let j = 0; j < filters.length; j++) {
                filters[j].classList.remove("active");
            }

            if (i === 0) {        
                document.querySelector(".gallery").innerHTML = "";
                generateGallery(gallery)
            } else {
            
            const galleryFiltered = gallery.filter((galleryElement) => galleryElement.category.name === categories[i-1].name);

            document.querySelector(".gallery").innerHTML = "";
            generateGallery(galleryFiltered)
            }

            filters[i].classList.add("active");
        });
    };
};


// génération de la galerie
export function generateGallery(gallery) {

    const sectionGallery = document.querySelector(".gallery");

    for (let i = 0; i < gallery.length; i++) {

        const item = gallery[i];

        const galleryItem = document.createElement("figure");
        const galleryItemImage = document.createElement("img");
        const galleryItemCaption = document.createElement("figcaption");

        galleryItemImage.src = item.imageUrl;
        galleryItemImage.alt = item.title;
        galleryItemCaption.innerText = item.title;

        sectionGallery.appendChild(galleryItem);
        galleryItem.appendChild(galleryItemImage);
        galleryItem.appendChild(galleryItemCaption);
    };
};

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
};