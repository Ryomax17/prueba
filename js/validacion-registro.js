function showAlertSuccess() {
    document.getElementById("alert-success").classList.add("show");

    let usuario = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password1").value,
    };
    
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuario.id = usuarios.length;

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    console.log(usuario); 
    
    setTimeout(function() {
        window.location.href = "login.html";
    }, 1500);
}
function showAlertError() {
    document.getElementById("alert-danger").classList.add("show");
}

document.addEventListener("DOMContentLoaded", function() {
    let regBtn = document.getElementById("regBtn");

    regBtn.addEventListener("click", function() {
        let nombre = document.getElementById("nombre").value;
        let apellido = document.getElementById("apellido").value;
        let email = document.getElementById("email").value;
        let password1 = document.getElementById("password1").value;
        let password2 = document.getElementById("password2").value;

        if (nombre.trim() === "" || apellido.trim() === "") {
            showAlertError();
            return;
        }

        if (email.trim() === "") {
            showAlertError();
            return;
        }

        if (password1.length < 6) {
            showAlertError();
            return;
        }

        if (password1 !== password2) {
            showAlertError();
            return;
        }

        let terminosCheckbox = document.getElementById("terminos");
        if (!terminosCheckbox.checked) {
            showAlertError();
            return;
        }
        showAlertSuccess();
    });
});