const fs = require('fs');
const path = require('path');
const marked = require('marked');

function pathExists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (error) {
    return false;
  }
}

function convertToAbsolutePath(relativePath) {
  return path.resolve(relativePath);
}

function extractLinksFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const tokens = marked.lexer(fileContent);

  const links = [];
  tokens.forEach(token => {
    if (token.type === 'link') {
      links.push({
        href: token.href,
        text: token.text,
        file: filePath,
      });
    }
  });

  return links;
}

function mdLinks(dirPath, options) {
  const absolutePath = convertToAbsolutePath(dirPath);

  if (!pathExists(absolutePath)) {
    return Promise.reject(new Error('La ruta no existe'));
  }

  if (options.validate) {
    // Aquí va lógica para validar links
  } else {
    const links = extractLinksFromFile(absolutePath);
    return Promise.resolve(links);
  }

}

module.exports = mdLinks;
