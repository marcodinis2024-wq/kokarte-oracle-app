// ============================================================
// 🔒 SISTEMA DE AUTENTICAÇÃO KOKARTE — SENHA FIXA
// ============================================================

// SENHA FIXA: "kokarte2026"
const SENHA_CORRETA = "kokarte2026";
const MAX_TENTATIVAS = 5;
const TEMPO_BLOQUEIO = 15; // minutos
const TEMPO_SESSAO = 30; // minutos

let tentativas = 0;
let bloqueioAte = null;

// ============================================================
// 1. FUNÇÃO DE LOGIN
// ============================================================
function fazerLogin(e) {
    e.preventDefault();
    
    if (estaBloqueado()) return;
    
    const senhaInput = document.getElementById('input-senha');
    const senha = senhaInput.value;
    const btnSubmit = document.querySelector('#sec-login button[type="submit"]');
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'A verificar...';
    
    if (senha === SENHA_CORRETA) {
        tentativas = 0;
        sessionStorage.setItem('kokarte_admin_logado', 'true');
        sessionStorage.setItem('kokarte_admin_login_time', Date.now().toString());
        senhaInput.value = '';
        mostrarPainel();
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Entrar no Painel';
    } else {
        tentativas++;
        atualizarContadorTentativas();
        
        if (tentativas >= MAX_TENTATIVAS) {
            bloqueioAte = Date.now() + (TEMPO_BLOQUEIO * 60 * 1000);
            const msg = document.getElementById('bloqueio-mensagem');
            if (msg) {
                msg.classList.remove('hidden');
                msg.innerHTML = `⚠️ Demasiadas tentativas. Aguarde ${TEMPO_BLOQUEIO} minutos.`;
            }
            senhaInput.disabled = true;
            senhaInput.placeholder = '🔒 Acesso bloqueado...';
            
            setTimeout(() => {
                senhaInput.disabled = false;
                senhaInput.placeholder = 'Digite a palavra-passe...';
                bloqueioAte = null;
                tentativas = 0;
                const msg2 = document.getElementById('bloqueio-mensagem');
                if (msg2) msg2.classList.add('hidden');
                atualizarContadorTentativas();
            }, TEMPO_BLOQUEIO * 60 * 1000);
        } else {
            const erroMsg = document.createElement('p');
            erroMsg.className = 'text-red-400 text-xs mt-2 text-center';
            erroMsg.id = 'erro-login';
            erroMsg.textContent = `❌ Senha incorreta. Tentativas restantes: ${MAX_TENTATIVAS - tentativas}`;
            
            const erroAnterior = document.getElementById('erro-login');
            if (erroAnterior) erroAnterior.remove();
            
            document.querySelector('#sec-login form').appendChild(erroMsg);
            
            setTimeout(() => {
                const erro = document.getElementById('erro-login');
                if (erro) erro.remove();
            }, 3000);
        }
        
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Entrar no Painel';
    }
}

// ============================================================
// 2. VERIFICAR BLOQUEIO
// ============================================================
function estaBloqueado() {
    if (!bloqueioAte) return false;
    
    const agora = Date.now();
    if (agora < bloqueioAte) {
        const minutosRestantes = Math.ceil((bloqueioAte - agora) / 60000);
        const msg = document.getElementById('bloqueio-mensagem');
        if (msg) {
            msg.classList.remove('hidden');
            msg.innerHTML = `⚠️ Acesso bloqueado. Aguarde ${minutosRestantes} minuto(s).`;
        }
        return true;
    }
    
    bloqueioAte = null;
    tentativas = 0;
    const msg = document.getElementById('bloqueio-mensagem');
    if (msg) msg.classList.add('hidden');
    atualizarContadorTentativas();
    return false;
}

// ============================================================
// 3. ATUALIZAR CONTADOR
// ============================================================
function atualizarContadorTentativas() {
    const container = document.getElementById('tentativas-restantes');
    const contador = document.getElementById('contador-tentativas');
    
    if (!container || !contador) return;
    
    if (tentativas >= MAX_TENTATIVAS) {
        container.classList.add('hidden');
        return;
    }
    
    const restantes = MAX_TENTATIVAS - tentativas;
    if (restantes <= 2) {
        container.classList.remove('hidden');
        contador.textContent = restantes;
    } else {
        container.classList.add('hidden');
    }
}

// ============================================================
// 4. VERIFICAR SESSÃO
// ============================================================
function verificarSessao() {
    const logado = sessionStorage.getItem('kokarte_admin_logado');
    const loginTime = sessionStorage.getItem('kokarte_admin_login_time');
    
    if (logado === 'true' && loginTime) {
        const tempoDecorrido = (Date.now() - parseInt(loginTime)) / 60000;
        
        if (tempoDecorrido > TEMPO_SESSAO) {
            fazerLogout();
            alert('⏰ A sua sessão expirou por inatividade.');
            return false;
        }
        
        sessionStorage.setItem('kokarte_admin_login_time', Date.now().toString());
        return true;
    }
    
    return false;
}

// ============================================================
// 5. LOGOUT
// ============================================================
function fazerLogout() {
    sessionStorage.removeItem('kokarte_admin_logado');
    sessionStorage.removeItem('kokarte_admin_login_time');
    
    document.getElementById('sec-login').classList.remove('hidden');
    document.getElementById('painel-admin').classList.add('hidden');
    
    const input = document.getElementById('input-senha');
    if (input) {
        input.value = '';
        input.disabled = false;
        input.placeholder = 'Digite a palavra-passe...';
    }
    
    tentativas = 0;
    bloqueioAte = null;
    
    const msg = document.getElementById('bloqueio-mensagem');
    if (msg) msg.classList.add('hidden');
    
    document.getElementById('tentativas-restantes').classList.add('hidden');
    atualizarContadorTentativas();
}

// ============================================================
// 6. MOSTRAR PAINEL
// ============================================================
function mostrarPainel() {
    document.getElementById('sec-login').classList.add('hidden');
    document.getElementById('painel-admin').classList.remove('hidden');
    carregarEventosAdmin();
    carregarServicosAdmin();
}

// ============================================================
// 7. MUDAR TAB
// ============================================================
function mudarTab(tabId) {
    // Esconde todas as tabs
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Remove active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Mostra a tab selecionada
    document.getElementById(tabId).classList.add('active');
    
    // Ativa o botão correspondente
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

// ============================================================
// 8. INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    if (verificarSessao()) {
        mostrarPainel();
    }
    
    configurarUploadDeImagem('evento');
    configurarUploadDeImagem('servico');
    atualizarContadorTentativas();
    
    if (bloqueioAte && Date.now() < bloqueioAte) {
        const minutosRestantes = Math.ceil((bloqueioAte - Date.now()) / 60000);
        const msg = document.getElementById('bloqueio-mensagem');
        if (msg) {
            msg.classList.remove('hidden');
            msg.innerHTML = `⚠️ Acesso bloqueado. Aguarde ${minutosRestantes} minuto(s).`;
        }
        const input = document.getElementById('input-senha');
        if (input) {
            input.disabled = true;
            input.placeholder = '🔒 Acesso bloqueado...';
        }
        
        setTimeout(() => {
            if (input) {
                input.disabled = false;
                input.placeholder = 'Digite a palavra-passe...';
            }
            bloqueioAte = null;
            tentativas = 0;
            const msg2 = document.getElementById('bloqueio-mensagem');
            if (msg2) msg2.classList.add('hidden');
            atualizarContadorTentativas();
        }, TEMPO_BLOQUEIO * 60 * 1000);
    }
    
    setInterval(() => {
        if (document.getElementById('painel-admin').classList.contains('hidden')) return;
        if (!verificarSessao()) {
            alert('⏰ Sessão expirada. Faça login novamente.');
            fazerLogout();
        }
    }, 60000);
});

// ============================================================
// 9. CONFIGURAR UPLOAD DE IMAGEM (genérico)
// ============================================================
function configurarUploadDeImagem(prefixo) {
    const inputImagem = document.getElementById(`${prefixo}-imagem`);
    const previewImg = document.getElementById(`${prefixo}-imagem-preview`);
    const previewContainer = document.getElementById(`${prefixo}-imagem-preview-container`);
    const inputBase64 = document.getElementById(`${prefixo}-imagem-base64`);

    if (!inputImagem) return;

    inputImagem.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) {
            previewContainer.classList.add('hidden');
            inputBase64.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
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
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const base64String = canvas.toDataURL('image/jpeg', 0.7);
                inputBase64.value = base64String;
                previewImg.src = base64String;
                previewContainer.classList.remove('hidden');
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    });
}

// ============================================================
// ============================================================
// 🗂️ GESTÃO DE EVENTOS
// ============================================================
// ============================================================

function lerEventos() {
    try {
        const dados = localStorage.getItem('kokarte_eventos');
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        return [];
    }
}

function guardarEventos(eventos) {
    localStorage.setItem('kokarte_eventos', JSON.stringify(eventos));
}

function guardarEvento(e) {
    e.preventDefault();
    
    let eventos = lerEventos();
    const idInput = document.getElementById('evento-id').value;
    
    const novoEvento = {
        id: idInput ? parseInt(idInput) : Date.now(),
        titulo: document.getElementById('evento-titulo').value,
        data: document.getElementById('evento-data').value,
        local: document.getElementById('evento-local').value,
        descricaoBreve: document.getElementById('evento-descricao-breve').value,
        descricaoCompleta: document.getElementById('evento-descricao-completa').value,
        imagem: document.getElementById('evento-imagem-base64').value,
        ativo: document.getElementById('evento-ativo').checked
    };

    if (idInput) {
        eventos = eventos.map(evt => evt.id === novoEvento.id ? novoEvento : evt);
    } else {
        eventos.push(novoEvento);
    }

    try {
        guardarEventos(eventos);
        limparFormularioEvento();
        carregarEventosAdmin();
        
        const btnSubmit = document.querySelector('#form-evento button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '✅ Guardado!';
        btnSubmit.classList.add('bg-green-600');
        setTimeout(() => {
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.classList.remove('bg-green-600');
        }, 2000);
    } catch (err) {
        alert('❌ Ocorreu um erro ao guardar o evento.');
    }
}

function limparFormularioEvento() {
    document.getElementById('form-evento').reset();
    document.getElementById('evento-id').value = '';
    document.getElementById('evento-imagem-base64').value = '';
    document.getElementById('evento-imagem-preview-container').classList.add('hidden');
    document.getElementById('evento-imagem-preview').src = '';
    document.getElementById('form-titulo-evento').innerHTML = '✨ Adicionar Novo Evento';
}

function carregarEventosAdmin() {
    const container = document.getElementById('tabela-eventos');
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

    container.innerHTML = '';
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

function toggleEvento(id) {
    let eventos = lerEventos();
    const evtIndex = eventos.findIndex(e => e.id === id);
    
    if (evtIndex !== -1) {
        eventos[evtIndex].ativo = !eventos[evtIndex].ativo;
        guardarEventos(eventos);
        carregarEventosAdmin();
    }
}

function editarEvento(id) {
    const eventos = lerEventos();
    const evt = eventos.find(e => e.id === id);
    if (!evt) return;

    document.getElementById('evento-id').value = evt.id;
    document.getElementById('evento-titulo').value = evt.titulo || '';
    document.getElementById('evento-data').value = evt.data || '';
    document.getElementById('evento-local').value = evt.local || '';
    document.getElementById('evento-descricao-breve').value = evt.descricaoBreve || evt.descricao || '';
    document.getElementById('evento-descricao-completa').value = evt.descricaoCompleta || evt.descricao || '';
    document.getElementById('evento-ativo').checked = evt.ativo;

    const inputBase64 = document.getElementById('evento-imagem-base64');
    const previewContainer = document.getElementById('evento-imagem-preview-container');
    const previewImg = document.getElementById('evento-imagem-preview');

    if (evt.imagem) {
        inputBase64.value = evt.imagem;
        previewImg.src = evt.imagem;
        previewContainer.classList.remove('hidden');
    } else {
        inputBase64.value = '';
        previewImg.src = '';
        previewContainer.classList.add('hidden');
    }
    
    document.getElementById('evento-imagem').value = '';
    document.getElementById('form-titulo-evento').innerHTML = '✏️ A Editar Evento...';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function apagarEvento(id) {
    if (confirm('⚠️ Tens a certeza que queres apagar permanentemente este evento?')) {
        let eventos = lerEventos();
        eventos = eventos.filter(evt => evt.id !== id);
        guardarEventos(eventos);
        
        if (document.getElementById('evento-id').value == id) {
            limparFormularioEvento();
        }
        
        carregarEventosAdmin();
    }
}

// ============================================================
// ============================================================
// 🗂️ GESTÃO DE SERVIÇOS
// ============================================================
// ============================================================

// ----- DADOS INICIAIS (fallback) -----
const SERVICOS_INICIAIS = [
    {
        id: 1001,
        titulo: "Consulta de Mapeamento Energético",
        duracao: "60 minutos",
        valor: "45.000 Kz",
        descricaoBreve: "A Consulta de Mapeamento Energético é o primeiro passo para compreender o seu estado energético e identificar os bloqueios que podem estar a influenciar diferentes áreas da sua vida.",
        descricaoCompleta: "A Consulta de Mapeamento Energético é o primeiro passo para compreender o seu estado energético e identificar os bloqueios que podem estar a influenciar diferentes áreas da sua vida.\n\nIntegra uma leitura do perfil energético, emocional, numerológico e kármico, com o objetivo de identificar padrões, bloqueios e desafios, compreender o momento atual de vida e trazer maior clareza sobre o propósito de vida.\n\nEsta análise cruza essas informações com uma avaliação energética realizada através da radiestesia. A consulta pode ser complementada com a Limpeza e Harmonização Energética para um trabalho mais profundo.",
        imagem: "",
        ativo: true
    },
    {
        id: 1002,
        titulo: "Reiki Tibetano",
        duracao: "60 min",
        valor: "59.000 Kz",
        descricaoBreve: "O Reiki Tibetano é uma terapia energética que promove o equilíbrio do campo energético, favorecendo o relaxamento profundo, a libertação de tensões e o restabelecimento da harmonia entre corpo, mente e emoções.",
        descricaoCompleta: "O Reiki Tibetano é uma terapia energética que promove o equilíbrio do campo energético, favorecendo o relaxamento profundo, a libertação de tensões e o restabelecimento da harmonia entre corpo, mente e emoções.\n\nCada sessão é adaptada às necessidades e ao momento de vida de cada pessoa, permitindo um trabalho personalizado de reequilíbrio energético, bem-estar e desenvolvimento pessoal.\n\nOferecemos duas modalidades: Sessão Completa (indicada para quem inicia o processo) e Sessão de Manutenção (para acompanhamento regular).",
        imagem: "",
        ativo: true
    },
    {
        id: 1003,
        titulo: "Programa de Transformação Pessoal",
        duracao: "60-90 min/sessão",
        valor: "150.000 Kz (pack 3)",
        descricaoBreve: "O Programa de Transformação Pessoal é um acompanhamento individual e personalizado, criado para quem pretende transformar padrões repetitivos, crenças limitantes e bloqueios identificados.",
        descricaoCompleta: "O Programa de Transformação Pessoal é um acompanhamento individual e personalizado, criado para quem pretende transformar padrões repetitivos, crenças limitantes e bloqueios identificados.\n\nO programa inicia-se com um pack de 3 sessões, onde trabalhamos reprogramação mental, gestão emocional, inteligência emocional e definição de metas. É um processo focado na mudança consistente e sustentável para uma vida com mais propósito.",
        imagem: "",
        ativo: true
    },
    {
        id: 1004,
        titulo: "Massagem Bioenergética com Cristais",
        duracao: "60 min",
        valor: "38.000 Kz",
        descricaoBreve: "A Massagem Bioenergética combina técnicas de massagem terapêutica com trabalho energético e cristais, proporcionando um profundo estado de relaxamento e reequilíbrio da energia vital.",
        descricaoCompleta: "A Massagem Bioenergética combina técnicas de massagem terapêutica com trabalho energético e cristais, proporcionando um profundo estado de relaxamento e reequilíbrio da energia vital.\n\nCada sessão integra aromaterapia e a aplicação personalizada de cristais, restaurando o fluxo energético e favorecendo uma sensação imediata de leveza, tranquilidade e renovação profunda.",
        imagem: "",
        ativo: true
    },
    {
        id: 1005,
        titulo: "RESET by KOKARTE",
        duracao: "Grupo",
        valor: "8.500 Kz",
        descricaoBreve: "O RESET by KOKARTE é uma experiência de reconexão consigo mesmo, criada para desacelerar, libertar a tensão acumulada e restaurar o equilíbrio.",
        descricaoCompleta: "O RESET by KOKARTE é uma experiência de reconexão consigo mesmo, criada para desacelerar, libertar a tensão acumulada e restaurar o equilíbrio.\n\nSessão focada em respiração, meditação guiada, visualização e alongamentos suaves. Um momento de pausa consciente para renovação interior.",
        imagem: "",
        ativo: true
    }
];

function lerServicos() {
    try {
        const dados = localStorage.getItem('kokarte_servicos');
        if (dados) {
            return JSON.parse(dados);
        } else {
            // Se não houver dados, guarda os serviços iniciais
            guardarServicos(SERVICOS_INICIAIS);
            return SERVICOS_INICIAIS;
        }
    } catch (e) {
        return SERVICOS_INICIAIS;
    }
}

function guardarServicos(servicos) {
    localStorage.setItem('kokarte_servicos', JSON.stringify(servicos));
}

function guardarServico(e) {
    e.preventDefault();
    
    let servicos = lerServicos();
    const idInput = document.getElementById('servico-id').value;
    
    const novoServico = {
        id: idInput ? parseInt(idInput) : Date.now(),
        titulo: document.getElementById('servico-titulo').value,
        duracao: document.getElementById('servico-duracao').value,
        valor: document.getElementById('servico-valor').value,
        descricaoBreve: document.getElementById('servico-descricao-breve').value,
        descricaoCompleta: document.getElementById('servico-descricao-completa').value,
        imagem: document.getElementById('servico-imagem-base64').value,
        ativo: document.getElementById('servico-ativo').checked
    };

    if (idInput) {
        servicos = servicos.map(s => s.id === novoServico.id ? novoServico : s);
    } else {
        servicos.push(novoServico);
    }

    try {
        guardarServicos(servicos);
        limparFormularioServico();
        carregarServicosAdmin();
        
        const btnSubmit = document.querySelector('#form-servico button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '✅ Guardado!';
        btnSubmit.classList.add('bg-green-600');
        setTimeout(() => {
            btnSubmit.innerHTML = textoOriginal;
            btnSubmit.classList.remove('bg-green-600');
        }, 2000);
    } catch (err) {
        alert('❌ Ocorreu um erro ao guardar o serviço.');
    }
}

function limparFormularioServico() {
    document.getElementById('form-servico').reset();
    document.getElementById('servico-id').value = '';
    document.getElementById('servico-imagem-base64').value = '';
    document.getElementById('servico-imagem-preview-container').classList.add('hidden');
    document.getElementById('servico-imagem-preview').src = '';
    document.getElementById('form-titulo-servico').innerHTML = '✨ Adicionar Novo Serviço';
}

function carregarServicosAdmin() {
    const container = document.getElementById('tabela-servicos');
    if (!container) return;
    
    const servicos = lerServicos();

    if (servicos.length === 0) {
        container.innerHTML = `
            <div class="bg-kokarteBg/50 border border-emerald-900/50 p-6 rounded-xl text-center">
                <p class="text-emerald-200/50 text-sm">Nenhum serviço na base de dados.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    servicos.reverse().forEach(s => {
        container.innerHTML += `
            <div class="bg-kokarteBg border ${s.ativo ? 'border-kokarteGold/40' : 'border-red-900/50 opacity-70'} p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
                <div class="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                    ${s.imagem 
                        ? `<img src="${s.imagem}" class="w-16 h-16 rounded-lg object-cover border border-kokarteGold/20 shrink-0">` 
                        : `<div class="w-16 h-16 rounded-lg bg-kokarteCard border border-emerald-900 flex flex-col items-center justify-center text-[10px] text-emerald-600 shrink-0"><span>Sem</span><span>Foto</span></div>`
                    }
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-white truncate text-sm">${s.titulo}</h3>
                        <p class="text-xs text-kokarteGold mt-0.5">${s.duracao} · ${s.valor}</p>
                        ${!s.ativo ? '<span class="inline-block mt-1 bg-red-950 text-red-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Oculto no Portal</span>' : '<span class="inline-block mt-1 bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Visível</span>'}
                    </div>
                </div>
                <div class="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button type="button" onclick="toggleServico(${s.id})" class="${s.ativo ? 'bg-amber-950/40 text-amber-300' : 'bg-emerald-950/40 text-emerald-300'} text-xs px-4 py-2.5 rounded-lg transition-colors border border-amber-900/30">
                        ${s.ativo ? 'Ocultar' : 'Ativar'}
                    </button>
                    <button type="button" onclick="editarServico(${s.id})" class="bg-kokarteCard hover:bg-kokarteGold hover:text-kokarteBg text-kokarteGold text-xs px-4 py-2.5 rounded-lg transition-colors border border-kokarteGold/30">
                        Editar
                    </button>
                    <button type="button" onclick="apagarServico(${s.id})" class="bg-red-950/40 hover:bg-red-600 text-red-200 hover:text-white text-xs px-4 py-2.5 rounded-lg transition-colors border border-red-900/50">
                        Apagar
                    </button>
                </div>
            </div>
        `;
    });
}

function toggleServico(id) {
    let servicos = lerServicos();
    const sIndex = servicos.findIndex(s => s.id === id);
    
    if (sIndex !== -1) {
        servicos[sIndex].ativo = !servicos[sIndex].ativo;
        guardarServicos(servicos);
        carregarServicosAdmin();
    }
}

function editarServico(id) {
    const servicos = lerServicos();
    const s = servicos.find(serv => serv.id === id);
    if (!s) return;

    document.getElementById('servico-id').value = s.id;
    document.getElementById('servico-titulo').value = s.titulo || '';
    document.getElementById('servico-duracao').value = s.duracao || '';
    document.getElementById('servico-valor').value = s.valor || '';
    document.getElementById('servico-descricao-breve').value = s.descricaoBreve || '';
    document.getElementById('servico-descricao-completa').value = s.descricaoCompleta || '';
    document.getElementById('servico-ativo').checked = s.ativo;

    const inputBase64 = document.getElementById('servico-imagem-base64');
    const previewContainer = document.getElementById('servico-imagem-preview-container');
    const previewImg = document.getElementById('servico-imagem-preview');

    if (s.imagem) {
        inputBase64.value = s.imagem;
        previewImg.src = s.imagem;
        previewContainer.classList.remove('hidden');
    } else {
        inputBase64.value = '';
        previewImg.src = '';
        previewContainer.classList.add('hidden');
    }
    
    document.getElementById('servico-imagem').value = '';
    document.getElementById('form-titulo-servico').innerHTML = '✏️ A Editar Serviço...';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function apagarServico(id) {
    if (confirm('⚠️ Tens a certeza que queres apagar permanentemente este serviço?')) {
        let servicos = lerServicos();
        servicos = servicos.filter(s => s.id !== id);
        guardarServicos(servicos);
        
        if (document.getElementById('servico-id').value == id) {
            limparFormularioServico();
        }
        
        carregarServicosAdmin();
    }
}

// ============================================================
// EXPOR FUNÇÕES GLOBALMENTE
// ============================================================
window.fazerLogin = fazerLogin;
window.fazerLogout = fazerLogout;
window.mudarTab = mudarTab;

// Eventos
window.guardarEvento = guardarEvento;
window.limparFormularioEvento = limparFormularioEvento;
window.carregarEventosAdmin = carregarEventosAdmin;
window.toggleEvento = toggleEvento;
window.editarEvento = editarEvento;
window.apagarEvento = apagarEvento;

// Serviços
window.guardarServico = guardarServico;
window.limparFormularioServico = limparFormularioServico;
window.carregarServicosAdmin = carregarServicosAdmin;
window.toggleServico = toggleServico;
window.editarServico = editarServico;
window.apagarServico = apagarServico;