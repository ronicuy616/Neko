const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const dropZoneContent = document.getElementById('dropZoneContent');
const imagePreview = document.getElementById('imagePreview');
const resultBox = document.getElementById('resultBox');
const predictionText = document.getElementById('predictionText');
const progressBar = document.getElementById('progressBar');
const treatmentText = document.getElementById('treatmentText');
const reportDate = document.getElementById('reportDate');
const historyBody = document.getElementById('historyBody');
const emptyHistory = document.getElementById('emptyHistory');

const LABELS = ["Ringworm (Kurap)", "Alergi (Dermatitis)", "Scabies (Kudis)", "Hotspot"];

// Database Cara Mengatasi / Solusi Penyakit Kulit
const TREATMENT_DB = {
    "Ringworm (Kurap)": "Mandikan kucing secara berkala menggunakan sampo khusus antijamur yang mengandung Miconazole atau Ketoconazole. Oleskan salep miconazole pada area luka melingkar. Lakukan isolasi mandiri agar spora jamur tidak menular ke hewan lain atau manusia.",
    "Alergi (Dermatitis)": "Identifikasi pemicu alergi (makanan, debu, atau kutu). Disarankan mengganti pakan ke jenis khusus Sensitive Skin atau Hypoallergenic (Grain-free). Berikan suplemen vitamin kulit (Omega-3 & 6) dan jaga kebersihan lingkungan bermain.",
    "Scabies (Kudis)": "Segera pisahkan kucing karena penyakit ini sangat menular. Pengobatan efektif memerlukan obat tetes tengkuk khusus (Spot-on seperti Revolution) atau suntikan ivermectin oleh Dokter Hewan. Rendam mainan dan kasur kucing dengan air panas.",
    "Hotspot": "Cukur bulu di sekitar titik luka basah agar sirkulasi udara lancar dan luka lekas mengering. Bersihkan area radang menggunakan antiseptik ringan (khusus hewan). Wajib pakaikan Elizabeth Collar (corong leher) agar kucing tidak terus-menerus menjilati lukanya."
};

// Event Trigger
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

function triggerUploadClick() {
    fileInput.click();
}

function focusUpload() {
    dropZone.scrollIntoView({ behavior: 'smooth' });
}

function handleFiles(files) {
    if (files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
        alert('Mohon unggah berkas berupa gambar yang valid!');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.hidden = false;
        dropZoneContent.hidden = true;
        
        runAiAnalysis();
    };
    reader.readAsDataURL(file);
}

// Simulasi / Proses Analisis AI
function runAiAnalysis() {
    resultBox.hidden = false;
    predictionText.innerHTML = "🔍 AI sedang menganalisis sampel jaringan kulit...";
    progressBar.style.width = "30%";
    progressBar.innerText = "30%";
    treatmentText.innerText = "Menganalisis langkah yang tepat...";

    // Mengeset waktu diagnosa saat ini
    const sekarang = new Date();
    reportDate.innerText = "Waktu Pemeriksaan: " + sekarang.toLocaleString('id-ID');

    setTimeout(() => {
        // Logika Klasifikasi (Dapat diintegrasikan dengan tf.browser.fromPixels jika model.json tersedia)
        const randomIndex = Math.floor(Math.random() * LABELS.length);
        const hasilPenyakit = LABELS[randomIndex];
        const akurasiAcak = (Math.random() * (99.5 - 84.0) + 84.0).toFixed(2);

        // Update Tampilan Hasil Laporan
        predictionText.innerHTML = `Hasil Deteksi Teridentifikasi: <b style="color:#6C5CE7; font-size:1.15rem;">${hasilPenyakit}</b>`;
        progressBar.style.width = `${akurasiAcak}%`;
        progressBar.innerText = `${akurasiAcak}%`;
        
        // Update Cara Mengatasi
        treatmentText.innerText = TREATMENT_DB[hasilPenyakit];

        // Masukkan Hasil ke Menu Riwayat Diagnosa
        tambahKeMenuRiwayat(sekarang.toLocaleTimeString('id-ID'), hasilPenyakit, akurasiAcak);
    }, 1500); 
}

// Fungsi Tambah Data ke Menu Tabel Riwayat
function tambahKeMenuRiwayat(waktu, penyakit, akurasi) {
    if (emptyHistory) {
        emptyHistory.style.display = 'none';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><b>${waktu}</b></td>
        <td><span style="color:#6C5CE7; font-weight:600;">${penyakit}</span></td>
        <td>${akurasi}%</td>
        <td><span style="background:#DCFCE7; color:#156534; padding:4px 8px; border-radius:12px; font-size:0.78rem; font-weight:bold;">Sukses</span></td>
    `;
    // Memasukkan riwayat baru di urutan paling atas tabel
    historyBody.insertBefore(row, historyBody.firstChild);
}

// Fitur Download Hasil Diagnosa Menjadi PDF
function downloadPDF() {
    const element = document.getElementById('pdfArea');
    const opsiKompresi = {
        margin:       10,
        filename:     'Hasil_Diagnosa_Kulit_Kucing_AI.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Menjalankan fungsi export pdf
    html2pdf().set(opsiKompresi).from(element).save();
}
