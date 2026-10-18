import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  Target,
  Music,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { TabId } from '../../types/navigation';

interface JuryShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: TabId) => void;
  onStartBloomMission?: (code: string) => void;
}

export const JuryShowcaseModal: React.FC<JuryShowcaseModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onStartBloomMission,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleJumpToTab = (tab: TabId) => {
    onClose();
    onNavigate?.(tab);
  };

  const handleJumpToMission = (code: string) => {
    onClose();
    if (onStartBloomMission) {
      onStartBloomMission(code);
    } else {
      onNavigate?.('misi');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Showcase Dewan Juri GamelanCode"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(45, 45, 43, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-app)',
          borderRadius: 24,
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1.5px solid var(--border-card)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal Showcase */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1.5px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-squircle)',
                background: 'var(--color-yellow-tint)',
                border: '1.5px solid var(--color-yellow)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    background: 'var(--color-yellow)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Showcase Esai Lomba
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  GamelanCode
                </span>
              </div>
              <h3
                style={{
                  margin: '2px 0 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                Presentasi Komprehensif Dewan Juri
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Showcase"
            className="btn-back-circle"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Konten Slide (Scrollable) */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'var(--bg-app)',
          }}
        >
          {/* SLIDE 1: URGENSI & LATAR BELAKANG RISET */}
          {currentSlide === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  padding: '14px 16px',
                  borderRadius: 16,
                  border: '1.5px solid #a7f3d0',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                  Babak 1 • Latar Belakang & Urgensi Riset
                </div>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#064e3b' }}>
                  Kesenjangan Skor PISA & Pelestarian Karawitan UNESCO
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#065f46', lineHeight: 1.5 }}>
                  GamelanCode hadir menjembatani tantangan ganda: penguatan keterampilan berpikir komputasional
                  generasi abad ke-21 serta pelestarian warisan budaya takbenda gamelan Jawa yang kian tergerus.
                </p>
              </div>

              {/* Kartu Metrik Riset */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                <div
                  style={{
                    background: 'white',
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc2626' }}>
                    OECD PISA 2025 & 2022
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#991b1b', margin: '2px 0' }}>
                    Skor 427 & 366
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                    Skor <em>computational problem solving</em> Indonesia 427 (rerata global 500) dan matematika 366
                    (peringkat 69 dari 81 negara).
                  </p>
                </div>

                <div
                  style={{
                    background: 'white',
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb' }}>
                    Kurikulum SD 2025/2026
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e40af', margin: '2px 0' }}>
                    Mapel Coding & AI
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                    Kemendikdasmen menetapkan mapel pilihan mulai kelas V SD, namun kesiapan guru dan sarana belum
                    merata di berbagai pelosok.
                  </p>
                </div>

                <div
                  style={{
                    background: 'white',
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706' }}>
                    UNESCO 2021
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309', margin: '2px 0' }}>
                    Warisan Takbenda
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                    Gamelan resmi diakui UNESCO dengan aturan laras dan ritme presisi, namun generasi muda minim minat
                    akibat keterbatasan alat fisik.
                  </p>
                </div>
              </div>

              {/* Rujukan Etnokomputasi */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 14,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <div style={{ color: '#0284c7', marginTop: 2 }}>
                  <BookOpen size={18} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.45 }}>
                  <strong>Landasan Teori Etnokomputasi:</strong> Sejalan dengan temuan riset <em>Adinkra Mathematics</em> di
                  Ghana (Babbitt et al., 2015) dan <em>EarSketch</em> (Magerko et al., 2016), menyematkan simbol budaya lokal
                  meningkatkan capaian berpikir komputasional secara signifikan dibanding koding konvensional tanpa konteks.
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: TIGA PRINSIP INTI IMPLEMENTASI */}
          {currentSlide === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  padding: '14px 16px',
                  borderRadius: 16,
                  border: '1.5px solid #bfdbfe',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                  Babak 2 • Model Implementasi & Filosofi
                </div>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a' }}>
                  Tiga Prinsip Inti GamelanCode
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#1e40af', lineHeight: 1.5 }}>
                  Dirancang agar tidak sekadar menjadi simulasi layar, namun menjaga orisinalitas nilai rasa dan etika
                  karawitan yang adiluhung.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Prinsip 1 */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    padding: '14px',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: '#dcfce7',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 800, color: '#1e293b' }}>
                      Learning by Doing (Belajar Melalui Praktik Nyata)
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                      Siswa menyusun blok instruksi algoritma secara langsung, mengamati jalannya visualizer tabuhan
                      secara real-time, mendeteksi perbedaan nada, dan memperbaiki kesalahan logika tanpa takut salah.
                    </p>
                  </div>
                </div>

                {/* Prinsip 2 */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    padding: '14px',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: '#fef3c7',
                      color: '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 800, color: '#1e293b' }}>
                      Human-in-the-Loop (Praktisi & Guru Sebagai Pusat)
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                      Aplikasi <strong>bukan pengganti</strong> guru maupun seniman pengrawit. GamelanCode adalah jembatan
                      pembantu yang memvalidasi pola dan memberi ruang bagi bimbingan rasa dan etika berkarawitan dari guru.
                    </p>
                  </div>
                </div>

                {/* Prinsip 3 */}
                <div
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    padding: '14px',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: '#f3e8ff',
                      color: '#7e22ce',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    3
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 800, color: '#1e293b' }}>
                      Dual-Model (Sinergi Digital & Gamelan Akustik)
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                      Memberikan akses tanpa hambatan kepemilikan gamelan fisik lewat web simulator, yang kemudian dapat
                      diteruskan dengan latihan gending langsung pada gamelan akustik fisik di sanggar atau sekolah.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kutipan Penutup Prinsip */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  borderRadius: 14,
                  padding: '10px 14px',
                  fontStyle: 'italic',
                  fontSize: '0.78rem',
                  color: '#92400e',
                  lineHeight: 1.4,
                  textAlign: 'center',
                }}
              >
                &ldquo;Pelestarian budaya bukan sekadar menjaga agar tetap ada, melainkan membuka ruang agar generasi muda
                dapat mempelajari, memaknai, dan mengembangkannya.&rdquo; — <em>Esai GamelanCode</em>
              </div>
            </div>
          )}

          {/* SLIDE 3: TAKSONOMI BLOOM & PRODUCTIVE FAILURE */}
          {currentSlide === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                  padding: '14px 16px',
                  borderRadius: 16,
                  border: '1.5px solid #e9d5ff',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7e22ce', textTransform: 'uppercase' }}>
                  Babak 3 • Taksonomi Bloom (C1–C6) & Productive Failure
                </div>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#581c87' }}>
                  Kerangka Kognitif Krathwohl (2002) & Kapur (2008)
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#6b21a8', lineHeight: 1.5 }}>
                  Misi belajar tidak acak, melainkan disusun secara sistematis menurut 6 jenjang proses kognitif
                  lengkap dengan fondasi teori <em>Productive Failure</em>.
                </p>
              </div>

              {/* Grid 6 Misi Bloom */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {[
                  { code: 'C1', title: 'Kenali Gamelan', bloom: 'Mengingat', color: '#d97706', desc: 'Identifikasi instrumen saron & nada slendro' },
                  { code: 'C2', title: 'Pahami Polanya', bloom: 'Memahami', color: '#0284c7', desc: 'Memahami ritme & perulangan gending' },
                  { code: 'C3', title: 'Susun Tabuhan', bloom: 'Menerapkan', color: '#16a34a', desc: 'Merangkai blok algoritma tabuhan dasar' },
                  { code: 'C4', title: 'Detektif Tabuhan', bloom: 'Menganalisis', color: '#ea580c', desc: 'Debugging kesalahan logika tempo & nada' },
                  { code: 'C5', title: 'Kurator Pola', bloom: 'Mengevaluasi', color: '#9333ea', desc: 'Menilai keefektifan pola & pengulangan' },
                  { code: 'C6', title: 'Ciptakan Gendingmu', bloom: 'Mencipta', color: '#db2777', desc: 'Menciptakan komposisi tabuhan orisinal' },
                ].map((m) => (
                  <div
                    key={m.code}
                    onClick={() => handleJumpToMission(m.code)}
                    style={{
                      background: 'white',
                      borderRadius: 12,
                      padding: '10px 12px',
                      border: '1.5px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = m.color;
                      e.currentTarget.style.boxShadow = `0 4px 10px rgba(0,0,0,0.06)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: m.color,
                          background: `${m.color}15`,
                          padding: '1px 6px',
                          borderRadius: 6,
                        }}
                      >
                        {m.code} • {m.bloom}
                      </span>
                      <ArrowRight size={13} color="#94a3b8" />
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rujukan Productive Failure */}
              <div
                style={{
                  background: '#fefce8',
                  border: '1.5px solid #fde047',
                  borderRadius: 14,
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Sparkles size={16} color="#ca8a04" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#854d0e' }}>
                    Konsep Productive Failure (Kapur, 2008)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#713f12', lineHeight: 1.45 }}>
                  Di awal aplikasi, siswa diberikan <strong>Tantangan Awal</strong> sebelum menerima instruksi. Mencoba
                  memecahkan masalah terlebih dahulu mengaktifkan pemahaman awal dan memberi alasan mengapa konsep
                  komputasional (seperti perulangan) sangat dibutuhkan untuk efisiensi.
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 4: ARSITEKTUR 3-TAHAP & HARDWARE SOLENOID */}
          {currentSlide === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  padding: '14px 16px',
                  borderRadius: 16,
                  border: '1.5px solid #bbf7d0',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                  Babak 4 • Rekayasa Perangkat Lunak & Simulasi Hardware
                </div>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#14532d' }}>
                  Arsitektur 3-Tahap & Ekosistem Solenoid Otomatis
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#166534', lineHeight: 1.5 }}>
                  Menjamin keandalan bebas error bagi anak serta menyediakan jalur ekspansi menuju robotik gamelan fisik.
                </p>
              </div>

              {/* Visualisasi Arsitektur 3-Tahap */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 14,
                  padding: '14px',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>
                  Alur Eksekusi: Compile → Guard → Play
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: 10, border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0284c7' }}>1. Compile</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                      Blockly Workspace diekstrak menjadi GamelanEvent[]
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: 10, border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#e11d48' }}>2. Guard</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                      Anti-loop 5000 step & proteksi overflow ketukan
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: 10, border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#16a34a' }}>3. Play</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                      Web Audio Synthesizer & Hardware serial stream
                    </div>
                  </div>
                </div>
              </div>

              {/* Rancangan Hardware Solenoid */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 14,
                  padding: '14px',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Cpu size={18} color="#0891b2" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0e7490' }}>
                    Spesifikasi Serial UART & Preseden Riset Robotik
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.45 }}>
                  • <strong>Protokol Komunikasi:</strong> Serial UART 115200 Baud mengirim paket biner nada & intensitas ke
                  mikrokontroler (Arduino/ESP32).
                  <br />
                  • <strong>Mekanisme Fisik:</strong> Driver transistor menggerakkan aktuator solenoid 12V untuk memukul bilah saron
                  dan gong akustik.
                  <br />
                  • <strong>Preseden Ilmiah:</strong> Merujuk pada riset Robot Gamelan <em>Sekar Nuswantoro</em> Universitas Dian
                  Nuswantoro (PSI UDINUS, 2023) dan seni robotik <em>Gamelatron</em> (Aaron Taylor Kuffner).
                </div>
                <div
                  style={{
                    background: '#f1f5f9',
                    borderRadius: 8,
                    padding: '6px 10px',
                    fontSize: '0.72rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <ShieldCheck size={14} color="#059669" />
                  <span>Status: Mode simulasi software aktif. Perangkat keras fisik dirancang sebagai tahap lanjut.</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: DAMPAK MULTILEVEL, SDGS & INDONESIA EMAS 2045 */}
          {currentSlide === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                  padding: '14px 16px',
                  borderRadius: 16,
                  border: '1.5px solid #fde047',
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a16207', textTransform: 'uppercase' }}>
                  Babak 5 • Dampak Nyata, SDGs & Indonesia Emas 2045
                </div>
                <h4 style={{ margin: '4px 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#713f12' }}>
                  Transformasi Berkelanjutan & Ekosistem Kolaborasi
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#854d0e', lineHeight: 1.5 }}>
                  GamelanCode menciptakan dampak nyata dari tingkat siswa sekolah dasar hingga pembangunan nasional
                  menuju peradaban Indonesia Emas 2045.
                </p>
              </div>

              {/* 3 Tingkat Dampak */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div style={{ background: 'white', padding: '12px', borderRadius: 14, border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669' }}>Tingkat Siswa</div>
                  <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: 4, lineHeight: 1.35 }}>
                    Meningkatkan <em>computational thinking</em>, penalaran kritis, dan kecintaan seni karawitan sejak dini.
                  </div>
                </div>
                <div style={{ background: 'white', padding: '12px', borderRadius: 14, border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d97706' }}>Tingkat Sosial</div>
                  <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: 4, lineHeight: 1.35 }}>
                    Memperkuat regenerasi pelaku seni lewat sinergi aktif sekolah dasar dan sanggar budaya lokal.
                  </div>
                </div>
                <div style={{ background: 'white', padding: '12px', borderRadius: 14, border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb' }}>Pilar SDGs</div>
                  <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: 4, lineHeight: 1.35 }}>
                    Mendukung SDG 4 (Pendidikan Berkualitas), SDG 11 (Warisan Budaya), dan SDG 17 (Kemitraan Multipihak).
                  </div>
                </div>
              </div>

              {/* Quick Action Navigation Buttons */}
              <div
                style={{
                  background: 'white',
                  borderRadius: 16,
                  padding: '14px',
                  border: '1.5px solid #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>
                  Akses Cepat Fitur Aplikasi Prototipe:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleJumpToTab('editor')}
                    style={{
                      minHeight: 44,
                      padding: '0 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <span>🚀 Buka Editor Blok</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpToTab('misi')}
                    style={{
                      minHeight: 44,
                      padding: '0 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <span>🎯 Coba Misi Bloom</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpToTab('belajar')}
                    style={{
                      minHeight: 44,
                      padding: '0 12px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <span>🎼 Soundboard Belajar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleJumpToTab('karyaku')}
                    style={{
                      minHeight: 44,
                      padding: '0 12px',
                      background: '#ec4899',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                    }}
                  >
                    <span>📁 Notasi & Ekspor Karyaku</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Label Integritas Budaya Standar */}
          <div className="culture-disclaimer" style={{ marginTop: 'auto' }}>
            <span>
              ⚠️ <strong>Integritas Budaya:</strong> Pola tabuhan prototipe adalah contoh simulasi (belum divalidasi praktisi karawitan). Media ini melatih berpikir komputasional, bukan menggantikan estetika rasa penabuh gamelan asli.
            </span>
          </div>
        </div>

        {/* Footer Navigasi Slide */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1.5px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-sand)',
          }}
        >
          {/* Tombol Kembali (selalu terpasang dengan touch target >= 44px) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            style={{
              minHeight: 44,
              padding: '0 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid var(--border-card)',
              background: currentSlide === 0 ? 'rgba(45, 43, 43, 0.05)' : 'white',
              color: currentSlide === 0 ? 'rgba(45, 45, 43, 0.35)' : 'var(--color-charcoal)',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              opacity: currentSlide === 0 ? 0.6 : 1,
            }}
          >
            <ChevronLeft size={18} />
            <span>Kembali</span>
          </button>

          {/* Indikator Titik Slide */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? 24 : 10,
                  height: 10,
                  borderRadius: 9999,
                  backgroundColor: idx === currentSlide ? 'var(--color-pink)' : 'rgba(45, 45, 43, 0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
                aria-label={`Buka slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Tombol Lanjut / Selesai */}
          <button
            type="button"
            onClick={handleNext}
            style={{
              minHeight: 44,
              padding: '0 18px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: currentSlide === totalSlides - 1 ? 'var(--color-olive)' : 'var(--color-charcoal)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <span>{currentSlide === totalSlides - 1 ? 'Tutup & Eksplorasi' : 'Lanjut'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
