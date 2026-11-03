import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import './StokModals.css';

const CATEGORIES = ['Kertas', 'Alat Tulis', 'Buku', 'Tinta Printer', 'Arsip', 'Perekat', 'Lainnya'];
const SATUAN_OPTIONS = ['Pcs', 'Rim', 'Buku', 'Botol', 'Pack', 'Lusin', 'Lembar'];

const ModalTambahBarang = ({ onClose, onSave }) => {
  const { warning } = useToast();
  const [form, setForm] = useState({
    nama: '',
    hargaBeli: '',
    harga: '',
    kategori: '',
    satuan: 'Pcs',
    stok: 0,
    stok_minimal: 5,
    kode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const namaTrimmed = form.nama.trim();
    if (!namaTrimmed) {
      warning('Nama barang tidak boleh kosong');
      return;
    }
    if (!form.harga || Number(form.harga) < 0) {
      warning('Harga jual harus berupa nominal valid (minimal Rp 0)');
      return;
    }
    if (!form.kategori) {
      warning('Silakan pilih kategori barang');
      return;
    }
    if (Number(form.stok) < 0) {
      warning('Jumlah stok tidak boleh angka negatif');
      return;
    }

    onSave({
      ...form,
      nama: namaTrimmed,
      hargaBeli: Math.max(0, Number(form.hargaBeli) || 0),
      harga: Math.max(0, Number(form.harga)),
      stok: Math.max(0, Number(form.stok) || 0),
      stok_minimal: Math.max(0, Number(form.stok_minimal) || 5),
      kode: form.kode.trim() || `ATK-${Date.now().toString().slice(-4)}`,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">DATA BARANG</span>
            <h2 className="modal-title">Barang Baru</h2>
            <p className="modal-subtitle">Lengkapi informasi barang di bawah ini.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-field">
              <label className="form-label">Nama Barang</label>
              <input
                className="form-input"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Kertas HVS A4 80gsm"
                required
                autoFocus
              />
            </div>

            <div className="modal-body-row">
              <div className="form-field">
                <label className="form-label">Harga Beli (Modal)</label>
                <input
                  className="form-input"
                  type="number"
                  name="hargaBeli"
                  value={form.hargaBeli}
                  onChange={handleChange}
                  placeholder="Rp 20.000"
                  min="0"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Harga Jual</label>
                <input
                  className="form-input"
                  type="number"
                  name="harga"
                  value={form.harga}
                  onChange={handleChange}
                  placeholder="Rp 25.000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="modal-body-row">
              <div className="form-field">
                <label className="form-label">Kategori</label>
                <select className="form-select form-input" name="kategori" value={form.kategori} onChange={handleChange} required>
                  <option value="">Pilih kategori</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Satuan</label>
                <select className="form-select form-input" name="satuan" value={form.satuan} onChange={handleChange}>
                  {SATUAN_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-body-row">
              <div className="form-field">
                <label className="form-label">Jumlah Stok Awal</label>
                <input
                  className="form-input"
                  type="number"
                  name="stok"
                  value={form.stok}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Batas Stok Minimal (Peringatan)</label>
                <input
                  className="form-input"
                  type="number"
                  name="stok_minimal"
                  value={form.stok_minimal}
                  onChange={handleChange}
                  min="0"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-batal" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-simpan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahBarang;
