import { supabase } from "./config.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  loadRiwayat();
  loadJam();
  loadSiswa();
});

// Fungsi global penutup modal
window.tutupModal = function(id) {
  const modalEl = document.getElementById(id);
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
};

window.tambahSiswa = async function () {
  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.from("users").insert({ nama, email, password, role: "siswa" });
  if (error) alert("Gagal tambah siswa");
  else {
    alert("Berhasil tambah siswa");
    loadSiswa();
    tutupModal("modalTambah");
  }
};

window.simpanJam = async function () {
  const jam_masuk_dari = document.getElementById("masukDari").value;
  const jam_masuk_sampai = document.getElementById("masukSampai").value;
  const jam_keluar_dari = document.getElementById("keluarDari").value;
  const jam_keluar_sampai = document.getElementById("keluarSampai").value;

  await supabase.from("pengaturan_jam").upsert({
    id: 1,
    jam_masuk_dari,
    jam_masuk_sampai,
    jam_keluar_dari,
    jam_keluar_sampai,
  });

  alert("Jam berhasil disimpan");
  await loadJam();
  tutupModal("modalJam");
};

async function loadJam() {
  const { data } = await supabase.from("pengaturan_jam").select("*").eq("id", 1).single();
  if (data) {
    document.getElementById("masukDari").value = data.jam_masuk_dari;
    document.getElementById("masukSampai").value = data.jam_masuk_sampai;
    document.getElementById("keluarDari").value = data.jam_keluar_dari;
    document.getElementById("keluarSampai").value = data.jam_keluar_sampai;

    document.getElementById("jamMasukTampil").innerText = `${data.jam_masuk_dari} - ${data.jam_masuk_sampai}`;
    document.getElementById("jamKeluarTampil").innerText = `${data.jam_keluar_dari} - ${data.jam_keluar_sampai}`;
  }
}

async function loadRiwayat() {
  const { data } = await supabase
    .from("absensi")
    .select("*, users(nama)")
    .order("tanggal", { ascending: false });

  const tbody = document.getElementById("riwayat");
  tbody.innerHTML = "";
  data.forEach(absen => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${absen.users.nama}</td>
      <td>${absen.tanggal}</td>
      <td>${absen.status}</td>
      <td>${absen.jenis ?? "-"}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadSiswa() {
  const { data } = await supabase.from("users").select("nama, email").eq("role", "siswa");
  const tbody = document.getElementById("daftarSiswa");
  tbody.innerHTML = "";
  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${user.nama}</td><td>${user.email}</td>`;
    tbody.appendChild(row);
  });
}
