let timer = null; // Inicializamos como null explícitamente
let countdownInterval = null;

const guiaEjercicios = {
    "Respiración Diafragmática": "Coloque una mano en el pecho y otra en el abdomen. Inhale por la nariz haciendo que el abdomen se eleve.",
    "Expansión Costal": "Coloque sus manos a los lados de las costillas. Al inhalar, intente empujar sus manos hacia afuera.",
    "Ciclo Activo": "Realice 2-3 respiraciones profundas, seguidas de un 'huff' (exhalación fuerte con la boca abierta).",
    "Movilidad Torácica": "Entrelace las manos, estire los brazos hacia arriba mientras inhala profundamente."
};

window.onload = function() {
    const intervaloGuardado = localStorage.getItem('intervalo');
    const ejercicioGuardado = localStorage.getItem('ejercicio');
    if (intervaloGuardado && ejercicioGuardado) {
        document.getElementById('intervalo').value = intervaloGuardado;
        document.getElementById('menu-ejercicios').value = ejercicioGuardado;
    }
    actualizarVistaHistorial();
};

function guardarYConfigurar() {
    const nombreSeleccionado = document.getElementById('menu-ejercicios').value;
    const minutos = parseFloat(document.getElementById('intervalo').value);

    if (nombreSeleccionado === "" || isNaN(minutos)) {
        alert("Por favor, selecciona un ejercicio y un tiempo válido.");
        return;
    }

    localStorage.setItem('intervalo', minutos);
    localStorage.setItem('ejercicio', nombreSeleccionado);

    // IMPORTANTE: Limpiar cualquier alarma previa antes de iniciar la nueva
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    const ms = minutos * 60 * 1000;

    // Seteamos el intervalo global
    timer = setInterval(() => {
        lanzarAlarma(nombreSeleccionado, guiaEjercicios[nombreSeleccionado]);
    }, ms);

    alert(`Alarma configurada cada ${minutos} minutos.`);
    document.getElementById('estado-proxima').innerText = `Estado: ACTIVO (cada ${minutos} min)`;
}

// FUNCIÓN CLAVE: Ahora detiene TODO
function detenerAlarma() {
    // 1. Frenamos el intervalo principal de las alarmas
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    // 2. Frenamos el cronómetro de los 30 segundos si estaba corriendo
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    // 3. Limpiamos la interfaz
    document.getElementById('pantalla-ejercicio').classList.add('hidden');
    document.getElementById('estado-proxima').innerText = "Estado: Detenido";
    
    alert("Todas las alarmas han sido desactivadas.");
}

function lanzarAlarma(nombre, info) {
    if ("vibrate" in navigator) {
        navigator.vibrate([500, 200, 500]);
    }
    
    document.getElementById('nombre-ejercicio').innerText = nombre;
    document.getElementById('instrucciones').innerText = info;
    document.getElementById('pantalla-ejercicio').classList.remove('hidden');
    
    iniciarCuentaRegresiva(30); 
    alert("¡HORA DE TU EJERCICIO!");
}

function iniciarCuentaRegresiva(segundos) {
    let tiempoRestante = segundos;
    const display = document.getElementById('cronometro-display');
    
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        tiempoRestante--;
        display.innerText = `00:${tiempoRestante < 10 ? '0' : ''}${tiempoRestante}`;

        if (tiempoRestante <= 0) {
            clearInterval(countdownInterval);
            display.innerText = "¡Cumplido!";
        }
    }, 1000);
}

function finalizarEjercicio() {
    const nombre = document.getElementById('nombre-ejercicio').innerText;
    registrarExito(nombre);
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    document.getElementById('pantalla-ejercicio').classList.add('hidden');
}

function registrarExito(nombre) {
    let historial = JSON.parse(localStorage.getItem('historialKine')) || [];
    const fecha = new Date();
    const registro = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${nombre}`;
    historial.unshift(registro);
    localStorage.setItem('historialKine', JSON.stringify(historial));
    actualizarVistaHistorial();
}

function actualizarVistaHistorial() {
    const lista = document.getElementById('lista-historial');
    const historial = JSON.parse(localStorage.getItem('historialKine')) || [];
    lista.innerHTML = historial.map(item => `<li>✅ ${item}</li>`).join('');
}

function borrarHistorial() {
    if(confirm("¿Borrar historial?")) {
        localStorage.removeItem('historialKine');
        actualizarVistaHistorial();
    }
}

// Service Worker (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error', err));
    });
}