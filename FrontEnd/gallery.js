import { displayModale } from "./popup.js";
const galleryJson = await fetch('http://localhost:5678/api/works');
export const gallery = await galleryJson.json();
const userLoggedIn = (sessionStorage.getItem("userToken")) ? true : false;

//initialisation page
getCategories(gallery);
generateGallery(gallery);

if (userLoggedIn) {
    launchEditionMode();
}

export async function updateGallery() {
    let galleryJson = await fetch('http://localhost:5678/api/works');
    let gallery = await galleryJson.json();
    document.querySelector(".gallery").innerHTML = "";
    generateGallery(gallery);
};

function getCategories(gallery) {
    let categories = new Set();
    for (let i = 0 ; i < gallery.length; i++ ) {
        categories.add(gallery[i].category.name);
    };
    let categoriesName = Array.from(categories);
    generateFilters(categoriesName);
    addFiltersListener(categoriesName);
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
      
        filterItem.innerText = categories[i];
        filterList.appendChild(filterItem);
    };
};

// eventslisteners filtres

function addFiltersListener(categoriesName) {
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
            
            const galleryFiltered = gallery.filter((galleryElement) => galleryElement.category.name === categoriesName[i-1]);

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
    const editWrapper = document.createElement("div");
    editWrapper.classList.add("edit-wrapper");
    editWrapper.innerHTML = `<p><i class="fa-regular fa-pen-to-square" aria-hidden="true"></i> Mode édition | <a href="#">Déconnexion</a></p>`

    const body = document.querySelector("body");
    const container = document.getElementById("main-container");

    body.insertBefore(editWrapper, container);

    document.querySelector(".edit-wrapper a").addEventListener("click", () => {
        sessionStorage.removeItem("userToken");
        location.reload();
    });

    document.querySelector(".filters").style.visibility = 'hidden';
   
    const editButton = document.createElement("span")
    editButton.classList.add("edit-button");
    editButton.innerHTML = `<i class="fa-regular fa-pen-to-square" aria-hidden="true"></i> Modifier`

    document.querySelector(".title").appendChild(editButton);

    editButton.addEventListener("click", () => { 
        displayModale();
    });
};