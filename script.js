let timer;
let countdownInterval;

// 1. Base de datos de ejercicios e instrucciones
const guiaEjercicios = {
    "Respiración Diafragmática": "Coloque una mano en el pecho y otra en el abdomen. Inhale por la nariz haciendo que el abdomen se eleve.",
    "Expansión Costal": "Coloque sus manos a los lados de las costillas. Al inhalar, intente empujar sus manos hacia afuera.",
    "Ciclo Activo": "Realice 2-3 respiraciones profundas, seguidas de un 'huff' (exhalación fuerte con la boca abierta).",
    "Movilidad Torácica": "Entrelace las manos, estire los brazos hacia arriba mientras inhala profundamente."
};

// 2. Al cargar la página: Recuperar configuración y cargar historial
window.onload = function() {
    const intervaloGuardado = localStorage.getItem('intervalo');
    const ejercicioGuardado = localStorage.getItem('ejercicio');
    
    if (intervaloGuardado && ejercicioGuardado) {
        document.getElementById('intervalo').value = intervaloGuardado;
        document.getElementById('menu-ejercicios').value = ejercicioGuardado;
        document.getElementById('estado-proxima').innerText = "Configuración recuperada.";
    }
    actualizarVistaHistorial();
};

// 3. Activar la Alarma
function guardarYConfigurar() {
    const nombreSeleccionado = document.getElementById('menu-ejercicios').value;
    const minutos = document.getElementById('intervalo').value;

    if (nombreSeleccionado === "") {
        alert("Por favor, selecciona un ejercicio.");
        return;
    }

    localStorage.setItem('intervalo', minutos);
    localStorage.setItem('ejercicio', nombreSeleccionado);

    const ms = minutos * 60 * 1000;
    
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        lanzarAlarma(nombreSeleccionado, guiaEjercicios[nombreSeleccionado]);
    }, ms);

    alert(`Alarma configurada cada ${minutos} minutos. Mantenga la app abierta de fondo.`);
    document.getElementById('estado-proxima').innerText = `Estado: ACTIVO (cada ${minutos} min)`;
}

// 4. Detener la Alarma
function detenerAlarma() {
    if (timer) {
        clearInterval(timer);
        clearInterval(countdownInterval);
        document.getElementById('pantalla-ejercicio').classList.add('hidden');
        document.getElementById('estado-proxima').innerText = "Estado: Detenido";
        alert("Alarmas desactivadas.");
    }
}

// 5. Mostrar la Alerta de Ejercicio
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

// 6. Cronómetro Visual
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

// 7. Finalizar y Registrar en Historial
function finalizarEjercicio() {
    const nombre = document.getElementById('nombre-ejercicio').innerText;
    
    let historial = JSON.parse(localStorage.getItem('historialKine')) || [];
    const fecha = new Date();
    const registro = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${nombre}`;
    
    historial.unshift(registro);
    localStorage.setItem('historialKine', JSON.stringify(historial));
    
    actualizarVistaHistorial();
    
    clearInterval(countdownInterval);
    document.getElementById('pantalla-ejercicio').classList.add('hidden');
}

function actualizarVistaHistorial() {
    const lista = document.getElementById('lista-historial');
    const historial = JSON.parse(localStorage.getItem('historialKine')) || [];
    lista.innerHTML = historial.map(item => `<li>✅ ${item}</li>`).join('');
}

function borrarHistorial() {
    if(confirm("¿Seguro que quieres borrar el progreso?")) {
        localStorage.removeItem('historialKine');
        actualizarVistaHistorial();
    }
}

// 8. Registro del Service Worker (PWA) - Corregido
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(reg) {
                console.log('SW registrado');
            })
            .catch(function(err) {
                console.log('SW error', err);
            });
    });
}