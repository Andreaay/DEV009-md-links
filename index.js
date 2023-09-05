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
  const lines = fileContent.split('\n');

  const links = [];
  for (const line of lines) {
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, text, href] = linkMatch;
      links.push({
        href,
        text,
        file: filePath,
      });
    }
  }

  return links;
}

function mdLinks(dirPath, options) {
  const absolutePath = convertToAbsolutePath(dirPath);

  if (!pathExists(absolutePath)) {
    return Promise.reject(new Error('Route does not exist'));
  }

  if (options.validate) {
    const links = extractLinksFromFile(absolutePath);
    const linkPromises = links.map((link) => validateLink(link));

    return Promise.all(linkPromises);
  } else {
    const links = extractLinksFromFile(absolutePath);
    return Promise.resolve(links);
  }

}

module.exports = mdLinks;
