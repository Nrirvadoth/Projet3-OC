const galleryJson = await fetch('http://localhost:5678/api/works');
let gallery = await galleryJson.json();

const categoriesJson = await fetch('http://localhost:5678/api/categories');
let categories = await categoriesJson.json();

// génération des filtres catégories
function generateFilters(categories) {

    const filters = document.querySelector(".filters");

    const filterList = document.createElement("ul");
    const filterAll = document.createElement("li");
    filterAll.innerText = "Tous";

    filters.appendChild(filterList);
    filterList.appendChild(filterAll);

    for (let i = 0; i < categories.length; i++) {
        
        const filterItem = document.createElement("li");
        filterItem.innerText = categories[i].name;
        filterList.appendChild(filterItem);
    };
};
generateFilters(categories);

// génération de la galerie
function generateGallery(gallery) {

    console.log("test");

    for (let i = 0; i < gallery.length; i++) {

        const item = gallery[i];

        const sectionGallery = document.querySelector(".gallery");

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

generateGallery(gallery);