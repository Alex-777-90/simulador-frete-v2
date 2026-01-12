// =====================================================================
// ARQUIVO: gerenciadorFretes.js
// FUNÇÃO: Orquestrar cálculos de várias transportadoras e gerar HTML
// =====================================================================

// Simulador genérico para transportadoras que ainda não têm arquivo .js próprio
const SIMULACAO_PADRAO = {
    fracionado: { adValorem: 0.003, precoKg: 1.60, despacho: 75.00, prazo: "5 a 8 dias" },
    dedicado: { indisponivel: true } // Exemplo: padrão assume que só fazem fracionado
};

// --- CALCULADORA GENÉRICA (SIMULAÇÃO) ---
function calcularGenerico(nomeTransportadora, peso, valorNF) {
    // Fracionado Simulado
    const fPeso = Math.max(peso, 50) * SIMULACAO_PADRAO.fracionado.precoKg;
    const fValor = valorNF * SIMULACAO_PADRAO.fracionado.adValorem;
    const sub = fPeso + fValor + SIMULACAO_PADRAO.fracionado.despacho;
    const total = sub / (1 - 0.12); // ICMS 12%

    return {
        nome: nomeTransportadora,
        fracionado: {
            fretePeso: fPeso,
            freteValor: fValor,
            despacho: SIMULACAO_PADRAO.fracionado.despacho,
            icms: total - sub,
            total: total,
            prazo: SIMULACAO_PADRAO.fracionado.prazo
        },
        dedicado: null // Null indica que não atende ou não temos tabela
    };
}

// --- FUNÇÃO DE FORMATAÇÃO ---
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- ORQUESTRADOR PRINCIPAL ---
function calcularFretesGerais(cidadeDestino, peso, valorNF, dadosMapaJSON) {
    const resultados = [];
    const cidadeNorm = cidadeDestino.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();

    // 1. VERIFICAR LEVANTE (Usa o levante.js se disponível)
    if (typeof calcularLevanteModulo === "function") {
        const resLevante = calcularLevanteModulo(cidadeDestino, peso, valorNF);
        if (resLevante) {
            resultados.push(resLevante);
        }
    }

    // 2. VERIFICAR OUTRAS (BestLog, Mira, etc)
    // Futuramente, se você criar bestLog.js, adicione:
    // if (typeof calcularBestLogModulo === "function") { ... }

    // Procura a cidade no JSON
    const dadosCidade = dadosMapaJSON.find(item => 
        item.cidade.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim() === cidadeNorm
    );

    if (dadosCidade && dadosCidade.transportadoras) {
        dadosCidade.transportadoras.forEach(nomeTransp => {
            // Evita duplicar a Levante se ela já foi calculada acima
            if (nomeTransp.toUpperCase().includes("LEVANTE")) return;

            // FUTURO: Se existir bestLog.js, faça algo assim:
            /*
            if (nomeTransp.toUpperCase().includes("BEST LOG") && typeof calcularBestLogModulo === 'function') {
                 resultados.push(calcularBestLogModulo(cidadeDestino, peso, valorNF));
                 return;
            }
            */

            // Se não tem JS específico, usa genérico
            resultados.push(calcularGenerico(nomeTransp, peso, valorNF));
        });
    }

    return resultados;
}

// --- GERADOR DE HTML (LAYOUT SOLICITADO) ---
function gerarCardsHTML(listaResultados) {
    const container = document.querySelector('.resultado-container');
    
    if (!container) return; // Segurança

    container.innerHTML = ""; // Limpa resultados anteriores

    if (listaResultados.length === 0) {
        container.innerHTML = `<div class="aviso-vazio">Nenhuma transportadora encontrada para <strong>${listaResultados.cidade || "esta região"}</strong>.</div>`;
        return;
    }

    listaResultados.forEach(res => {
        const card = document.createElement('div');
        card.className = 'card-transportadora';

        // HTML INTERNO DO CARD
        card.innerHTML = `
            <div class="card-header">
                <h3>${res.nome}</h3>
            </div>
            <div class="card-body">
                ${gerarTabelaModalidade(res.fracionado, "Fracionado")}
                
                <div class="divisor-vertical"></div>

                ${gerarTabelaModalidade(res.dedicado, "Dedicado")}
            </div>
        `;
        container.appendChild(card);
    });
}

// Helper para montar a tabela individual
function gerarTabelaModalidade(dados, titulo) {
    if (!dados) {
        return `
            <div class="coluna-modalidade inativo">
                <h4>${titulo}</h4>
                <p class="msg-erro">Transportadora não atende na modalidade ${titulo.toLowerCase()}.</p>
            </div>
        `;
    }

    return `
        <div class="coluna-modalidade">
            <h4>${titulo} <small>(${dados.prazo})</small></h4>
            <table class="tabela-custos">
                <tr>
                    <td>Frete peso</td>
                    <td class="valor">${formatCurrency(dados.fretePeso)}</td>
                </tr>
                <tr>
                    <td>Frete valor</td>
                    <td class="valor">${formatCurrency(dados.freteValor)}</td>
                </tr>
                <tr>
                    <td>Taxa de despacho</td>
                    <td class="valor">${formatCurrency(dados.despacho)}</td>
                </tr>
                <tr>
                    <td>ICMS Aplicado</td>
                    <td class="valor">${formatCurrency(dados.icms)}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total do serviço</strong></td>
                    <td class="valor total"><strong>${formatCurrency(dados.total)}</strong></td>
                </tr>
            </table>
        </div>
    `;
}