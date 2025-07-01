import { supabase } from "./config.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "siswa") window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("namaSiswa").textContent = user.nama;
  loadJam();
  loadRiwayat();
});

async function loadJam() {
  const { data } = await supabase.from("pengaturan_jam").select("*").eq("id", 1).single();
  if (data) {
    document.getElementById("jamMasuk").textContent = `${data.jam_masuk_dari} - ${data.jam_masuk_sampai}`;
    document.getElementById("jamKeluar").textContent = `${data.jam_keluar_dari} - ${data.jam_keluar_sampai}`;
  }
}

async function loadRiwayat() {
  const { data } = await supabase
    .from("absensi")
    .select("*")
    .eq("user_id", user.id)
    .order("tanggal", { ascending: false });

  const tbody = document.getElementById("riwayatSiswa");
  tbody.innerHTML = "";

  data.forEach(item => {
    const keterangan = item.status === "Masuk" ? "✅ Absen Masuk" : "✅ Absen Keluar";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.status}</td>
      <td>${keterangan}</td>
    `;
    tbody.appendChild(row);
  });
}

window.absen = async function () {
  const tanggal = new Date().toISOString().split("T")[0];
  const now = new Date();
  const jamSekarang = now.toTimeString().slice(0, 5); // format HH:MM

  const { data: jamData } = await supabase.from("pengaturan_jam").select("*").eq("id", 1).single();
  if (!jamData) return alert("Jam belum diatur oleh admin");

  let status = "";
  if (jamSekarang >= jamData.jam_masuk_dari && jamSekarang <= jamData.jam_masuk_sampai) {
    status = "Masuk";
  } else if (jamSekarang >= jamData.jam_keluar_dari && jamSekarang <= jamData.jam_keluar_sampai) {
    status = "Keluar";
  } else {
    return alert("Bukan waktu absensi yang diperbolehkan!");
  }

  const { error } = await supabase.from("absensi").insert({
    user_id: user.id,
    tanggal,
    status
  });

  if (error) return alert("Gagal absen");

  alert(`Absensi ${status} berhasil`);
  loadRiwayat();
};
