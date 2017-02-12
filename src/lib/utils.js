import config from 'config';
import fs from 'fs';
import path from 'path';
import md5File from 'md5-file';
import xml2js from 'xml2js';

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

// Traitement des ROMs
export async function getRoms(system, subpath = '') {
  const srcpath = path.join(config.get('recalbox.romsPath'), system, subpath);
  const esSystems = await getEsSystems();
  const systemData = esSystems.find((s) => s.name === system);
  const romExtensions = systemData ? systemData.extensions : [];

  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isFile() &&
      -1 !== romExtensions.indexOf(path.extname(file));
  });
}

// Promise xml2json
async function xmlToJson(file) {
  var promise = await new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      trim: true,
      explicitArray: false
    });

    parser.parseString(fs.readFileSync(file), (jsError, jsResult) => {
      if (jsError) {
        reject(jsError);
      } else {
        resolve(jsResult);
      }
    });
  });

  return promise;
}

// Traitements des systèmes supportés par ES
let esSystems;

export async function getEsSystems() {
  if (esSystems) {
    return esSystems;
  }

  const json = await xmlToJson(config.get('recalbox.esSystemsCfgPath'));
  esSystems = [];

  json.systemList.system.forEach((system) => {
    esSystems.push({
      name: system.name,
      fullname: system.fullname,
      path: system.path,
      extensions: system.extension ? system.extension.split(' ') : [],
      launchCommand: system.command,
    });
  });

  return esSystems;
}

// Traitement des fichiers gamelist.xml
let gamelistCollection = {};

export function parseGameReleaseDate(releaseDate) {
  return {
    day: releaseDate.substring(6, 8),
    month: releaseDate.substring(4, 6),
    year: releaseDate.substring(0, 4),
  };
}

export function getSystemRomsBasePath(system) {
  return path.join(config.get('recalbox.romsPath'), system);
}

export function getSystemGamelistPath(system) {
  return path.join(getSystemRomsBasePath(system), 'gamelist.xml');
}

export async function getSystemGamelist(system) {
  if (gamelistCollection.system) {
    return gamelistCollection.system;
  }

  const json = await xmlToJson(getSystemGamelistPath(system));
  let list = {};
  let gameList = json.gameList.game || [];

  if (!Array.isArray(gameList)) {
    gameList = [gameList];
  }

  gameList.forEach((game) => {
    list[game.path.substring(2)] = game;
  });

  gamelistCollection.system = list;

  return list;
}
