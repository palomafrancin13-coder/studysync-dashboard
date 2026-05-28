const SUPABASE_URL = "https://upqdljmaxmnxqknxskrw.supabase.co";
const SUPABASE_KEY = "sb_publishable_eBXcaTKLyCcxVFwd_eZaeA_mjXMoKpo";
let editandoId = null;

async function cadastrar() {
    const email =
        document.getElementById(
            "email"
        ).value;

    const senha =
        document.getElementById(
            "senha"
        ).value;

    const response = await fetch(
        `${SUPABASE_URL}/auth/v1/signup`,
        {
            method: "POST",

            headers: {
                apikey: SUPABASE_KEY,
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                email: email,
                password: senha,
            }),
        }
    );

    const data = await response.json();

    console.log(data);

    mostrarAviso("Usuário cadastrado com sucesso!", "sucesso");
}
async function login() {
    const email =
        document.getElementById(
            "email"
        ).value;

    const senha =
        document.getElementById(
            "senha"
        ).value;

    const response = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
            method: "POST",

            headers: {
                apikey: SUPABASE_KEY,
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                email: email,
                password: senha,
            }),
        }
    );

    const data = await response.json();

    console.log(data);

    if (data.access_token) {
        localStorage.setItem(
            "token",
            data.access_token
        );
        localStorage.setItem(
            "email",
            email
        );

        window.location.href =
            "dashboard.html";
    mostrarAviso("Email ou Senha incorretos", "erro");
        );
    }
}

function logout() {
    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "index.html";
}

async function criarAtividade() {
    const titulo =
        document.getElementById(
            "titulo"
        ).value;

    const descricao =
        document.getElementById(
            "descricao"
        ).value;

    const data =
        document.getElementById("data")
            .value;

    const status =
        document.getElementById(
            "status"
        ).value;

    const prioridade =
        document.getElementById(
            "prioridade"
        ).value;

    const url = editandoId
        ? `${SUPABASE_URL}/rest/v1/atividades?id=eq.${editandoId}`
        : `${SUPABASE_URL}/rest/v1/atividades`;

    const metodo = editandoId
        ? "PATCH"
        : "POST";

    const response = await fetch(
        url,
        {
            method: metodo,

            headers: {
                apikey: SUPABASE_KEY,

                Authorization: `Bearer ${SUPABASE_KEY}`,

                "Content-Type":
                    "application/json",

                Prefer:
                    "return=representation",
            },

            body: JSON.stringify({
                titulo: titulo,
                descricao: descricao,
                data_entrega: data,
                status: status,
                prioridade: prioridade,
            }),
        }
    );

    const dataResponse =
        await response.json();

    console.log(dataResponse);

   mostrarAviso(
    editandoId
        ? "Atividade atualizada com sucesso!"
        : "Atividade criada com sucesso!",
    "sucesso"
);
    );

    listarAtividades();

    editandoId = null;

    document.getElementById(
        "titulo"
    ).value = "";

    document.getElementById(
        "descricao"
    ).value = "";

    document.getElementById(
        "data"
    ).value = "";

    document.getElementById(
        "status"
    ).value = "Pendente";

    document.getElementById(
        "prioridade"
    ).value = "Baixa";
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

    const atividades =
        await response.json();

    console.log(atividades);

    const lista =
        document.getElementById(
            "lista-atividades"
        );

    if (!lista) return;

    lista.innerHTML = "";
    const pesquisa =
        document
            .getElementById(
                "pesquisa"
            )
            ?.value.toLowerCase() || "";
    atividades.forEach(

        (atividade) => {
            lista.innerHTML += `
                <div class="bg-white p-6 rounded-2xl shadow-lg mb-4 border-l-4 border-blue-500">

                    <h2 class="text-2xl font-bold">
                        ${atividade.titulo}
                    </h2>

                    <p class="mb-2">
                        ${atividade.descricao}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${atividade.data_entrega}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${atividade.status}
                    </p>

                    <p>
                        <strong>Prioridade:</strong>
                        ${atividade.prioridade}
                    </p>

                    <button
                        onclick='editarAtividade(${JSON.stringify(
                atividade
            )})'
                        class="bg-yellow-500 text-white px-4 py-2 rounded mt-4 mr-2"
                    >
                        Editar
                    </button>

                    <button
                        onclick="deletarAtividade(${atividade.id})"
                        class="bg-red-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Excluir
                    </button>

                </div>
            `;
        }
    );
}

async function deletarAtividade(
    id
) {
    const confirmar = confirm(
        "Deseja realmente excluir?"
    );

    if (!confirmar) {
        return;
    }

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/atividades?id=eq.${id}`,
        {
            method: "DELETE",

            headers: {
                apikey: SUPABASE_KEY,

                Authorization: `Bearer ${SUPABASE_KEY}`,
            },
        }
    );

    console.log(response);

    mostrarAviso("Atividade excluída com sucesso!", "sucesso");

listarAtividades();
}

function editarAtividade(
    atividade
) {
    editandoId = atividade.id;

    document.getElementById(
        "titulo"
    ).value = atividade.titulo;

    document.getElementById(
        "descricao"
    ).value =
        atividade.descricao;

    document.getElementById(
        "data"
    ).value =
        atividade.data_entrega;

    document.getElementById(
        "status"
    ).value = atividade.status;

    document.getElementById(
        "prioridade"
    ).value =
        atividade.prioridade;
}

listarAtividades();
const usuario =
    localStorage.getItem(
        "email"
    );

const usuarioLogado =
    document.getElementById(
        "usuario-logado"
    );

if (usuarioLogado) {
    usuarioLogado.innerHTML =
        `👋 Bem-vindo(a), ${usuario}`;
}
