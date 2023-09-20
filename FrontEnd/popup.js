import { getWorks, categories, generateGallery } from "./gallery.js";
import { myApi, token } from "./config.js";

const modale = document.querySelector(".modale-background");
const modaleTitle = document.querySelector(".modale-title");
const addWorkButton = document.querySelector(".addword-button");
const sendWorkButton = document.querySelector(".sendwork-button");
const closeIcon = document.querySelector(".fa-xmark");
const backIcon = document.querySelector(".fa-arrow-left");
const galleryContainer = document.querySelector(".modale-gallery");
const formContainer = document.querySelector(".form-container");
const inputImage = document.getElementById("image");
const inputTitle = document.getElementById("title");
const inputCategory = document.getElementById("category");
const imagePreview = document.querySelector(".image-preview");
const result = document.getElementById("result");

let categoriesCreated;

closeIcon.onclick = function() {closeModale()};

modale.addEventListener("click", (event) => {
    if (event.target === modale) {
        closeModale();
    }
});

backIcon.onclick = function() {modaleStateRemove()};

export function displayModale() {
    modale.style.display = "flex";
    modaleStateRemove();
}

async function closeModale() {
    await generateGallery();
    modale.style.display = "none";
}

function modaleStateRemove() {  
    backIcon.classList.add("hide");
    formContainer.classList.add("hide");
    sendWorkButton.classList.add("hide");
    addWorkButton.classList.remove("hide");
    galleryContainer.classList.remove("hide");

    modaleTitle.innerText = "Galerie Photo";
    generateModaleGallery();

    addWorkButton.onclick = function() {modaleStateAdd()};
};

function modaleStateAdd() {
    backIcon.classList.remove("hide");
    formContainer.classList.remove("hide");
    sendWorkButton.classList.remove("hide");
    galleryContainer.classList.add("hide");
    addWorkButton.classList.add("hide");
    modaleTitle.innerText = "Ajout Photo";
    
    result.innerText = "";
    clearForm();

    if (!categoriesCreated) {
        addCategories();
        categoriesCreated = true;
    }
    checkForm();
    sendWorkButton.onclick = function() {postWork()};
};

async function generateModaleGallery() {

    const works = await getWorks();
    galleryContainer.innerHTML = "";
    
    for (let i = 0; i < works.length; i++) {

        const item = works[i];
        const galleryItem = document.createElement("div");
        const galleryItemImage = document.createElement("img");
        const removeIcon = document.createElement("div");
        removeIcon.classList.add("remove-icon");
        removeIcon.innerHTML = `<i class="fa-regular fa-trash-can"></i>`

        galleryItemImage.src = item.imageUrl;
        galleryItemImage.alt = item.title;

        removeIcon.addEventListener("click", async() => {
            const workDelete = `${myApi}/works/${works[i].id}`;
            fetch(workDelete, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });
            galleryItem.remove();
        });

        galleryContainer.appendChild(galleryItem);
        galleryItem.appendChild(removeIcon);
        galleryItem.appendChild(galleryItemImage);
    };
}

function addCategories() {
    for (let i = 0; i < categories.length; i++) {
        const cat = document.createElement("option");
        cat.innerText = categories[i].name;
        cat.setAttribute("value", `${categories[i].id}`);
        inputCategory.appendChild(cat);
    }
};

function checkForm() {
    inputImage.addEventListener("change", (event) => {
        result.innerText = "";
        try {
            if (event.target.files[0].size > 4000000) {
                inputImage.value = "";
                throw new Error("Le poids de l'image est trop grand")
            } else {
                imagePreview.src = window.URL.createObjectURL(event.target.files[0]);
                document.querySelector(".upload").style.display = "none";
            }
        } catch (error) {
            result.innerText = error.message;
        }
        isValid();
    });

    inputTitle.addEventListener("change", () => {
        result.innerText = "";
        const titleRegex = /[a-zA-Z0-9]+/
        try {
            if (!inputTitle.value.match(titleRegex)) {
                throw new Error("Saisir un titre valide")
            } 
        } catch (error) {
            result.innerText = error.message;
        }
        isValid();
    });

    inputCategory.addEventListener("change", () => {
        result.innerText = "";
        try {
            if (!inputCategory.value) {
                throw new Error("Sélectionnez une catégorie")
            } 
        } catch (error) {
            result.innerText = error.message;
        }
        isValid();
    });
};

function isValid() {
    if (inputImage.value === "" || inputTitle.value === "" || inputCategory.value === "") sendWorkButton.classList.add("inactive");
    if (inputImage.value && inputTitle.value && inputCategory.value) sendWorkButton.classList.remove("inactive");
};

async function postWork() {
    if (sendWorkButton.classList.contains("inactive")) return;
    try {
        let formData = new FormData();
        formData.append("image", inputImage.files[0], inputImage.files[0].name);
        formData.append("title", inputTitle.value);
        formData.append("category", inputCategory.value);

        await fetch(`${myApi}/works`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi")
            }  
        })
        .then(uploadSuccess());

    } catch (error) {
        result.innerText = error.message;
        };
};

function uploadSuccess() {
    result.innerText = "L'image a bien été ajoutée à la gallerie";
    clearForm();
};

function clearForm() {
    document.querySelector(".upload").style.display = "flex";
    inputImage.value = "";
    inputTitle.value = "";
    inputCategory.value = "";
    imagePreview.src = "";
    sendWorkButton.classList.add("inactive")
}