import { supabase } from "./config.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "siswa") window.location.href = "index.html";

document.getElementById("welcome").textContent = `Halo, ${user.nama}!`;

window.absenSekarang = async function () {
  const now = new Date();
  const jamSekarang = now.toTimeString().slice(0, 5);

  const { data: jam } = await supabase.from("pengaturan_jam").select("*").eq("id", 1).single();

  const masukValid = jamSekarang >= jam.jam_masuk_dari && jamSekarang <= jam.jam_masuk_sampai;
  const keluarValid = jamSekarang >= jam.jam_keluar_dari && jamSekarang <= jam.jam_keluar_sampai;

  if (!masukValid && !keluarValid) {
    alert("Diluar waktu absensi!");
    return;
  }

  const status = masukValid ? "Hadir" : "Terlambat";
  const tanggalHariIni = new Date().toISOString().split("T")[0];

  const { data: sudah } = await supabase
    .from("absensi")
    .select("*")
    .eq("user_id", user.id)
    .eq("tanggal", tanggalHariIni);

  if (sudah.length > 0) {
    alert("Sudah absen hari ini!");
    return;
  }

  const { error } = await supabase.from("absensi").insert({
    user_id: user.id,
    status,
  });

  if (error) alert("Gagal absensi!");
  else {
    alert("Absensi berhasil!");
    loadRiwayat();
  }
};

async function loadRiwayat() {
  const { data } = await supabase
    .from("absensi")
    .select("*")
    .eq("user_id", user.id)
    .order("tanggal", { ascending: false });

  const list = document.getElementById("riwayat");
  list.innerHTML = "";
  data.forEach(absen => {
    const li = document.createElement("li");
    li.textContent = `${absen.tanggal} - ${absen.status}`;
    list.appendChild(li);
  });
}

loadRiwayat();
