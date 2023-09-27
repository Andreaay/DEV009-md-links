const path = require('path');
const { readFiles, validateLinks, readPath, getContent, stats, statsValidate } = require('../data.js');
const { mdLinks } = require('../index.js');
const noLinks = 'testingFiles\\testingFileswithNoLinks.md';
const existentLinks = 'testingFiles\\README.md'
const options = '--validate';

describe('mdLinks', () => {

it('should be a function that resolves a promise', () => {
    expect (typeof mdLinks).toBe('function');
  })

  it('should return an error if the path does not exist', () => {
    return expect(mdLinks('notAFile.md')).rejects.toEqual('This path does not exist, enter a valid path.');
  })

  it('should throw an error message if there are no links in the file', () => {
    return expect(mdLinks(noLinks)).rejects.toEqual('This path does not exist, enter a valid path.');
  })
});

describe('validateLinks', () => {

  it('should handle no response', () => {
    const links = [
      { href: 'nonexistent-link', text: 'Nonexistent Link', file: 'nonexistent.md' },
      ];

      return validateLinks(links)
      .then((results) => {
        expect(results).toEqual([
          {
            text: 'Nonexistent Link',
            href: 'nonexistent-link',
            file: 'nonexistent.md',
            status: 'no response',
            statusText: 'Fail',
          },
        ]);
      });
  });
});

describe('readFiles', () => {

  it('should throw an error if the file is not .md', () => {
    return expect(readFiles('testingFiles/testing.html')).rejects.toThrow('Not Markdown. Please, enter a markdown file (.md).');
  })
  
});

describe('getContent', () => {
  it('return an array with all the links in all files in a directory', () => {
    const testFolderPath = path.resolve(__dirname, 'testingFiles');
    return expect(getContent(testFolderPath)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: expect.any(String),
          text: expect.any(String),
          file: expect.stringContaining(testFolderPath),
        }),
      ])
    );
  });
});

describe('stats and statsValidate', () => {
  const linksArray = [
    { href: 'link1', statusText: 'OK' },
    { href: 'link1', statusText: 'OK' },
    { href: 'link2', statusText: 'OK' },
    { href: 'link3', statusText: 'Fail' },
    { href: 'link4', statusText: 'Fail' }
  ];

  it('returns the number of total links and the number of unique links', () => {
    expect(stats(linksArray)).toEqual({ Total: 5, Unique: 4 });
  });

  it('returns the number of total links and the number of unique links', () => {
    expect(statsValidate(linksArray)).toEqual({ Total: 5, Unique: 4, OK: 3, Broken: 2 });
  });

});
