// ============================================================
// 📦 DADOS KOKARTE — VERSÃO DINÂMICA
// ============================================================

// As mensagens do oráculo permanecem fixas (não precisam de ser editadas)
const ORACULO_MENSAGENS = [
    "Tens tentado fazer tudo certo, agradar toda a gente e evitar conflitos. Mas, no meio desse esforço, foste-te afastando de ti. Hoje faz uma pausa e pergunta-te uma coisa muito simples: 'O que é que eu preciso?' Talvez seja a primeira vez, em muito tempo, que te permites ouvir essa resposta.",

    "Nem tudo o que te preocupa merece ocupar tanto espaço dentro de ti. Há pensamentos que se repetem tantas vezes que acabam por parecer verdade. Nem sempre são. Antes de continuares a alimentar esse peso, pergunta-te se ele pertence ao presente ou apenas a um medo antigo.",

    "Há pessoas que entram na nossa vida para caminhar ao nosso lado. Outras entram apenas para nos ensinar. Não confundas uma lição com um lugar onde tens de permanecer.",

    "Há uma parte de ti que continua à espera de uma desculpa para começar. Espera por mais tempo, mais dinheiro, mais confiança, mais certezas. Mas a vida raramente muda quando tudo está perfeito. Muda quando decidimos dar um passo mesmo sem saber exatamente onde ele nos vai levar. Talvez o momento que tens esperado não esteja à tua frente. Talvez seja este.",

    "Nem tudo o que te tira a paz merece uma resposta. Há pessoas que só conseguem chegar até ti quando reages. Hoje experimenta fazer diferente. Nem todas as batalhas precisam de ser travadas. Algumas terminam simplesmente quando deixas de lhes dar espaço dentro de ti.",

    "Há dias em que sentes que estás a falhar, apenas porque ainda não chegaste onde gostarias. Mas esqueces-te de olhar para tudo aquilo que já ultrapassaste. Não te compares com a meta. Compara-te com a pessoa que eras há um ano. Vais perceber que cresceste mais do que imaginas.",

    "Não carregues a responsabilidade de salvar toda a gente. Há pessoas que só mudam quando decidem fazê-lo por elas próprias. O teu papel nunca foi resolver a vida de todos. O teu papel é cuidar da tua.",

    "Talvez tenhas passado tanto tempo a adaptar-te às expectativas dos outros que já nem saibas distinguir aquilo que realmente desejas. Hoje não procures agradar. Procura apenas ser verdadeira contigo. Essa resposta vale mais do que qualquer aprovação.",

    "Há uma preocupação que te acompanha quase todos os dias. Ela entra contigo quando acordas e continua presente quando te deitas. Mas preocupares-te constantemente não te aproxima da solução. Apenas te afasta da tranquilidade necessária para a encontrares.",

    "Não confundas calma com falta de ambição. Há momentos em que o maior progresso acontece precisamente quando deixamos de correr atrás de tudo ao mesmo tempo. A vida também cresce no silêncio.",

    "Existe algo dentro de ti que já sabe qual é a decisão certa. O problema é que tens pedido opinião a tantas pessoas que deixaste de ouvir a única voz que realmente importa. Antes de procurares mais respostas lá fora, escuta-te.",

    "Nem sempre precisas de explicar porque mudaste. Quem acompanha o teu caminho percebe a tua evolução. Quem exige justificações, muitas vezes, apenas sente dificuldade em aceitar que já não és a mesma pessoa.",

    "Há uma diferença entre desistires de um sonho e mudares de direção. Crescer também significa reconhecer quando um caminho deixou de fazer sentido. Não tenhas medo de escolher outra estrada.",

    "Hoje tenta reparar na forma como falas contigo. Se essas palavras fossem dirigidas a alguém que amas, continuarias a dizê-las? Mereces receber de ti a mesma compreensão que ofereces aos outros.",

    "Por vezes procuramos uma grande mudança, quando aquilo de que realmente precisamos é de pequenas decisões repetidas com consistência. Não subestimes o poder de um hábito que respeita quem queres tornar-te.",

    "Nem tudo o que terminou foi uma perda. Algumas coisas terminaram porque já não conseguiam acompanhar a pessoa em que te estás a transformar. Não olhes apenas para o que ficou para trás. Repara também no espaço que ficou disponível.",

    "Talvez estejas cansada, mas não apenas fisicamente. Há um cansaço que nasce de tentares controlar tudo. Experimenta confiar um pouco mais na vida e um pouco menos na necessidade de prever cada passo.",

    "Existe uma conversa que tens tido contigo em silêncio. Sempre que ela aparece, mudas de assunto, ocupas-te com outras coisas ou convences-te de que não é importante. Mas algumas respostas só aparecem quando deixamos de fugir das perguntas.",

    "Não deixes que um momento difícil te faça acreditar que toda a tua vida está errada. Um capítulo nunca conta a história inteira. Continua a escrever.",

    "Há algo que tens tentado resolver apenas com a mente, quando talvez a resposta não esteja aí. Nem tudo se resolve a pensar mais. Algumas decisões precisam de silêncio, de tempo e de coragem para sentir. Hoje não procures controlar tudo. Experimenta apenas estar presente no momento em que estás.",

    "Nem todas as pessoas vão compreender a tua mudança. Algumas conheceram uma versão tua que já não existe. Não sintas necessidade de voltar atrás só para continuares a ser reconhecida por quem nunca acompanhou o teu crescimento.",

    "Tens um hábito de minimizar as tuas conquistas. Quando algo corre bem, dizes que foi sorte. Quando algo corre mal, assumes toda a culpa. Talvez esteja na altura de começares a olhar para ti com mais justiça.",

    "Há uma parte de ti que continua a acreditar que precisas de merecer descanso. Como se só tivesses o direito de parar depois de resolver tudo. Mas a verdade é que nunca estará tudo resolvido. Cuida de ti antes que o cansaço decida por ti.",

    "Talvez estejas a interpretar este momento como um atraso, quando na realidade é uma preparação. Nem sempre percebemos o motivo das pausas enquanto as estamos a viver. Só mais tarde percebemos que elas evitaram caminhos que não eram para nós.",

    "Não deixes que uma desilusão te convença de que tudo será igual. As pessoas mudam. As circunstâncias mudam. E tu também mudaste. Não carregues o passado para lugares onde ele já não faz sentido.",

    "Há muito tempo que tentas manter tudo equilibrado. A família, o trabalho, as responsabilidades, as emoções. Mas ninguém consegue segurar tudo sem, em algum momento, começar a deixar cair a si próprio. Hoje lembra-te de que também fazes parte da lista de prioridades que tanto tentas cumprir.",

    "Talvez estejas à procura de uma confirmação para aquilo que já decidiste no teu coração. A verdade é que nem sempre ela chega. Há momentos em que a confiança nasce precisamente quando deixamos de esperar que alguém nos diga que estamos certos.",

    "Nem tudo o que te desafia veio para te magoar. Algumas situações aparecem apenas para mostrar uma força tua que ainda não conhecias. Nem sempre a vida pergunta se estás preparada. Às vezes, apenas te mostra que és muito mais capaz do que pensavas.",

    "Hoje presta atenção às pequenas coisas que te fazem sentir viva. Um café sem pressa. Uma conversa sincera. O silêncio da manhã. A felicidade raramente faz barulho.",

    "Há um peso que continuas a carregar apenas porque te habituaste a ele. Já nem perguntas se ainda faz sentido. Talvez hoje seja um bom dia para pousá-lo e perceber que a tua caminhada pode ser mais leve.",

    "Nem toda a distância significa perda. Há pessoas de quem nos afastamos para finalmente conseguirmos voltar a encontrar-nos.",

    "Existe uma diferença entre ser paciente e viver constantemente à espera. Não adies a tua vida enquanto esperas que tudo fique perfeito. Há coisas que só começam quando decides avançar.",

    "Hoje talvez não precises de mudar o mundo. Talvez precises apenas de mudar a forma como olhas para ti. Às vezes é essa a transformação que altera tudo o resto.",

    "Se continuas a pensar tantas vezes na mesma situação, talvez não seja porque ainda não encontraste uma resposta. Talvez seja porque ainda não aceitaste aquela que já conheces.",

    "Não tenhas receio de desapontar algumas pessoas quando a alternativa é continuares a desapontar-te a ti própria. A paz também exige escolhas difíceis.",

    "Há momentos em que a vida parece tirar-nos aquilo que mais queríamos. Só muito mais tarde percebemos que, naquele espaço vazio, nasceu uma versão nossa que nunca teria existido de outra forma.",

    "Olha para a forma como falas dos teus sonhos. Se até tu os tratas como impossíveis, será difícil acreditar neles quando surgirem oportunidades para os concretizar.",

    "Talvez estejas a exigir de ti uma perfeição que nunca exigiste a ninguém que amas. Porque razão és tão compreensiva com os outros e tão dura contigo?",

    "Há uma tranquilidade que chega quando deixamos de querer controlar a opinião dos outros. Nem toda a gente vai gostar de quem és. E isso não diz nada sobre o teu valor.",

    "Hoje permite-te mudar de ideias sem culpa. Crescer também significa deixar para trás certezas que já não fazem sentido.",

    "Há portas que permanecem fechadas não porque te falte capacidade, mas porque ainda estás a insistir em abrir a porta errada. Nem tudo o que desejas é necessariamente aquilo de que precisas.",

    "Talvez estejas a procurar motivação quando aquilo de que realmente precisas é de descanso. Um coração cansado raramente consegue sonhar com clareza.",

    "Existe uma coragem silenciosa que poucas pessoas veem. É aquela que te faz levantar todos os dias, mesmo quando ninguém imagina aquilo que tens enfrentado por dentro. Não desvalorizes essa força.",

    "Não deixes que um dia difícil te faça acreditar que tens uma vida difícil. Há dias que chegam apenas para nos lembrar que somos humanos. Amanhã pode trazer uma perspetiva completamente diferente.",

    "Se esta mensagem chegou até ti hoje, fica apenas com uma ideia: não precisas de resolver toda a tua vida esta semana, nem este mês. Basta continuares a dar passos honestos na direção da pessoa que queres ser. Às vezes, a mudança acontece tão devagar que só nos apercebemos dela quando olhamos para trás e já não reconhecemos a versão antiga de nós mesmos."
];

// ============================================================
// 🌙 FUNÇÃO PARA OBTER A ENERGIA DO MÊS (dinâmica)
// ============================================================
function obterEnergiaDoMes() {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    
    try {
        const dados = localStorage.getItem('kokarte_energias');
        if (dados) {
            const energias = JSON.parse(dados);
            // Procura a energia do mês atual e ano atual
            const energia = energias.find(e => e.mesNumero === mesAtual && e.ano === anoAtual && e.ativo);
            if (energia) {
                return energia;
            }
            
            // Se não encontrar, tenta buscar do ano anterior
            const energiaAnoAnterior = energias.find(e => e.mesNumero === mesAtual && e.ano === anoAtual - 1 && e.ativo);
            if (energiaAnoAnterior) {
                return energiaAnoAnterior;
            }
        }
    } catch (e) {
        console.error('Erro ao ler energias:', e);
    }
    
    // Fallback: dados fixos (caso não haja dados no localStorage)
    const ENERGIAS_FIXAS = {
        0: { mes: "Janeiro — Energia da Renovação e Novos Começos", cristal: "Quartzo Transparente", beneficios: "Limpeza energética, clareza mental e definição de intenções elevadas.", cuidados: "Evita acumular sentimentos do ano passado. Deixa ir o que já não te serve.", afirmacao: "Eu abro os meus braços para as infinitas possibilidades de luz deste novo ciclo." },
        1: { mes: "Fevereiro — Energia da Intuição e Conexão", cristal: "Ametista", beneficios: "Tranquilidade emocional, elevação espiritual e proteção contra energias densas.", cuidados: "Atenção ao desgaste mental. Reserva momentos diários para momentos de silêncio.", afirmacao: "A minha intuição é o meu guia sagrado. Eu escuto a sabedoria da minha alma." },
        2: { mes: "Março — Energia do Equilíbrio e Cura", cristal: "Quartzo Verde", beneficios: "Vitalidade física, harmonização do chakra cardíaco e regeneração de forças.", cuidados: "Não guardes ressentimentos. A cura começa quando perdoas a ti e aos outros.", afirmacao: "A minha vida flui em perfeita harmonia, saúde e amor incondicional." },
        3: { mes: "Abril — Energia da Força e Foco", cristal: "Olho de Tigre", beneficios: "Proteção espiritual, coragem para ultrapassar obstáculos e foco nos objetivos.", cuidados: "Cuidado com o excesso de autocrítica. Reconhece cada pequeno avanço teu.", afirmacao: "Eu sou forte, protegido(a) e capaz de vencer qualquer desafio com sabedoria." },
        4: { mes: "Maio — Energia do Amor Próprio e Acolhimento", cristal: "Quartzo Rosa", beneficios: "Abertura para o amor, pacificação de mágoas e fortalecimento da autoestima.", cuidados: "Evita procurar validação externa. O amor mais profundo nasce dentro de ti.", afirmacao: "Eu mereço todo o amor, respeito e abundância que o universo tem para me dar." },
        5: { mes: "Junho — Energia da Prosperidade e Luz Solar", cristal: "Citrino", beneficios: "Alegria de viver, atração de abundância e desbloqueio da criatividade.", cuidados: "Cuidado com pensamentos de escassez. Foca na gratidão do que já conquistaste.", afirmacao: "A minha energia é radiante como o sol. Eu atraio prosperidade em todas as áreas." },
        6: { mes: "Julho — Energia da Proteção e Ancoramento", cristal: "Turmalina Negra", beneficios: "Escudo contra inveja e maus-olhados, estabilidade emocional e enraizamento.", cuidados: "Protege o teu campo energético de conversas negativas ou ambientes pesados.", afirmacao: "Eu estou profundamente protegido(a), centrado(a) e seguro(a) na minha luz." },
        7: { mes: "Agosto — Energia da Sabedoria e Expressão", cristal: "Lápis-Lazúli", beneficios: "Clareza na comunicação, paz interior e despertar da sabedoria ancestral.", cuidados: "Não te cales por medo do julgamento. A tua verdade é valiosa.", afirmacao: "Eu expresso a minha verdade com amor, firmeza e sabedoria." },
        8: { mes: "Setembro — Energia da Colheita e Gratidão", cristal: "Cornalina", beneficios: "Motivação, coragem para agir e celebração das tuas conquistas.", cuidados: "Evita a procrastinação. Dá o primeiro passo, mesmo que pareça pequeno.", afirmacao: "Eu colho com gratidão os frutos do meu trabalho e da minha dedicação." },
        9: { mes: "Outubro — Energia da Transformação", cristal: "Obsidiana", beneficios: "Libertação de bloqueios profundos, transformação pessoal e coragem espiritual.", cuidados: "Não tenhas medo da mudança. O fim de um ciclo é o início de algo maior.", afirmacao: "Eu liberto o passado com gratidão e acolho a minha melhor versão." },
        10: { mes: "Novembro — Energia da Paz e Espiritualidade", cristal: "Selenita", beneficios: "Purificação de ambientes, elevação vibracional e conexão angelical.", cuidados: "Evita confusões ou correrias desnecessárias. Procura momentos de serenidade.", afirmacao: "A minha mente está em paz e o meu espírito conectado com a luz divina." },
        11: { mes: "Dezembro — Energia da Celebração e Encerramento", cristal: "Pedra do Sol", beneficios: "Sentimento de dever cumprido, calor humano e renovação das esperanças.", cuidados: "Evita o cansaço extremo nas festividades. Prioriza o teu descanso.", afirmacao: "Eu celebro a minha caminhada e recebo a nova fase com o coração cheio de luz." }
    };
    
    return ENERGIAS_FIXAS[mesAtual] || ENERGIAS_FIXAS[0];
}

// ============================================================
// 🔄 FUNÇÃO PARA ATUALIZAR A ENERGIA NO INDEX
// ============================================================
function carregarEnergiaDoMes() {
    const energia = obterEnergiaDoMes();
    
    if (!energia) return;
    
    // Suporte para o formato antigo (mes) e novo (titulo)
    const titulo = energia.titulo || energia.mes || "---";
    const cristal = energia.cristal || "---";
    const beneficios = energia.beneficios || "---";
    const cuidados = energia.cuidados || "---";
    const afirmacao = energia.afirmacao || "---";
    
    if (document.getElementById('energia-mes-titulo')) {
        document.getElementById('energia-mes-titulo').innerText = titulo;
    }
    if (document.getElementById('energia-cristal')) {
        document.getElementById('energia-cristal').innerText = cristal;
    }
    if (document.getElementById('energia-beneficios')) {
        document.getElementById('energia-beneficios').innerText = beneficios;
    }
    if (document.getElementById('energia-cuidados')) {
        document.getElementById('energia-cuidados').innerText = cuidados;
    }
    if (document.getElementById('energia-afirmacao')) {
        document.getElementById('energia-afirmacao').innerText = afirmacao;
    }
}

// ============================================================
// ⚠️ MANTÉM A COMPATIBILIDADE COM O CÓDIGO EXISTENTE
// ============================================================
// Para não quebrar o código antigo que usava ENERGIAS_MESES,
// criamos um proxy que usa a função dinâmica
const ENERGIAS_MESES = {
    0: { mes: "Janeiro — Energia da Renovação e Novos Começos", cristal: "Quartzo Transparente", beneficios: "Limpeza energética, clareza mental e definição de intenções elevadas.", cuidados: "Evita acumular sentimentos do ano passado. Deixa ir o que já não te serve.", afirmacao: "Eu abro os meus braços para as infinitas possibilidades de luz deste novo ciclo." },
    1: { mes: "Fevereiro — Energia da Intuição e Conexão", cristal: "Ametista", beneficios: "Tranquilidade emocional, elevação espiritual e proteção contra energias densas.", cuidados: "Atenção ao desgaste mental. Reserva momentos diários para momentos de silêncio.", afirmacao: "A minha intuição é o meu guia sagrado. Eu escuto a sabedoria da minha alma." },
    2: { mes: "Março — Energia do Equilíbrio e Cura", cristal: "Quartzo Verde", beneficios: "Vitalidade física, harmonização do chakra cardíaco e regeneração de forças.", cuidados: "Não guardes ressentimentos. A cura começa quando perdoas a ti e aos outros.", afirmacao: "A minha vida flui em perfeita harmonia, saúde e amor incondicional." },
    3: { mes: "Abril — Energia da Força e Foco", cristal: "Olho de Tigre", beneficios: "Proteção espiritual, coragem para ultrapassar obstáculos e foco nos objetivos.", cuidados: "Cuidado com o excesso de autocrítica. Reconhece cada pequeno avanço teu.", afirmacao: "Eu sou forte, protegido(a) e capaz de vencer qualquer desafio com sabedoria." },
    4: { mes: "Maio — Energia do Amor Próprio e Acolhimento", cristal: "Quartzo Rosa", beneficios: "Abertura para o amor, pacificação de mágoas e fortalecimento da autoestima.", cuidados: "Evita procurar validação externa. O amor mais profundo nasce dentro de ti.", afirmacao: "Eu mereço todo o amor, respeito e abundância que o universo tem para me dar." },
    5: { mes: "Junho — Energia da Prosperidade e Luz Solar", cristal: "Citrino", beneficios: "Alegria de viver, atração de abundância e desbloqueio da criatividade.", cuidados: "Cuidado com pensamentos de escassez. Foca na gratidão do que já conquistaste.", afirmacao: "A minha energia é radiante como o sol. Eu atraio prosperidade em todas as áreas." },
    6: { mes: "Julho — Energia da Proteção e Ancoramento", cristal: "Turmalina Negra", beneficios: "Escudo contra inveja e maus-olhados, estabilidade emocional e enraizamento.", cuidados: "Protege o teu campo energético de conversas negativas ou ambientes pesados.", afirmacao: "Eu estou profundamente protegido(a), centrado(a) e seguro(a) na minha luz." },
    7: { mes: "Agosto — Energia da Sabedoria e Expressão", cristal: "Lápis-Lazúli", beneficios: "Clareza na comunicação, paz interior e despertar da sabedoria ancestral.", cuidados: "Não te cales por medo do julgamento. A tua verdade é valiosa.", afirmacao: "Eu expresso a minha verdade com amor, firmeza e sabedoria." },
    8: { mes: "Setembro — Energia da Colheita e Gratidão", cristal: "Cornalina", beneficios: "Motivação, coragem para agir e celebração das tuas conquistas.", cuidados: "Evita a procrastinação. Dá o primeiro passo, mesmo que pareça pequeno.", afirmacao: "Eu colho com gratidão os frutos do meu trabalho e da minha dedicação." },
    9: { mes: "Outubro — Energia da Transformação", cristal: "Obsidiana", beneficios: "Libertação de bloqueios profundos, transformação pessoal e coragem espiritual.", cuidados: "Não tenhas medo da mudança. O fim de um ciclo é o início de algo maior.", afirmacao: "Eu liberto o passado com gratidão e acolho a minha melhor versão." },
    10: { mes: "Novembro — Energia da Paz e Espiritualidade", cristal: "Selenita", beneficios: "Purificação de ambientes, elevação vibracional e conexão angelical.", cuidados: "Evita confusões ou correrias desnecessárias. Procura momentos de serenidade.", afirmacao: "A minha mente está em paz e o meu espírito conectado com a luz divina." },
    11: { mes: "Dezembro — Energia da Celebração e Encerramento", cristal: "Pedra do Sol", beneficios: "Sentimento de dever cumprido, calor humano e renovação das esperanças.", cuidados: "Evita o cansaço extremo nas festividades. Prioriza o teu descanso.", afirmacao: "Eu celebro a minha caminhada e recebo a nova fase com o coração cheio de luz." }
};

// ============================================================
// EXPOR FUNÇÕES GLOBALMENTE
// ============================================================
window.obterEnergiaDoMes = obterEnergiaDoMes;
window.carregarEnergiaDoMes = carregarEnergiaDoMes;