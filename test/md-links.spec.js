const fs = require('fs');
const path = require('path');
const mdLinks = require('../index');


describe('mdLinks', () => {

  it('should return true if the path exists', () => {
    expect(mdLinks.pathExists(__dirname)).toBe(true);
  });
  it('should return false if the path does not exist', () => {
    expect(mdLinks.pathExists('/nonexistentpath')).toBe(false);
  });
});

describe('convertToAbsolutePath', () => {
  it('should convert a relative path to an absolute path', () => {
    const relativePath = './testfile.txt';
    const absolutePath = path.resolve(relativePath);
    expect(mdLinks.convertToAbsolutePath(relativePath)).toBe(absolutePath);
  });

  describe('extractLinksFromFile', () => {
    it('should extract links from a markdown file', () => {
      const filePath = './test.md';
      const links = mdLinks.extractLinksFromFile(filePath);
      const expectedLinks = [
        { href: 'http://example.com', text: 'Example', file: filePath },
      ];
      expect(links).toEqual(expectedLinks);
    });
});
});
