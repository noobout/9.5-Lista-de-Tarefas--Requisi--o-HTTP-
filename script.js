const tarefas = document.getElementById("listaTarefas");

// Carregar tarefas
console.log("Iniciando carregamento das tarefas...");
fetch("https://crudcrud.com/api/525d39c0a68047ff8eb89a20f207620b/tarefas")
.then(resposta => {
    console.log("Resposta GET:", resposta);
    return resposta.json();
})
.then((listaDeTarefas) => {
    console.log("Tarefas recebidas:", listaDeTarefas);
    listaDeTarefas.forEach(element => {
        console.log("Adicionando tarefa:", element);
        const item = document.createElement("li");
        item.innerHTML = `${element.descricao} <button onclick="remove('${element._id}', this)">X</button>`;
        tarefas.appendChild(item); 
    });
})
.catch(error => {
    console.error("Erro ao carregar tarefas:", error);
    mostrarErro("Erro ao carregar tarefas. Verifique a conexão.");
});

// Adicionar nova tarefa
document.getElementById("add").addEventListener("click", ()=>{
    const descricao = document.getElementById("tarefa").value.trim();
    if(!descricao) return;

    console.log("Enviando nova tarefa...");
    fetch("https://crudcrud.com/api/525d39c0a68047ff8eb89a20f207620b/tarefas", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({descricao: descricao})
    })
    .then(resposta => {
        console.log("Resposta POST:", resposta);
        return resposta.json();
    })
    .then((tarefa) => {
        console.log("Tarefa criada:", tarefa);
        const item = document.createElement("li");
        item.innerHTML = `${tarefa.descricao} <button onclick="remove('${tarefa._id}', this)">X</button>`;
        tarefas.appendChild(item);
        document.getElementById("tarefa").value = "";
    })
    .catch(error => {
        console.error("Erro ao adicionar tarefa:", error);
        mostrarErro("Erro ao adicionar tarefa. Verifique a conexão.");
    });
});

// Remover tarefa
function remove(id, botao){
    console.log("Removendo tarefa com ID:", id);
    botao.disabled = true;
    botao.textContent = "Removendo...";

    fetch(`https://crudcrud.com/api/525d39c0a68047ff8eb89a20f207620b/tarefas/${id}`, { method: "DELETE" })
    .then(resposta => {
        console.log("Resposta DELETE:", resposta);
        if(resposta.ok){
            const item = botao.parentElement;
            item.classList.add("fade-out");
            item.addEventListener("transitionend", ()=> item.remove());
        } else {
            console.warn("Erro ao remover tarefa:", resposta.status);
            botao.disabled = false;
            botao.textContent = "X";
            mostrarErro("Erro ao remover tarefa. Tente novamente.");
        }
    })
    .catch(error => {
        console.error("Erro de rede ao remover tarefa:", error);
        botao.disabled = false;
        botao.textContent = "X";
        mostrarErro("Erro de rede ao remover tarefa.");
    });
}

// Alert de erros (apenas lógica, sem estilo no JS)
function mostrarErro(mensagem){
    const alertDiv = document.getElementById("error-alert");
    alertDiv.textContent = mensagem;
    alertDiv.style.display = "block";
    setTimeout(() => {
        alertDiv.style.display = "none";
    }, 3000);
}
