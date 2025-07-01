import { supabase } from "./config.js";

// Validasi user siswa
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "siswa") window.location.href = "index.html";

// Load data saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("namaSiswa").textContent = user.nama;
  loadJam();
  loadRiwayat();
});

// Ambil pengaturan jam absensi
async function loadJam() {
  const { data } = await supabase.from("pengaturan_jam").select("*").eq("id", 1).single();
  if (data) {
    document.getElementById("jamMasuk").textContent = `${data.jam_masuk_dari} - ${data.jam_masuk_sampai}`;
    document.getElementById("jamKeluar").textContent = `${data.jam_keluar_dari} - ${data.jam_keluar_sampai}`;
  }
}

// Tampilkan riwayat absensi
async function loadRiwayat() {
  const { data } = await supabase
    .from("absensi")
    .select("*")
    .eq("user_id", user.id)
    .order("tanggal", { ascending: false });

  const tbody = document.getElementById("riwayatSiswa");
  tbody.innerHTML = "";

  if (data.length > 0) {
    const today = new Date().toISOString().split("T")[0];
    const hariIni = data.find(item => item.tanggal === today);
    if (hariIni) {
      document.getElementById("statusHariIni").textContent = hariIni.jenis ? `Sudah Absen (${hariIni.jenis})` : "Sudah Absen";
      document.getElementById("statusHariIni").classList.replace("bg-secondary", "bg-success");
    }
  }

  data.forEach(item => {
    const keterangan = item.jenis ? `✅ Absen ${item.jenis}` : "-";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.status}</td>
      <td>${keterangan}</td>
    `;
    tbody.appendChild(row);
  });
}

// Fungsi Absensi
window.absen = async function () {
  const tanggal = new Date().toISOString().split("T")[0];
  const now = new Date();
  const jamSekarang = now.toTimeString().slice(0, 5); // HH:MM

  const { data: jamData } = await supabase.from("pengaturan_jam").select("*").eq("id", 1).single();
  if (!jamData) return alert("Jam belum diatur oleh admin");

  let jenis = "";
  if (jamSekarang >= jamData.jam_masuk_dari && jamSekarang <= jamData.jam_masuk_sampai) {
    jenis = "Masuk";
  } else if (jamSekarang >= jamData.jam_keluar_dari && jamSekarang <= jamData.jam_keluar_sampai) {
    jenis = "Keluar";
  } else {
    return alert("Bukan waktu absensi yang diperbolehkan!");
  }

  const { error } = await supabase.from("absensi").insert({
    user_id: user.id,
    tanggal,
    status: "Hadir", // sesuai constraint Supabase
    jenis // Masuk/Keluar
  });

  if (error) return alert("Gagal absen");

  alert(`Absensi ${jenis} berhasil`);
  loadRiwayat();
};
