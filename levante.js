// =====================================================================
// ARQUIVO: levante.js (COMPLETO)
// FUNÇÃO: Realizar os cálculos específicos da Levante e devolver os dados
// =====================================================================

// ================== CONSTANTES GERAIS ==================

const AD_VALOREM_FRAC = 0.002;     // 0,20% Valor NF (fracionado)
const TAXA_DESPACHO = 84.74;       // R$ despacho fracionado
const PESO_MIN_KG = 100;           // mínimo fracionado
const ALIQUOTA_ICMS = 0.12;        // 12% (ICMS "por dentro")

const AD_VALOREM_DED = 0.002;      // 0,20% Valor NF (dedicado)
const CAT_DED = 85.60;             // CAT dedicado

// ================== ROTAS FRACIONADO (ROTA I / II) ==================

const ROTA_I = [
  "SAO PAULO",
  "GUARULHOS",
  "ARUJA",
  "MAUA",
  "POA",
  "SANTO ANDRE",
  "SAO CAETANO DO SUL",
  "DIADEMA",
  "SAO BERNARDO DO CAMPO",
  "TABOAO DA SERRA",
  "ITAPECERICA DA SERRA",
  "COTIA",
  "CARAPICUIBA",
  "BARUERI",
  "OSASCO",
  "SANTANA DE PARNAIBA"
];

const ROTA_II = [
  "ATIBAIA",
  "BOM JESUS DOS PERDOES",
  "MAIRIPORA",
  "CAIEIRAS",
  "ITATIBA",
  "BRAGANCA PAULISTA",
  "JARINU",
  "MAIRINQUE",
  "SAO ROQUE",
  "ARACARIGUAMA",
  "SOROCABA",
  "SALTO",
  "BOITUVA",
  "CERQUILHO",
  "ITU",
  "JUNDIAI",
  "CAMPINAS",
  "VALINHOS",
  "VINHEDO",
  "LOUVEIRA",
  "CABREUVA",
  "AMERICANA",
  "SUMARE",
  "ARTHUR NOGUEIRA",
  "PAULINIA",
  "JAGUARIUNA",
  "LIMEIRA",
  "RIO CLARO",
  "PIRACICABA",
  "ITAQUAQUECETUBA",
  "SUZANO",
  "MOGI DAS CRUZES",
  "MOGI GUACU",
  "HOLAMBRA",
  "MONTE MOR",
  "HORTOLANDIA",
  "SANTA BARBARA D OESTE",
  "PORTE FELIZ",
  "CAPIVARI",
  "RIO DAS PEDRAS",
  "CAJAMAR",
  "CORDEIROPOLIS",
  "SANTA GERTRUDES",
  "ARARAS"
];

// valor por tonelada para cada rota (fracionado)
const TARIFA_POR_ROTA = {
  I: 186.18,
  II: 292.11
};

// ================== TABELA DEDICADO (LOTACAO) ==================
// Dados específicos de origem/destino. 

const DEDICADO_ROTAS = [
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "SAO PAULO",
    destinoUF: "SP",
    carreta: 2033.00,
    truck: 909.50,
    toco: 802.50,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 0.00
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "BARUERI",
    destinoUF: "SP",
    carreta: 2033.00,
    truck: 963.00,
    toco: 856.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 5.80
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "AMERICANA",
    destinoUF: "SP",
    carreta: 0.00,
    truck: 1498.00,
    toco: 1498.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 36.50
  },
  {
    origemCidade: "RIO CLARO",
    origemUF: "SP",
    destinoCidade: "SAO PAULO",
    destinoUF: "SP",
    carreta: 3424.00,
    truck: 2461.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 43.50
  },
  {
    origemCidade: "RIO CLARO",
    origemUF: "SP",
    destinoCidade: "DUQUE DE CAXIAS",
    destinoUF: "RJ",
    carreta: 10165.00,
    truck: 6955.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 105.00
  },
  {
    origemCidade: "RIO CLARO",
    origemUF: "SP",
    destinoCidade: "TRIUNFO",
    destinoUF: "RS",
    carreta: 12626.00,
    truck: 8774.00,
    toco: 7704.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 86.50
  },
  {
    origemCidade: "RIO CLARO",
    origemUF: "SP",
    destinoCidade: "CAMACARI",
    destinoUF: "BA",
    carreta: 17013.00,
    truck: 11663.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 81.50
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "PAULINIA",
    destinoUF: "SP",
    carreta: 4066.00,
    truck: 2354.00,
    toco: 1284.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 26.50
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "RIO CLARO",
    destinoUF: "SP",
    carreta: 2889.00,
    truck: 1819.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 45.00
  },
  {
    origemCidade: "CAMACARI",
    origemUF: "BA",
    destinoCidade: "RIO CLARO",
    destinoUF: "SP",
    carreta: 16585.00,
    truck: 9095.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 81.50
  },
  {
    origemCidade: "SOROCABA",
    origemUF: "SP",
    destinoCidade: "RIO CLARO",
    destinoUF: "SP",
    carreta: 2889.00,
    truck: 1819.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 23.00
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "PINDAMONHANGABA",
    destinoUF: "SP",
    carreta: 4226.50,
    truck: 2086.50,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 30.00
  },
  {
    origemCidade: "ITAJAI",
    origemUF: "SC",
    destinoCidade: "MAUA",
    destinoUF: "SP",
    carreta: 5992.00,
    truck: 0.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 48.20
  },
  {
    origemCidade: "ITAJAI",
    origemUF: "SC",
    destinoCidade: "RIO CLARO",
    destinoUF: "SP",
    carreta: 6848.00,
    truck: 0.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 91.00
  },
  {
    origemCidade: "RIO CLARO",
    origemUF: "SP",
    destinoCidade: "MAUA",
    destinoUF: "SP",
    carreta: 2889.00,
    truck: 1819.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 45.00
  },
  {
    origemCidade: "MAUA",
    origemUF: "SC",
    destinoCidade: "TRIUNFO",
    destinoUF: "RS",
    carreta: 0.00,
    truck: 8025.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 67.50
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "MAUA",
    destinoUF: "SP",
    carreta: 1498.00,
    truck: 749.00,
    toco: 695.50,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 0.00
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "SANTO ANDRE",
    destinoUF: "SP",
    carreta: 1498.00,
    truck: 749.00,
    toco: 695.50,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 0.00
  },
  {
    origemCidade: "RIO CLARO",
    origemUF: "SP",
    destinoCidade: "PAULINIA",
    destinoUF: "SP",
    carreta: 0.00,
    truck: 1070.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 21.50
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "SUZANO",
    destinoUF: "SP",
    carreta: 2033.00,
    truck: 909.50,
    toco: 802.50,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 21.50
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "CAMPINAS",
    destinoUF: "SP",
    carreta: 2889.00,
    truck: 1819.00,
    toco: 1819.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 62.00
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "SUMARE",
    destinoUF: "SP",
    carreta: 2889.00,
    truck: 1819.00,
    toco: 1498.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 36.50
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "ITATIBA",
    destinoUF: "SP",
    carreta: 2889.00,
    truck: 1819.00,
    toco: 1819.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 47.00
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "SAO JOSE DOS CAMPOS",
    destinoUF: "SP",
    carreta: 0.00,
    truck: 1712.00,
    toco: 0.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 30.00
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "GUARUJA",
    destinoUF: "SP",
    carreta: 0.00,
    truck: 1819.00,
    toco: 1712.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 53.50
  },
  {
    origemCidade: "MAUA",
    origemUF: "SP",
    destinoCidade: "VINHEDO",
    destinoUF: "SP",
    carreta: 0.00,
    truck: 1605.00,
    toco: 1498.00,
    f4000: 0,
    f1000: 0,
    pedagioPorEixo: 32.00
  }
];

// Fallback por ROTA quando não houver linha específica (Forma 1)
const DEDICADO_PADRAO_ROTA = {
  I: { carreta: 1900.00, truck: 1400.00, toco: 1200.00, f4000: 900.00, f1000: 850.00 },
  II: { carreta: 2700.00, truck: 1819.00, toco: 1400.00, f4000: 1100.00, f1000: 1000.00 }
};

const DEDICADO_PADRAO_PEDAGIO_POR_EIXO = {
  I: 0.00,
  II: 47.00  // 47 * 3 eixos = 141,00 (caso Jarinu)
};

// definição das faixas de veículo (automático por peso)
const VEICULOS_FAIXAS = [
  { tipo: "carreta", minKg: 12000, eixos: 5 },
  { tipo: "truck",  minKg: 6000,  eixos: 3 },
  { tipo: "toco",   minKg: 3000,  eixos: 2 },
  { tipo: "f4000",  minKg: 1000,  eixos: 2 },
  { tipo: "f1000",  minKg: 0,     eixos: 2 }
];


// ================== FUNÇÕES AUXILIARES INTERNAS ==================

function normalizarTextoLevante(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,']/g, " ")
    .toUpperCase()
    .trim();
}

function descobrirRotaFracionado(cidadeDestino) {
  const nome = normalizarTextoLevante(cidadeDestino);
  if (ROTA_I.includes(nome)) return "I";
  if (ROTA_II.includes(nome)) return "II";
  // Forma 1: se não achar, considerar null (não atende) ou II por padrão.
  // Neste módulo, se não achar, assumiremos que não atende a não ser que tenha rota dedicada específica.
  return null;
}

// Reintegrando a função de busca dedicada original
function encontrarRotaDedicado(origemCidade, origemUF, destinoCidade, destinoUF) {
  const oCidade = normalizarTextoLevante(origemCidade);
  const dCidade = normalizarTextoLevante(destinoCidade);
  const oUF = (origemUF || "").toUpperCase();
  const dUF = (destinoUF || "").toUpperCase();

  return DEDICADO_ROTAS.find(r =>
    r.origemCidade === oCidade &&
    r.destinoCidade === dCidade &&
    r.origemUF === oUF &&
    r.destinoUF === dUF
  );
}

function escolherVeiculoPorPeso(pesoKg, rotaObj) {
  // primeiro tenta pela faixa de peso
  for (const v of VEICULOS_FAIXAS) {
    if (pesoKg >= v.minKg) {
      const valorVeiculo = rotaObj[v.tipo];
      if (valorVeiculo && valorVeiculo > 0) {
        return { tipo: v.tipo, valor: valorVeiculo, eixos: v.eixos };
      }
    }
  }
  // fallback: qualquer um que tenha valor > 0
  for (const v of VEICULOS_FAIXAS) {
    const valorVeiculo = rotaObj[v.tipo];
    if (valorVeiculo && valorVeiculo > 0) {
      return { tipo: v.tipo, valor: valorVeiculo, eixos: v.eixos };
    }
  }
  return null;
}

function estimarPrazo(rota, modalidade) {
    if (modalidade === 'dedicado') return "Imediato / Agendado";
    if (rota === "I") return "2 a 3 dias úteis";
    if (rota === "II") return "3 a 5 dias úteis";
    return "Sob consulta";
}

// =====================================================================
// FUNÇÃO PRINCIPAL EXPORTADA (USADA PELO GERENCIADOR)
// =====================================================================

function calcularLevanteModulo(cidadeDestino, pesoKg, valorNF) {
    // 1. Tenta identificar Rota Fracionada
    let rota = descobrirRotaFracionado(cidadeDestino);
    
    // IMPORTANTE: Definindo Origem Padrão para busca na tabela de Dedicados
    // Como o sistema novo só passa destino, assumimos MAUA-SP como origem padrão para tentar achar na tabela
    // Se precisar de outra origem, precisará ajustar o input do sistema.
    const origemPadrao = "MAUA";
    const ufOrigemPadrao = "SP";
    const ufDestinoPadrao = "SP"; // Assumindo SP se não informado, ou precisaria passar no parametro

    // --- CÁLCULO FRACIONADO ---
    let resultadoFracionado = null;
    
    if (rota) {
        const tarifaTon = TARIFA_POR_ROTA[rota];
        const pesoFaturadoKg = Math.max(pesoKg, PESO_MIN_KG);
        const pesoTon = pesoFaturadoKg / 1000;

        const fretePesoFrac = pesoTon * tarifaTon;
        const freteValorFrac = valorNF * AD_VALOREM_FRAC;
        const despachoFrac = TAXA_DESPACHO;
        const subtotalFrac = fretePesoFrac + freteValorFrac + despachoFrac;
        const totalFrac = subtotalFrac / (1 - ALIQUOTA_ICMS);
        
        resultadoFracionado = {
            fretePeso: fretePesoFrac,
            freteValor: freteValorFrac,
            despacho: despachoFrac,
            icms: totalFrac - subtotalFrac,
            total: totalFrac,
            prazo: estimarPrazo(rota, 'fracionado')
        };
    }

    // --- CÁLCULO DEDICADO ---
    let resultadoDedicado = null;

    // 1. Tenta achar rota específica na tabela gigante (DEDICADO_ROTAS)
    let rotaObj = encontrarRotaDedicado(origemPadrao, ufOrigemPadrao, cidadeDestino, ufDestinoPadrao);

    // 2. Se não achou específica, tenta fallback por Rota I ou II
    if (!rotaObj && rota) {
        const padrao = DEDICADO_PADRAO_ROTA[rota];
        const pedagioPorEixoPadrao = DEDICADO_PADRAO_PEDAGIO_POR_EIXO[rota];
        if (padrao) {
            rotaObj = {
                carreta: padrao.carreta,
                truck: padrao.truck,
                toco: padrao.toco,
                f4000: padrao.f4000,
                f1000: padrao.f1000,
                pedagioPorEixo: pedagioPorEixoPadrao
            };
        }
    }

    // Se conseguiu definir uma rota dedicada (Específica ou Padrão)
    if (rotaObj) {
        const veiculo = escolherVeiculoPorPeso(pesoKg, rotaObj);
        
        if (veiculo) {
            const valorVeiculo = veiculo.valor;
            const pedagioTotal = rotaObj.pedagioPorEixo * veiculo.eixos;
            const freteValorDed = valorNF * AD_VALOREM_DED;
            const subtotalDed = valorVeiculo + pedagioTotal + freteValorDed + CAT_DED;
            const totalDed = subtotalDed / (1 - ALIQUOTA_ICMS);

            resultadoDedicado = {
                fretePeso: valorVeiculo + pedagioTotal, 
                freteValor: freteValorDed,
                despacho: CAT_DED,
                icms: totalDed - subtotalDed,
                total: totalDed,
                prazo: estimarPrazo(rota || "II", 'dedicado')
            };
        }
    }

    // Se não atende nem fracionado nem dedicado, retorna null
    if (!resultadoFracionado && !resultadoDedicado) return null;

    return {
        nome: "Levante Logística",
        fracionado: resultadoFracionado, // Pode ser null se não atender fracionado
        dedicado: resultadoDedicado      // Pode ser null se não atender dedicado
    };
}