import { gallery, updateGallery, categories } from "./gallery.js";
let modaleCreated = false;

export function displayModale() {
    if (!modaleCreated) {
        generateModale();
        modaleCreated = true
    } else {
        document.querySelector(".modale-background").style.display = "flex";
    }
}

async function closeModale() {
    updateGallery();
    document.querySelector(".modale-background").style.display = "none";
}

function generateModale() {

    const main = document.querySelector("main");
    const modaleBackground = document.createElement("aside");
    modaleBackground.classList.add("modale-background");
    main.appendChild(modaleBackground);

    modaleBackground.innerHTML = `
        <div class="modale-container">
            <div class="modale-nav">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </div> 
            <h3 class="modale-title"></h3>
            <div class="modale-main-content">
                <div class="divider"></div>
                <bouton class="modale-button"></bouton>
            </div>
        </div>
    `;
    
    document.querySelector(".fa-xmark").addEventListener("click", () => {
        closeModale();
    });

    modaleBackground.addEventListener("click", (event) => {
        if (event.target == modaleBackground) {
            closeModale();
        }
    });

    modaleStateRemove();
}


function modaleStateRemove() {  
    if (document.querySelector(".fa-arrow-left")) document.querySelector(".fa-arrow-left").remove();
    if (document.getElementById("formModale")) document.getElementById("formModale").remove();

    document.querySelector(".modale-title").innerText = "Galerie Photo";
    const button = document.querySelector(".modale-button");
    button.classList.remove("inactive");
    button.innerText = "Ajouter une photo";
    generateModaleGallery(gallery);

    button.addEventListener("click", function modale() {
        modaleStateAdd();
        this.removeEventListener("click", modale);
    });
};

function modaleStateAdd() {

    const backIcon = document.createElement("i");
    backIcon.classList.add("fa-solid", "fa-arrow-left");
    document.querySelector(".modale-nav").appendChild(backIcon);
    document.querySelector(".modale-title").innerText = "Ajout Photo";
    document.querySelector(".gallery-container").remove();
    const button = document.querySelector(".modale-button");
    button.classList.add("inactive");
    button.innerText = "Vérifier";
    addWorkForm();

    backIcon.addEventListener("click", () => {
        modaleStateRemove();
    });
};

function generateModaleGallery(gallery) {

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

        removeIcon.addEventListener("click", async() => {
            const workDelete = "http://localhost:5678/api/works/" + gallery[i].id;
            fetch(workDelete, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${window.sessionStorage.getItem("userToken")}`
                }
            });
            galleryItem.remove();
        });

        galleryContainer.appendChild(galleryItem);
        galleryItem.appendChild(removeIcon);
        galleryItem.appendChild(galleryItemImage);
    };

    document.querySelector(".modale-main-content").insertBefore(galleryContainer, document.querySelector(".divider"));
}

async function addWorkForm() {
    
    let categoriesList = `<option value=""></option>`;
    for (let i = 0; i < categories.length; i++)
    categoriesList += `<option value="${categories[i].id}">${categories[i].name}</option>`
    
    const form = document.createElement("form");
    form.setAttribute("id", "formModale");
    form.innerHTML = `
        <span id ="result"></span>
        <div class="input-div">
            <img id="output">
            <div class="upload">
                <i class="fa-regular fa-image"></i>
                <label for="image" class="upload-button">+ Ajouter photo</label>
                <input type="file" accept=".png, .jpg, .jpeg" size="4000000" name="image" id="image" class="hide">
                <p class="submit-info">jpg, png : 4Mo max</p>
            </div>
        </div>
        <label for="title">Titre</label>
        <input type="text" id="title" name="title"  >
        <label for="category">Categorie</label>
        <select name="category" id="category" name="category">
            ${categoriesList}
        </select>
    `;
    
    document.querySelector(".modale-main-content").insertBefore(form, document.querySelector(".divider"));

    checkForm();
};

function checkForm() {
    image.addEventListener("change", (event) => {
        result.innerText = "";
        try {
            if (event.target.files[0].size > 4000000) {
                image.value = "";
                throw new Error("Le poids de l'image est trop grand")
            } else {
                output.src = window.URL.createObjectURL(event.target.files[0]);
                document.querySelector(".upload").style.display = "none";
            }
        } catch (error) {
            result.innerText = error.message;
        }
        isValid();
    });

    title.addEventListener("change", () => {
        result.innerText = "";
        const titleRegex = /[a-zA-Z1-9]+/
        try {
            if (!title.value.match(titleRegex)) {
                throw new Error("Saisir un titre valide")
            } 
        } catch (error) {
            result.innerText = error.message;
        }
        isValid();
    });

    category.addEventListener("change", () => {
        result.innerText = "";
        try {
            if (!category.value) {
                throw new Error("Sélectionnez une catégorie")
            } 
        } catch (error) {
            result.innerText = error.message;
        }
        isValid();
    });
}

function isValid() {
    if (image.value && title.value && category.value) {
        const button = document.querySelector(".modale-button")
        button.classList.remove("inactive");
        button.addEventListener("click", async () => {
            try {
                let formData = new FormData();
                formData.append("image", image.files[0], image.files[0].name);
                formData.append("title", title.value);
                formData.append("category", category.value);
    
                await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: { "Authorization": `Bearer ${window.sessionStorage.getItem("userToken")}`},
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
            }
        });
    };
};

function uploadSuccess() {
    result.innerText = "L'image a bien été ajoutée à la gallerie";
    document.querySelector(".upload").style.display = "flex";
    image.value = "";
    title.value = "";
    output.src = "";
    document.querySelector(".modale-button").classList.add("inactive")
}