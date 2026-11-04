import React, { useState } from 'react';
import CurrencyInput from '../common/CurrencyInput';
import './StokModals.css';

/**
 * Modal Update Harga — Mendukung hingga 3 Tingkatan Satuan & Harga (Multi-Tier UoM)
 */
const ModalUpdateHarga = ({ product, onClose, onSave }) => {
  const [hargaBeli, setHargaBeli] = useState(product.hargaBeli ?? product.harga);
  const [harga, setHarga] = useState(product.harga);
  const [confirmStep, setConfirmStep] = useState(false);

  // Cari Tier 2 & Tier 3 yang sudah tersimpan
  const existingTier2 = product.satuan_opsi?.find((opt) => (opt.tier === 2) || (opt.pengali > 1 && opt.pengali < 1000));
  const existingTier3 = product.satuan_opsi?.find((opt) => (opt.tier === 3) || (opt.pengali >= 1000));

  // State Tier 2
  const [hasTier2, setHasTier2] = useState(Boolean(existingTier2));
  const [tier2, setTier2] = useState({
    nama: existingTier2?.namaSatuan || existingTier2?.nama?.split(' ')[0] || 'Rim',
    pengali: existingTier2?.pengali || 500,
    harga: existingTier2?.harga || '',
  });

  // State Tier 3
  const [hasTier3, setHasTier3] = useState(Boolean(existingTier3));
  const [tier3, setTier3] = useState({
    nama: existingTier3?.namaSatuan || existingTier3?.nama?.split(' ')[0] || 'Box',
    pengali: existingTier3?.pengali || 2500,
    harga: existingTier3?.harga || '',
  });

  const handleNext = (e) => {
    e.preventDefault();
    setConfirmStep(true);
  };

  const handleSave = () => {
    const newHargaEcer = Number(harga);
    const satuanBase = product.satuan || 'Pcs';

    const updatedSatuanOpsi = [
      {
        tier: 1,
        nama: satuanBase,
        namaSatuan: satuanBase,
        pengali: 1,
        harga: newHargaEcer,
        label: `Ecer (${satuanBase})`,
      },
    ];

    if (hasTier2 && Number(tier2.pengali) > 1 && Number(tier2.harga) > 0) {
      const t2Name = tier2.nama.trim() || 'Pack';
      const mult2 = Number(tier2.pengali);
      updatedSatuanOpsi.push({
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
      updatedSatuanOpsi.push({
        tier: 3,
        nama: `${t3Name} (${mult3} ${satuanBase})`,
        namaSatuan: t3Name,
        pengali: mult3,
        harga: Number(tier3.harga),
        label: `${t3Name} (isi ${mult3} ${satuanBase})`,
      });
    }

    onSave({
      ...product,
      hargaBeli: Number(hargaBeli),
      harga: newHargaEcer,
      satuan_opsi: updatedSatuanOpsi,
    });
  };

  if (confirmStep) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-dialog-body">
            <div className="confirm-icon" style={{ background: '#baced7ff' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <h2 className="confirm-dialog-title">Simpan Update Harga?</h2>
            <p className="confirm-dialog-sub">
              Harga <strong>{product.nama}</strong> akan diperbarui sesuai tingkatan satuan yang diset.
            </p>
          </div>
          <div className="modal-footer modal-footer-center">
            <div className="update-choice-group">
              <button className="btn-batal" style={{ flex: 1 }} onClick={() => setConfirmStep(false)}>Batal</button>
              <button className="btn-simpan" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-dialog-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-eyebrow">UPDATE</span>
            <h2 className="modal-title">Update Harga Barang</h2>
            <p className="modal-subtitle">Perbarui harga modal dan harga jual untuk ke-3 tingkatan satuan.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleNext}>
          <div className="modal-body">
            {/* Harga Beli */}
            <div className="form-field">
              <label className="form-label">Harga Beli / Modal</label>
              <CurrencyInput
                className="form-input"
                value={hargaBeli}
                onChange={(raw) => setHargaBeli(raw)}
                placeholder="Rp 20.000"
                min={0}
              />
            </div>

            <div className="tier-section-title">
              <span className="tier-section-heading">Harga Jual 3 Tingkatan Satuan</span>
            </div>

            <div className="multi-tier-container">
              {/* TIER 1: Ecer */}
              <div className="tier-card tier-active">
                <div className="tier-card-header">
                  <span className="tier-badge tier-badge-1">Tingkat 1 • Eceran Dasar ({product.satuan || 'Pcs'})</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Unit Dasar</span>
                </div>
                <div className="form-field">
                  <label className="form-label">Harga Jual Eceran</label>
                  <CurrencyInput
                    className="form-input"
                    value={harga}
                    onChange={(raw) => setHarga(raw)}
                    placeholder="Contoh: 300 / 3000"
                    min={0}
                    required
                  />
                </div>
              </div>

              {/* TIER 2: Kemasan Sedang */}
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
                      <label className="form-label">Isi per {tier2.nama || 'Pack'} ({product.satuan || 'Pcs'})</label>
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

              {/* TIER 3: Kemasan Besar / Grosir */}
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
                      <label className="form-label">Total Isi per {tier3.nama || 'Box'} ({product.satuan || 'Pcs'})</label>
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
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-batal" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-simpan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUpdateHarga;
