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
      // const okLinks = links.filter((link) => link.ok).length;
      // const brokenLinks = links.filter((link) => !link.ok).length;\nBroken: ${brokenLinks}, parte de validacion =>\nOK: ${okLinks}`
      console.log(`Total: ${totalLinks}\nUnique: ${uniqueLinks}`);
    }else {
      links.forEach((link) => {
        console.log(`${link.file} - ${link.href} - ${link.ok ? 'OK' : 'Fail'} - ${link.status}`);
        console.log(link);
      });
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

