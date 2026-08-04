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
    
    // Procura os eventos guardados no LocalStorage com proteção contra erros
    let eventos = [];
    try {
        const dadosLocais = localStorage.getItem("kokarte_eventos");
        eventos = dadosLocais ? JSON.parse(dadosLocais) : [
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