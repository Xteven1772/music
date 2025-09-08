const fs = require('fs');
const path = require('path');

// Ruta a la carpeta 'music' (subimos un nivel desde 'scripts' y entramos en 'music')
const musicDir = path.join(__dirname, '..', 'music');

// Ruta donde se guardará el archivo generado 'media-data.js' dentro de 'scripts'
const outputFile = path.join(__dirname, 'media-data.js');

console.log(`Escaneando directorio: ${musicDir}`);

fs.readdir(musicDir, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio de música:', err);
        const emptyMediaList = `const media = []; // Error al cargar medios o directorio vacío`;
        fs.writeFile(outputFile, emptyMediaList, (writeErr) => {
            if (writeErr) console.error('Error al escribir el archivo de datos vacío:', writeErr);
        });
        return;
    }

    // Filtrar solo archivos (excluir carpetas)
    const mediaFiles = files.filter(file => {
        const fullPath = path.join(musicDir, file);
        return fs.statSync(fullPath).isFile();
    });

    // Construir lista de medios con nombre, artista, archivo y tipo
    const mediaList = mediaFiles.map(file => {
        const fileName = path.parse(file).name;
        const parts = fileName.split(' - ');
        let name = fileName;
        let artist = 'Artista Desconocido';
        let type = 'audio';

        if (parts.length > 1) {
            artist = parts[0].trim();
            name = parts.slice(1).join(' - ').trim();
        }

        const ext = path.extname(file).toLowerCase();
        if (['.mp4', '.webm', '.ogg'].includes(ext)) {
            type = 'video';
        } else if (['.mp3', '.wav', '.flac'].includes(ext)) {
            type = 'audio';
        }

        return {
            name: name,
            artist: artist,
            file: `music/${file}`,
            type: type
        };
    });

    // Contenido JS que exporta la lista de medios
    const jsContent = `// Este archivo fue generado automáticamente por generate-media-list.js
// No lo edites manualmente.
const media = ${JSON.stringify(mediaList, null, 4)};`;

    fs.writeFile(outputFile, jsContent, (err) => {
        if (err) {
            console.error('Error al escribir el archivo de datos de medios:', err);
        } else {
            console.log(`Archivo ${outputFile} generado exitosamente con ${mediaList.length} elementos.`);
        }
    });
});