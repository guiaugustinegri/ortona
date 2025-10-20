// ===== CONFIGURAÇÃO DO LEITOR ORTONA =====
// Este arquivo contém todas as configurações do leitor
// Modifique aqui para alterar diretórios, capítulos e músicas

const READER_CONFIG = {
    // Caminho para os capítulos (relativo ao leitor)
    // Em produção, os capítulos serão copiados para "leitor/capitulos/"
    chaptersPath: 'capitulos/',
    
    // Lista de capítulos
    chapters: [
        { number: 1, file: 'Capitulo_01_O_Cerco_de_Ortona.md', title: 'O Cerco de Ortona', date: '1943' },
        { number: 2, file: 'Capitulo_02_Florenca_O_Comeco_da_Ruptura.md', title: 'Florença - O Começo da Ruptura', date: '1943' },
        { number: 3, file: 'Capitulo_03_O_Reencontro_e_a_Decisao.md', title: 'O Reencontro e a Decisão', date: '1943' },
        { number: 4, file: 'Capitulo_04_O_Retorno_a_Ortona.md', title: 'O Retorno a Ortona', date: '1943' },
        { number: 5, file: 'Capitulo_05_O_Bosque.md', title: 'O Bosque', date: '1943' },
        { number: 6, file: 'Capitulo_06_Canada_A_Guerra_Antes_de_Ortona.md', title: 'Canadá - A Guerra Antes de Ortona', date: '1942' },
        { number: 7, file: 'Capitulo_07_A_Cacada.md', title: 'A Caçada', date: '1943' },
        { number: 8, file: 'Capitulo_08_O_Encontro.md', title: 'O Encontro', date: '1943' },
        { number: 9, file: 'Capitulo_09_A_Resposta_de_Ferro.md', title: 'A Resposta de Ferro', date: '1943' },
        { number: 10, file: 'Capitulo_10_A_Cidade_sob_Ferro.md', title: 'A Cidade sob Ferro', date: '1943' },
        { number: 11, file: 'Capitulo_11_A_Missao_Secreta.md', title: 'A Missão Secreta', date: '1943' },
        { number: 12, file: 'Capitulo_12_A_Fuga_e_a_Descoberta.md', title: 'A Fuga e a Descoberta', date: '1943' },
        { number: 13, file: 'Capitulo_13_A_Captura_e_o_Encontro_Final.md', title: 'A Captura e o Encontro Final', date: '1943' },
        { number: 14, file: 'Capitulo_14_O_Retorno_e_a_Humilhacao.md', title: 'O Retorno e a Humilhação', date: '1943' },
        { number: 15, file: 'Capitulo_15_O_Mapa_e_a_Paz_Armada.md', title: 'O Mapa e a Paz Armada', date: '1943' },
        { number: 16, file: 'Capitulo_16_A_Preparacao_e_a_Explosao.md', title: 'A Preparação e a Explosão', date: '1943' },
        { number: 17, file: 'Capitulo_17_A_Corrida_e_o_Rugir.md', title: 'A Corrida e o Rugir', date: '1943' },
        { number: 18, file: 'Capitulo_18_A_Fortaleza_e_o_Encontro.md', title: 'A Fortaleza e o Encontro', date: '1943' },
        { number: 19, file: 'Capitulo_19_O_Porao_e_o_Amanhecer.md', title: 'O Porão e o Amanhecer', date: '1943' },
        { number: 20, file: 'Capitulo_20_O_Preco_da_Liberdade.md', title: 'O Preço da Liberdade', date: '1943' },
        { number: 21, file: 'Capitulo_21_Epilogo_2025.md', title: 'Epílogo 2025', date: '2025' }
    ],
    
    // Configuração de música por capítulos
    musicConfig: {
        enabled: true,
        // Caminho para a pasta de música (relativo ao leitor)
        // Em produção, as músicas serão copiadas para "leitor/trilha sonora/"
        musicPath: 'trilha sonora/',
        tracks: [
            { 
                file: 'trilha sonora/Chamas.mp3', 
                chapters: [1, 2, 3], 
                name: 'Chamas',
                description: 'Música de abertura para os primeiros capítulos'
            },
            // Adicione mais músicas aqui:
            // { 
            //     file: '../trilha sonora/NovaMusica.mp3', 
            //     chapters: [4, 5, 6], 
            //     name: 'Nova Música',
            //     description: 'Descrição da música'
            // },
        ]
    },
    
    // Configurações gerais
    settings: {
        // Tema padrão: 'light' ou 'dark'
        defaultTheme: 'dark',
        // Tamanho de fonte padrão
        defaultFontSize: 18,
        // Volume padrão da música (0-100)
        defaultMusicVolume: 50,
        // Reproduzir música automaticamente
        defaultMusicAutoPlay: false,
        // Repetir música
        defaultMusicLoop: true
    }
};

// ===== AJUSTE AUTOMÁTICO DE CAMINHOS (LOCAL vs RENDER) =====
// Local: usa arquivos originais nas pastas da raiz (../Final e ../trilha sonora)
// Render: usa cópias dentro de leitor/ (capitulos/ e trilha sonora/)
(function() {
    const isLocal = (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:'
    );

    if (isLocal) {
        READER_CONFIG.chaptersPath = '../Final/';
        READER_CONFIG.musicConfig.musicPath = '../trilha sonora/';
        // Também ajustar caminhos absolutos de tracks se necessário
        READER_CONFIG.musicConfig.tracks = READER_CONFIG.musicConfig.tracks.map(t => ({
            ...t,
            file: t.file.startsWith('trilha sonora/') ? ('../' + t.file) : t.file
        }));
    }
})();

// ===== INSTRUÇÕES DE CONFIGURAÇÃO =====
/*
COMO CONFIGURAR MÚSICAS POR CAPÍTULOS:

1. Adicione seus arquivos MP3 na pasta "trilha sonora/"
2. No array 'tracks' acima, adicione um objeto para cada música:
   {
       file: 'caminho/para/musica.mp3',    // Caminho relativo ao leitor
       chapters: [1, 2, 3],               // Array com números dos capítulos
       name: 'Nome da Música',            // Nome que aparecerá no player
       description: 'Descrição opcional'  // Descrição da música
   }

EXEMPLOS DE CONFIGURAÇÃO:

// Uma música para capítulos 1-3:
{ file: '../trilha sonora/Abertura.mp3', chapters: [1, 2, 3], name: 'Abertura' }

// Uma música para capítulos 4-6:
{ file: '../trilha sonora/Meio.mp3', chapters: [4, 5, 6], name: 'Meio da História' }

// Uma música apenas para o capítulo 10:
{ file: '../trilha sonora/Climax.mp3', chapters: [10], name: 'Clímax' }

// Uma música para capítulos 20-21 (final):
{ file: '../trilha sonora/Final.mp3', chapters: [20, 21], name: 'Final' }

COMO ALTERAR O DIRETÓRIO DOS CAPÍTULOS:

1. Altere a propriedade 'chaptersPath' acima
2. Exemplos:
   - '../Final/' (pasta Final)
   - '../Versões Texto/capitulos-finais V1/' (outra pasta)
   - '../capitulos/' (pasta capitulos)

COMO ADICIONAR/REMOVER CAPÍTULOS:

1. Adicione ou remova objetos no array 'chapters'
2. Cada capítulo deve ter:
   - number: número do capítulo
   - file: nome do arquivo .md
   - title: título do capítulo
   - date: ano do capítulo
*/
