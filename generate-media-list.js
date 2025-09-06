const fs = require('fs'); // Módulo para interactuar con el sistema de archivos
const path = require('path'); // Módulo para manejar rutas de archivos

// Define la ruta a la carpeta 'music' dentro de 'Reproductor web'
const musicDir = path.join(__dirname, 'Reproductor web', 'music');
// Define la ruta donde se guardará el archivo JavaScript generado
const outputFile = path.join(__dirname, 'Reproductor web', 'scripts', 'media-data.js');

console.log(`Escaneando directorio: ${musicDir}`);

// Lee el contenido del directorio de música
fs.readdir(musicDir, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio de música:', err);
        // Si el directorio no existe o hay un error, crea un archivo vacío o con un mensaje de error
        const emptyMediaList = `const media = []; // Error al cargar medios o directorio vacío`;
        fs.writeFile(outputFile, emptyMediaList, (writeErr) => {
            if (writeErr) console.error('Error al escribir el archivo de datos vacío:', writeErr);
        });
        return;
    }

    // Filtra solo los archivos (ignora subdirectorios si los hubiera)
    const mediaFiles = files.filter(file => fs.statSync(path.join(musicDir, file)).isFile());

    // Mapea los nombres de archivo a un formato de objeto que tu reproductor pueda usar
    const mediaList = mediaFiles.map(file => {
        const fileName = path.parse(file).name; // Obtiene el nombre del archivo sin extensión
        const parts = fileName.split(' - '); // Intenta dividir por " - " para separar artista y nombre
        let name = fileName;
        let artist = 'Artista Desconocido';
        let type = 'audio'; // Asumimos audio por defecto

        // Si se pudo dividir, asigna artista y nombre
        if (parts.length > 1) {
            artist = parts[0].trim(); // Elimina espacios en blanco
            name = parts.slice(1).join(' - ').trim(); // Une el resto como el nombre de la canción
        }

        // Determina el tipo de medio basado en la extensión del archivo
        const ext = path.extname(file).toLowerCase();
        if (['.mp4', '.webm', '.ogg'].includes(ext)) {
            type = 'video';
        } else if (['.mp3', '.wav', '.flac'].includes(ext)) {
            type = 'audio';
        }
        // Puedes añadir más tipos de archivos si es necesario

        return {
            name: name,
            artist: artist,
            file: `music/${file}`, // Ruta relativa para el navegador
            type: type
        };
    });

    // Genera el contenido del archivo JavaScript
    // JSON.stringify convierte el array de objetos a una cadena JSON
    // null, 4 formatea el JSON con indentación para que sea legible
    const jsContent = `// Este archivo fue generado automáticamente por generate-media-list.js
// No lo edites manualmente.
const media = ${JSON.stringify(mediaList, null, 4)};`;

    // Escribe el contenido en el archivo de salida
    fs.writeFile(outputFile, jsContent, (err) => {
        if (err) {
            console.error('Error al escribir el archivo de datos de medios:', err);
        } else {
            console.log(`Archivo ${outputFile} generado exitosamente con ${mediaList.length} elementos.`);
        }
    });
});