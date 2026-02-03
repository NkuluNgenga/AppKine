let timer;
let countdownInterval;

const guiaEjercicios = {
    "Respiración Diafragmática": "Coloque una mano en el pecho y otra en el abdomen. Inhale por la nariz haciendo que el abdomen se eleve.",
    "Expansión Costal": "Coloque sus manos a los lados de las costillas. Al inhalar, intente empujar sus manos hacia afuera.",
    "Ciclo Activo": "Realice 2-3 respiraciones profundas, seguidas de un 'huff' (exhalación fuerte con la boca abierta).",
    "Movilidad Torácica": "Entrelace las manos, estire los brazos hacia arriba mientras inhala profundamente."
};

window.onload = function() {
    // Recuperar configuración anterior
    const intervaloGuardado = localStorage.getItem('intervalo');
    const ejercicioGuardado = localStorage.getItem('ejercicio');
    if (intervaloGuardado && ejercicioGuardado) {
        document.getElementById('intervalo').value = intervaloGuardado;
        document.getElementById('menu-ejercicios').value = ejercicioGuardado;
    }
    // Cargar historial al iniciar
    actualizarVistaHistorial();
};

function guardarYConfigurar() {
    const nombreSeleccionado = document.getElementById('menu-ejercicios').value;
    const minutos = document.getElementById('intervalo').value;

    if (nombreSeleccionado === "") {
        alert("Selecciona un ejercicio.");
        return;
    }

    localStorage.setItem('intervalo', minutos);
    localStorage.setItem('ejercicio', nombreSeleccionado);

    const ms = minutos * 60 * 1000;
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        lanzarAlarma(nombreSeleccionado, guiaEjercicios[nombreSeleccionado]);
    }, ms);

    alert(`Alarma configurada.`);
}

function lanzarAlarma(nombre, info) {
    document.getElementById('nombre-ejercicio').innerText = nombre;
    document.getElementById('instrucciones').innerText = info;
    document.getElementById('pantalla-ejercicio').classList.remove('hidden');
    iniciarCuentaRegresiva(30);
}

function iniciarCuentaRegresiva(segundos) {
    let tiempoRestante = segundos;
    const display = document.getElementById('cronometro-display');
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        tiempoRestante--;
        display.innerText = `00:${tiempoRestante < 10 ? '0' : ''}${tiempoRestante}`;
        if (tiempoRestante <= 0) clearInterval(countdownInterval);
    }, 1000);
}

// --- NUEVAS FUNCIONES DE HISTORIAL ---

function finalizarEjercicio() {
    const nombre = document.getElementById('nombre-ejercicio').innerText;
    registrarEnHistorial(nombre); // Guardamos el éxito
    
    clearInterval(countdownInterval);
    document.getElementById('pantalla-ejercicio').classList.add('hidden');
}

function registrarEnHistorial(nombreEj) {
    let historial = JSON.parse(localStorage.getItem('historialKine')) || [];
    const fecha = new Date();
    const registro = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${nombreEj}`;
    
    historial.unshift(registro); // Agregamos al principio de la lista
    localStorage.setItem('historialKine', JSON.stringify(historial));
    actualizarVistaHistorial();
}

function actualizarVistaHistorial() {
    const lista = document.getElementById('lista-historial');
    const historial = JSON.parse(localStorage.getItem('historialKine')) || [];
    
    lista.innerHTML = historial.map(item => `<li style="border-bottom: 1px solid #eee; padding: 5px 0;">✅ ${item}</li>`).join('');
}

function borrarHistorial() {
    if(confirm("¿Borrar todos los registros?")) {
        localStorage.removeItem('historialKine');
        actualizarVistaHistorial();
    }
}