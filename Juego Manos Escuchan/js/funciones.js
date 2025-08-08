document.getElementById('link-show-register').addEventListener('click', (e)=>{
  e.preventDefault();
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
});

document.getElementById('link-show-login').addEventListener('click', (e)=>{
  e.preventDefault();
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
});

document.getElementById('btn-register').addEventListener('click', ()=>{
  const u = document.getElementById('register-username').value.trim();
  const p = document.getElementById('register-password').value;
  if(!u || !p){ alert('Completa todos los campos.'); return; }
  if(localStorage.getItem('user_'+u)){ alert('Este usuario ya existe.'); return; }
  localStorage.setItem('user_'+u, p);
  alert('Registro exitoso. Ahora inicia sesión.');
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('login-username').value = u;
});

document.getElementById('btn-login').addEventListener('click', ()=>{
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  if(!u || !p){ alert('Completa todos los campos.'); return; }
  const stored = localStorage.getItem('user_'+u);
  if(stored === null){ alert('Usuario no encontrado. Regístrate primero.'); return; }
  if(stored === p){
    localStorage.setItem('usuarioActual', u);
    alert('Bienvenido, ' + u + ' 🎉');
    window.location.href = 'juego.html';
  } else {
    alert('Contraseña incorrecta.');
  }
});
