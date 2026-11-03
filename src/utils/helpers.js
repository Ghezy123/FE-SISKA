// Kumpulan fungsi utilitas / helper

/**
 * Format tanggal ke format lokal Indonesia (contoh: 3 November 2026)
 */
export const formatTanggal = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Format angka ke mata uang Rupiah
 */
export const formatRupiah = (number) => {
  if (number === undefined || number === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

/**
 * Ambil inisial nama untuk avatar
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

