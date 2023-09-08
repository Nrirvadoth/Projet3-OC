//redirectLoggedUser();
addButtonListener();

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

    try {
        const login = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: inputInfos
        });

        document.getElementById("password").value = "";

        if (!login.ok) {
            switch (login.status) {
                case 404:
                case 401:
                    throw new Error("Erreur dans l’identifiant ou le mot de passe");
                    break;
            };
        };

        loginSuccess(login)

    } catch (error) {
        document.querySelector(".loginError").innerText = error.message;
    }
};

async function loginSuccess(login) {
    console.log("login successful");
    const user = await login.json();
    localStorage.setItem("userToken", user.token);
    redirectLoggedUser();
};

function redirectLoggedUser() {
    if (localStorage.getItem('userToken')) {
        window.location.href = "./";
    }
}