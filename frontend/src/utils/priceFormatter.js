export const formatPrice = (price) => {
  if (!price) return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' đ';
};