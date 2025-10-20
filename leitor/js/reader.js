// ===== CONFIGURAÇÃO =====
// A configuração agora é carregada do arquivo config.js
// Use READER_CONFIG para acessar as configurações

// ===== ESTADO GLOBAL =====
let currentChapter = 1;
let totalChapters = READER_CONFIG.chapters.length;
let isLoading = false;
let bookmarks = JSON.parse(localStorage.getItem('ortona-bookmarks') || '[]');

// Estado do player de música
let musicPlayer = {
    audio: null,
    currentTrack: null,
    isPlaying: false,
    isMuted: false,
    volume: 50,
    autoPlay: false,
    loop: true
};

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
    shareChapter: document.getElementById('share-chapter'),
    // Elementos do player de música
    musicToggle: document.getElementById('music-toggle'),
    musicPanel: document.getElementById('music-panel'),
    musicPanelClose: document.getElementById('music-panel-close'),
    musicPlayPause: document.getElementById('music-play-pause'),
    musicStop: document.getElementById('music-stop'),
    musicMute: document.getElementById('music-mute'),
    musicVolume: document.getElementById('music-volume'),
    volumeDisplay: document.getElementById('volume-display'),
    musicAutoPlay: document.getElementById('music-auto-play'),
    musicLoop: document.getElementById('music-loop'),
    backgroundMusic: document.getElementById('background-music'),
    currentTrackName: document.getElementById('current-track-name'),
    currentTrackChapters: document.getElementById('current-track-chapters')
};
// Elementos auxiliares (podem não existir em todas as páginas)
elements.mobileMusicHint = document.getElementById('mobile-music-hint');
elements.mobileMusicEnable = document.getElementById('mobile-music-enable');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        initializeReader();
        setupEventListeners();
        
        // Verificar slug via hash (ex: #capitulo-3)
        const hashMatch = window.location.hash.match(/capitulo-(\d+)/);
        if (hashMatch) {
            const chapterFromHash = parseInt(hashMatch[1]);
            if (chapterFromHash >= 1 && chapterFromHash <= totalChapters) {
                currentChapter = chapterFromHash;
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
    const savedTheme = localStorage.getItem('ortona-theme') || READER_CONFIG.settings.defaultTheme || 'dark';
    setTheme(savedTheme);
    
    // Carregar tamanho da fonte salvo
    const savedFontSize = localStorage.getItem('ortona-font-size') || '18';
    setFontSize(savedFontSize);
    
    // Inicializar player de música
    initializeMusicPlayer();
    
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
    
    // Player de música
    if (elements.musicToggle) elements.musicToggle.addEventListener('click', toggleMusicPanel);
    elements.musicPanelClose.addEventListener('click', closeMusicPanel);
    if (elements.musicPlayPause) elements.musicPlayPause.addEventListener('click', toggleMusicPlayPause);
    if (elements.musicStop) elements.musicStop.addEventListener('click', stopMusic);
    if (elements.musicMute) elements.musicMute.addEventListener('click', toggleMusicMute);
    if (elements.musicVolume) elements.musicVolume.addEventListener('input', adjustMusicVolume);
    if (elements.musicAutoPlay) elements.musicAutoPlay.addEventListener('change', toggleMusicAutoPlay);
    if (elements.musicLoop) elements.musicLoop.addEventListener('change', toggleMusicLoop);

    // Botão mobile para habilitar áudio
    if (elements.mobileMusicEnable) {
        elements.mobileMusicEnable.addEventListener('click', () => {
            musicPlayer.autoPlay = true;
            localStorage.setItem('ortona-music-autoplay', 'true');
            if (elements.mobileMusicHint) elements.mobileMusicHint.classList.add('hidden');
            // Toca imediatamente se já houver trilha para o capítulo
            playMusic();
        });
    }
    
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
        const chapter = READER_CONFIG.chapters[chapterNumber - 1];
        const url = timestamp ? 
            `${READER_CONFIG.chaptersPath}${chapter.file}?t=${timestamp}` : 
            `${READER_CONFIG.chaptersPath}${chapter.file}`;
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
        
        // Atualizar URL com hash (evita 404 em refresh em hosts estáticos)
        const slug = `capitulo-${chapter.number}`;
        window.location.hash = slug;
        
        // Estilizar diálogos automaticamente
        styleDialogs();
        
        // Atualizar navegação
        updateNavigation();
        updateChapterList();
        updateProgress();
        updateBookmarkButton();
        
        // Verificar música para o capítulo atual
        checkMusicForChapter(currentChapter);
        
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
    const chapter = READER_CONFIG.chapters.find(c => c.number === currentChapter);
    
    if (chapter) {
        loadChapter(currentChapter, timestamp);
    }
}

function buildChapterList() {
    elements.chapterList.innerHTML = '';
    
    READER_CONFIG.chapters.forEach((chapter, index) => {
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
    const chapter = READER_CONFIG.chapters[currentChapter - 1];
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
            const chapter = READER_CONFIG.chapters[currentChapter - 1];
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

// ===== PLAYER DE MÚSICA =====
function initializeMusicPlayer() {
    musicPlayer.audio = elements.backgroundMusic;
    
    // Carregar configurações salvas
    musicPlayer.volume = parseInt(localStorage.getItem('ortona-music-volume') || '50');
    const defaultAutoPlay = READER_CONFIG.settings.defaultMusicAutoPlay === true;
    const savedAutoPlay = localStorage.getItem('ortona-music-autoplay');
    musicPlayer.autoPlay = savedAutoPlay !== null ? (savedAutoPlay === 'true') : defaultAutoPlay;
    musicPlayer.loop = localStorage.getItem('ortona-music-loop') !== 'false';
    
    // Aplicar configurações
    elements.musicVolume.value = musicPlayer.volume;
    elements.volumeDisplay.textContent = `${musicPlayer.volume}%`;
    elements.musicAutoPlay.checked = musicPlayer.autoPlay;
    elements.musicLoop.checked = musicPlayer.loop;
    
    // Configurar áudio
    musicPlayer.audio.volume = musicPlayer.volume / 100;
    musicPlayer.audio.loop = musicPlayer.loop;
    
    // Event listeners do áudio
    musicPlayer.audio.addEventListener('play', () => {
        musicPlayer.isPlaying = true;
        updateMusicControls();
    });
    
    musicPlayer.audio.addEventListener('pause', () => {
        musicPlayer.isPlaying = false;
        updateMusicControls();
    });
    
    musicPlayer.audio.addEventListener('ended', () => {
        musicPlayer.isPlaying = false;
        updateMusicControls();
    });
}

function toggleMusicPanel() {
    // Em mobile: primeiro clique abre/fecha painel; segundo botão play/pause já existe no painel
    elements.musicPanel.classList.toggle('hidden');
    elements.musicToggle.classList.toggle('active', !elements.musicPanel.classList.contains('hidden'));
}

function closeMusicPanel() {
    elements.musicPanel.classList.add('hidden');
    elements.musicToggle.classList.remove('active');
}

function checkMusicForChapter(chapterNumber) {
    if (!READER_CONFIG.musicConfig.enabled) return;
    
    const track = READER_CONFIG.musicConfig.tracks.find(t => t.chapters.includes(chapterNumber));
    
    if (track && track !== musicPlayer.currentTrack) {
        musicPlayer.currentTrack = track;
        musicPlayer.audio.src = track.file;
        elements.currentTrackName.textContent = track.name;
        elements.currentTrackChapters.textContent = `Capítulos: ${track.chapters.join(', ')}`;
        
        if (musicPlayer.autoPlay) {
            playMusic();
        } else if (elements.mobileMusicHint) {
            // Mostrar dica no mobile quando há trilha disponível e autoplay desligado
            elements.mobileMusicHint.classList.remove('hidden');
        }
    } else if (!track && musicPlayer.currentTrack) {
        // Parar música se não há track para este capítulo
        stopMusic();
        musicPlayer.currentTrack = null;
        elements.currentTrackName.textContent = 'Nenhuma música tocando';
        elements.currentTrackChapters.textContent = 'Capítulos: -';
        if (elements.mobileMusicHint) elements.mobileMusicHint.classList.add('hidden');
    }
}

function toggleMusicPlayPause() {
    if (musicPlayer.isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    if (musicPlayer.currentTrack && musicPlayer.audio.src) {
        musicPlayer.audio.play().catch(error => {
            console.log('Erro ao reproduzir música:', error);
        });
    }
}

function pauseMusic() {
    musicPlayer.audio.pause();
}

function stopMusic() {
    musicPlayer.audio.pause();
    musicPlayer.audio.currentTime = 0;
    musicPlayer.isPlaying = false;
    updateMusicControls();
}

function toggleMusicMute() {
    musicPlayer.isMuted = !musicPlayer.isMuted;
    musicPlayer.audio.muted = musicPlayer.isMuted;
    updateMusicControls();
}

function adjustMusicVolume() {
    musicPlayer.volume = parseInt(elements.musicVolume.value);
    musicPlayer.audio.volume = musicPlayer.volume / 100;
    elements.volumeDisplay.textContent = `${musicPlayer.volume}%`;
    localStorage.setItem('ortona-music-volume', musicPlayer.volume);
}

function toggleMusicAutoPlay() {
    musicPlayer.autoPlay = elements.musicAutoPlay.checked;
    localStorage.setItem('ortona-music-autoplay', musicPlayer.autoPlay);
}

function toggleMusicLoop() {
    musicPlayer.loop = elements.musicLoop.checked;
    musicPlayer.audio.loop = musicPlayer.loop;
    localStorage.setItem('ortona-music-loop', musicPlayer.loop);
}

function updateMusicControls() {
    elements.musicPlayPause.textContent = musicPlayer.isPlaying ? '⏸' : '▶';
    elements.musicMute.textContent = musicPlayer.isMuted ? '🔇' : '🔊';
    
    elements.musicPlayPause.classList.toggle('active', musicPlayer.isPlaying);
    elements.musicMute.classList.toggle('active', musicPlayer.isMuted);
}
