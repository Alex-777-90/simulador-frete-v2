// =====================================================================
// ARQUIVO: index.js (COMPLETO)
// =====================================================================

// Variável global para armazenar o mapa de cidades x transportadoras
let mapaTransportadoras = [];

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // 🟡 PARTE 1: CARREGAMENTO DE DADOS DO FRETE (DADOSMAPA2.JSON)
    // =====================================================================
    fetch('dadosMapa2.json')
        .then(response => response.json())
        .then(data => {
            mapaTransportadoras = data;
            console.log("Base de dados de cidades/transportadoras carregada.");
        })
        .catch(error => console.error("Erro ao carregar dadosMapa2.json:", error));


    // =====================================================================
    // 🔵 PARTE 2: AUTOCOMPLETE DO CLIENTE + PREENCHIMENTO DE DADOS
    // =====================================================================
    const inputCliente = document.getElementById('cliente-input');
    const listaSugestoes = document.getElementById('lista-sugestoes');
    const btnToggle = document.getElementById('btn-toggle-lista'); 
    let todosClientes = [];

    // 1. Carregar Clientes
    fetch("clientes2.json").then(res => res.json()).then(json => {
        if (!Array.isArray(json) || json.length < 2) return;
        const header = json[0];
        todosClientes = json.slice(1).map(linha => {
            const obj = {};
            header.forEach((col, i) => obj[col] = linha[i]);
            return obj;
        });
        // Ordenar por nome
        todosClientes.sort((a, b) => {
            const nA = (a["Nome estrangeiro"] || "").toUpperCase();
            const nB = (b["Nome estrangeiro"] || "").toUpperCase();
            return nA.localeCompare(nB);
        });
    }).catch(err => console.error("Erro JSON Clientes", err));

    // Função Auxiliar para renderizar a lista
    function renderizarLista(arrayClientes) {
        listaSugestoes.innerHTML = '';
        
        if (arrayClientes.length === 0) {
            listaSugestoes.classList.remove('ativo');
            return;
        }

        arrayClientes.forEach(cli => {
            const nome = cli["Nome do PN"] || cli["Nome estrangeiro"] || cli["Nome fantasia"] || "Cliente";
            const cidade = cli["Cidade"] || "";
            const uf = cli["UF"] || "";
            
            const li = document.createElement('li');
            li.innerHTML = `<strong>${nome}</strong> <small style="opacity:0.7">(${cidade}/${uf})</small>`;
            
            li.addEventListener('click', () => {
                // Preencher Input
                inputCliente.value = nome;
                
                // --- PREENCHIMENTO DA CIDADE (ESSENCIAL PARA O CÁLCULO) ---
                const inputCidade = document.getElementById('cidade');
                if (inputCidade) {
                    // Pega o valor, remove acentos, joga para maiúscula e remove espaços extras
                    const cidadeTratada = (cli["Cidade"] || "")
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toUpperCase()
                        .trim();
                    
                    inputCidade.value = cidadeTratada;
                }
                
                // Preencher Dados Visíveis (Lógica antiga mantida)
                if (typeof destinoSelecionada !== 'undefined') {
                    destinoSelecionada = true; 
                }

                const ufDest = document.getElementById("uf-destino");
                const cidDest = document.getElementById("cidade-destino");
                const cepDest = document.getElementById("cep-destino");
                const endDest = document.getElementById("end-destino");
                
                // Funções auxiliares (verifica se existem no escopo global, senão ignora)
                const safeRemoveAcentos = (typeof removeAcentos === 'function') ? removeAcentos : (s) => s;
                const safeToUpper = (typeof toUpper === 'function') ? toUpper : (s) => s ? s.toUpperCase() : "";
                const safeNormalizeCEP = (typeof normalizeCEPFromJson === 'function') ? normalizeCEPFromJson : (s) => s;

                if (ufDest) ufDest.value = safeRemoveAcentos(safeToUpper(cli["UF"]));
                if (cidDest) cidDest.value = safeRemoveAcentos(safeToUpper(cli["Cidade"]));
                if (cepDest) cepDest.value = safeNormalizeCEP(cli["CEP"]);
                if (endDest) endDest.value = safeRemoveAcentos(safeToUpper(cli["ENDERECO"] || cli["Endereço"]));

                // Preencher Campos Ocultos de Latitude e Longitude
                const latDest = document.getElementById("destino-lat");
                const lonDest = document.getElementById("destino-lon");
                if(latDest) latDest.value = cli["Latitude"] || "";
                if(lonDest) lonDest.value = cli["Longitude"] || "";

                listaSugestoes.classList.remove('ativo');
            });
            listaSugestoes.appendChild(li);
        });
        listaSugestoes.classList.add('ativo');
    }

    // 2. Evento de Digitação
    if (inputCliente && listaSugestoes) {
        inputCliente.addEventListener('input', function() {
            const texto = this.value.toLowerCase();
            
            if (texto.length < 1) {
                listaSugestoes.classList.remove('ativo');
                return;
            }

            const filtrados = todosClientes.filter(cli => {
                const n = (cli["Nome do PN"] || "").toLowerCase();
                const f = (cli["Nome fantasia"] || "").toLowerCase();
                return n.includes(texto) || f.includes(texto);
            }).slice(0, 20); 

            renderizarLista(filtrados);
        });

        // 3. Evento do Botão Seta (Toggle)
        if (btnToggle) {
            btnToggle.addEventListener('click', (e) => {
                e.preventDefault(); 
                e.stopPropagation(); 

                if (listaSugestoes.classList.contains('ativo')) {
                    listaSugestoes.classList.remove('ativo');
                } else {
                    const textoAtual = inputCliente.value.toLowerCase();
                    
                    let listaParaMostrar;
                    if (textoAtual.length > 0) {
                        listaParaMostrar = todosClientes.filter(cli => 
                            (cli["Nome do PN"]||"").toLowerCase().includes(textoAtual)
                        );
                    } else {
                        listaParaMostrar = todosClientes; 
                    }

                    renderizarLista(listaParaMostrar.slice(0, 50));
                    inputCliente.focus(); 
                }
            });
        }

        // 4. Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            const clicouInput = inputCliente.contains(e.target);
            const clicouLista = listaSugestoes.contains(e.target);
            const clicouBotao = btnToggle && btnToggle.contains(e.target);

            if (!clicouInput && !clicouLista && !clicouBotao) {
                listaSugestoes.classList.remove('ativo');
            }
        });
    }

    // =====================================================================
    // 🟢 PARTE 3: BOTÃO CALCULAR (INTEGRAÇÃO COM GERENCIADOR DE FRETES)
    // =====================================================================
    const btnCalcular = document.getElementById('btn-calcular-lote');
    
    if (btnCalcular) {
        btnCalcular.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Capturar Inputs
            const inputValor = document.getElementById('valor-nf');
            const inputPeso = document.getElementById('peso');
            // Este campo 'cidade' foi preenchido automaticamente pelo autocomplete acima
            const inputCidade = document.getElementById('cidade'); 

            // Validação básica se os campos existem no HTML
            if (!inputValor || !inputPeso || !inputCidade) {
                console.error("Campos de input (valor-nf, peso, cidade) não encontrados no HTML.");
                return;
            }

            // 2. Tratamento de Valores
            // Converte "1.000,50" para float 1000.50
            const valorNF = parseFloat(inputValor.value.replace(/\./g, '').replace(',', '.')) || 0;
            const peso = parseFloat(inputPeso.value.replace(/\./g, '').replace(',', '.')) || 0;
            const cidadeDestino = inputCidade.value;

            // 3. Validação Lógica
            if (cidadeDestino === "" || valorNF === 0 || peso === 0) {
                alert("Por favor, selecione um Cliente (para preencher a Cidade) e informe Peso e Valor da NF.");
                return;
            }

            // 4. Executar Cálculo (Chama função do gerenciadorFretes.js)
            if (typeof calcularFretesGerais === 'function') {
                const resultados = calcularFretesGerais(cidadeDestino, peso, valorNF, mapaTransportadoras);
                
                // 5. Renderizar (Chama função do gerenciadorFretes.js)
                if (typeof gerarCardsHTML === 'function') {
                    gerarCardsHTML(resultados);
                }
            } else {
                console.error("A função calcularFretesGerais não foi encontrada. Verifique se importou o gerenciadorFretes.js");
            }
        });
    }

});