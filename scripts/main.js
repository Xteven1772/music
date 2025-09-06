// Lista de canciones y videos disponibles
// Se ha añadido un campo 'artist' para una mejor visualización
const media = [
    { name: "Propose", artist: "9Lana", file: "music/9Lana - propose.mp4", type: "video" },
    { name: "Thunderstruck", artist: "AC/DC", file: "music/AC_DC - Thunderstruck.mp4", type: "video" },
    { name: "Where's My Head At", artist: "Basement Jaxx & 100 gecs", file: "music/Basement Jaxx & 100 gecs - where's my head at _.mp4", type: "video" },
    { name: "1-800", artist: "bbno$ & Ironmouse", file: "music/bbno$ & Ironmouse - 1-800.mp4", type: "video" },
    { name: "Hentai", artist: "Cigarettes After Sex", file: "music/Cigarettes After Sex - Hentai.mp4", type: "video" },
    { name: "Daylight", artist: "David Kushner", file: "music/David Kushner - Daylight.mp4", type: "video" },
    { name: "Woops", artist: "DJ Bountyhunter", file: "music/DJ Bountyhunter - Woops.mp4", type: "video" },
    { name: "Bodies", artist: "Drowning Pool", file: "music/Drowning Pool - Bodies.mp4", type: "video" },
    { name: "Survivor / I Will Survive", artist: "Glee Cast", file: "music/Glee Cast - Survivor _ I Will Survive (Cover of Destiny's Child and Gloria Gaynor).mp4", type: "video" },
    { name: "19-2000", artist: "Gorillaz", file: "music/Gorillaz - 19-2000.mp4", type: "video" },
    { name: "Take Me to the Beach", artist: "Imagine Dragons", file: "music/Imagine Dragons - Take Me to the Beach.mp4", type: "video" },
    { name: "Meant to be Yours", artist: "Jamie Muscato & Original West End Cast of Heathers", file: "music/Jamie Muscato & Original West End Cast of Heathers - Meant to be Yours.mp4", type: "video" },
    { name: "3D - Justin Timberlake Remix", artist: "Jung Kook & Justin Timberlake", file: "music/Jung Kook & Justin Timberlake - 3D - Justin Timberlake Remix.mp4", type: "video" },
    { name: "Monster", artist: "Kanye West", file: "music/Kanye West - Monster.mp4", type: "video" },
    { name: "Freak On a Leash", artist: "Korn", file: "music/Korn - Freak On a Leash.mp4", type: "video" },
    { name: "Rollin' (Air Raid Vehicle)", artist: "Limp Bizkit", file: "music/Limp Bizkit - Rollin' (Air Raid Vehicle).mp4", type: "video" },
    { name: "Given Up", artist: "Linkin Park", file: "music/Linkin Park - Given Up.mp4", type: "video" },
    { name: "In the End", artist: "Linkin Park", file: "music/Linkin Park - In the End.mp4", type: "video" },
    { name: "GOSSIP", artist: "Måneskin", file: "music/Måneskin - GOSSIP.mp4", type: "video" },
    { name: "Enter Sandman", artist: "Metallica", file: "music/Metallica - Enter Sandman.mp4", type: "video" },
    { name: "Master Of Puppets", artist: "Metallica", file: "music/Metallica - Master Of Puppets.mp4", type: "video" },
    { name: "Inferno", artist: "Mrs. GREEN APPLE", file: "music/Mrs. GREEN APPLE - Inferno.mp4", type: "video" },
    { name: "No Surprises", artist: "Radiohead", file: "music/Radiohead - No Surprises.mp4", type: "video" },
    { name: "Amerika", artist: "Rammstein", file: "music/Rammstein - Amerika.mp4", type: "video" },
    { name: "Du hast", artist: "Rammstein", file: "music/Rammstein - Du hast.mp4", type: "video" },
    { name: "Te quiero puta!", artist: "Rammstein", file: "music/Rammstein - Te quiero puta!.mp4", type: "video" },
    { name: "Nothing's New", artist: "Rio Romeo", file: "music/Rio Romeo - Nothing's New.mp4", type: "video" },
    { name: "Dragula", artist: "Rob Zombie", file: "music/Rob Zombie - Dragula.mp4", type: "video" },
    { name: "Vicinity Of Obscenity", artist: "System Of A Down", file: "music/System Of A Down - Vicinity Of Obscenity.mp4", type: "video" }
];

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
    themeSelect: document.getElementById('theme-select'), // ADDED: Elemento para el selector de tema
};

let currentPlayingElement = null; // Para rastrear el elemento li actualmente activo

/**
 * Renderiza la lista de canciones filtradas.
 * @param {string} filter - El texto para filtrar las canciones.
 */
function renderSongs(filter = "") {
    DOM.songList.innerHTML = ""; // Limpiar la lista actual

    const filtered = media.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(filter.toLowerCase())) // Buscar también por artista
    );

    if (filtered.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No hay canciones o videos disponibles.";
        li.classList.add('no-results'); // Clase para estilizar el mensaje
        DOM.songList.appendChild(li);
        hideAllPlayers(); // Ocultar reproductores si no hay resultados
        return;
    }

    filtered.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        if (item.artist) {
            const artistSpan = document.createElement('span');
            artistSpan.textContent = ` - ${item.artist}`;
            artistSpan.style.color = '#bbb'; // Color más tenue para el artista
            artistSpan.style.fontSize = '0.9em';
            li.appendChild(artistSpan);
        }
        if (item.type === 'video') {
            const videoIcon = document.createElement('span');
            videoIcon.textContent = ' 🎬'; // Icono de video
            videoIcon.style.marginLeft = '5px';
            li.appendChild(videoIcon);
        }

        li.dataset.file = item.file; // Guardar el archivo en un atributo de datos
        li.dataset.type = item.type; // Guardar el tipo en un atributo de datos
        li.dataset.name = item.name; // Guardar el nombre
        li.dataset.artist = item.artist || ''; // Guardar el artista

        li.onclick = () => playMedia(item); // Pasar el objeto completo
        DOM.songList.appendChild(li);
    });

    // Resaltar la canción actualmente en reproducción si existe
    if (currentPlayingElement) {
        const activeLi = DOM.songList.querySelector(`li[data-file="${currentPlayingElement.dataset.file}"]`);
        if (activeLi) {
            activeLi.classList.add('active');
        }
    }
}

/**
 * Reproduce un archivo multimedia y actualiza la interfaz.
 * @param {object} mediaItem - El objeto del medio a reproducir (con file, type, name, artist).
 */
function playMedia(mediaItem) {
    const { file, type, name, artist } = mediaItem;

    // Pausar y ocultar todos los reproductores
    DOM.audioPlayer.pause();
    DOM.videoPlayer.pause();
    hideAllPlayers();

    // Eliminar la clase 'active' de la canción previamente seleccionada
    if (currentPlayingElement) {
        currentPlayingElement.classList.remove('active');
    }

    // Encontrar el elemento li correspondiente a la canción que se va a reproducir
    const targetLi = DOM.songList.querySelector(`li[data-file="${file}"]`);
    if (targetLi) {
        targetLi.classList.add('active');
        currentPlayingElement = targetLi; // Actualizar la referencia a la canción activa
    }

    // Actualizar la información del medio
    const updateMediaInfo = (titleElement, artistElement, mediaName, mediaArtist) => {
        titleElement.textContent = mediaName;
        artistElement.textContent = mediaArtist || 'Artista Desconocido';
    };

    if (type === 'audio') {
        DOM.audioPlayer.src = file;
        DOM.audioSlide.style.display = 'flex';
        DOM.audioPlayer.load(); // Cargar el medio
        DOM.audioPlayer.play().catch(error => {
            console.error("Error al reproducir audio:", error);
            // alert("No se pudo reproducir el audio. Asegúrate de que el archivo exista y sea accesible."); // REMOVED: Alert puede ser molesto
        });
        updateMediaInfo(DOM.audioInfoTitle, DOM.audioInfoArtist, name, artist);
    } else if (type === 'video') {
        DOM.videoPlayer.src = file;
        DOM.videoSlide.style.display = 'flex';
        DOM.videoPlayer.load(); // Cargar el medio
        DOM.videoPlayer.play().catch(error => {
            console.error("Error al reproducir video:", error);
            // alert("No se pudo reproducir el video. Asegúrate de que el archivo exista y sea accesible."); // REMOVED: Alert puede ser molesto
        });
        updateMediaInfo(DOM.videoInfoTitle, DOM.videoInfoArtist, name, artist);
    }
}

/**
 * Oculta ambos reproductores (audio y video).
 */
function hideAllPlayers() {
    DOM.audioSlide.style.display = 'none';
    DOM.videoSlide.style.display = 'none';
}

/**
 * Aplica el tema seleccionado al body del documento.
 * @param {string} themeName - El nombre del tema (ej. 'normal', 'red').
 */
function applyTheme(themeName) {
    // Eliminar todas las clases de tema existentes
    document.body.className = '';
    // Añadir la nueva clase de tema
    document.body.classList.add(`theme-${themeName}`);
    // Guardar la preferencia del usuario (opcional, para que el tema persista)
    localStorage.setItem('selectedTheme', themeName);
}


// Event Listener para la barra de búsqueda
DOM.searchInput.addEventListener('input', function() {
    renderSongs(this.value);
});

// Event Listeners para manejar errores de carga de medios
DOM.audioPlayer.addEventListener('error', (e) => {
    console.error("Error de carga de audio:", e);
    // alert("Error al cargar el archivo de audio. Puede que el archivo esté dañado o no exista."); // REMOVED: Alert puede ser molesto
    hideAllPlayers();
});

DOM.videoPlayer.addEventListener('error', (e) => {
    console.error("Error de carga de video:", e);
    // alert("Error al cargar el archivo de video. Puede que el archivo esté dañado o no exista."); // REMOVED: Alert puede ser molesto
    hideAllPlayers();
});


// Inicializar la lista de canciones y cargar el tema cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // ADDED: Cargar el tema guardado al cargar la página
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
        DOM.themeSelect.value = savedTheme; // Asegurarse de que el select muestre el tema correcto
    } else {
        applyTheme('normal'); // Aplicar el tema normal si no hay uno guardado
    }

    // ADDED: Event Listener para el cambio de tema
    DOM.themeSelect.addEventListener('change', function() {
        applyTheme(this.value);
    });

    renderSongs(); // Inicializar la lista de canciones
});