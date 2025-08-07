import validator from 'validator';

export function sanitizeString(input: string | undefined | null): string {
  if (input === undefined || input === null) {
    return '';
  }

  const str = String(input);

  // Escape HTML special characters
  return validator.escape(str);
}

export function sanitizeId(id: string | undefined | null): string {
  if (id === undefined || id === null) {
    return '';
  }

  const str = String(id);

  return validator.isAlphanumeric(str) ? str : '';
}

export function sanitizeSort(sort: string | undefined | null): string | undefined {
  if (sort === undefined || sort === null) {
    return undefined;
  }

  // Only allow specific sort values
  const allowedSorts = ['average_height'];
  const sanitized = sanitizeString(sort);

  return allowedSorts.includes(sanitized) ? sanitized : undefined;
}

export function sanitizeOrder(order: string | undefined | null): 'asc' | 'desc' | undefined {
  if (order === undefined || order === null) {
    return undefined;
  }

  // Only allow specific order values
  const sanitized = sanitizeString(order);

  // Return the sanitized value only if it's a valid order
  return sanitized === 'asc' || sanitized === 'desc' ? sanitized : undefined;
}