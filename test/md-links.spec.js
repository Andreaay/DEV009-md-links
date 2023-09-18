const fs = require('fs');
const path = require('path');
const mdLinks = require('../index');


describe('mdLinks', () => {
  it('should return an array of links when given a valid Markdown file', () => {
    const filePath = path.resolve(__dirname, 'README.md');
    return mdLinks(filePath).then((links) => {
      expect(Array.isArray(links)).toBe(true);
    });
  });

  it('should reject with an error when given an invalid file path', () => {
    const invalidFilePath = 'nonexistent.md'; // Replace with a path that doesn't exist
    return expect(mdLinks(invalidFilePath)).rejects.toThrowError(expect.stringContaining('Route does not exist'));
  });
  

});
