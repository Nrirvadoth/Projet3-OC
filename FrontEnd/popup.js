import { gallery, generateGallery, updateGallery } from "./gallery.js";
let modaleCreated = false;

export function displayModale() {
    if (!modaleCreated) {
        generateModale();
        modaleCreated = true
    } else {
        document.querySelector(".modale-background").style.display = "flex";
    }
}

function closeModale() {
    document.querySelector(".modale-background").style.display = "none";
}

function generateModale() {
    const modaleBackground = document.createElement("aside");
    modaleBackground.classList.add("modale-background");
    const modaleContainer = document.createElement("div");
    modaleContainer.classList.add("modale-container");

    document.querySelector("main").appendChild(modaleBackground);
    modaleBackground.appendChild(modaleContainer);
    
    const modaleNav = document.createElement("div");
    modaleNav.classList.add("modale-nav");

    const crossIcon = document.createElement("i");
    crossIcon.classList.add("fa-solid");
    crossIcon.classList.add("fa-xmark");
    modaleContainer.appendChild(modaleNav);
    modaleNav.appendChild(crossIcon);

    crossIcon.addEventListener("click", () => {
        closeModale();
    });

    modaleBackground.addEventListener("click", (event) => {
        if (event.target === modaleBackground) {
            closeModale();
        }
    });

    const modaleMainContent = document.createElement("div");
    modaleMainContent.classList.add("modale-main-content");
    modaleContainer.appendChild(modaleMainContent);
    const modaleTitle = document.createElement("h3");
    modaleTitle.innerText = "Galerie Photo";
    modaleTitle.classList.add("modale-title");
    modaleMainContent.append(modaleTitle);

    /* Galerie */

    const galleryContainer = document.createElement("div");
    galleryContainer.classList.add("gallery-container");

    for (let i = 0; i < gallery.length; i++) {

        const item = gallery[i];
        const galleryItem = document.createElement("div");
        const galleryItemImage = document.createElement("img");
        const removeIcon = document.createElement("div");
        removeIcon.classList.add("remove-icon");
        removeIcon.innerHTML = `<i class="fa-regular fa-trash-can"></i>`

        galleryItemImage.src = item.imageUrl;
        galleryItemImage.alt = item.title;

        removeIcon.addEventListener("click", () => {
            const workDelete = "http://localhost:5678/api/works/" + gallery[i].id;
            fetch(workDelete, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${window.localStorage.getItem("userToken")}`
                }
            });
            galleryItem.remove();
            updateGallery();
        });

        galleryContainer.appendChild(galleryItem);
        galleryItem.appendChild(removeIcon);
        galleryItem.appendChild(galleryItemImage);
    };

    modaleMainContent.appendChild(galleryContainer);

    const divider = document.createElement("div");
    divider.classList.add("divider");
    modaleMainContent.appendChild(divider);

    const modaleButton = document.createElement("button");
    modaleButton.classList.add("modale-button");
    modaleButton.innerText = "Ajouter une photo";
    modaleMainContent.appendChild(modaleButton);
}




