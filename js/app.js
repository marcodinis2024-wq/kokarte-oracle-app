// 📱 Define aqui o número do WhatsApp da loja
const NUMERO_WHATSAPP = "244936676628"; 

// ============================================================
// 🎴 ORÁCULO KOKARTE — CARTA PREMIUM (ANIMAÇÃO COMPLETA)
// ============================================================

let estadoCarta = 'fechada'; // 'fechada' | 'abrindo' | 'aberta' | 'fechando'
let mensagemAtual = '';
let podeAbrir = true;

// Elementos DOM
const envelopeEstado = document.getElementById('envelope-estado');
const cartaoEstado = document.getElementById('cartao-estado');
const envelope = document.getElementById('envelope');
const envelopeImg = document.getElementById('envelope-img');
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
    if (typeof ORACULO_MENSAGENS === 'undefined') {
        console.error('ORACULO_MENSAGENS não está definido!');
        return;
    }
    
    const indice = Math.floor(Math.random() * ORACULO_MENSAGENS.length);
    mensagemAtual = ORACULO_MENSAGENS[indice];
    
    cartaConteudo.innerText = `"${mensagemAtual}"`;
    oraculoTexto.innerText = `"${mensagemAtual}"`;
    
    // Estado inicial: envelope fechado
    estadoCarta = 'fechada';
    podeAbrir = true;
    envelopeEstado.classList.remove('hidden');
    cartaoEstado.classList.add('hidden');
    carta.classList.remove('open');
    legenda.style.opacity = '1';
    sublegenda.style.opacity = '1';
    envelope.style.opacity = '1';
    envelope.style.transform = 'scale(1)';
    envelope.classList.remove('abrindo');
    if (envelopeImg) {
        envelopeImg.style.opacity = '1';
        envelopeImg.style.transform = 'scale(1) rotate(0deg)';
    }
    particulasContainer.innerHTML = '';
    envelope.style.pointerEvents = 'auto';
}

// ============================================================
// 2. ABRIR CARTA (acionado pelo clique no envelope)
// ============================================================
function abrirCarta() {
    if (estadoCarta !== 'fechada' || !podeAbrir) return;
    
    estadoCarta = 'abrindo';
    podeAbrir = false;
    envelope.style.pointerEvents = 'none';
    
    // Passo 1: Inicia animação da imagem (encolhe + desvanece)
    envelope.classList.add('abrindo');
    
    // Passo 2: Carta sobe (após pequeno delay)
    setTimeout(() => {
        carta.classList.add('open');
    }, 400);
    
    // Passo 3: Partículas douradas
    setTimeout(() => {
        criarParticulas();
    }, 600);
    
    // Passo 4: Esconde o envelope e mostra o cartão
    setTimeout(() => {
        envelope.style.display = 'none';
        envelopeEstado.classList.add('hidden');
        cartaoEstado.classList.remove('hidden');
        estadoCarta = 'aberta';
        podeAbrir = true;
        envelope.style.pointerEvents = 'auto';
        
        // Reset da imagem para futuras aberturas (será restaurada em fecharCarta)
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 1200);
}

// ============================================================
// 3. FECHAR CARTA E MOSTRAR ENVELOPE FECHADO
// ============================================================
function fecharCarta() {
    if (estadoCarta !== 'aberta' || !podeAbrir) return;
    
    estadoCarta = 'fechando';
    podeAbrir = false;
    
    // Esconde o cartão
    cartaoEstado.classList.add('hidden');
    
    // Mostra o envelope novamente
    envelopeEstado.classList.remove('hidden');
    envelope.style.display = 'block';
    envelope.classList.remove('abrindo');
    
    // Restaura a imagem ao estado original
    if (envelopeImg) {
        envelopeImg.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        envelopeImg.style.opacity = '1';
        envelopeImg.style.transform = 'scale(1) rotate(0deg)';
        envelopeImg.style.filter = 'drop-shadow(0 8px 30px rgba(0, 0, 0, 0.3))';
    }
    
    // Carta desce
    carta.classList.remove('open');
    
    // Restaura legenda
    legenda.style.transition = 'opacity 0.5s ease';
    legenda.style.opacity = '1';
    sublegenda.style.transition = 'opacity 0.5s ease';
    sublegenda.style.opacity = '1';
    
    // Remove partículas
    particulasContainer.innerHTML = '';
    
    // Aguarda e volta ao estado fechado
    setTimeout(() => {
        estadoCarta = 'fechada';
        podeAbrir = true;
        envelope.style.pointerEvents = 'auto';
    }, 400);
}

// ============================================================
// 4. RECEBER NOVA MENSAGEM (com envelope completo)
// ============================================================
function tirarNovaMensagem() {
    if (estadoCarta === 'abrindo' || estadoCarta === 'fechando') return;
    
    if (estadoCarta === 'aberta') {
        fecharCarta();
        
        setTimeout(() => {
            const indice = Math.floor(Math.random() * ORACULO_MENSAGENS.length);
            mensagemAtual = ORACULO_MENSAGENS[indice];
            cartaConteudo.innerText = `"${mensagemAtual}"`;
            oraculoTexto.innerText = `"${mensagemAtual}"`;
        }, 500);
        return;
    }
    
    if (estadoCarta === 'fechada') {
        const indice = Math.floor(Math.random() * ORACULO_MENSAGENS.length);
        mensagemAtual = ORACULO_MENSAGENS[indice];
        cartaConteudo.innerText = `"${mensagemAtual}"`;
        oraculoTexto.innerText = `"${mensagemAtual}"`;
        
        // Garante que o envelope está visível e fechado
        envelopeEstado.classList.remove('hidden');
        cartaoEstado.classList.add('hidden');
        envelope.style.display = 'block';
        envelope.classList.remove('abrindo');
        if (envelopeImg) {
            envelopeImg.style.opacity = '1';
            envelopeImg.style.transform = 'scale(1) rotate(0deg)';
        }
        legenda.style.opacity = '1';
        sublegenda.style.opacity = '1';
        carta.classList.remove('open');
        particulasContainer.innerHTML = '';
        estadoCarta = 'fechada';
        podeAbrir = true;
        envelope.style.pointerEvents = 'auto';
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
        
        setTimeout(() => {
            particula.remove();
        }, 2200 + (Math.random() * 500));
    }
}

// ============================================================
// 6. Lógica do WhatsApp
// ============================================================
function agendarWhatsApp(nomeItem) {
    const mensagem = `Olá! Gostaria de agendar/reservar lugar para: *${nomeItem}*.`;
    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, "_blank");
}

// ============================================================
// 7. Carregar Eventos
// ============================================================
function carregarEventosIniciais() {
    const container = document.getElementById("lista-eventos");
    if (!container) return;
    
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
            <div class="bg-kokarteCard/90 p-6 rounded-2xl border border-emerald-800/40 text-center glass-premium">
                <p class="text-xs sm:text-sm text-emerald-200/70">Não há eventos agendados de momento. Fica atento às nossas redes sociais!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    eventosAtivos.forEach(evt => {
        const textoBreve = evt.descricaoBreve || evt.descricao || "";

        container.innerHTML += `
            <div class="bg-kokarteCard/90 rounded-2xl border border-emerald-800/50 overflow-hidden glass-premium space-y-0" data-aos="fade-up">
                ${evt.imagem ? `
                    <div class="w-full h-48 sm:h-56 overflow-hidden relative">
                        <img src="${evt.imagem}" alt="${evt.titulo}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-kokarteCard via-transparent to-transparent"></div>
                    </div>
                ` : ''}
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
                        <a href="eventos.html" class="block w-full text-center bg-kokarteGold/20 border border-kokarteGold text-kokarteGold hover:bg-kokarteGold hover:text-kokarteBg text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.02]">
                            Saber Mais
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// ============================================================
// 8. Carregar Serviços no Index
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
    
    if (servicos.length === 0) {
        servicos = [
            {
                id: 1001,
                titulo: "Consulta de Mapeamento Energético",
                duracao: "60 minutos",
                valor: "45.000 Kz",
                descricaoBreve: "A Consulta de Mapeamento Energético é o primeiro passo para compreender o seu estado energético e identificar os bloqueios que podem estar a influenciar diferentes áreas da sua vida.",
                ativo: true
            },
            {
                id: 1002,
                titulo: "Reiki Tibetano",
                duracao: "60 min",
                valor: "59.000 Kz",
                descricaoBreve: "O Reiki Tibetano é uma terapia energética que promove o equilíbrio do campo energético, favorecendo o relaxamento profundo, a libertação de tensões e o restabelecimento da harmonia entre corpo, mente e emoções.",
                ativo: true
            },
            {
                id: 1003,
                titulo: "Programa de Transformação Pessoal",
                duracao: "60-90 min/sessão",
                valor: "150.000 Kz (pack 3)",
                descricaoBreve: "O Programa de Transformação Pessoal é um acompanhamento individual e personalizado, criado para quem pretende transformar padrões repetitivos, crenças limitantes e bloqueios identificados.",
                ativo: true
            },
            {
                id: 1004,
                titulo: "Massagem Bioenergética com Cristais",
                duracao: "60 min",
                valor: "38.000 Kz",
                descricaoBreve: "A Massagem Bioenergética combina técnicas de massagem terapêutica com trabalho energético e cristais, proporcionando um profundo estado de relaxamento e reequilíbrio da energia vital.",
                ativo: true
            },
            {
                id: 1005,
                titulo: "RESET by KOKARTE",
                duracao: "Grupo",
                valor: "8.500 Kz",
                descricaoBreve: "O RESET by KOKARTE é uma experiência de reconexão consigo mesmo, criada para desacelerar, libertar a tensão acumulada e restaurar o equilíbrio.",
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
    
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// ============================================================
// 9. Partilha do Oráculo
// ============================================================
async function partilharMensagem() {
    const oraculoTextoAtual = document.getElementById("oraculo-texto").innerText;
    const textoPartilhaElemento = document.getElementById("texto-partilha");
    const cartaoPartilha = document.getElementById("cartao-partilha");
    const btnPartilhar = document.getElementById("btn-partilhar");
    
    if (!oraculoTextoAtual || !cartaoPartilha) return;

    textoPartilhaElemento.innerText = oraculoTextoAtual;
    
    const textoOriginalBotao = btnPartilhar.innerHTML;
    btnPartilhar.innerHTML = "A gerar carta... ✨";
    btnPartilhar.disabled = true;

    try {
        const canvas = await html2canvas(cartaoPartilha, {
            scale: 1,
            useCORS: true,
            backgroundColor: null
        });

        canvas.toBlob(async (blob) => {
            const file = new File([blob], "kokarte-oraculo.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'A minha mensagem do Oráculo KOKARTE',
                        text: 'Vê o conselho que recebi hoje no portal da KOKARTE! ✨',
                        files: [file]
                    });
                    btnPartilhar.innerHTML = textoOriginalBotao;
                    btnPartilhar.disabled = false;
                } catch (error) {
                    btnPartilhar.innerHTML = textoOriginalBotao;
                    btnPartilhar.disabled = false;
                }
            } else {
                const link = document.createElement("a");
                link.download = "kokarte-oraculo.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
                
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
// 10. INICIALIZAÇÃO
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    carregarOraculo();
    carregarEnergiaDoMes();
    carregarEventosIniciais();
    carregarServicosIndex();
});

// ============================================================
// EXPOR FUNÇÕES GLOBALMENTE
// ============================================================
window.carregarOraculo = carregarOraculo;
window.abrirCarta = abrirCarta;
window.tirarNovaMensagem = tirarNovaMensagem;
window.partilharMensagem = partilharMensagem;
window.agendarWhatsApp = agendarWhatsApp;
window.carregarEventosIniciais = carregarEventosIniciais;
window.carregarServicosIndex = carregarServicosIndex;