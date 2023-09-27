const { checkAbsolute, pathExists, getContent, validateLinks} = require('./data');

function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    const absolutePath = checkAbsolute(filePath);

    if (!pathExists(absolutePath)) {
      reject('This path does not exist, enter a valid path.');
      return;
    }

    getContent(absolutePath)
      .then((links) => {
        if (links.length > 0) {
          if (options) {
            validateLinks(links)
              .then((validatedLinks) => {
                resolve(validatedLinks);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve(links);
          }
        } else {
          reject(new Error('The file is empty or there are no links to validate.'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = { mdLinks };