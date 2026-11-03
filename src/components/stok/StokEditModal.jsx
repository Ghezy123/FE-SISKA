import React, { useState, useEffect } from 'react';
import './StokEditModal.css';

const defaultProduct = {
  id: '',
  nama: '',
  kategori: '',
  harga: 0,
  stok: 0,
  satuan: '',
  kode: '',
};

const StokEditModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(defaultProduct);

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      // generate new id for new product
      const newId = `prd_${Date.now()}`;
      setForm({ ...defaultProduct, id: newId });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'harga' || name === 'stok' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.nama || !form.kategori || !form.satuan || !form.kode) {
      alert('Semua bidang wajib diisi');
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{product ? 'Edit Produk' : 'Tambah Produk'}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Nama
            <input name="nama" value={form.nama} onChange={handleChange} required />
          </label>
          <label>
            Kategori
            <input name="kategori" value={form.kategori} onChange={handleChange} required />
          </label>
          <label>
            Harga (Rp)
            <input type="number" name="harga" value={form.harga} onChange={handleChange} min="0" required />
          </label>
          <label>
            Stok
            <input type="number" name="stok" value={form.stok} onChange={handleChange} min="0" required />
          </label>
          <label>
            Satuan
            <input name="satuan" value={form.satuan} onChange={handleChange} required />
          </label>
          <label>
            Kode
            <input name="kode" value={form.kode} onChange={handleChange} required />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn cancel">
              Batal
            </button>
            <button type="submit" className="btn save">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StokEditModal;

