const normalizeDirectionPayload = (body = {}) => {
  const normalized = { ...body };

  const hasSnakeCase = Object.prototype.hasOwnProperty.call(body, 'display_order');
  const hasCamelCase = Object.prototype.hasOwnProperty.call(body, 'displayOrder');

  if (hasSnakeCase || hasCamelCase) {
    const rawValue = hasSnakeCase ? body.display_order : body.displayOrder;

    let parsedValue = rawValue;

    if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
      parsedValue = Number(rawValue);
    }

    normalized.display_order = parsedValue;
    normalized.displayOrder = parsedValue;
  }

  return normalized;
};

module.exports = {
  normalizeDirectionPayload,
};

