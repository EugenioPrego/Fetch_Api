const url = "https://jsonplaceholder.typicode.com/posts";

const loading_element = document.getElementById("loading");
const posts_container = document.getElementById("posts-container");

const post_page = document.getElementById("post");
const post_container = document.getElementById("post-container");
const coments_container = document.getElementById("coments-container");

const coment_form = document.getElementById("coment-form");
const email = document.getElementById("email");
const body_input = document.getElementById("body");

// Mensagem de offline
const offlineMessage = document.createElement("div");
offlineMessage.id = "offline-message";
offlineMessage.innerText = "⚠️ Você está offline. Conecte-se à internet para continuar.";
offlineMessage.style.position = "fixed";
offlineMessage.style.top = "0";
offlineMessage.style.left = "0";
offlineMessage.style.width = "100%";
offlineMessage.style.padding = "10px";
offlineMessage.style.backgroundColor = "red";
offlineMessage.style.color = "white";
offlineMessage.style.textAlign = "center";
offlineMessage.style.display = "none"; // escondido por padrão
document.body.appendChild(offlineMessage);

// Função para mostrar/ocultar mensagem offline
function checkConnection() {
    if (navigator.onLine) {
        offlineMessage.style.display = "none";
    } else {
        offlineMessage.style.display = "block";
    }
}

// Detectar mudança de conexão
window.addEventListener("online", checkConnection);
window.addEventListener("offline", checkConnection);

// Checar logo ao carregar
checkConnection();

// Get id from url
const url_search_params = new URLSearchParams(window.location.search);
const post_id = url_search_params.get("id");

// Get all posts
async function get_all_posts() {
    if (!navigator.onLine) {
        loading_element.innerText = "Sem conexão para carregar os posts.";
        return;
    }

    const response = await fetch(url);
    const data = await response.json();

    loading_element.classList.add("hide");

    data.map((post) => {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        title.innerText = post.title;
        body.innerText = post.body;

        link.innerText = "Ler";
        link.setAttribute("href", `./post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        posts_container.appendChild(div);
    });
}

// Get individual post
async function get_post(id) {
    if (!navigator.onLine) {
        loading_element.innerText = "Sem conexão para carregar o post.";
        return;
    }

    const [response_post, response_coment] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);

    const data_post = await response_post.json();
    const data_coments = await response_coment.json();

    loading_element.classList.add("hide");
    post_page.classList.remove("hide");

    const title = document.createElement("h1");
    const body = document.createElement("p");
    
    title.innerText = data_post.title;
    body.innerText = data_post.body;

    post_container.appendChild(title);
    post_container.appendChild(body);

    if (Array.isArray(data_coments)) {
        data_coments.map((comment) => {
            create_coment(comment);
        });
    }
}

function create_coment(comment) {
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const coment_body = document.createElement("p");

    email.innerText = comment.email;
    coment_body.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(coment_body);
    coments_container.appendChild(div);
}

// Post a coment
async function post_coment(comment) {
    if (!navigator.onLine) {
        alert("Você está offline. O comentário não pode ser enviado.");
        return;
    }

    const response = await fetch(`${url}/${post_id}/comments`, {
        method: "POST",
        body: comment,
        headers:{
            "content-type":"application/json"
        }
    })

    const data = await response.json();

    create_coment(data);
}

// Inicialization
if (!post_id) {
    get_all_posts();
} else {
    get_post(post_id);

    // add event to comment form
    coment_form.addEventListener("submit",(event) =>{
        event.preventDefault()

        let coment = {
            email: email.value,
            body: body_input.value,
        }

        coment = JSON.stringify(coment);

        post_coment(coment);

        console.log(coment)
    });
}




