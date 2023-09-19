#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mdLinks = require('./index');

const args = process.argv.slice(2); // Get command-line arguments
const inputPath = args[0]; // The first argument is the file or directory path
const validateOption = args.includes('--validate'); // Check if the --validate option is present

if (!inputPath) {
  console.error('You must provide a file or directory path as an argument.');
  process.exit(1);
}

// Function to determine if the input is a file or a directory
function isDirectory(filePath) {
  return fs.statSync(filePath).isDirectory();
}

// Function to find Markdown files in a directory
function findMarkdownFiles(dirPath) {
  const markdownFiles = [];
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      markdownFiles.push(...findMarkdownFiles(filePath));
    } else if (file.match(/\.(md|mkd|mdwn|mdown|mdtxt|mdtext|markdown|text)$/i)) {
      markdownFiles.push(filePath);
    }
  }
  return markdownFiles;
}

if (isDirectory(inputPath)) {
  // If the input is a directory, search for Markdown files in that directory and subdirectories
  const markdownFiles = findMarkdownFiles(inputPath);

  // Process each found Markdown file
  const promises = markdownFiles.map((filePath) => {
    return mdLinks(filePath, validateOption);
  });

  // Wait for all promises to resolve and concatenate the results
  Promise.all(promises)
    .then((results) => {
      const allLinks = [].concat(...results);
      console.log(allLinks);
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
} else {
  // If the input is a file, simply run mdLinks on that file
  mdLinks(inputPath, validateOption)
    .then((links) => {
      console.log(links);
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
}
