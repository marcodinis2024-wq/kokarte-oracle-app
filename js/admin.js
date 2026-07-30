// Palavra-passe temporária para testes locais
const SENHA_ADMIN_TEMPORARIA = "kokarte2026";

document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("admin_autenticado") === "true") {
        mostrarPainel();
    }
});

// Autenticação simples
function fazerLogin(e) {
    e.preventDefault();
    const senha = document.getElementById("input-senha").value;
    if (senha === SENHA_ADMIN_TEMPORARIA) {
        sessionStorage.setItem("admin_autenticado", "true");
        mostrarPainel();
    } else {
        alert("Palavra-passe incorreta!");
    }
}

function fazerLogout() {
    sessionStorage.removeItem("admin_autenticado");
    location.reload();
}

function mostrarPainel() {
    document.getElementById("sec-login").classList.add("hidden");
    document.getElementById("painel-admin").classList.remove("hidden");
    renderizarTabelaEventos();
}

// Obter eventos do LocalStorage (Simulação de Base de Dados)
function obterEventosLocal() {
    const dados = localStorage.getItem("kokarte_eventos");
    return dados ? JSON.parse(dados) : [
        {
            id: 1,
            titulo: "Workshop de Cristais de Proteção",
            data: "15 de Setembro, 18:30",
            local: "Loja KOKARTE",
            descricao: "Aprende a limpar e programar as tuas pedras de proteção.",
            ativo: true,
            imagem: ""
        }
    ];
}

function guardarEventosLocal(eventos) {
    localStorage.setItem("kokarte_eventos", JSON.stringify(eventos));
    renderizarTabelaEventos();
}

// Função para converter o ficheiro de imagem em string Base64
function converterImagemParaBase64(ficheiro) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(ficheiro);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Criar ou Editar Evento (agora com processamento de imagem da galeria)
async function guardarEvento(e) {
    e.preventDefault();
    const id = document.getElementById("evento-id").value;
    const titulo = document.getElementById("evento-titulo").value;
    const data = document.getElementById("evento-data").value;
    const local = document.getElementById("evento-local").value;
    const descricao = document.getElementById("evento-descricao").value;
    const ativo = document.getElementById("evento-ativo").checked;
    
    // Processamento da imagem carregada do telemóvel
    const inputImagem = document.getElementById("evento-imagem");
    let imagemBase64 = document.getElementById("evento-imagem-base64").value || "";

    if (inputImagem && inputImagem.files && inputImagem.files[0]) {
        try {
            imagemBase64 = await converterImagemParaBase64(inputImagem.files[0]);
        } catch (err) {
            console.error("Erro ao converter imagem:", err);
        }
    }

    let eventos = obterEventosLocal();

    if (id) {
        // Modo Edição
        eventos = eventos.map(evt => evt.id == id ? { id: Number(id), titulo, data, local, descricao, ativo, imagem: imagemBase64 } : evt);
    } else {
        // Novo Evento
        const novoEvento = {
            id: Date.now(),
            titulo,
            data,
            local,
            descricao,
            ativo,
            imagem: imagemBase64
        };
        eventos.push(novoEvento);
    }

    guardarEventosLocal(eventos);
    limparFormulario();
}

// Renderizar Tabela no Admin
function renderizarTabelaEventos() {
    const container = document.getElementById("tabela-eventos");
    const eventos = obterEventosLocal();

    if (eventos.length === 0) {
        container.innerHTML = `<p class="text-xs text-emerald-300/50 italic text-center py-4">Nenhum evento registado.</p>`;
        return;
    }

    container.innerHTML = "";
    eventos.forEach(evt => {
        container.innerHTML += `
            <div class="bg-kokarteCard p-4 rounded-xl border ${evt.ativo ? 'border-kokarteGold/40' : 'border-red-900/40 opacity-60'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center gap-3">
                    ${evt.imagem ? `<img src="${evt.imagem}" alt="Preview" class="w-12 h-12 rounded-lg object-cover border border-kokarteGold/30 shrink-0">` : ''}
                    <div>
                        <div class="flex items-center space-x-2">
                            <h3 class="font-bold text-white text-sm">${evt.titulo}</h3>
                            <span class="text-[9px] font-bold px-2 py-0.5 rounded ${evt.ativo ? 'bg-emerald-900 text-emerald-200' : 'bg-red-950 text-red-300'}">
                                ${evt.ativo ? 'Ativo / Visível' : 'Oculto'}
                            </span>
                        </div>
                        <p class="text-xs text-emerald-200/70 mt-1">🗓️ ${evt.data} | 📍 ${evt.local}</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
                    <button onclick="alternarVisibilidade(${evt.id})" class="text-xs border border-emerald-700/60 text-emerald-200 hover:bg-emerald-900/50 px-2.5 py-1 rounded transition-colors">
                        ${evt.ativo ? '👁️ Ocultar' : '👁️ Mostrar'}
                    </button>
                    <button onclick="prepararEdicao(${evt.id})" class="text-xs border border-kokarteGold/60 text-kokarteGold hover:bg-kokarteGold/10 px-2.5 py-1 rounded transition-colors">
                        ✏️ Editar
                    </button>
                    <button onclick="eliminarEvento(${evt.id})" class="text-xs border border-red-500/50 text-red-300 hover:bg-red-950 px-2.5 py-1 rounded transition-colors">
                        🗑️ Apagar
                    </button>
                </div>
            </div>
        `;
    });
}

// Ações rápidas
function alternarVisibilidade(id) {
    let eventos = obterEventosLocal();
    eventos = eventos.map(evt => evt.id === id ? { ...evt, ativo: !evt.ativo } : evt);
    guardarEventosLocal(eventos);
}

function eliminarEvento(id) {
    if (confirm("Tens a certeza que queres apagar este evento?")) {
        let eventos = obterEventosLocal();
        eventos = eventos.filter(evt => evt.id !== id);
        guardarEventosLocal(eventos);
    }
}

function prepararEdicao(id) {
    const eventos = obterEventosLocal();
    const evt = eventos.find(e => e.id === id);
    if (!evt) return;

    document.getElementById("evento-id").value = evt.id;
    document.getElementById("evento-titulo").value = evt.titulo;
    document.getElementById("evento-data").value = evt.data;
    document.getElementById("evento-local").value = evt.local;
    document.getElementById("evento-descricao").value = evt.descricao || "";
    document.getElementById("evento-ativo").checked = evt.ativo;
    
    // Preservar a imagem existente durante a edição
    if (document.getElementById("evento-imagem-base64")) {
        document.getElementById("evento-imagem-base64").value = evt.imagem || "";
    }

    document.getElementById("form-titulo").innerText = "✏️ Editar Evento";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparFormulario() {
    document.getElementById("form-evento").reset();
    document.getElementById("evento-id").value = "";
    if (document.getElementById("evento-imagem-base64")) {
        document.getElementById("evento-imagem-base64").value = "";
    }
    document.getElementById("form-titulo").innerText = "✨ Adicionar Novo Evento";
}