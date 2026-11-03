import { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { mahasiswaService } from '../../services/mahasiswaService';

export const MahasiswaList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mahasiswaService
      .getAll()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = data.filter(
    (mhs) =>
      mhs.nama.toLowerCase().includes(search.toLowerCase()) ||
      mhs.nim.includes(search) ||
      mhs.prodi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="siska-page">
      <div className="siska-page-header">
        <div>
          <h1 className="siska-page-title">Data Mahasiswa</h1>
          <p className="siska-page-desc">Daftar mahasiswa terdaftar di sistem akademik</p>
        </div>
        <Button variant="primary">+ Tambah Mahasiswa</Button>
      </div>

      <Card>
        <div className="siska-table-toolbar">
          <input
            type="text"
            className="siska-search-input"
            placeholder="Cari berdasarkan NIM, Nama, atau Program Studi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="siska-loading-text">Memuat data...</p>
        ) : (
          <div className="siska-table-wrapper">
            <table className="siska-table">
              <thead>
                <tr>
                  <th>NIM</th>
                  <th>Nama Lengkap</th>
                  <th>Program Studi</th>
                  <th>Angkatan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.nim}</strong></td>
                      <td>{item.nama}</td>
                      <td>{item.prodi}</td>
                      <td>{item.angkatan}</td>
                      <td>
                        <span
                          className={`siska-status-pill siska-status-${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="siska-row-actions">
                          <button type="button" className="siska-action-btn edit">
                            Edit
                          </button>
                          <button type="button" className="siska-action-btn delete">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      Tidak ada data mahasiswa ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

