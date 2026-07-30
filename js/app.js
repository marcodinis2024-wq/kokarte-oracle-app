// 📱 Define aqui o número do WhatsApp da loja (apenas dígitos com indicativo, ex: "244936676628" ou "351912345678")
const NUMERO_WHATSAPP = "244936676628"; 

// 🚀 EXECUTAR ASSIM QUE A PÁGINA CARREGA
document.addEventListener("DOMContentLoaded", () => {
    carregarOraculo();
    carregarEnergiaDoMes();
    carregarEventosIniciais();
});

// 1. Lógica do Oráculo
function carregarOraculo() {
    const textoElemento = document.getElementById("oraculo-texto");
    if (!textoElemento || typeof ORACULO_MENSAGENS === 'undefined') return;

    const indiceAleatorio = Math.floor(Math.random() * ORACULO_MENSAGENS.length);
    
    textoElemento.style.opacity = "0";
    setTimeout(() => {
        textoElemento.innerText = `"${ORACULO_MENSAGENS[indiceAleatorio]}"`;
        textoElemento.style.opacity = "1";
    }, 250);
}

function tirarNovaMensagem() {
    carregarOraculo();
}

// 2. Lógica da Energia do Mês Automática
function carregarEnergiaDoMes() {
    if (typeof ENERGIAS_MESES === 'undefined') return;

    const mesAtual = new Date().getMonth(); // 0 = Janeiro, 11 = Dezembro
    const dadosMes = ENERGIAS_MESES[mesAtual];

    if (dadosMes) {
        if(document.getElementById("energia-mes-titulo")) document.getElementById("energia-mes-titulo").innerText = dadosMes.mes || dadosMes.titulo;
        if(document.getElementById("energia-cristal")) document.getElementById("energia-cristal").innerText = dadosMes.cristal;
        if(document.getElementById("energia-beneficios")) document.getElementById("energia-beneficios").innerText = dadosMes.beneficios;
        if(document.getElementById("energia-cuidados")) document.getElementById("energia-cuidados").innerText = dadosMes.cuidados;
        if(document.getElementById("energia-afirmacao")) document.getElementById("energia-afirmacao").innerText = dadosMes.afirmacao;
    }
}

// 3. Lógica de Redirecionamento para o WhatsApp
function agendarWhatsApp(nomeItem) {
    const mensagem = `Olá! Gostaria de agendar/reservar lugar para: *${nomeItem}*.`;
    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, "_blank");
}

// 4. Carregar Eventos Ativos Guardados no Admin (Com Suporte a Imagem e Tipografia Otimizada)
function carregarEventosIniciais() {
    const container = document.getElementById("lista-eventos");
    if (!container) return;
    
    // Procura os eventos guardados no LocalStorage
    const dadosLocais = localStorage.getItem("kokarte_eventos");
    const eventos = dadosLocais ? JSON.parse(dadosLocais) : [
        {
            id: 1,
            titulo: "Workshop de Cristais de Proteção",
            data: "15 de Setembro, 18:30",
            local: "Loja KOKARTE",
            descricao: "Aprende a limpar e programar as tuas pedras.",
            ativo: true,
            imagem: ""
        }
    ];

    const eventosAtivos = eventos.filter(evt => evt.ativo);

    if (eventosAtivos.length === 0) {
        container.innerHTML = `
            <div class="bg-kokarteCard/90 p-6 rounded-2xl border border-emerald-800/40 text-center glass-card">
                <p class="text-xs sm:text-sm text-emerald-200/70">Não há eventos agendados de momento. Fica atento às nossas redes sociais!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    eventosAtivos.forEach(evt => {
        container.innerHTML += `
            <div class="bg-kokarteCard/90 rounded-2xl border border-emerald-800/50 overflow-hidden glass-card space-y-0" data-aos="fade-up">
                
                <!-- Foto do Evento (Se existir carregada do telemóvel) -->
                ${evt.imagem ? `
                    <div class="w-full h-48 sm:h-56 overflow-hidden relative">
                        <img src="${evt.imagem}" alt="${evt.titulo}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-kokarteCard via-transparent to-transparent"></div>
                    </div>
                ` : ''}

                <!-- Conteúdo com espaçamento e texto legível -->
                <div class="p-6 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-kokarteGold font-semibold border-b border-kokarteGold/20 pb-2.5">
                        <span>📅 ${evt.data}</span>
                        <span>📍 ${evt.local}</span>
                    </div>

                    <div class="space-y-1">
                        <h3 class="font-bold text-white text-base sm:text-lg">${evt.titulo}</h3>
                        ${evt.descricao ? `<p class="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">${evt.descricao}</p>` : ''}
                    </div>

                    <div class="pt-2">
                        <button onclick="agendarWhatsApp('Evento: ${evt.titulo}')" class="w-full text-center bg-kokarteGold/20 border border-kokarteGold text-kokarteGold hover:bg-kokarteGold hover:text-kokarteBg text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.02]">
                            Garantir Vaga no Evento
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    // Atualiza o AOS (animações de scroll) para os elementos dinâmicos
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}