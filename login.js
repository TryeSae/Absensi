document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    alert('Email atau password salah!');
    return;
  }

  localStorage.setItem('user', JSON.stringify(data));

  if (data.role === 'admin') {
    window.location.href = 'dashboard.html';
  } else {
    window.location.href = 'siswa.html';
  }
});
