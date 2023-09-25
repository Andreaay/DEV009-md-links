const path = require('path');
const fs = require('fs');
const axios = require('axios').default;

function checkAbsolute(filePath) {
  return path.resolve(filePath);
}

function pathExists(filePath) {
  return fs.existsSync(filePath);
}

function getContent(filePath) {
  const isDirectory = fs.statSync(filePath).isDirectory();

  if (isDirectory) {
    const files = readPath(filePath);
    const allFiles = files.map((file) => readFiles(file));
    return Promise.all(allFiles)
      .then((links) => links.flat());
  }

  return readFiles(filePath);
}

function readPath(filePath) {
  const arrayAllPaths = [];
  const files = fs.readdirSync(filePath);

  files.forEach((file) => {
    const fullPath = path.join(filePath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const sub = readPath(fullPath);
      arrayAllPaths.push(...sub);
    } else if (fileExtension(fullPath) === '.md') {
      arrayAllPaths.push(fullPath);
    }
  });

  return arrayAllPaths;
}

function readFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (fileExtension(filePath) === '.md') {
        resolve(getLinks(data, filePath));
      } else {
        reject(new Error('Not Markdown. Please, enter a markdown file (.md).'));
      }
    });
  });
}

function fileExtension(filePath) {
  return path.extname(filePath);
}

function getLinks(data, filePath) {
  const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
  const links = [];
  let match;

  while ((match = regex.exec(data)) !== null) {
    const text = match[1];
    const href = match[2];
    links.push({ href, text, file: filePath });
  }

  return links;
}

function validateLinks(links) {
  const validatePromises = links.map(link => {
    return axios.get(link.href)
      .then((response) => {
        link.status = response.status;
        link.statusText = 'ok';
        return link;
      })
      .catch((error) => {
        link.status = error.status !== undefined ? error.status : 'no response';
        link.statusText = 'Fail';
        return link;
      });
  });

  return Promise.all(validatePromises);
}

function stats(arr) {
  return {
    Total: arr.length,
    Unique: new Set(arr.map((links) => links.href)).size,
  };
}

function statsValidate(arr) {
  return {
    Total: arr.length,
    Unique: new Set(arr.map((link) => link.href)).size,
    OK: arr.filter((link) => link.statusText === 'OK').length,
    Broken: arr.filter((link) => link.statusText === 'Fail').length,
  };
}

module.exports = {
  checkAbsolute,
  pathExists,
  readPath,
  readFiles,
  validateLinks,
  getContent,
  stats,
  statsValidate,
};
