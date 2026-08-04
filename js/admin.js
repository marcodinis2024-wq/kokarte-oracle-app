// 🔒 Define a senha de acesso ao painel (Altera para o que desejares)
const SENHA_CORRETA = "kokarte2026";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Verifica se a sessão já está iniciada
    if (sessionStorage.getItem("kokarte_admin_logado") === "true") {
        mostrarPainel();
    }

    // 2. Configura o processamento de Imagens para Base64
    configurarUploadDeImagem();
});

function fazerLogin(e) {
    e.preventDefault();
    const senhaInput = document.getElementById("input-senha").value;
    
    if (senhaInput === SENHA_CORRETA) {
        // Guarda na sessão (apaga quando o separador do browser for fechado)
        sessionStorage.setItem("kokarte_admin_logado", "true");
        mostrarPainel();
    } else {
        alert("❌ Palavra-passe incorreta!");
    }
}

function fazerLogout() {
    sessionStorage.removeItem("kokarte_admin_logado");
    document.getElementById("sec-login").classList.remove("hidden");
    document.getElementById("painel-admin").classList.add("hidden");
    document.getElementById("input-senha").value = "";
}

function mostrarPainel() {
    document.getElementById("sec-login").classList.add("hidden");
    document.getElementById("painel-admin").classList.remove("hidden");
    carregarEventosAdmin();
}

// Esta função pega na foto, reduz a qualidade/tamanho e converte para texto (Base64)
// Isto previne que o LocalStorage atinja o limite de 5MB rapidamente
function configurarUploadDeImagem() {
    const inputImagem = document.getElementById("evento-imagem");
    const previewImg = document.getElementById("imagem-preview");
    const previewContainer = document.getElementById("imagem-preview-container");
    const inputBase64 = document.getElementById("evento-imagem-base64");

    if (!inputImagem) return;

    inputImagem.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (!file) {
            previewContainer.classList.add("hidden");
            inputBase64.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Redimensionar a imagem (Máximo 800x800px)
                const canvas = document.createElement("canvas");
                const MAX_SIZE = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Comprimir para JPEG (Qualidade 70%)
                const base64String = canvas.toDataURL("image/jpeg", 0.7);
                
                // Guardar no campo escondido e mostrar o preview
                inputBase64.value = base64String;
                previewImg.src = base64String;
                previewContainer.classList.remove("hidden");
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    });
}

function lerEventos() {
    try {
        const dados = localStorage.getItem("kokarte_eventos");
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        return [];
    }
}

function guardarEvento(e) {
    e.preventDefault();
    
    let eventos = lerEventos();
    const idInput = document.getElementById("evento-id").value;
    
    const novoEvento = {
        id: idInput ? parseInt(idInput) : Date.now(),
        titulo: document.getElementById("evento-titulo").value,
        data: document.getElementById("evento-data").value,
        local: document.getElementById("evento-local").value,
        descricaoBreve: document.getElementById("evento-descricao-breve").value,
        descricaoCompleta: document.getElementById("evento-descricao-completa").value,
        imagem: document.getElementById("evento-imagem-base64").value,
        ativo: document.getElementById("evento-ativo").checked
    };

    if (idInput) {
        // Atualizar evento existente
        eventos = eventos.map(evt => evt.id === novoEvento.id ? novoEvento : evt);
    } else {
        // Adicionar novo evento
        eventos.push(novoEvento);
    }

    try {
        localStorage.setItem("kokarte_eventos", JSON.stringify(eventos));
        limparFormulario();
        carregarEventosAdmin();
        
        // Notificação visual suave
        const btnSubmit = document.querySelector("#form-evento button[type='submit']");
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = "✅ Guardado!";
        btnSubmit.classList.add("bg-green-600");
        setTimeout(() => {
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.classList.remove("bg-green-600");
        }, 2000);

    } catch (err) {
        if (err.name === 'QuotaExceededError') {
            alert("❌ Erro: Memória cheia. A imagem pode ser demasiado grande, ou existem demasiados eventos guardados.");
        } else {
            alert("❌ Ocorreu um erro ao guardar.");
        }
    }
}

function limparFormulario() {
    document.getElementById("form-evento").reset();
    document.getElementById("evento-id").value = "";
    document.getElementById("evento-imagem-base64").value = "";
    
    // Esconder preview da imagem
    document.getElementById("imagem-preview-container").classList.add("hidden");
    document.getElementById("imagem-preview").src = "";
    
    document.getElementById("form-titulo").innerHTML = "✨ Adicionar Novo Evento";
}

//* ... existing code ... */
function carregarEventosAdmin() {
    const container = document.getElementById("tabela-eventos");
    if (!container) return;
    
    const eventos = lerEventos();

    if (eventos.length === 0) {
        container.innerHTML = `
            <div class="bg-kokarteBg/50 border border-emerald-900/50 p-6 rounded-xl text-center">
                <p class="text-emerald-200/50 text-sm">Nenhum evento na base de dados.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    eventos.reverse().forEach(evt => {
        container.innerHTML += `
            <div class="bg-kokarteBg border ${evt.ativo ? 'border-kokarteGold/40' : 'border-red-900/50 opacity-70'} p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
                <div class="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                    ${evt.imagem 
                        ? `<img src="${evt.imagem}" class="w-16 h-16 rounded-lg object-cover border border-kokarteGold/20 shrink-0">` 
                        : `<div class="w-16 h-16 rounded-lg bg-kokarteCard border border-emerald-900 flex flex-col items-center justify-center text-[10px] text-emerald-600 shrink-0"><span>Sem</span><span>Foto</span></div>`
                    }
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-white truncate text-sm">${evt.titulo}</h3>
                        <p class="text-xs text-kokarteGold mt-0.5">${evt.data}</p>
                        ${!evt.ativo ? '<span class="inline-block mt-1 bg-red-950 text-red-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Oculto no Portal</span>' : '<span class="inline-block mt-1 bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Visível</span>'}
                    </div>
                </div>
                <div class="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button type="button" onclick="toggleEvento(${evt.id})" class="${evt.ativo ? 'bg-amber-950/40 text-amber-300' : 'bg-emerald-950/40 text-emerald-300'} text-xs px-4 py-2.5 rounded-lg transition-colors border border-amber-900/30">
                        ${evt.ativo ? 'Ocultar' : 'Ativar'}
                    </button>
                    <button type="button" onclick="editarEvento(${evt.id})" class="bg-kokarteCard hover:bg-kokarteGold hover:text-kokarteBg text-kokarteGold text-xs px-4 py-2.5 rounded-lg transition-colors border border-kokarteGold/30">
                        Editar
                    </button>
                    <button type="button" onclick="apagarEvento(${evt.id})" class="bg-red-950/40 hover:bg-red-600 text-red-200 hover:text-white text-xs px-4 py-2.5 rounded-lg transition-colors border border-red-900/50">
                        Apagar
                    </button>
                </div>
            </div>
        `;
    });
}

// Nova função para alternar o estado de visibilidade sem abrir o formulário
function toggleEvento(id) {
    let eventos = lerEventos();
    const evtIndex = eventos.findIndex(e => e.id === id);
    
    if (evtIndex !== -1) {
        eventos[evtIndex].ativo = !eventos[evtIndex].ativo; // Inverte o estado (true vira false, false vira true)
        localStorage.setItem("kokarte_eventos", JSON.stringify(eventos));
        carregarEventosAdmin(); // Atualiza a lista visualmente
    }
}

function editarEvento(id) {
    const eventos = lerEventos();
    const evt = eventos.find(e => e.id === id);
    if (!evt) return;

    // Preencher campos
    document.getElementById("evento-id").value = evt.id;
    document.getElementById("evento-titulo").value = evt.titulo || "";
    document.getElementById("evento-data").value = evt.data || "";
    document.getElementById("evento-local").value = evt.local || "";
    
    // Lidar com eventos antigos e os novos campos separados
    document.getElementById("evento-descricao-breve").value = evt.descricaoBreve || evt.descricao || ""; 
    document.getElementById("evento-descricao-completa").value = evt.descricaoCompleta || evt.descricao || ""; 
    
    document.getElementById("evento-ativo").checked = evt.ativo;

    // Lidar com imagem
    const inputBase64 = document.getElementById("evento-imagem-base64");
    const previewContainer = document.getElementById("imagem-preview-container");
    const previewImg = document.getElementById("imagem-preview");

    if (evt.imagem) {
        inputBase64.value = evt.imagem;
        previewImg.src = evt.imagem;
        previewContainer.classList.remove("hidden");
    } else {
        inputBase64.value = "";
        previewImg.src = "";
        previewContainer.classList.add("hidden");
    }
    
    // Limpar o input de ficheiro para não causar confusão
    document.getElementById("evento-imagem").value = "";

    document.getElementById("form-titulo").innerHTML = "✏️ A Editar Evento...";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function apagarEvento(id) {
    if(confirm("⚠️ Tens a certeza que queres apagar permanentemente este evento?")) {
        let eventos = lerEventos();
        eventos = eventos.filter(evt => evt.id !== id);
        localStorage.setItem("kokarte_eventos", JSON.stringify(eventos));
        
        // Se estivermos a apagar o evento que está no formulário, limpa o formulário
        if (document.getElementById("evento-id").value == id) {
            limparFormulario();
        }
        
        carregarEventosAdmin();
    }
}