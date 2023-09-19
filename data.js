const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Function to validate a single link using Axios
async function validateLink(link) {
  try {
    const response = await axios.get(link.href);
    link.status = response.status;
    link.ok = response.status >= 200 && response.status < 400;
  } catch (error) {
    link.status = null;
    link.ok = false;
  }
  return link;
}

// Function to extract links from a Markdown file
async function extractLinks(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = await fs.readFile(absolutePath, 'utf-8');
    const links = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(fileContent))) {
      const [, text, href] = match;
      links.push({
        href,
        text: text.slice(0, 50), // Truncate the text to 50 characters
        file: absolutePath,
      });
    }
    return links;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  validateLink,
  extractLinks,
};
