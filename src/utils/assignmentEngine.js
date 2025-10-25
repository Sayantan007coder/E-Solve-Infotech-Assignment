export const assignCase = (daysPastDue) => {
  if (daysPastDue <= 30) return 'Call Center';
  if (daysPastDue <= 90) return 'Field Agent';
  return 'Legal Team';
};