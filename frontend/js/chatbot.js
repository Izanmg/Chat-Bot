let lastScrollTop = 0; // Guarda la última posición del scroll
const header = document.querySelector("header");

// Asegurar que el header esté visible al cargar la página
header.style.position = "fixed";
header.style.top = "0";
header.style.width = "100%";
header.style.transition = "top 0.3s ease-in-out"; // Transición suave

window.addEventListener("scroll", () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        // Scroll hacia abajo y más de 50px: ocultar el header
        header.style.top = "-80px"; // Ajusta según la altura del header
    } else {
        // Scroll hacia arriba: mostrar el header
        header.style.top = "0";
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Evita valores negativos
});

const inputText = document.getElementById("input-text");

inputText.addEventListener("input", function () {
    this.style.height = "25px"; // Mantiene el tamaño base si no es necesario expandirse
    if (this.scrollHeight > this.clientHeight && this.scrollHeight < 200) {
        this.style.height = this.scrollHeight-20 + "px"; // Solo expande si el contenido es mayor al área visible
    }
    else if (this.scrollHeight >= 200){
        this.style.height = "200px"
        this.style.overflowY = "visible"
    }
    
});

// Agregar evento keydown para detectar la tecla Enter y Shift + Enter
inputText.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (event.shiftKey) {
            
        } else {
            // Si se presiona solo Enter, enviar el mensaje
            event.preventDefault(); // Evita el salto de línea en el input
            document.querySelector("#new-message").dispatchEvent(new Event("submit"));
        }
    }
});

document.querySelector("#new-message").addEventListener("submit", function () {
    inputText.style.height = "25px";
})

window.addEventListener("resize", () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 420) {
        document.querySelector("#btn-new-chat").innerHTML = "New";
    } else {
        document.querySelector("#btn-new-chat").innerHTML = "New Chat"; // Valor por defecto
    }
});

// Ejecutar también al cargar la página
window.addEventListener("load", () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 397) {
        document.querySelector("#btn-new-chat").innerHTML = "Nuevo";
    } else {
        document.querySelector("#btn-new-chat").innerHTML = "Nuevo Chat";
    }
});

document.querySelector("#utility-chat").addEventListener("click", () => {
    document.querySelector("#input-text").value = "¿Para que sirves?";
    document.querySelector("#new-message").dispatchEvent(new Event("submit"));
});

document.querySelector("#what-do").addEventListener("click", () => {
    document.querySelector("#input-text").value = "¿Que sabes hacer?";
    document.querySelector("#new-message").dispatchEvent(new Event("submit"));
});

document.querySelector("#what-proyects").addEventListener("click", () => {
    document.querySelector("#input-text").value = "¿Que proyectos has creado?";
    document.querySelector("#new-message").dispatchEvent(new Event("submit"));
});

let firstSubmit = true; // Variable de control

document.querySelector("#new-message").addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el envío automático del formulario

    if (firstSubmit) {
        document.querySelector("#h1-welcome").remove()
        document.querySelector("#suggested-questions").remove()
        document.querySelector("#new-message").style.position = "fixed";
        document.querySelector("#new-message").style.bottom = "20px";
        document.querySelector("#new-message").style.left = "0";
        document.querySelector("#new-message").style.right = "0";
        document.querySelector("#chat-messages").style.marginBottom = "35px"
        // margin-bottom: 30px;

        
        let newH2 = document.createElement("h2")
        newH2.textContent = "Historial"
        document.querySelector("#chat-history").insertBefore(newH2,document.querySelector("#chat-messages"))
        // <h2>Historial</h2>

        firstSubmit = false; // Desactiva la funcionalidad especial después del primer envío
    }

    // Mostrar por pantalla el mensaje del usuario
    let newDiv = document.createElement("div")
    newDiv.className = "message-user"

    let newSpan = document.createElement("span")
    newSpan.className = "span-text-user" 
    newSpan.textContent = document.querySelector("#input-text").value
    newDiv.appendChild(newSpan)
    // Crear un nuevo span para el emoji 👤
    let emojiSpan = document.createElement("span");
    emojiSpan.className = "span-img";
    emojiSpan.textContent = "👤";
    newDiv.appendChild(emojiSpan); // Añadir el emoji al final del div
    document.querySelector("#chat-messages").appendChild(newDiv)
    let UserMesage = document.querySelector("#input-text").value;
    document.querySelector("#input-text").value = ""
    
    let newDivBot = document.createElement("div")
    newDivBot.className = "message-bot"
    let gif = document.createElement("img")
    gif.src = "assets/gif1.gif"
    gif.style.width = "30px"
    document.querySelector("#chat-messages").appendChild(newDivBot)
    newDivBot.appendChild(gif)
    
    const urlServer = "https://chatbot-952713132334.europe-west1.run.app/chat";
    async function sendMessageToServer(messageInput) {
        const response = await fetch(urlServer,{
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({message : messageInput})
        })
        const data = await response.json();
        
        
        gif.remove();
        // Crear un nuevo span para el emoji 🤖
        let emojiSpanBot = document.createElement("span");
        emojiSpanBot.className = "span-img";
        let avatar = document.createElement("img");
        avatar.src = "assets/avatar.webp";
        avatar.style.width = "30px";
        emojiSpanBot.appendChild(avatar);
        newDivBot.appendChild(emojiSpanBot); // Añadir el emoji al final del div

        let newSpanBot = document.createElement("span")
        newSpanBot.className = "span-text-bot" 
        newSpanBot.textContent = "";
        newDivBot.appendChild(newSpanBot)
        
        document.querySelector("#chat-messages").appendChild(newDivBot)
        
        typeText(newSpanBot, data.message);
        newDivBot.scrollIntoView({ behavior: "smooth" });
    }
    
    sendMessageToServer(UserMesage);
});

function typeText(element, text) {
    let index = 0;
    element.innerHTML = ""; // Limpiar el contenido antes de escribir
    function type() {
        if (index < text.length) {
            if (text.charAt(index) === '\n') {
                element.innerHTML += "<br>";
            } else {
                element.innerHTML += text.charAt(index);
            }
            index++;
            setTimeout(type, 25); // Ajusta la velocidad de escritura aquí
        }
        else {
            // Hacer scroll al final del contenedor de mensajes cuando se ha añadido todo el texto
            document.querySelector("main").scrollIntoView({ 
                behavior: "smooth", 
                block: "end" 
            });        }
    }
    type();
}