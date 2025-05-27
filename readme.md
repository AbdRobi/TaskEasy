# TaskEasy – Aplikasi Manajemen Tugas

TaskEasy adalah aplikasi manajemen tugas sederhana yang dibangun menggunakan praktik **Extreme Programming (XP)**. Aplikasi ini memungkinkan pengguna untuk membuat, melihat, memperbarui, dan menghapus tugas serta melacak status dan prioritasnya.

## 🔧 Fitur Utama (Planned)

- ✅ **Day 1**: Project setup dan perencanaan
- ✅ **Day 2**: Membuat tugas dengan judul, deskripsi, prioritas (US1)
- ✅ **Day 3**: Melihat daftar tugas yang diurutkan berdasarkan prioritas (US2)
- ✅ **Day 4**: Memperbarui status dan detail tugas (US3)
- ✅ **Day 5**: Menghapus tugas dengan konfirmasi (US4)
- ✅ **Day 6**: UI/UX Modern + Merge to Main + Deploy
- 🔄 **Day 7**: Presentasi dan Demo

## 🛠️ Teknologi yang Digunakan

- HTML, CSS, dan JavaScript murni (Frontend)
- LocalStorage (untuk penyimpanan data di sisi klien)
- Jest (untuk testing)
- GitHub Actions (untuk CI/CD)

## 👥 Peran dalam Pair Programming

| Hari   | Driver | Navigator | Reviewer | Focus                 |
| ------ | ------ | --------- | -------- | --------------------- |
| Hari 1 | Setup  | Planning  | Review   | Project Setup         |
| Hari 2 | Zein   | Rian      | Robi     | US1: Create Tasks     |
| Hari 3 | Robi   | Zein      | Rian     | US2: Priority Sorting |
| Hari 4 | Rian   | Robi      | Zein     | US3: Update Tasks     |
| Hari 5 | Zein   | Rian      | Robi     | US4: Delete Tasks     |
| Hari 6 | Robi   | Zein      | Rian     | Modern UI/UX + Deploy |

## 🚀 Memulai Proyek

\`\`\`bash

# Install dependencies

npm install

# Run development server

npm run dev

# Run tests

npm test

# Run tests in watch mode

npm run test:watch
\`\`\`

## 📋 User Stories

| ID  | User Story                                                                            | Prioritas | Poin Cerita | Status |
| --- | ------------------------------------------------------------------------------------- | --------- | ----------- | ------ |
| US1 | Sebagai pengguna, saya dapat membuat tugas dengan judul, deskripsi, prioritas         | Tinggi    | 3           | ✅     |
| US2 | Sebagai pengguna, saya dapat melihat semua tugas yang diurutkan berdasarkan prioritas | Tinggi    | 2           | ✅     |
| US3 | Sebagai pengguna, saya dapat memperbarui status dan detail tugas                      | Sedang    | 2           | ✅     |
| US4 | Sebagai pengguna, saya dapat menghapus tugas                                          | Rendah    | 1           | ✅     |

## 📆 Rencana Sprint

| Hari | Target Kegiatan                                           | Status | Deliverables                        |
| ---- | --------------------------------------------------------- | ------ | ----------------------------------- |
| 1    | Menyiapkan proyek, repositori, dan perencanaan user story | ✅     | Project setup, planning docs        |
| 2    | Mengerjakan US1 dengan pendekatan TDD                     | ✅     | Create task functionality           |
| 3    | Mengerjakan US2 dan melakukan refactoring                 | ✅     | Priority sorting, visual indicators |
| 4    | Mengerjakan US3 dengan edit mode                          | ✅     | Update task functionality           |
| 5    | Mengerjakan US4 dengan delete confirmation                | ✅     | Delete task functionality           |
| 6    | Modern UI/UX + Merge to Main + Deploy                     | ✅     | Production-ready app                |
| 7    | Presentasi dan demo aplikasi                              | 🔄     | Final presentation                  |

---

## 🧠 Planning Game – TaskEasy

### 🎯 Tujuan

Menguraikan proyek menjadi user story yang dapat dikelola dan merencanakan pengembangan.

## ☀️ Catatan Stand-Up Harian – TaskEasy

### Hari 1 ✅

- **Kemajuan:** Repositori diinisialisasi, user story direncanakan
- **Selanjutnya:** Mulai US1 dengan TDD

### Hari 2 ✅

- **Peran Pair Programming:** Zein (Driver), Rian (Navigator), Robi (Reviewer)
- **Target:** Pembuatan fitur tambah tugas dengan pendekatan TDD
- **Hasil:** US1 berhasil diimplementasi dengan validasi lengkap
- **Test Coverage:** 85%
- **Selanjutnya:** Menampilkan daftar tugas berdasarkan prioritas

### Hari 3 ✅

- **Peran Pair Programming:** Robi (Driver), Zein (Navigator), Rian (Reviewer)
- **Target:** US2 - Fitur sorting berdasarkan prioritas + refactoring
- **Hasil:** Priority sorting dengan visual indicators
- **Test Coverage:** 92%
- **Selanjutnya:** Implementasi fitur update

### Hari 4 ✅

- **Peran Pair Programming:** Rian (Driver), Robi (Navigator), Zein (Reviewer)
- **Target:** US3 - Implementasi fitur update tugas
- **Hasil:** Edit mode dengan form integration
- **Test Coverage:** 88%
- **Selanjutnya:** Implementasi fitur delete

### Hari 5 ✅

- **Peran Pair Programming:** Zein (Driver), Rian (Navigator), Robi (Reviewer)
- **Target:** US4 - Implementasi fitur delete tugas
- **Hasil:** Delete dengan confirmation modal + bulk operations
- **Test Coverage:** 90%
- **Selanjutnya:** Modern UI/UX improvements + deploy

### Hari 6 ✅

- **Peran Pair Programming:** Robi (Driver), Zein (Navigator), Rian (Reviewer)
- **Target:** Modern UI/UX design + merge to main + deploy
- **Rencana:**
  - Redesign dengan modern minimalist approach
  - Dark mode implementation
  - Enhanced mobile experience
  - Merge semua branches ke main
  - Deploy ke production
- **Selanjutnya:** Persiapan presentasi

---

## 📋 Laporan Proyek XP – TaskEasy (Preview)

### 🔧 Praktik XP yang Akan Diterapkan

- **Pair Programming:** Rotasi harian peran driver/navigator/reviewer
- **TDD:** Pengujian ditulis terlebih dahulu sebelum implementasi
- **CI:** GitHub Actions menjalankan pengujian otomatis pada setiap push/PR
- **Rilis Kecil:** Fitur diselesaikan bertahap setiap hari
- **Refactoring:** Perbaikan kode setelah pengujian
- **Kolaborasi Pelanggan:** Satu anggota bertindak sebagai product owner

### 🎯 Kriteria Evaluasi

- **Functionality (30%)**: Apakah aplikasi memenuhi requirements?
- **XP Practices (40%)**: Seberapa efektif praktik XP diimplementasikan?
- **Collaboration (20%)**: Komunikasi dan kolaborasi tim
- **Presentation (10%)**: Kualitas demo dan penjelasan

---

_Dibuat dengan ❤️ menggunakan Extreme Programming practices_

**Next:** Ready untuk Day 6 - Modern UI/UX improvements + deploy 🚀
