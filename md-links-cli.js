#!/usr/bin/env node

const mdLinks = require('./index'); // Importa mdLinks
const args = process.argv.slice(2); // Obtiene los argumentos de la línea de comando

// Aquí se agrega la lógica para parsear los argumentos y llamar a la función mdLinks
// El primer argumento como la ruta y el segundo como una opción:
const path = args[0];
const options = { validate: args.includes('--validate') };

mdLinks(path, options)
  .then(links => {
    // Aquí se puede imprimir o manejar resultados
    console.log(links);
  })
  .catch(err => {
    console.error(err);
  });
