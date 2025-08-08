let preguntasActuales = [];
let preguntaActual = 0;
let puntaje = 0;

// Event Listeners para los botones
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("start-btn").addEventListener("click", iniciarJuego);
  document.getElementById("next-btn").addEventListener("click", siguientePregunta);
  document.getElementById("restart-btn").addEventListener("click", reiniciarJuego);
});

// Inicia el juego con la categoría seleccionada
function iniciarJuego() {
  const categoria = document.getElementById("category").value;
  // Si la categoría no tiene preguntas predefinidas, las generamos
  if (!preguntasPorCategoria[categoria] || preguntasPorCategoria[categoria].length === 0) {
    cargarPreguntasPorCategoria(categoria); // Esta función ahora poblará preguntasActuales
  } else {
    preguntasActuales = preguntasPorCategoria[categoria];
  }

  // Mezclar las preguntas para que no siempre salgan en el mismo orden
  preguntasActuales = shuffleArray(preguntasActuales);

  preguntaActual = 0;
  puntaje = 0;

  document.getElementById("score").textContent = puntaje;
  document.querySelector(".category-select").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  document.getElementById("restart-btn").classList.add("hidden"); // Asegurarse de que esté oculto al inicio

  mostrarPregunta();
}

// --- Cargar preguntas según la categoría (Mejorado) ---
// Esta función ahora genera las preguntas y las asigna a preguntasActuales
function cargarPreguntasPorCategoria(categoria) {
  let nuevasPreguntas = [];
  let totalItems = 0;
  let prefijo = "";
  let rutaImagen = "";

  switch (categoria) {
    case "numeros":
      totalItems = 20; // Por ejemplo, hasta el 20 para empezar
      prefijo = "";
      rutaImagen = "imagenes/numeros/";
      break;
    case "palabras":
      totalItems = 10; // Algunas palabras de ejemplo
      prefijo = "Palabra";
      rutaImagen = "imagenes/palabras/";
      break;
    case "oraciones":
      totalItems = 5; // Algunas oraciones de ejemplo
      prefijo = "Oración";
      rutaImagen = "imagenes/oraciones/";
      break;
    case "frases":
      totalItems = 7; // Algunas frases de ejemplo
      prefijo = "Frase";
      rutaImagen = "imagenes/frases/";
      break;
    default:
      // Si la categoría no está manejada aquí, se usará el array predefinido
      return;
  }

  for (let i = 1; i <= totalItems; i++) {
    let respuestaTexto = prefijo ? `${prefijo} ${i}` : `${i}`;
    // Para números, la respuesta es el número mismo. Para palabras/frases, es "Palabra X"
    if (categoria === "numeros") {
      respuestaTexto = `${i}`;
    } else if (categoria === "abecedario") {
        // El abecedario ya está predefinido en preguntas.js, esta función no lo generaría
        // Pero si se quisiera generar dinámicamente, se haría aquí
    }


    nuevasPreguntas.push({
      imagen: `${rutaImagen}${i}.jpg`, // Asumiendo que las imágenes son .jpg
      respuesta: respuestaTexto,
      opciones: generarOpciones(respuestaTexto, totalItems, prefijo, categoria)
    });
  }
  preguntasActuales = nuevasPreguntas;
}

// --- Generar opciones de respuesta (Mejorado) ---
function generarOpciones(correcta, total, prefijo, categoria) {
  let opciones = [correcta];
  while (opciones.length < 4) {
    let random;
    let opcionGenerada;

    if (categoria === "abecedario") {
      // Generar letras aleatorias para el abecedario
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      random = Math.floor(Math.random() * alphabet.length);
      opcionGenerada = alphabet[random];
    } else if (categoria === "numeros") {
      // Generar números aleatorios
      random = Math.floor(Math.random() * total) + 1;
      opcionGenerada = `${random}`;
    } else {
      // Para palabras, oraciones, frases
      random = Math.floor(Math.random() * total) + 1;
      opcionGenerada = prefijo ? `${prefijo} ${random}` : `${random}`;
    }

    if (!opciones.includes(opcionGenerada) && opcionGenerada !== correcta) {
      opciones.push(opcionGenerada);
    }
  }
  return opciones.sort(() => Math.random() - 0.5); // Mezclar las opciones
}

// Muestra la pregunta actual
function mostrarPregunta() {
  if (preguntaActual >= preguntasActuales.length) {
    // Si no hay más preguntas, mostrar pantalla final o reiniciar
    mostrarResultadosFinales();
    return;
  }

  const pregunta = preguntasActuales[preguntaActual];

  // Mostrar imagen con animación
  const imagen = document.getElementById("sign-image");
  imagen.classList.remove("loaded"); // Quitar clase para reiniciar animación
  imagen.src = pregunta.imagen;
  imagen.onload = () => {
    imagen.classList.add("loaded"); // Añadir clase cuando la imagen cargue
  };
  imagen.onerror = () => {
    console.error(`Error al cargar la imagen: ${pregunta.imagen}`);
    // Opcional: mostrar una imagen de placeholder o un mensaje de error
    imagen.src = "placeholder.jpg"; // Asegúrate de tener una imagen de placeholder
  };


  // Mostrar opciones
  const contenedorOpciones = document.getElementById("options-container");
  contenedorOpciones.innerHTML = ""; // limpia opciones anteriores

  pregunta.opciones.forEach((opcion) => {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.classList.add("opcion");
    boton.onclick = () => verificarRespuesta(opcion, boton); // Pasar el botón para manipular su clase
    contenedorOpciones.appendChild(boton);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").classList.remove("correct", "wrong"); // Limpiar clases de feedback
  document.getElementById("next-btn").style.display = "none";
}

// Verifica si la respuesta fue correcta
function verificarRespuesta(opcionSeleccionada, botonSeleccionado) {
  const pregunta = preguntasActuales[preguntaActual];
  const esCorrecta = opcionSeleccionada.trim() === pregunta.respuesta.trim(); // Usar trim para evitar espacios extra

  const feedback = document.getElementById("feedback");
  feedback.classList.remove("hidden"); // Asegurarse de que el feedback sea visible

  if (esCorrecta) {
    feedback.textContent = "✅ ¡Correcto!";
    feedback.classList.add("correct");
    feedback.classList.remove("wrong");
    puntaje++;
    document.getElementById("score").textContent = puntaje;
  } else {
    feedback.textContent = `❌ Incorrecto. La respuesta correcta era: "${pregunta.respuesta}"`;
    feedback.classList.add("wrong");
    feedback.classList.remove("correct");
  }

  // Desactivar botones después de responder y aplicar estilos
  const botones = document.querySelectorAll(".opcion");
  botones.forEach((btn) => {
    btn.disabled = true; // Deshabilitar todos los botones
    if (btn.textContent.trim() === pregunta.respuesta.trim()) {
      btn.classList.add("correcta"); // Marcar la respuesta correcta
    } else if (btn === botonSeleccionado && !esCorrecta) {
      btn.classList.add("incorrecta"); // Marcar la respuesta incorrecta seleccionada
    }
  });

  // Mostrar botón "Siguiente" o "Reiniciar"
  if (preguntaActual < preguntasActuales.length - 1) {
    document.getElementById("next-btn").style.display = "inline-block";
  } else {
    document.getElementById("restart-btn").classList.remove("hidden");
    document.getElementById("next-btn").style.display = "none";
  }
}

// Va a la siguiente pregunta
function siguientePregunta() {
  preguntaActual++;
  mostrarPregunta();
}

// Reinicia el juego
function reiniciarJuego() {
  document.querySelector(".category-select").classList.remove("hidden");
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("restart-btn").classList.add("hidden");
  document.getElementById("feedback").classList.add("hidden"); // Ocultar feedback al reiniciar
  document.getElementById("final-results").classList.add("hidden"); // Ocultar resultados finales si existen
}

// Función para mezclar un array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
  }
  return array;
}

// Función para mostrar resultados finales (Nueva)
function mostrarResultadosFinales() {
  const quizContainer = document.getElementById("quiz");
  quizContainer.classList.add("hidden"); // Ocultar el quiz

  let finalResultsContainer = document.getElementById("final-results");
  if (!finalResultsContainer) {
    finalResultsContainer = document.createElement("div");
    finalResultsContainer.id = "final-results";
    finalResultsContainer.classList.add("card", "hidden");
    document.querySelector(".container").appendChild(finalResultsContainer);
  }
  finalResultsContainer.classList.remove("hidden");

  finalResultsContainer.innerHTML = `
    <h2>🎉 ¡Juego Terminado! 🎉</h2>
    <p>Has completado todas las preguntas.</p>
    <p>Tu puntaje final es: <span class="score-final">${puntaje} / ${preguntasActuales.length}</span></p>
    <button id="restart-from-results-btn" class="btn btn-primary">Volver a Jugar</button>
  `;

  document.getElementById("restart-from-results-btn").addEventListener("click", reiniciarJuego);
}

