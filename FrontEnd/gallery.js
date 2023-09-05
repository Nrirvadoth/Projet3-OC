const galleryJson = await fetch('http://localhost:5678/api/works');
let gallery = await galleryJson.json();

const categoriesJson = await fetch('http://localhost:5678/api/categories');
let categories = await categoriesJson.json();

//initialisation page
generateFilters(categories);
addFiltersListener();
generateGallery(gallery);

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

function addFiltersListener() {
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
            
            const galleryFiltered = gallery.filter((galleryElement) => galleryElement.categoryId === categories[i-1].id);

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