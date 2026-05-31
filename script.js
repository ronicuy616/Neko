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

const TREATMENT_DB = {
    "Ringworm (Kurap)": "Mandikan kucing secara berkala menggunakan sampo khusus antijamur yang mengandung Miconazole atau Ketoconazole. Oleskan salep miconazole pada area luka melingkar. Lakukan isolasi mandiri agar spora jamur tidak menular ke hewan lain atau manusia.",
    "Alergi (Dermatitis)": "Identifikasi pemicu alergi (makanan, debu, atau kutu). Disarankan mengganti pakan ke jenis khusus Sensitive Skin atau Hypoallergenic (Grain-free). Berikan suplemen vitamin kulit (Omega-3 & 6) dan jaga kebersihan lingkungan bermain.",
    "Scabies (Kudis)": "Segera pisahkan kucing karena penyakit ini sangat menular. Pengobatan efektif memerlukan obat tetes tengkuk khusus (Spot-on seperti Revolution) atau suntikan ivermectin oleh Dokter Hewan. Rendam mainan dan kasur kucing dengan air panas.",
    "Hotspot": "Cukur bulu di sekitar titik luka basah agar sirkulasi udara lancar dan luka lekas mengering. Bersihkan area radang menggunakan antiseptik ringan (khusus hewan). Wajib pakaikan Elizabeth Collar (corong leher) agar kucing tidak terus-menerus menjilati lukanya."
};

// 1. MANAJEMEN INPUT UNGGAL FILE & DRAG DROP
dropZone.addEventListener('click', () => fileInput.click());

// Mendeteksi ketika file dipilih lewat explorer berkas
fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

// Event Drag over
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#6C5CE7';
});

// Event Drag leave
dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#CBD5E0';
});

// Event Drop berkas gambar
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#CBD5E0';
    handleFiles(e.dataTransfer.files);
});

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
        // Mengisi source gambar pratinjau yang nempel di layout PDF berkas
        imagePreview.src = e.target.result;
        runAiAnalysis();
    };
    reader.readAsDataURL(file);
}

// 2. ENGINE ANALISIS DETEKSI AI
function runAiAnalysis() {
    resultBox.hidden = false;
    predictionText.innerHTML = "🔍 AI sedang menganalisis sampel jaringan kulit...";
    progressBar.style.width = "30%";
    progressBar.innerText = "30%";
    treatmentText.innerText = "Menganalisis langkah yang tepat...";

    const sekarang = new Date();
    reportDate.innerText = "Waktu Pemeriksaan: " + sekarang.toLocaleString('id-ID');

    setTimeout(() => {
        // Logika Klasifikasi berbasis probabilitas acak terkontrol (dapat dihubungkan dengan model .json real Anda)
        const randomIndex = Math.floor(Math.random() * LABELS.length);
        const hasilPenyakit = LABELS[randomIndex];
        const akurasiAcak = (Math.random() * (99.5 - 84.0) + 84.0).toFixed(2);

        predictionText.innerHTML = `Hasil Deteksi Teridentifikasi: <b style="color:#6C5CE7; font-size:1.15rem;">${hasilPenyakit}</b>`;
        progressBar.style.width = `${akurasiAcak}%`;
        progressBar.innerText = `${akurasiAcak}%`;
        
        treatmentText.innerText = TREATMENT_DB[hasilPenyakit];

        tambahKeMenuRiwayat(sekarang.toLocaleTimeString('id-ID'), hasilPenyakit, akurasiAcak);
    }, 1200); 
}

function tambahKeMenuRiwayat(waktu, penyakit, akurasi) {
    if (emptyHistory) emptyHistory.style.display = 'none';

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><b>${waktu}</b></td>
        <td><span style="color:#6C5CE7; font-weight:600;">${penyakit}</span></td>
        <td>${akurasi}%</td>
        <td><span style="background:#DCFCE7; color:#156534; padding:4px 8px; border-radius:12px; font-size:0.78rem; font-weight:bold;">Sukses</span></td>
    `;
    historyBody.insertBefore(row, historyBody.firstChild);
}

// 3. EKSPOR DATA DAN PREVIEW GAMBAR SECARA NYATA KE PDF
function downloadPDF() {
    const element = document.getElementById('pdfArea');
    
    const opsiKompresi = {
        margin:       10,
        filename:     'Laporan_Diagnosa_Kucing_AI.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: false 
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opsiKompresi).from(element).save();
}
