import React, { useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import CurrencyInput from '../common/CurrencyInput';
import './StokModals.css';

const CATEGORIES = ['Kertas', 'Alat Tulis', 'Buku', 'Arsip', 'Perekat', 'Lainnya'];
const SATUAN_OPTIONS = ['Pcs', 'Lembar', 'Rim', 'Buku', 'Botol', 'Pack', 'Lusin'];

const ModalTambahBarang = ({ onClose, onSave }) => {
  const { warning } = useToast();
  const [form, setForm] = useState({
    nama: '',
    hargaBeli: '',
    harga: '',
    kategori: '',
    satuan: 'Pcs',
    stok_minimal: 10,
    kode: '',
  });

  // Tingkat 2 (Kemasan Sedang: Pack / Rim / Lusin)
  const [hasTier2, setHasTier2] = useState(false);
  const [tier2, setTier2] = useState({
    nama: 'Rim',
    pengali: 500,
    harga: '',
  });

  // Tingkat 3 (Kemasan Besar / Grosir: Box / Dus / Karton)
  const [hasTier3, setHasTier3] = useState(false);
  const [tier3, setTier3] = useState({
    nama: 'Box',
    pengali: 2500,
    harga: '',
  });

  // Input Stok Awal (Bisa dalam bentuk Tier 1, Tier 2, atau Tier 3)
  const [inputStokQty, setInputStokQty] = useState('');
  const [inputStokTier, setInputStokTier] = useState('tier1');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Hitung pengali stok fisik master
  const currentMultiplier = useMemo(() => {
    if (inputStokTier === 'tier2' && hasTier2) return Math.max(1, Number(tier2.pengali) || 1);
    if (inputStokTier === 'tier3' && hasTier3) return Math.max(1, Number(tier3.pengali) || 1);
    return 1;
  }, [inputStokTier, hasTier2, hasTier3, tier2.pengali, tier3.pengali]);

  const totalPhysicalStock = useMemo(() => {
    const qty = Number(inputStokQty) || 0;
    return Math.max(0, qty * currentMultiplier);
  }, [inputStokQty, currentMultiplier]);

  const activeTierLabel = useMemo(() => {
    if (inputStokTier === 'tier2' && hasTier2) return tier2.nama || 'Pack';
    if (inputStokTier === 'tier3' && hasTier3) return tier3.nama || 'Box';
    return form.satuan || 'Pcs';
  }, [inputStokTier, hasTier2, hasTier3, tier2.nama, tier3.nama, form.satuan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const namaTrimmed = form.nama.trim();
    if (!namaTrimmed) {
      warning('Nama barang tidak boleh kosong');
      return;
    }
    if (!form.harga || Number(form.harga) < 0) {
      warning('Harga jual eceran harus berupa nominal valid (minimal Rp 0)');
      return;
    }
    if (!form.kategori) {
      warning('Silakan pilih kategori barang');
      return;
    }

    const satuanBase = form.satuan || 'Pcs';
    const hargaJualEcer = Math.max(0, Number(form.harga));

    // Susun hingga 3 Tingkatan Satuan (Multi-Tier UoM)
    const satuanOpsi = [
      {
        tier: 1,
        nama: satuanBase,
        namaSatuan: satuanBase,
        pengali: 1,
        harga: hargaJualEcer,
        label: `Ecer (${satuanBase})`,
      },
    ];

    if (hasTier2 && Number(tier2.pengali) > 1 && Number(tier2.harga) > 0) {
      const t2Name = tier2.nama.trim() || 'Pack';
      const mult2 = Number(tier2.pengali);
      satuanOpsi.push({
        tier: 2,
        nama: `${t2Name} (${mult2} ${satuanBase})`,
        namaSatuan: t2Name,
        pengali: mult2,
        harga: Number(tier2.harga),
        label: `${t2Name} (isi ${mult2} ${satuanBase})`,
      });
    }

    if (hasTier3 && Number(tier3.pengali) > 1 && Number(tier3.harga) > 0) {
      const t3Name = tier3.nama.trim() || 'Box';
      const mult3 = Number(tier3.pengali);
      satuanOpsi.push({
        tier: 3,
        nama: `${t3Name} (${mult3} ${satuanBase})`,
        namaSatuan: t3Name,
        pengali: mult3,
        harga: Number(tier3.harga),
        label: `${t3Name} (isi ${mult3} ${satuanBase})`,
      });
    }

    onSave({
      ...form,
      nama: namaTrimmed,
      hargaBeli: Math.max(0, Number(form.hargaBeli) || 0),
      harga: hargaJualEcer,
      satuan: satuanBase,
      stok: totalPhysicalStock,
      stok_minimal: Math.max(0, Number(form.stok_minimal) || 5),
      kode: form.kode.trim() || `ATK-${Date.now().toString().slice(-4)}`,
      satuan_opsi: satuanOpsi,
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
            <p className="modal-subtitle">Atur identitas barang, 3 tingkatan satuan jual, dan stok awal.</p>
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
            {/* Bagian 1: Identitas Barang */}
            <div className="form-field">
              <label className="form-label">Nama Barang</label>
              <input
                className="form-input"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Kertas HVS A4 80gsm / Pena Standard AE7"
                required
                autoFocus
              />
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
                <label className="form-label">Harga Beli (Modal)</label>
                <CurrencyInput
                  className="form-input"
                  value={form.hargaBeli}
                  onChange={(raw) => setForm((prev) => ({ ...prev, hargaBeli: raw }))}
                  placeholder="Rp 20.000"
                  min={0}
                />
              </div>
            </div>

            {/* Bagian 2: Pengaturan 3 Tingkatan Satuan (Multi-Tier UoM) */}
            <div className="tier-section-title">
              <span className="tier-section-heading">Pengaturan 3 Tingkatan Satuan & Harga</span>
            </div>

            <div className="multi-tier-container">
              {/* TIER 1: Satuan Dasar (Eceran) */}
              <div className="tier-card tier-active">
                <div className="tier-card-header">
                  <span className="tier-badge tier-badge-1">Tingkat 1 • Satuan Dasar (Eceran)</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Wajib (Unit Terkecil)</span>
                </div>
                <div className="modal-body-row">
                  <div className="form-field">
                    <label className="form-label">Satuan Eceran</label>
                    <select className="form-select form-input" name="satuan" value={form.satuan} onChange={handleChange}>
                      {SATUAN_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Harga Jual Eceran</label>
                    <CurrencyInput
                      className="form-input"
                      value={form.harga}
                      onChange={(raw) => setForm((prev) => ({ ...prev, harga: raw }))}
                      placeholder="Contoh: 300 / 3000"
                      min={0}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* TIER 2: Kemasan Sedang (Pack / Rim / Lusin) */}
              <div className={`tier-card ${hasTier2 ? 'tier-active' : ''}`}>
                <div className="tier-card-header">
                  <span className="tier-badge tier-badge-2">Tingkat 2 • Kemasan Sedang</span>
                  <label className="tier-toggle-label">
                    <input
                      type="checkbox"
                      checked={hasTier2}
                      onChange={(e) => setHasTier2(e.target.checked)}
                    />
                    <span>Aktifkan Tingkat 2</span>
                  </label>
                </div>
                {hasTier2 && (
                  <div className="modal-body-row">
                    <div className="form-field">
                      <label className="form-label">Nama Satuan</label>
                      <input
                        className="form-input"
                        value={tier2.nama}
                        onChange={(e) => setTier2({ ...tier2, nama: e.target.value })}
                        placeholder="Contoh: Rim / Pack / Lusin"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Isi per {tier2.nama || 'Pack'} ({form.satuan})</label>
                      <CurrencyInput
                        className="form-input"
                        min={2}
                        value={tier2.pengali}
                        onChange={(raw) => setTier2({ ...tier2, pengali: raw })}
                        placeholder="Contoh: 500 / 12"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Harga Jual</label>
                      <CurrencyInput
                        className="form-input"
                        value={tier2.harga}
                        onChange={(raw) => setTier2({ ...tier2, harga: raw })}
                        placeholder="Contoh: 55000"
                        min={0}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* TIER 3: Kemasan Besar / Grosir (Box / Dus / Karton) */}
              <div className={`tier-card ${hasTier3 ? 'tier-active' : ''}`}>
                <div className="tier-card-header">
                  <span className="tier-badge tier-badge-3">Tingkat 3 • Kemasan Besar / Dus / Box</span>
                  <label className="tier-toggle-label">
                    <input
                      type="checkbox"
                      checked={hasTier3}
                      onChange={(e) => setHasTier3(e.target.checked)}
                    />
                    <span>Aktifkan Tingkat 3</span>
                  </label>
                </div>
                {hasTier3 && (
                  <div className="modal-body-row">
                    <div className="form-field">
                      <label className="form-label">Nama Satuan</label>
                      <input
                        className="form-input"
                        value={tier3.nama}
                        onChange={(e) => setTier3({ ...tier3, nama: e.target.value })}
                        placeholder="Contoh: Box / Dus / Karton"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Total Isi per {tier3.nama || 'Box'} ({form.satuan})</label>
                      <CurrencyInput
                        className="form-input"
                        min={2}
                        value={tier3.pengali}
                        onChange={(raw) => setTier3({ ...tier3, pengali: raw })}
                        placeholder="Contoh: 2500 / 144"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Harga Jual</label>
                      <CurrencyInput
                        className="form-input"
                        value={tier3.harga}
                        onChange={(raw) => setTier3({ ...tier3, harga: raw })}
                        placeholder="Contoh: 260000"
                        min={0}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bagian 3: Input Stok Awal (Mendukung Opsi Pilihan Satuan dari 3 Layer) */}
            <div className="tier-section-title">
              <span className="tier-section-heading">Input Stok Awal & Peringatan</span>
            </div>

            <div className="modal-body-row">
              <div className="form-field" style={{ flex: 1.2 }}>
                <label className="form-label">Jumlah Stok Awal</label>
                <CurrencyInput
                  className="form-input"
                  value={inputStokQty}
                  onChange={(raw) => setInputStokQty(raw)}
                  placeholder="0"
                  min={0}
                />
              </div>

              <div className="form-field" style={{ flex: 1.8 }}>
                <label className="form-label">Satuan Input Stok</label>
                <select
                  className="form-select form-input"
                  value={inputStokTier}
                  onChange={(e) => setInputStokTier(e.target.value)}
                >
                  <option value="tier1">
                    Tingkat 1: {form.satuan || 'Pcs'} (Eceran Dasar)
                  </option>
                  {hasTier2 && (
                    <option value="tier2">
                      Tingkat 2: {tier2.nama || 'Pack'} (isi {tier2.pengali} {form.satuan})
                    </option>
                  )}
                  {hasTier3 && (
                    <option value="tier3">
                      Tingkat 3: {tier3.nama || 'Box'} (isi {tier3.pengali} {form.satuan})
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Live conversion summary badge */}
            {Number(inputStokQty) > 0 && (
              <div className="stock-calc-preview">
                <span className="stock-calc-preview-text">
                  Input <strong>{inputStokQty} {activeTierLabel}</strong> otomatis tersimpan ke stok fisik dasar:
                </span>
                <span className="stock-calc-preview-badge">
                  = {totalPhysicalStock.toLocaleString('id-ID')} {form.satuan || 'Pcs'}
                </span>
              </div>
            )}

            <div className="form-field">
              <label className="form-label">Batas Stok Minimal ({form.satuan || 'Pcs'})</label>
              <CurrencyInput
                className="form-input"
                name="stok_minimal"
                value={form.stok_minimal}
                onChange={(raw) => setForm({ ...form, stok_minimal: raw })}
                min={0}
                placeholder="10"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-batal" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-simpan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Simpan Barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahBarang;
