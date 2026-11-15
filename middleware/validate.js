function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function validatePlot(body) {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a valid JSON object';
  }

  const { name, soil } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return 'Plot name is required and must be a non-empty string';
  }

  if (typeof soil !== 'string' || soil.trim().length === 0) {
    return 'Soil type is required and must be a non-empty string';
  }

  return null;
}

function validateGardener(body) {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a valid JSON object';
  }

  const { name, email } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return 'Gardener name is required and must be a non-empty string';
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return 'A valid email address is required';
  }

  return null;
}

function validateLease(body) {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a valid JSON object';
  }

  if (!parseId(body.gardener_id)) {
    return 'gardener_id must be a positive integer';
  }

  if (!parseId(body.plot_id)) {
    return 'plot_id must be a positive integer';
  }

  return null;
}

module.exports = {
  parseId,
  validatePlot,
  validateGardener,
  validateLease
};