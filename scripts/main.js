// Cache de elementos del DOM para evitar búsquedas repetitivas
const DOM = {
    songList: document.getElementById('song-list'),
    searchInput: document.getElementById('search'),
    audioPlayer: document.getElementById('audio-player'),
    videoPlayer: document.getElementById('video-player'),
    audioSlide: document.getElementById('audio-slide'),
    videoSlide: document.getElementById('video-slide'),
    audioInfoTitle: document.querySelector('#audio-info .media-title'),
    audioInfoArtist: document.querySelector('#audio-info .media-artist'),
    videoInfoTitle: document.querySelector('#video-info .media-title'),
    videoInfoArtist: document.querySelector('#video-info .media-artist'),
    themeSelect: document.getElementById('theme-select'),
};

let currentPlayingElement = null;

/**
 * Oculta ambos reproductores (audio y video) y pausa la reproducción.
 */
function hideAllPlayers() {
    DOM.audioSlide.style.display = 'none';
    DOM.videoSlide.style.display = 'none';
    DOM.audioPlayer.pause();
    DOM.videoPlayer.pause();
}

/**
 * Reproduce el medio seleccionado (audio o video).
 * @param {Object} item - Objeto con propiedades: name, artist, file, type.
 */
function playMedia(item) {
    hideAllPlayers();

    // Remover clase 'active' de la canción anterior
    if (currentPlayingElement) {
        currentPlayingElement.classList.remove('active');
    }

    // Buscar el <li> correspondiente y marcarlo activo
    const lis = DOM.songList.querySelectorAll('li');
    lis.forEach(li => {
        if (li.dataset.file === item.file) {
            li.classList.add('active');
            currentPlayingElement = li;
        } else {
            li.classList.remove('active');
        }
    });

    if (item.type === 'audio') {
        DOM.audioPlayer.src = item.file;
        DOM.audioInfoTitle.textContent = item.name;
        DOM.audioInfoArtist.textContent = item.artist || '';
        DOM.audioSlide.style.display = 'block';
        DOM.audioPlayer.play();
    } else if (item.type === 'video') {
        DOM.videoPlayer.src = item.file;
        DOM.videoInfoTitle.textContent = item.name;
        DOM.videoInfoArtist.textContent = item.artist || '';
        DOM.videoSlide.style.display = 'block';
        DOM.videoPlayer.play();
    }
}

/**
 * Aplica el tema seleccionado al body y guarda la preferencia.
 * @param {string} themeName - Nombre del tema.
 */
function applyTheme(themeName) {
    document.body.className = ''; // Limpiar clases previas
    if (themeName && themeName !== 'normal') {
        document.body.classList.add(themeName);
    }
    localStorage.setItem('selectedTheme', themeName);
}

/**
 * Renderiza la lista de canciones filtradas.
 * @param {string} filter - Texto para filtrar canciones.
 */
function renderSongs(filter = "") {
    DOM.songList.innerHTML = "";

    // 'media' viene de media-data.js cargado antes de este script
    const filtered = media.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filtered.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No hay canciones o videos disponibles.";
        li.classList.add('no-results');
        DOM.songList.appendChild(li);
        hideAllPlayers();
        return;
    }

    filtered.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        if (item.artist) {
            const artistSpan = document.createElement('span');
            artistSpan.textContent = ` - ${item.artist}`;
            artistSpan.style.color = '#bbb';
            artistSpan.style.fontSize = '0.9em';
            li.appendChild(artistSpan);
        }
        if (item.type === 'video') {
            const videoIcon = document.createElement('span');
            videoIcon.textContent = ' 🎬';
            videoIcon.style.marginLeft = '5px';
            li.appendChild(videoIcon);
        }

        li.dataset.file = item.file;
        li.dataset.type = item.type;
        li.dataset.name = item.name;
        li.dataset.artist = item.artist || '';

        li.onclick = () => playMedia(item);
        DOM.songList.appendChild(li);
    });

    // Si hay una canción activa, mantenerla resaltada
    if (currentPlayingElement) {
        const activeLi = DOM.songList.querySelector(`li[data-file="${currentPlayingElement.dataset.file}"]`);
        if (activeLi) {
            activeLi.classList.add('active');
        }
    }
}

// Event listeners y carga inicial
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar tema guardado o tema por defecto
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
        DOM.themeSelect.value = savedTheme;
    } else {
        applyTheme('normal');
    }

    // Cambiar tema al seleccionar
    DOM.themeSelect.addEventListener('change', function() {
        applyTheme(this.value);
    });

    // Filtrar canciones al escribir en el input de búsqueda
    DOM.searchInput.addEventListener('input', () => {
        renderSongs(DOM.searchInput.value);
    });

    // Renderizar lista inicial sin filtro
    renderSongs();
});