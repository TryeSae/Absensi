import { supabase } from "./config.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  loadRiwayat();
});

window.tambahSiswa = async function () {
  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.from("users").insert({ nama, email, password, role: "siswa" });
  if (error) alert("Gagal tambah siswa");
  else alert("Berhasil tambah siswa");
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
};

async function loadRiwayat() {
  const { data } = await supabase
    .from("absensi")
    .select("*, users(nama)")
    .order("tanggal", { ascending: false });

  const list = document.getElementById("riwayat");
  list.innerHTML = "";
  data.forEach(absen => {
    const li = document.createElement("li");
    li.textContent = `${absen.users.nama} - ${absen.tanggal} - ${absen.status}`;
    list.appendChild(li);
  });
}
