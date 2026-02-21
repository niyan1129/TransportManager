const { generatePaginationLinks } = require('../../../src/utils/generatePaginationLinks');

describe('generatePaginationLinks', () => {
  it('builds prev/next links and preserves existing query parameters', () => {
    const result = generatePaginationLinks('/api/drivers?sort=firstName', 2, 5, 10);

    expect(result.prev).toBe('/api/drivers?sort=firstName&page=1&limit=10');
    expect(result.next).toBe('/api/drivers?sort=firstName&page=3&limit=10');
    expect(result.linkHeader).toBe(
      '</api/drivers?sort=firstName&page=1&limit=10>; rel="first", ' +
        '</api/drivers?sort=firstName&page=1&limit=10>; rel="previous", ' +
        '</api/drivers?sort=firstName&page=3&limit=10>; rel="next", ' +
        '</api/drivers?sort=firstName&page=5&limit=10>; rel="last"',
    );
  });

  it('omits prev when on first page and next on last page', () => {
    const firstPage = generatePaginationLinks('/api/vehicles', 1, 3, 5);
    expect(firstPage.prev).toBeUndefined();
    expect(firstPage.next).toBe('/api/vehicles?page=2&limit=5');

    const lastPage = generatePaginationLinks('/api/vehicles', 3, 3, 5);
    expect(lastPage.prev).toBe('/api/vehicles?page=2&limit=5');
    expect(lastPage.next).toBeUndefined();
  });
});
