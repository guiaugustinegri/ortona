// ===== CONFIGURAÇÃO =====
const CONFIG = {
    chaptersPath: '../capitulos-finais V2 - Story/',
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
        { number: 12, file: 'Capitulo_12_O_QUEIJO_E_A_ARMADILHA.md', title: 'O Queijo e a Armadilha', date: '1943' },
        { number: 13, file: 'Capitulo_13_O_Cacador_e_o_Preco.md', title: 'O Caçador e o Preço', date: '1943' },
        { number: 14, file: 'Capitulo_14_O_Rugir_dos_Tanques.md', title: 'O Rugir dos Tanques', date: '1943' },
        { number: 15, file: 'Capitulo_15_A_Queda_da_Fortaleza.md', title: 'A Queda da Fortaleza', date: '1943' },
        { number: 16, file: 'Capitulo_16_O_Preco_da_Liberdade.md', title: 'O Preço da Liberdade', date: '1943' },
        { number: 17, file: 'Capitulo_17_Epilogo_2025.md', title: 'Epílogo 2025', date: '2025' }
    ]
};

// ===== ESTADO GLOBAL =====
let currentChapter = 1;
let totalChapters = CONFIG.chapters.length;
let isLoading = false;
let bookmarks = JSON.parse(localStorage.getItem('ortona-bookmarks') || '[]');

// ===== ELEMENTOS DOM =====
const elements = {
    loading: document.getElementById('loading'),
    chapterContent: document.getElementById('chapter-content'),
    chapterTitle: document.getElementById('chapter-title'),
    chapterNumber: document.getElementById('chapter-number'),
    chapterText: document.getElementById('chapter-text'),
    chapterList: document.getElementById('chapter-list'),
    prevButton: document.getElementById('prev-chapter'),
    nextButton: document.getElementById('next-chapter'),
    headerPrevButton: document.getElementById('header-prev-chapter'),
    headerNextButton: document.getElementById('header-next-chapter'),
    reloadButton: document.getElementById('reload-chapter'),
    currentChapterInfo: document.getElementById('current-chapter-info'),
    progressFill: document.getElementById('progress-fill'),
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    themeToggle: document.getElementById('theme-toggle'),
    fontSizeDecrease: document.getElementById('font-size-decrease'),
    fontSizeIncrease: document.getElementById('font-size-increase'),
    bookmarkToggle: document.getElementById('bookmark-toggle'),
    shareChapter: document.getElementById('share-chapter')
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        initializeReader();
        setupEventListeners();
        
        // Verificar se há slug na URL
        const path = window.location.pathname;
        const slugMatch = path.match(/\/capitulo-(\d+)/);
        if (slugMatch) {
            const chapterFromSlug = parseInt(slugMatch[1]);
            if (chapterFromSlug >= 1 && chapterFromSlug <= totalChapters) {
                currentChapter = chapterFromSlug;
            }
        }
        
        loadChapter(currentChapter);
    }, 100);
});

function initializeReader() {
    // Debug: verificar se elementos existem
    console.log('Elementos encontrados:', {
        chapterTitle: !!elements.chapterTitle,
        chapterNumber: !!elements.chapterNumber,
        chapterText: !!elements.chapterText
    });
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('ortona-theme') || 'light';
    setTheme(savedTheme);
    
    // Carregar tamanho da fonte salvo
    const savedFontSize = localStorage.getItem('ortona-font-size') || '18';
    setFontSize(savedFontSize);
    
    // Construir lista de capítulos
    buildChapterList();
    
    // Atualizar navegação
    updateNavigation();
    
    // Atualizar progresso
    updateProgress();
}

function setupEventListeners() {
    // Navegação
    elements.prevButton.addEventListener('click', () => navigateChapter(-1));
    elements.nextButton.addEventListener('click', () => navigateChapter(1));
    elements.headerPrevButton.addEventListener('click', () => navigateChapter(-1));
    elements.headerNextButton.addEventListener('click', () => navigateChapter(1));
    elements.reloadButton.addEventListener('click', () => reloadCurrentChapter());
    
    // Sidebar
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Controles
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.fontSizeDecrease.addEventListener('click', () => adjustFontSize(-2));
    elements.fontSizeIncrease.addEventListener('click', () => adjustFontSize(2));
    
    // Bookmarks e compartilhamento
    elements.bookmarkToggle.addEventListener('click', toggleBookmark);
    elements.shareChapter.addEventListener('click', shareChapter);
    
    // Teclado
    document.addEventListener('keydown', handleKeyboard);
    
    // Fechar sidebar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!elements.sidebar.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
            elements.sidebar.classList.remove('open');
        }
    });
}

// ===== CARREGAMENTO DE CAPÍTULOS =====
async function loadChapter(chapterNumber, timestamp = null) {
    if (isLoading || chapterNumber < 1 || chapterNumber > totalChapters) return;
    
    isLoading = true;
    currentChapter = chapterNumber;
    
    // Mostrar loading
    elements.loading.classList.remove('hidden');
    elements.chapterContent.classList.add('hidden');
    
    try {
        const chapter = CONFIG.chapters[chapterNumber - 1];
        const url = timestamp ? 
            `${CONFIG.chaptersPath}${chapter.file}?t=${timestamp}` : 
            `${CONFIG.chaptersPath}${chapter.file}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar capítulo: ${response.status}`);
        }
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        
        // Atualizar conteúdo
        if (elements.chapterTitle) elements.chapterTitle.textContent = chapter.title;
        if (elements.chapterNumber) elements.chapterNumber.textContent = `Capítulo ${chapter.number}`;
        if (elements.chapterText) elements.chapterText.innerHTML = html;
        
        // Atualizar URL com slug
        const slug = `/capitulo-${chapter.number}`;
        window.history.pushState({}, '', slug);
        
        // Estilizar diálogos automaticamente
        styleDialogs();
        
        // Atualizar navegação
        updateNavigation();
        updateChapterList();
        updateProgress();
        updateBookmarkButton();
        
        // Esconder loading e mostrar conteúdo
        elements.loading.classList.add('hidden');
        elements.chapterContent.classList.remove('hidden');
        elements.chapterContent.classList.add('fade-in');
        
        // Scroll para o topo
        window.scrollTo(0, 0);
        
        // Salvar capítulo atual
        localStorage.setItem('ortona-current-chapter', chapterNumber);
        
    } catch (error) {
        console.error('Erro ao carregar capítulo:', error);
        elements.chapterText.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <h3>Erro ao carregar capítulo</h3>
                <p>Não foi possível carregar o capítulo ${chapterNumber}.</p>
                <p>Verifique se o arquivo existe e tente novamente.</p>
            </div>
        `;
        elements.loading.classList.add('hidden');
        elements.chapterContent.classList.remove('hidden');
    }
    
    isLoading = false;
}

// ===== NAVEGAÇÃO =====
function navigateChapter(direction) {
    const newChapter = currentChapter + direction;
    if (newChapter >= 1 && newChapter <= totalChapters) {
        loadChapter(newChapter);
    }
}

function reloadCurrentChapter() {
    if (isLoading) return;
    
    // Adicionar timestamp para forçar recarregamento
    const timestamp = new Date().getTime();
    const chapter = CONFIG.chapters.find(c => c.number === currentChapter);
    
    if (chapter) {
        loadChapter(currentChapter, timestamp);
    }
}

function buildChapterList() {
    elements.chapterList.innerHTML = '';
    
    CONFIG.chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.className = 'chapter-item';
        
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'chapter-link';
        a.dataset.chapter = chapter.number;
        
        a.innerHTML = `
            <div class="chapter-link-title">${chapter.title}</div>
            <div class="chapter-link-number">Capítulo ${chapter.number} • ${chapter.date}</div>
        `;
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadChapter(chapter.number);
            elements.sidebar.classList.remove('open');
        });
        
        li.appendChild(a);
        elements.chapterList.appendChild(li);
    });
}

function updateChapterList() {
    const links = elements.chapterList.querySelectorAll('.chapter-link');
    links.forEach(link => {
        const chapterNum = parseInt(link.dataset.chapter);
        link.classList.toggle('active', chapterNum === currentChapter);
    });
}

function updateNavigation() {
    elements.prevButton.disabled = currentChapter <= 1;
    elements.nextButton.disabled = currentChapter >= totalChapters;
    elements.headerPrevButton.disabled = currentChapter <= 1;
    elements.headerNextButton.disabled = currentChapter >= totalChapters;
    elements.currentChapterInfo.textContent = `Capítulo ${currentChapter} de ${totalChapters}`;
}

function updateProgress() {
    const progress = (currentChapter / totalChapters) * 100;
    elements.progressFill.style.width = `${progress}%`;
}

// ===== SIDEBAR =====
function toggleSidebar() {
    elements.sidebar.classList.toggle('open');
}

// ===== TEMA =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ortona-theme', theme);
    
    const themeIcon = elements.themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? 'D' : 'L';
}

// ===== FONTE =====
function adjustFontSize(delta) {
    const currentSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-size-base'));
    const newSize = Math.max(14, Math.min(24, currentSize + delta));
    setFontSize(newSize);
}

function setFontSize(size) {
    document.documentElement.style.setProperty('--font-size-base', `${size}px`);
    localStorage.setItem('ortona-font-size', size);
}

// ===== BOOKMARKS =====
function toggleBookmark() {
    const chapterIndex = bookmarks.indexOf(currentChapter);
    
    if (chapterIndex > -1) {
        bookmarks.splice(chapterIndex, 1);
        elements.bookmarkToggle.textContent = 'Marcar página';
    } else {
        bookmarks.push(currentChapter);
        elements.bookmarkToggle.textContent = 'Desmarcar página';
    }
    
    localStorage.setItem('ortona-bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButton();
}

function updateBookmarkButton() {
    const isBookmarked = bookmarks.includes(currentChapter);
    elements.bookmarkToggle.textContent = isBookmarked ? 'Desmarcar página' : 'Marcar página';
}

// ===== COMPARTILHAMENTO =====
function shareChapter() {
    const chapter = CONFIG.chapters[currentChapter - 1];
    const url = `${window.location.origin}${window.location.pathname}#chapter-${currentChapter}`;
    const text = `Leia o capítulo "${chapter.title}" do livro Ortona`;
    
    if (navigator.share) {
        navigator.share({
            title: `Ortona - ${chapter.title}`,
            text: text,
            url: url
        });
    } else {
        // Fallback: copiar para clipboard
        navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

// ===== TECLADO =====
function handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateChapter(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateChapter(1);
            break;
        case 'Escape':
            elements.sidebar.classList.remove('open');
            break;
        case 'b':
        case 'B':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleBookmark();
            }
            break;
        case 'r':
        case 'R':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                reloadCurrentChapter();
            }
            break;
    }
}

// ===== UTILITÁRIOS =====
function showNotification(message, type = 'info') {
    // Implementar notificação se necessário
    console.log(`${type.toUpperCase()}: ${message}`);
}

// ===== ESTILIZAÇÃO DE DIÁLOGOS =====
function styleDialogs() {
    const paragraphs = elements.chapterText.querySelectorAll('p');
    
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        
        // Detectar linhas que começam com travessão (-)
        if (text.startsWith('—') || text.startsWith('-')) {
            // Criar estrutura de diálogo
            const parts = text.split(':', 2);
            if (parts.length === 2) {
                const speaker = parts[0].replace(/^[—\-]\s*/, '').trim();
                const dialogue = parts[1].trim();
                
                p.innerHTML = `
                    <strong>${speaker}</strong>
                    ${dialogue}
                `;
                p.classList.add('dialogue');
            } else {
                // Diálogo sem falante identificado
                const dialogue = text.replace(/^[—\-]\s*/, '');
                p.innerHTML = `<em>${dialogue}</em>`;
                p.classList.add('dialogue-simple');
            }
        }
        
        // Detectar linhas que começam com asterisco (*) - pensamentos
        if (text.startsWith('*') && text.endsWith('*')) {
            const thought = text.slice(1, -1).trim();
            p.innerHTML = `<em class="thought">${thought}</em>`;
            p.classList.add('thought');
        }
    });
}

// ===== CARREGAR CAPÍTULO SALVO =====
window.addEventListener('load', () => {
    const savedChapter = localStorage.getItem('ortona-current-chapter');
    if (savedChapter && savedChapter !== currentChapter.toString()) {
        loadChapter(parseInt(savedChapter));
    }
});

// ===== DETECÇÃO DE MUDANÇA DE ARQUIVO =====
// Para desenvolvimento - recarregar automaticamente se arquivo mudar
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setInterval(async () => {
        try {
            const chapter = CONFIG.chapters[currentChapter - 1];
            const response = await fetch(`${CONFIG.chaptersPath}${chapter.file}`, { method: 'HEAD' });
            if (response.ok) {
                const lastModified = response.headers.get('Last-Modified');
                if (lastModified && lastModified !== localStorage.getItem(`ortona-last-modified-${currentChapter}`)) {
                    localStorage.setItem(`ortona-last-modified-${currentChapter}`, lastModified);
                    loadChapter(currentChapter);
                }
            }
        } catch (error) {
            // Ignorar erros de verificação
        }
    }, 5000);
}
