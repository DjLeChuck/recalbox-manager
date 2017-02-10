import config from 'config';
import fs from 'fs';
import path from 'path';
import md5File from 'md5-file';

// Traitement d'une ligne du fichier readme.txt des BIOS
const md5Rule = /^[a-f0-9]{32}$/i;
const biosPath = config.get('recalbox.biosPath');

export function handleBiosLine(line) {
  let parts = line.split(' ');

  if (!parts[0].match(md5Rule)) {
    return null;
  }

  parts = parts.filter(Boolean);
  const md5 = parts.shift();
  const name = parts.join(' ').trim();
  const thisBiosPath = path.join(biosPath, name);

  return {
    md5: md5,
    name: name,
    valid: fs.existsSync(thisBiosPath) ? md5 === md5File.sync(thisBiosPath) : null
  };
}
