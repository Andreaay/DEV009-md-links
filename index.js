const fs = require('fs').promises;
const { Console } = require('console');
const path = require('path');

function mdLinks(filePath, validate = false) {
  return new Promise((resolve, reject) => {
    // Transform the input path to an absolute path
    const absolutePath = path.resolve(filePath);

    // Check if the path exists on the filesystem
    fs.access(absolutePath)
      .then(() => {
        // Ensure that the file is of Markdown type
        const extname = path.extname(absolutePath).toLowerCase();
        if (![".md", ".mkd", ".mdwn", ".mdown", ".mdtxt", ".mdtext", ".markdown", ".text"].includes(extname)) {
          reject(new Error("The file is not of Markdown type."));
        }

        // Read the file
        fs.readFile(absolutePath, 'utf-8')
          .then((fileContent) => {
            // Find links within the document
            const links = [];
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            let match;
            while ((match = linkRegex.exec(fileContent))) {
              const [, text, href] = match;
              links.push({
                href,
                text,
                file: absolutePath,
              });
            }

            if (validate) {
              // Validate links if requested
              const linkValidationPromises = links.map((link) => {
                return fetch(link.href)
                  .then((response) => {
                    link.status = response.status;
                    link.ok = response.ok;
                    return link;
                  })
                  .catch((error) => {
                    link.status = null;
                    link.ok = false;
                    return link;
                  });
              });

              // Wait for all validations to complete
              Promise.all(linkValidationPromises)
                .then((validatedLinks) => {
                  resolve(validatedLinks);
                })
                .catch((validationError) => {
                  reject(validationError);
                });
            } else {
              // If validation is not requested, resolve the links as they are
              resolve(links);
            }
          })
          .catch((readError) => {
            reject(readError);
          });
      })
      .catch((accessError) => {
        reject(accessError);
      });
  });
}

module.exports = mdLinks;
