// 📱 Define aqui o número do WhatsApp da loja (apenas dígitos com indicativo, ex: "244936676628" ou "351912345678")
const NUMERO_WHATSAPP = "244936676628"; 

// 🚀 EXECUTAR ASSIM QUE A PÁGINA CARREGA
document.addEventListener("DOMContentLoaded", () => {
    carregarOraculo();
    carregarEnergiaDoMes();
    carregarEventosIniciais();
});

// ============================================================
// ORÁCULO KOKARTE — CARTA PREMIUM (VERSÃO COMPLETA)
// ============================================================

let estadoCarta = 'fechada'; // 'fechada' | 'abrindo' | 'aberta' | 'fechando'
let mensagemAtual = '';
let podeAbrir = true; // Impede múltiplos cliques durante animações

// Elementos DOM
const oraculoContainer = document.getElementById('oraculo-container');
const envelopeEstado = document.getElementById('envelope-estado');
const cartaoEstado = document.getElementById('cartao-estado');
const envelope = document.getElementById('envelope');
const envelopeFlap = document.getElementById('envelope-flap');
const envelopeSeal = document.getElementById('envelope-seal');
const carta = document.getElementById('carta');
const cartaConteudo = document.getElementById('carta-conteudo');
const oraculoTexto = document.getElementById('oraculo-texto');
const legenda = document.getElementById('envelope-legenda');
const sublegenda = document.getElementById('envelope-sublegenda');
const particulasContainer = document.getElementById('particulas-container');

// ============================================================
// 1. CARREGAR MENSAGEM INICIAL
// ============================================================
function carregarOraculo() {
    // Escolhe uma mensagem aleatória
    const indice = Math.floor(Math.random() * ORACULO_MENSAGENS.length);
    mensagemAtual = ORACULO_MENSAGENS[indice];
    
    // Coloca a mensagem na carta (escondida)
    cartaConteudo.innerText = `"${mensagemAtual}"`;
    
    // Coloca a mensagem no cartão (para quando abrir)
    oraculoTexto.innerText = `"${mensagemAtual}"`;
    
    // Estado inicial: envelope fechado
    estadoCarta = 'fechada';
    podeAbrir = true;
    envelopeEstado.classList.remove('hidden');
    cartaoEstado.classList.add('hidden');
    envelopeSeal.classList.remove('broken');
    envelopeFlap.style.transform = 'rotateX(0deg)';
    carta.classList.remove('open');
    legenda.style.opacity = '1';
    sublegenda.style.opacity = '1';
    envelope.style.opacity = '1';
    envelope.style.transform = 'scale(1)';
    
    // Remove partículas antigas
    particulasContainer.innerHTML = '';
    
    // Reativa o selo
    envelopeSeal.style.pointerEvents = 'auto';
}

// ============================================================
// 2. ABRIR CARTA (acionado pelo clique no selo)
// ============================================================
function abrirCarta() {
    // Verifica se pode abrir
    if (estadoCarta !== 'fechada' || !podeAbrir) return;
    
    estadoCarta = 'abrindo';
    podeAbrir = false;
    
    // Desativa o selo para evitar múltiplos cliques
    envelopeSeal.style.pointerEvents = 'none';
    
    // Passo 1: Selo parte (com pequeno delay para dar ênfase)
    envelopeSeal.classList.add('broken');
    
    // Passo 2: Aba abre (0.3s)
    setTimeout(() => {
        envelopeFlap.style.transform = 'rotateX(-180deg)';
        envelopeFlap.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 250);
    
    // Passo 3: Carta sobe (0.5s)
    setTimeout(() => {
        carta.classList.add('open');
    }, 550);
    
    // Passo 4: Partículas douradas (0.8s)
    setTimeout(() => {
        criarParticulas();
    }, 850);
    
    // Passo 5: Envelope desvanece (1.2s)
    setTimeout(() => {
        envelope.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        envelope.style.opacity = '0';
        envelope.style.transform = 'scale(0.92)';
        legenda.style.transition = 'opacity 0.4s ease';
        legenda.style.opacity = '0';
        sublegenda.style.transition = 'opacity 0.4s ease';
        sublegenda.style.opacity = '0';
    }, 1250);
    
    // Passo 6: Mostra o cartão (1.6s)
    setTimeout(() => {
        envelopeEstado.classList.add('hidden');
        cartaoEstado.classList.remove('hidden');
        estadoCarta = 'aberta';
        podeAbrir = true;
        envelopeSeal.style.pointerEvents = 'auto';
        
        // Atualiza AOS se disponível
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 1700);
}

// ============================================================
// 3. FECHAR CARTA E MOSTRAR ENVELOPE FECHADO
// ============================================================
function fecharCarta() {
    if (estadoCarta !== 'aberta' || !podeAbrir) return;
    
    estadoCarta = 'fechando';
    podeAbrir = false;
    
    // Passo 1: Esconde o cartão
    cartaoEstado.classList.add('hidden');
    
    // Passo 2: Mostra o envelope (com fade-in)
    envelopeEstado.classList.remove('hidden');
    
    // Pequeno delay para o envelope aparecer
    setTimeout(() => {
        // Reset do envelope
        envelope.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        envelope.style.opacity = '1';
        envelope.style.transform = 'scale(1)';
        legenda.style.transition = 'opacity 0.5s ease';
        legenda.style.opacity = '1';
        sublegenda.style.transition = 'opacity 0.5s ease';
        sublegenda.style.opacity = '1';
        
        // Carta desce
        carta.classList.remove('open');
        
        // Aba fecha
        envelopeFlap.style.transform = 'rotateX(0deg)';
        envelopeFlap.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // Selo restaurado (sem efeito de partido)
        envelopeSeal.classList.remove('broken');
        envelopeSeal.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // Remove partículas antigas
        particulasContainer.innerHTML = '';
        
        // Reativa o selo para o utilizador clicar novamente
        envelopeSeal.style.pointerEvents = 'auto';
        
        // Volta ao estado fechado
        estadoCarta = 'fechada';
        podeAbrir = true;
        
    }, 300);
}

// ============================================================
// 4. RECEBER NOVA MENSAGEM (com envelope completo)
// ============================================================
function tirarNovaMensagem() {
    // Se já estiver a animar, ignora
    if (estadoCarta === 'abrindo' || estadoCarta === 'fechando') return;
    
    // Se estiver aberta, fecha primeiro
    if (estadoCarta === 'aberta') {
        // Primeiro: fecha a carta atual
        fecharCarta();
        
        // Depois de fechar, espera um momento e prepara nova mensagem
        // O utilizador terá que clicar no selo para abrir
        setTimeout(() => {
            // Escolhe nova mensagem
            const indice = Math.floor(Math.random() * ORACULO_MENSAGENS.length);
            mensagemAtual = ORACULO_MENSAGENS[indice];
            
            // Atualiza o conteúdo da carta e do cartão
            cartaConteudo.innerText = `"${mensagemAtual}"`;
            oraculoTexto.innerText = `"${mensagemAtual}"`;
            
            // Pequena atualização visual para mostrar que é uma carta nova
            // O envelope já está fechado e visível, pronto para ser aberto
        }, 500);
        
        return;
    }
    
    // Se estiver fechada, apenas atualiza a mensagem e mostra o envelope
    if (estadoCarta === 'fechada') {
        // Escolhe nova mensagem
        const indice = Math.floor(Math.random() * ORACULO_MENSAGENS.length);
        mensagemAtual = ORACULO_MENSAGENS[indice];
        
        // Atualiza o conteúdo da carta e do cartão
        cartaConteudo.innerText = `"${mensagemAtual}"`;
        oraculoTexto.innerText = `"${mensagemAtual}"`;
        
        // Garante que o envelope está visível e fechado
        envelopeEstado.classList.remove('hidden');
        cartaoEstado.classList.add('hidden');
        envelope.style.opacity = '1';
        envelope.style.transform = 'scale(1)';
        legenda.style.opacity = '1';
        sublegenda.style.opacity = '1';
        carta.classList.remove('open');
        envelopeFlap.style.transform = 'rotateX(0deg)';
        envelopeSeal.classList.remove('broken');
        envelopeSeal.style.pointerEvents = 'auto';
        particulasContainer.innerHTML = '';
        estadoCarta = 'fechada';
        podeAbrir = true;
    }
}

// ============================================================
// 5. CRIAR PARTÍCULAS DOURADAS
// ============================================================
function criarParticulas() {
    const container = particulasContainer;
    const numParticulas = 22;
    
    for (let i = 0; i < numParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'particle';
        
        // Posição aleatória ao redor do envelope
        const angle = Math.random() * 2 * Math.PI;
        const distance = 60 + Math.random() * 140;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 40;
        
        particula.style.setProperty('--tx', tx + 'px');
        particula.style.setProperty('--ty', ty + 'px');
        particula.style.left = '50%';
        particula.style.top = '50%';
        particula.style.width = (3 + Math.random() * 7) + 'px';
        particula.style.height = particula.style.width;
        particula.style.animationDelay = (Math.random() * 0.4) + 's';
        particula.style.background = `radial-gradient(circle, ${Math.random() > 0.5 ? '#f0d080' : '#c9a035'}, #b8952E)`;
        
        container.appendChild(particula);
        
        // Remove após a animação
        setTimeout(() => {
            particula.remove();
        }, 2200 + (Math.random() * 500));
    }
}

// ============================================================
// 6. INICIALIZAR
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    carregarOraculo();
});

// Expor funções globalmente
window.abrirCarta = abrirCarta;
window.tirarNovaMensagem = tirarNovaMensagem;
window.carregarOraculo = carregarOraculo;

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
    
    // Procura os eventos guardados no LocalStorage com proteção contra erros
    let eventos = [];

try {
    const dadosLocais = localStorage.getItem("kokarte_eventos");
    eventos = dadosLocais ? JSON.parse(dadosLocais) : [];
} catch (e) {
    console.error("Erro ao ler eventos do LocalStorage:", e);
    eventos = [];
}

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
        // Garantir compatibilidade com eventos antigos que só tinham "descricao"
        const textoBreve = evt.descricaoBreve || evt.descricao || "";

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
                        ${textoBreve ? `<p class="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">${textoBreve}</p>` : ''}
                    </div>

                    <div class="pt-2">
                        <!-- Botão para redirecionar para a página detalhada -->
                        <a href="eventos.html" class="block w-full text-center bg-kokarteGold/20 border border-kokarteGold text-kokarteGold hover:bg-kokarteGold hover:text-kokarteBg text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.02]">
                            Saber Mais
                        </a>
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

// 5. Lógica de Partilha do Oráculo (Gerar Imagem com fundo.jpeg)
async function partilharMensagem() {
    const oraculoTextoAtual = document.getElementById("oraculo-texto").innerText;
    const textoPartilhaElemento = document.getElementById("texto-partilha");
    const cartaoPartilha = document.getElementById("cartao-partilha");
    const btnPartilhar = document.getElementById("btn-partilhar");
    
    if (!oraculoTextoAtual || !cartaoPartilha) return;

    // Coloca a frase atual no cartão invisível
    textoPartilhaElemento.innerText = oraculoTextoAtual;
    
    // Altera o estado do botão para avisar que está a carregar
    const textoOriginalBotao = btnPartilhar.innerHTML;
    btnPartilhar.innerHTML = "A gerar carta... ✨";
    btnPartilhar.disabled = true;

    try {
        // Tira o "print" ao elemento escondido usando a biblioteca html2canvas
        const canvas = await html2canvas(cartaoPartilha, {
            scale: 1, // Escala 1 é suficiente pois já está em 1080x1920
            useCORS: true, // Permite carregar a imagem de fundo localmente
            backgroundColor: null // Fundo transparente para captar o jpeg de fundo
        });

        // Converte o canvas para Blob (ficheiro bruto) para podermos partilhar
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "kokarte-oraculo.png", { type: "image/png" });

            // Verifica se o dispositivo suporta a Web Share API (normalmente Telemóveis)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'A minha mensagem do Oráculo KOKARTE',
                        text: 'Vê o conselho que recebi hoje no portal da KOKARTE! ✨',
                        files: [file]
                    });
                    
                    // Restaura o botão ao estado normal
                    btnPartilhar.innerHTML = textoOriginalBotao;
                    btnPartilhar.disabled = false;
                } catch (error) {
                    console.log("O utilizador cancelou a partilha ou ocorreu um erro ligeiro.");
                    btnPartilhar.innerHTML = textoOriginalBotao;
                    btnPartilhar.disabled = false;
                }
            } else {
                // Fallback para PC ou telemóveis antigos: Descarregar a imagem automaticamente
                const link = document.createElement("a");
                link.download = "kokarte-oraculo.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
                
                // Em vez de usar alert(), damos feedback no próprio botão (mais moderno e bonito)
                btnPartilhar.innerHTML = "Guardado com Sucesso! ✅";
                setTimeout(() => {
                    btnPartilhar.innerHTML = textoOriginalBotao;
                    btnPartilhar.disabled = false;
                }, 3500);
            }
        }, 'image/png');

    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        
        btnPartilhar.innerHTML = "Falha ao Gerar ❌";
        setTimeout(() => {
            btnPartilhar.innerHTML = textoOriginalBotao;
            btnPartilhar.disabled = false;
        }, 3000);
    }
}
// ============================================================
// CARREGAR SERVIÇOS NO INDEX (apenas descrição breve)
// ============================================================
function carregarServicosIndex() {
    const container = document.getElementById('lista-servicos-index');
    if (!container) return;
    
    let servicos = [];
    try {
        const dados = localStorage.getItem('kokarte_servicos');
        if (dados) {
            servicos = JSON.parse(dados);
        }
    } catch (e) {
        console.error('Erro ao ler serviços:', e);
    }
    
    // Fallback: serviços iniciais (caso não haja dados)
    if (servicos.length === 0) {
        servicos = [
            {
                id: 1001,
                titulo: "Consulta de Mapeamento Energético",
                duracao: "60 minutos",
                valor: "45.000 Kz",
                descricaoBreve: "A Consulta de Mapeamento Energético é o primeiro passo para compreender o seu estado energético e identificar os bloqueios que podem estar a influenciar diferentes áreas da sua vida.",
                descricaoCompleta: "",
                imagem: "",
                ativo: true
            },
            {
                id: 1002,
                titulo: "Reiki Tibetano",
                duracao: "60 min",
                valor: "59.000 Kz",
                descricaoBreve: "O Reiki Tibetano é uma terapia energética que promove o equilíbrio do campo energético, favorecendo o relaxamento profundo, a libertação de tensões e o restabelecimento da harmonia entre corpo, mente e emoções.",
                descricaoCompleta: "",
                imagem: "",
                ativo: true
            },
            {
                id: 1003,
                titulo: "Programa de Transformação Pessoal",
                duracao: "60-90 min/sessão",
                valor: "150.000 Kz (pack 3)",
                descricaoBreve: "O Programa de Transformação Pessoal é um acompanhamento individual e personalizado, criado para quem pretende transformar padrões repetitivos, crenças limitantes e bloqueios identificados.",
                descricaoCompleta: "",
                imagem: "",
                ativo: true
            },
            {
                id: 1004,
                titulo: "Massagem Bioenergética com Cristais",
                duracao: "60 min",
                valor: "38.000 Kz",
                descricaoBreve: "A Massagem Bioenergética combina técnicas de massagem terapêutica com trabalho energético e cristais, proporcionando um profundo estado de relaxamento e reequilíbrio da energia vital.",
                descricaoCompleta: "",
                imagem: "",
                ativo: true
            },
            {
                id: 1005,
                titulo: "RESET by KOKARTE",
                duracao: "Grupo",
                valor: "8.500 Kz",
                descricaoBreve: "O RESET by KOKARTE é uma experiência de reconexão consigo mesmo, criada para desacelerar, libertar a tensão acumulada e restaurar o equilíbrio.",
                descricaoCompleta: "",
                imagem: "",
                ativo: true
            }
        ];
    }
    
    const ativos = servicos.filter(s => s.ativo);
    
    if (ativos.length === 0) {
        container.innerHTML = `
            <div class="bg-kokarteCard/90 p-6 rounded-2xl border border-emerald-800/40 text-center glass-premium">
                <p class="text-xs sm:text-sm text-emerald-200/70">Não há serviços disponíveis de momento. Volte em breve!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    ativos.forEach((s, index) => {
        container.innerHTML += `
            <div class="glass-premium p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4" data-aos="fade-left" data-aos-delay="${(index + 1) * 100}">
                <div class="space-y-1">
                    <h3 class="font-bold text-white text-base sm:text-lg font-display">${s.titulo}</h3>
                    <p class="text-xs sm:text-sm text-emerald-200/80 font-body leading-relaxed">${s.descricaoBreve || ''}</p>
                    ${s.duracao || s.valor ? `<p class="text-[10px] text-kokarteGold/60 font-sans tracking-wider">${s.duracao || ''} ${s.duracao && s.valor ? '·' : ''} ${s.valor || ''}</p>` : ''}
                </div>
                <a href="servicos.html" class="btn-gold-secondary text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shrink-0">
                    Saber Mais
                </a>
            </div>
        `;
    });
    
    // Atualiza AOS se disponível
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Adicionar ao DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    carregarOraculo();
    carregarEnergiaDoMes();
    carregarEventosIniciais();
    carregarServicosIndex(); // <-- NOVO
});