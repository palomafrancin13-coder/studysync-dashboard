const SUPABASE_URL = "https://upqdljmaxmnxqknxskrw.supabase.co";
const SUPABASE_KEY = "sb_publishable_eBXcaTKLyCcxVFwd_eZaeA_mjXMoKpo";
let editandoId = null;

async function cadastrar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch(
        `${SUPABASE_URL}/auth/v1/signup`,
        {
            method: "POST",
            headers: {
                apikey: SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: senha,
            }),
        }
    );

    const data = await response.json();

    mostrarAviso("Usuário cadastrado com sucesso!", "sucesso");
}

async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
            method: "POST",
            headers: {
                apikey: SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: senha,
            }),
        }
    );

    const data = await response.json();

    if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", email);

        mostrarAviso("Login realizado com sucesso!", "sucesso");

        window.location.href = "dashboard.html";
    } else {
        mostrarAviso("Email ou senha inválidos", "erro");
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

async function criarAtividade() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const data = document.getElementById("data").value;
    const status = document.getElementById("status").value;
    const prioridade = document.getElementById("prioridade").value;

    const url = editandoId
        ? `${SUPABASE_URL}/rest/v1/atividades?id=eq.${editandoId}`
        : `${SUPABASE_URL}/rest/v1/atividades`;

    const metodo = editandoId ? "PATCH" : "POST";

    const response = await fetch(url, {
        method: metodo,
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify({
            titulo,
            descricao,
            data_entrega: data,
            status,
            prioridade,
        }),
    });

    const dataResponse = await response.json();

    mostrarAviso(
        editandoId
            ? "Atividade atualizada com sucesso!"
            : "Atividade criada com sucesso!",
        "sucesso"
    );

    listarAtividades();

    editandoId = null;
}

async function listarAtividades() {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/atividades?select=*`,
        {
            method: "GET",
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
            },
        }
    );

    const atividades = await response.json();
    const lista = document.getElementById("lista-atividades");

    if (!lista) return;

    lista.innerHTML = "";

    atividades.forEach((atividade) => {
        lista.innerHTML += `
        <div class="bg-white p-6 rounded-2xl shadow-lg mb-4 border-l-4 border-blue-500">

            <h2 class="text-2xl font-bold">${atividade.titulo}</h2>
            <p class="mb-2">${atividade.descricao}</p>

            <p><strong>Data:</strong> ${atividade.data_entrega}</p>
            <p><strong>Status:</strong> ${atividade.status}</p>
            <p><strong>Prioridade:</strong> ${atividade.prioridade}</p>

           <button onclick='editarAtividade(${JSON.stringify(atividade)})'
  class="bg-yellow-500 text-white px-4 py-2 rounded mt-4 mr-2 hover:scale-105 transition duration-300 shadow-md">
  Editar
</button>

<button onclick="deletarAtividade(${atividade.id})"
  class="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:scale-105 transition duration-300 shadow-md">
  Excluir
</button>
        </div>
        `;
    });
}

async function deletarAtividade(id) {
    const modal = document.getElementById("modal-confirm");
    const btnSim = document.getElementById("btn-sim");
    const btnNao = document.getElementById("btn-nao");

    modal.classList.remove("hidden");

    btnNao.onclick = () => {
        modal.classList.add("hidden");
    };

    btnSim.onclick = async () => {
        modal.classList.add("hidden");

        await fetch(
            `${SUPABASE_URL}/rest/v1/atividades?id=eq.${id}`,
            {
                method: "DELETE",
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                },
            }
        );

        mostrarAviso("Atividade excluída com sucesso!", "sucesso");
        listarAtividades();
    };
}

function editarAtividade(atividade) {
    editandoId = atividade.id;

    document.getElementById("titulo").value = atividade.titulo;
    document.getElementById("descricao").value = atividade.descricao;
    document.getElementById("data").value = atividade.data_entrega;
    document.getElementById("status").value = atividade.status;
    document.getElementById("prioridade").value = atividade.prioridade;
}

listarAtividades();

const usuario = localStorage.getItem("email");
const usuarioLogado = document.getElementById("usuario-logado");

if (usuarioLogado) {
    usuarioLogado.innerHTML = `Bem-vindo(a), ${usuario}`;
}

function mostrarAviso(mensagem, tipo = "erro") {
    const toast = document.getElementById("toast");

    if (!toast) return;

    const cores = {
        erro: "bg-red-500",
        sucesso: "bg-green-500",
        info: "bg-blue-500",
    };

    toast.className = `
        fixed top-5 right-5 px-6 py-4 rounded-2xl text-white font-semibold shadow-lg z-50
        ${cores[tipo]}
    `;

    toast.innerText = mensagem;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}
