const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const musicDir = path.join(__dirname, '../../music');
  let files = [];
  try {
    files = fs.readdirSync(musicDir)
      .filter(f => /\.(mp3|mp4|wav|ogg|webm|m4a|flac)$/i.test(f));
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudo leer la carpeta de música.' })
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(files)
  };
};
