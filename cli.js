#!/usr/bin/env node

const mdLinks = require('./index');

const args = process.argv.slice(2);
const inputPath = args[0];
const validateOption = args.includes('--validate');

if (!inputPath) {
  console.error('You must provide a file or directory path as an argument.');
  process.exit(1);
}

mdLinks.mdLinks(inputPath, validateOption)
  .then((links) => {
    if(args.includes('--stats') && args.includes('--validate')){
      const totalLinks = links.length;
      const uniqueLinks = new Set(links.map((link) => link.href)).size;
      const okLinks = links.filter((link) => link.ok).length;
      const brokenLinks = links.filter((link) => !link.ok).length;
      console.log(`Total: ${totalLinks}\nUnique: ${uniqueLinks}\nBroken: ${brokenLinks}\nOK: ${okLinks}`);
    } else if (args.includes('--stats')) {
      const totalLinks = links.length;
      const uniqueLinks = new Set(links.map((link) => link.href)).size;
      console.log(`Total: ${totalLinks}\nUnique: ${uniqueLinks}`);
    } else if (args.includes('--validate')){
      links.forEach((link) => {
        console.log(`${link.file} - ${link.text} - ${link.href} - ${link.statusText} - ${link.status}`);
      });
    }else {
      links.forEach((link) => {
        console.log(`${link.file}- ${link.text} - ${link.href}`);
      });
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

