document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // 🔵 AUTOCOMPLETE DO CLIENTE + BOTÃO DROPDOWN
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
            
            // =========================================================
            // 🆕 ALTERAÇÃO SOLICITADA: Preencher Cidade (Padronizada)
            // =========================================================
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
            // =========================================================

            // Preencher Dados Visíveis (Lógica antiga mantida)
            // Nota: Se a variável 'destinoSelecionada' não for global, verifique se ela existe no seu código completo.
            if (typeof destinoSelecionada !== 'undefined') {
                destinoSelecionada = true; 
            }

            const ufDest = document.getElementById("uf-destino");
            const cidDest = document.getElementById("cidade-destino");
            const cepDest = document.getElementById("cep-destino");
            const endDest = document.getElementById("end-destino");
            
            // Nota: Mantive as chamadas removeAcentos/toUpper originais caso você tenha essas funções definidas em outro lugar.
            // Se elas não existirem, o código acima (inputCidade) já garante o funcionamento para o campo 'cidade'.
            if (ufDest && typeof removeAcentos === 'function') ufDest.value = removeAcentos(toUpper(cli["UF"]));
            if (cidDest && typeof removeAcentos === 'function') cidDest.value = removeAcentos(toUpper(cli["Cidade"]));
            if (cepDest && typeof normalizeCEPFromJson === 'function') cepDest.value = normalizeCEPFromJson(cli["CEP"]);
            if (endDest && typeof removeAcentos === 'function') endDest.value = removeAcentos(toUpper(cli["ENDERECO"] || cli["Endereço"]));

            // 🔴 NOVO: Preencher Campos Ocultos de Latitude e Longitude
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

});