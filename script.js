const lista = document.getElementById("listaClientes");
const API_URL = "https://crudcrud.com/api/SEU_ENDPOINT/clientes"; // Trocar pelo seu endpoint

// Função para exibir erros
function mostrarErro(mensagem){
    const alertDiv = document.getElementById("error-alert");
    alertDiv.textContent = mensagem;
    alertDiv.style.display = "block";
    setTimeout(() => {
        alertDiv.style.display = "none";
    }, 3000);
}

// Listar clientes (GET)
fetch(API_URL)
.then(res => res.json())
.then(clientes => {
    clientes.forEach(cliente => {
        const li = document.createElement("li");
        li.innerHTML = `${cliente.nome} - ${cliente.email} 
            <button onclick="remover('${cliente._id}', this)">Excluir</button>`;
        lista.appendChild(li);
    });
})
.catch(() => mostrarErro("Erro ao carregar clientes"));

// Cadastrar cliente (POST)
document.getElementById("add").addEventListener("click", () => {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if(!nome || !email) {
        mostrarErro("Preencha todos os campos");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome, email })
    })
    .then(res => res.json())
    .then(cliente => {
        const li = document.createElement("li");
        li.innerHTML = `${cliente.nome} - ${cliente.email} 
            <button onclick="remover('${cliente._id}', this)">Excluir</button>`;
        lista.appendChild(li);

        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
    })
    .catch(() => mostrarErro("Erro ao adicionar cliente"));
});

// Remover cliente (DELETE)
function remover(id, botao) {
    botao.disabled = true;
    botao.textContent = "Removendo...";

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => {
        if(res.ok){
            botao.parentElement.remove();
        } else {
            mostrarErro("Erro ao remover cliente");
            botao.disabled = false;
            botao.textContent = "Excluir";
        }
    })
    .catch(() => {
        mostrarErro("Erro de rede");
        botao.disabled = false;
        botao.textContent = "Excluir";
    });
}
