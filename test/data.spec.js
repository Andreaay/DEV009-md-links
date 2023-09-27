const { validateLinks } = require('../data.js');
const axios = require('axios');

jest.mock('axios');

describe('validateLinks', () => {
  it('should resolve with an array of link status information for a valid link', () => {
    axios.get.mockResolvedValue({ status: 200 });

    const links = [
      { href: 'https://exercism.org/users/sign_in', text: 'Exercism', file: 'example.md' },
    ];

    return validateLinks(links).then((results) => {
      expect(results).toEqual([
        {
          href: 'https://exercism.org/users/sign_in',
          text: 'Exercism',
          file: 'example.md',
          status: 200,
          statusText: 'ok',
        },
      ]);
    });
  });
});
