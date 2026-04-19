export function getExpiryCountdownLabel(daysUntilExpiry: number) {
  if (daysUntilExpiry < 0) {
    return `${Math.abs(daysUntilExpiry)}일 지남`;
  }

  if (daysUntilExpiry === 0) {
    return '오늘 만료';
  }

  return `${daysUntilExpiry}일 남음`;
}
