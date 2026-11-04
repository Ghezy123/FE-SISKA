import React, { useState, useEffect, useRef } from 'react';

/**
 * CurrencyInput — Input angka dengan format titik ribuan otomatis (ID locale)
 *
 * Digunakan untuk SEMUA input bertipe numerik:
 *  - Harga beli & harga jual
 *  - Jumlah stok fisik & stok minimal
 *  - Uang tunai diterima kasir
 *  - Jumlah layanan cetak / fotokopi
 *
 * Menghilangkan tombol scroll / panah spinner browser (type="text" + inputMode="numeric")
 * dan memformat angka secara real-time: 1000 -> 1.000, 2000000 -> 2.000.000.
 */
const formatNumber = (val) => {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'string' ? val.replace(/\./g, '') : String(val);
  const parsed = parseInt(num, 10);
  if (isNaN(parsed)) return '';
  return parsed.toLocaleString('id-ID');
};

const CurrencyInput = ({
  value,
  onChange,
  placeholder = '0',
  className = '',
  required = false,
  min = 0,
  disabled = false,
  autoFocus = false,
  style,
  id,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState(() => formatNumber(value));
  const isUserTyping = useRef(false);

  // Sinkronkan dari parent (misal quick-pill set value=50000 atau reset form)
  useEffect(() => {
    if (!isUserTyping.current) {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const handleChange = (e) => {
    isUserTyping.current = true;

    const raw = e.target.value;
    // Hanya pertahankan digit angka
    const digitsOnly = raw.replace(/[^\d]/g, '');

    if (digitsOnly === '') {
      setDisplayValue('');
      if (onChange) onChange('');
    } else {
      const parsed = parseInt(digitsOnly, 10);
      const formatted = parsed.toLocaleString('id-ID');
      setDisplayValue(formatted);
      if (onChange) onChange(parsed);
    }

    setTimeout(() => {
      isUserTyping.current = false;
    }, 0);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      className={className}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoFocus={autoFocus}
      style={style}
      {...rest}
    />
  );
};

export default CurrencyInput;
