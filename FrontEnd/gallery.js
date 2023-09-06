const galleryJson = await fetch('http://localhost:5678/api/works');
const gallery = await galleryJson.json();

console.log(localStorage.getItem("userId"));

//initialisation page
getCategories(gallery);
generateGallery(gallery);

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
function generateGallery(gallery) {

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