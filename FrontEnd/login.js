addButtonListener()

function addButtonListener() {
    const loginButton = document.querySelector("input[type=submit]");

    loginButton.addEventListener("click", (event) => {
        event.preventDefault();
        loginAttempt();
    });
};

async function loginAttempt() {
    document.querySelector(".loginError").innerText = "";

    let inputInfos = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
        };

    inputInfos = JSON.stringify(inputInfos);

    const login = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: inputInfos
    });

    document.getElementById("password").value = "";


    if (login.ok) {
        loginSuccess(login);
    } else if (login.status === 401) {
        document.querySelector(".loginError").innerText = "Mot de passe invalide";
    } else {
        document.querySelector(".loginError").innerText = "Utilisateur non reconnu";
    }
};

async function loginSuccess(login) {
    console.log("login successful");
    const user = await login.json();


    console.log(user);
};