'use strict';

// Milestone A only: HTTPS camera access, capture, preview, retake, and use-photo check.
// No image persistence, ROI extraction, database, or scientific color processing yet.
const validTagPattern = /^FD-P-(00[1-9]|0[1-1][0-9]|02[0-4])$/;
const params = new URLSearchParams(window.location.search);
const rawId = params.get('id') || '';
const tagId = rawId.toUpperCase();

const tagTitle = document.getElementById('tag-title');
const statusBox = document.getElementById('status');
const message = document.getElementById('message');
const video = document.getElementById('video');
const canvas = document.getElementById('still');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('placeholder');
const openButton = document.getElementById('open-camera');
const captureButton = document.getElementById('capture');
const retakeButton = document.getElementById('retake');
const useButton = document.getElementById('use-photo');
let stream = null;
let capturedDataUrl = null;

if (!validTagPattern.test(tagId)) {
  tagTitle.textContent = 'ID tag tidak valid';
  statusBox.textContent = 'Gunakan URL dengan parameter ?id=FD-P-001 sampai FD-P-024.';
  openButton.disabled = true;
  message.textContent = 'Tidak ada kamera yang dibuka karena ID belum valid.';
} else {
  tagTitle.textContent = tagId;
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  video.srcObject = null;
}

async function openCamera() {
  if (!validTagPattern.test(tagId)) return;
  if (!window.isSecureContext) {
    message.textContent = 'Kamera memerlukan HTTPS (atau localhost untuk pengujian lokal).';
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    message.textContent = 'Browser ini tidak menyediakan akses kamera. Coba browser smartphone terbaru.';
    return;
  }
  message.textContent = 'Meminta izin kamera…';
  try {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
    } catch (firstError) {
      // Some devices do not support facingMode constraints; retry with a generic video request.
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    }
    video.srcObject = stream;
    video.hidden = false;
    preview.hidden = true;
    canvas.hidden = true;
    placeholder.hidden = true;
    await video.play();
    captureButton.disabled = false;
    openButton.hidden = true;
    captureButton.hidden = false;
    retakeButton.hidden = true;
    useButton.hidden = true;
    message.textContent = 'Kamera aktif. Pastikan tag terlihat utuh sebelum mengambil foto.';
  } catch (error) {
    stopCamera();
    const name = error && error.name;
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      message.textContent = 'Izin kamera ditolak. Izinkan kamera untuk situs ini di pengaturan browser, lalu muat ulang halaman.';
    } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      message.textContent = 'Kamera tidak ditemukan pada perangkat ini.';
    } else if (name === 'NotReadableError' || name === 'TrackStartError') {
      message.textContent = 'Kamera sedang dipakai aplikasi lain atau tidak dapat dimulai. Tutup aplikasi kamera lain dan coba lagi.';
    } else {
      message.textContent = `Kamera gagal dibuka (${name || 'kesalahan tidak diketahui'}). Periksa HTTPS dan izin kamera.`;
    }
  }
}

function capturePhoto() {
  if (!video.videoWidth || !video.videoHeight) {
    message.textContent = 'Video belum siap. Tunggu sebentar lalu coba lagi.';
    return;
  }
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  preview.src = capturedDataUrl;
  preview.hidden = false;
  video.hidden = true;
  canvas.hidden = true;
  captureButton.hidden = true;
  retakeButton.hidden = false;
  useButton.hidden = false;
  message.textContent = 'Pratinjau siap. Pilih Ambil ulang atau Gunakan foto untuk menuntaskan uji.';
}

function retakePhoto() {
  if (!stream || !stream.active) {
    openButton.hidden = false;
    retakeButton.hidden = true;
    useButton.hidden = true;
    preview.hidden = true;
    placeholder.hidden = false;
    message.textContent = 'Buka kamera untuk mengambil foto baru.';
    return;
  }
  preview.hidden = true;
  video.hidden = false;
  captureButton.hidden = false;
  retakeButton.hidden = true;
  useButton.hidden = true;
  message.textContent = 'Kamera aktif kembali. Ambil ulang saat tag sudah berada di dalam bingkai.';
}

function usePhoto() {
  if (!capturedDataUrl) {
    message.textContent = 'Belum ada foto. Ambil foto terlebih dahulu.';
    return;
  }
  stopCamera();
  statusBox.textContent = 'Uji kamera berhasil pada sesi ini — foto tertangkap dan pratinjau dapat digunakan.';
  message.textContent = 'Milestone A: pengambilan dan pratinjau foto selesai. Foto belum dikirim atau disimpan.';
  retakeButton.hidden = true;
  useButton.hidden = true;
  openButton.hidden = false;
  openButton.textContent = 'Uji kamera lagi';
}

openButton.addEventListener('click', openCamera);
captureButton.addEventListener('click', capturePhoto);
retakeButton.addEventListener('click', retakePhoto);
useButton.addEventListener('click', usePhoto);
window.addEventListener('pagehide', stopCamera);
