const nombreJugador = localStorage.getItem('usuarioActual');
if (!nombreJugador) {
  window.location.href = "index.html"; // Si no hay usuario, vuelve al login
}

document.getElementById("nombreJugador").textContent = nombreJugador;

let preguntaActual = 0;

function mostrarPregunta() {
  if (preguntaActual >= preguntas.length) {
    document.getElementById("pregunta-box").innerHTML = "<h2>¡Nivel completado 🎉!</h2>";
    return;
  }

  const p = preguntas[preguntaActual];
  document.getElementById("pregunta-texto").textContent = p.pregunta;
  document.getElementById("pregunta-imagen").src = p.imagen;

  const opcionesDiv = document.getElementById("opciones");
  opcionesDiv.innerHTML = "";
  p.opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.onclick = () => verificarRespuesta(op);
    opcionesDiv.appendChild(btn);
  });
}

function verificarRespuesta(opcion) {
  const p = preguntas[preguntaActual];
  const resultadoDiv = document.getElementById("resultado");

  if (opcion === p.respuesta) {
    resultadoDiv.textContent = "✅ Correcto";
    confetti();
    preguntaActual++;
    setTimeout(() => {
      resultadoDiv.textContent = "";
      mostrarPregunta();
    }, 1500);
  } else {
    resultadoDiv.textContent = "❌ Incorrecto, intenta otra vez";
  }
}

mostrarPregunta();
