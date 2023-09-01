const galleryJson = await fetch('http://localhost:5678/api/works');
let gallery = await galleryJson.json();

console.log(gallery);

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