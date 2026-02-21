function generatePaginationLinks(originalUrl, currentPage, totalPages, limit) {
  const url = new URL(`http://localhost${originalUrl}`);
  const links = {};

  const buildLink = (page) => {
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    return url.pathname + url.search;
  };

  if (currentPage > 1) {
    links.prev = buildLink(currentPage - 1);
  }

  if (currentPage < totalPages) {
    links.next = buildLink(currentPage + 1);
  }

  const linkParts = [];
  linkParts.push(`<${buildLink(1)}>; rel="first"`);
  if (links.prev) linkParts.push(`<${links.prev}>; rel="previous"`);
  if (links.next) linkParts.push(`<${links.next}>; rel="next"`);
  linkParts.push(`<${buildLink(totalPages)}>; rel="last"`);

  links.linkHeader = linkParts.join(', ');

  return links;
}

module.exports = { generatePaginationLinks };
