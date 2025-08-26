// Variabel global
let chapters = {}; // { libra: [...], virgo: [...], karyaku: [...] }
let unlockKeys = {};
let currentSection = '';
let currentChapterIndex = 0;
let isViewingChapter = false; // Tambahkan variabel untuk melacak status

// URL Backend — Ganti ke URL deploy nanti
const API_URL = "http://localhost:5000"; // Ganti jadi: https://githouse-api.onrender.com saat deploy

// Muat data dari backend saat halaman dibuka
async function loadData() {
  try {
    const [chaptersRes, keysRes] = await Promise.all([
      fetch(`${API_URL}/api/chapters`).then(r => r.json()),
      fetch(`${API_URL}/api/keys`).then(r => r.json())
    ]);
    chapters = chaptersRes; // ← ambil urutan dari server
    unlockKeys = keysRes;
  } catch (err) {
    console.error("Gagal ambil data", err);
    alert("Tidak bisa terhubung ke server. Cek backend atau koneksi internet.");
  }
}

// Panggil saat halaman selesai muat
window.onload = loadData;

// Buka modal kunci
function unlockSection(section) {
  currentSection = section;
  document.getElementById('modalTitle').textContent = `Buka ${capitalize(section)}`;
  document.getElementById('modalDesc').textContent = `Masukkan kunci akses untuk membuka bagian ${capitalize(section)}.`;
  document.getElementById('accessKey').value = '';
  document.getElementById('unlockModal').classList.remove('hidden');
}

// Tutup modal
function closeModal() {
  document.getElementById('unlockModal').classList.add('hidden');
}

// Validasi kunci
function validateKey() {
  const input = document.getElementById('accessKey').value.trim();
  if (input === unlockKeys[currentSection]) {
    sessionStorage.setItem(`unlocked_${currentSection}`, 'true');
    closeModal();
    loadSection(currentSection);
  } else {
    alert('Kunci salah! Silakan coba lagi.');
  }
}

// Tampilkan daftar chapter
function loadSection(section) {
  // Simpan section aktif
  currentSection = section;
  isViewingChapter = false; // Sedang melihat daftar chapter

  // Cek apakah terkunci
  if (['libra', 'virgo'].includes(section)) {
    if (!sessionStorage.getItem(`unlocked_${section}`)) {
      unlockSection(section);
      return;
    }
  }

  // Sembunyikan menu utama
  document.querySelector('main').classList.add('hidden');
  document.getElementById('contentSection').classList.remove('hidden');

  const titleEl = document.getElementById('sectionTitle');
  const listEl = document.getElementById('chapterList');

  // Judul utama
  titleEl.textContent = "Cerita yang Tak Pernah Punya Bab Terakhir";

  // Kosongkan daftar
  listEl.innerHTML = '';

  const chapterData = chapters[section] || [];

  if (chapterData.length === 0) {
    listEl.innerHTML = '<p class="text-gray-500">Belum ada chapter di bagian ini.</p>';
  } else {
    // Tampilkan daftar chapter sebagai tombol
    const ul = document.createElement('ul');
    ul.className = 'flex flex-wrap gap-2 mb-6';

    chapterData.forEach((chap, index) => {
      const li = document.createElement('li');
      li.className = 'bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-emerald-700 transition';
      li.textContent = `Bagian ${index + 1}`;
      li.onclick = () => {
        currentChapterIndex = index;
        showChapter(chap);
      };
      ul.appendChild(li);
    });

    listEl.appendChild(ul);
  }
}

// Tampilkan isi chapter
function showChapter(chap) {
  isViewingChapter = true; // Sedang melihat konten chapter
  
  const titleEl = document.getElementById('sectionTitle');
  const listEl = document.getElementById('chapterList');

  // Judul utama tetap
  titleEl.textContent = "Cerita yang Tak Pernah Punya Bab Terakhir";

  // Kosongkan daftar
  listEl.innerHTML = '';

  // Buat konten
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = `
    <!-- Isi cerita -->
    <div class="bg-white p-8 rounded-xl shadow-lg border border-emerald-100 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-emerald-600 mb-6">${chap.title}</h2>
      <div class="text-gray-700 leading-relaxed whitespace-pre-line">
        ${chap.content}
      </div>
    </div>

    <!-- Tombol Selanjutnya (kanan sekali) -->
    <div class="flex justify-end mt-8">
      <button onclick="nextChapter()" class="text-emerald-600 hover:underline flex items-center gap-1">
        Selanjutnya →
      </button>
    </div>
  `;

  listEl.appendChild(contentDiv);
}

// Fungsi chapter berikutnya
function nextChapter() {
  const chapterData = chapters[currentSection] || [];
  if (currentChapterIndex < chapterData.length - 1) {
    currentChapterIndex++;
    showChapter(chapterData[currentChapterIndex]);
  } else {
    alert("Ini adalah chapter terakhir.");
  }
}

// Kembali ke halaman sebelumnya (dinamis) - DIPERBAIKI
function goBack() {
  if (isViewingChapter) {
    // Jika sedang melihat konten chapter, kembali ke daftar chapter
    isViewingChapter = false;
    loadSection(currentSection);
  } else {
    // Jika sedang melihat daftar chapter, kembali ke menu utama
    document.getElementById('contentSection').classList.add('hidden');
    document.querySelector('main').classList.remove('hidden');
  }
}

// Tampilkan kembali daftar chapter
function showChapterList() {
  isViewingChapter = false; // Kembali ke daftar chapter
  
  const titleEl = document.getElementById('sectionTitle');
  const listEl = document.getElementById('chapterList');

  titleEl.textContent = "Cerita yang Tak Pernah Punya Bab Terakhir";
  listEl.innerHTML = '';

  const chapterData = chapters[currentSection] || [];

  if (chapterData.length === 0) {
    listEl.innerHTML = '<p class="text-gray-500">Belum ada chapter di bagian ini.</p>';
  } else {
    const ul = document.createElement('ul');
    ul.className = 'flex flex-wrap gap-2 mb-6';

    chapterData.forEach((chap, index) => {
      const li = document.createElement('li');
      li.className = 'bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-emerald-700 transition';
      li.textContent = `Bagian ${index + 1}`;
      li.onclick = () => {
        currentChapterIndex = index;
        showChapter(chap);
      };
      ul.appendChild(li);
    });

    listEl.appendChild(ul);
  }
}

// Capitalize huruf pertama
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}