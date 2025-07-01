import { supabase } from "./config.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    alert("Login gagal! Email atau password salah.");
    return;
  }

  localStorage.setItem("user", JSON.stringify(data));
  window.location.href = data.role === "admin" ? "dashboard.html" : "siswa.html";
});
