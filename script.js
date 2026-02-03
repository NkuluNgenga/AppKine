let timer = null;
let sessionInterval = null;
let sistemaActivo = false;
let rutinaEjercicios = [];

const bibliotecaEjercicios = [
    { nombre: "Respiración Diafragmática", info: "Inhale por nariz inflando el abdomen, exhale lento por boca." },
    { nombre: "Expansión Costal", info: "Manos en costillas. Empuje sus manos hacia afuera al inhalar." },
    { nombre: "Ciclo Activo (Huffing)", info: "2 respiraciones profundas y 1 exhalación fuerte con la boca abierta." },
    { nombre: "Drenaje Autógeno", info: "Respiraciones a distintos volúmenes para movilizar secreciones." },
    { nombre: "Sentarse y Pararse", info: "Desde una silla, pararse derecho y volver a sentarse suavemente." },
    { nombre: "Levantar Rodillas", info: "Marcha en el lugar levantando las rodillas hacia el pecho." },
    { nombre: "Extensión adelante", info: "Pierna extendida, llevarla hacia adelante sin doblar la rodilla." },
    { nombre: "Abducción lateral", info: "Pierna extendida, llevarla hacia el costado y volver." },
    { nombre: "Extensión atrás", info: "Pierna extendida, llevarla hacia atrás apretando el glúteo." },
    { nombre: "Péndulo de Brazo", info: "Inclinarse y balancear el brazo en círculos suaves." },
    { nombre: "Puntas de Pie", info: "Elevar talones, quedar en puntas de pie y bajar lento." },
    { nombre: "Puntas y Desvío", info: "Puntas de pie y mover talones hacia los costados al bajar." },
    { nombre: "Tocarse los Pies (Derecho)", info: "Sentado, bajar las manos a tocar los pies y subir lento." },
    { nombre: "Tocarse los Pies (Diagonal)", info: "Sentado, llevar mano derecha a pie izquierdo y viceversa." },
    { nombre: "Círculos de Tobillo", info: "Girar el pie dibujando círculos en el aire." },
    { nombre: "Talones a la Cola", info: "Flexionar rodilla llevando el talón hacia atrás." },
    { nombre: "Apertura de Pecho", info: "Abrir brazos grandes hacia atrás para estirar el pecho." },
    { nombre: "Rotación de Cuello", info: "Girar la cabeza suavemente hacia un lado y el otro." },
    { nombre: "Hombros arriba", info: "Subir hombros a las orejas y soltar con fuerza." },
    { nombre: "Sentadilla Corta", info: "Bajar un poco la cadera con espalda derecha y subir." },
    { nombre: "Estocada Fija", info: "Un paso adelante y bajar la rodilla de atrás un poco." },
    { nombre: "Equilibrio un pie", info: "Mantenerse sobre una pierna (sujetarse de silla)." },
    { nombre: "Inclinación Lateral", info: "Deslizar la mano por el muslo hacia la rodilla." },
    { nombre: "Remo sin peso", info: "Llevar los codos hacia atrás apretando las escápulas." },
    { nombre: "Círculos de Muñeca", info: "Girar las manos suavemente para movilizar muñecas." },
    { nombre: "Puente de Glúteo", info: "Boca arriba, doblar rodillas y elevar la cadera." },
    { nombre: "Flexión en Pared", info: "Hacer flexiones de brazos apoyado contra la pared." },
    { nombre: "Caminar de Talones", info: "Dar unos pasos apoyando solo los talones." },
    { nombre: "Caminar de Puntas", info: "Dar unos pasos apoyando solo las puntas." },
    { nombre: "Aplauso arriba", info: "Subir brazos y aplaudir sobre la cabeza." }
];

window.onload = function() {
    generarPanelSeleccion();
    const intervaloGuardado = localStorage.getItem('intervaloKine');
    if (intervaloGuardado) document.getElementById('intervalo').value = intervaloGuardado;
    actualizarVistaHistorial();
};

// Genera la lista de checkboxes
function generarPanelSeleccion() {
    const contenedor = document.getElementById('contenedor-checks');
    bibliotecaEjercicios.forEach((ej, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<input type="checkbox" id="ej-${index}" value="${index}" class="ej-check">
                         <label for="ej-${index}">${ej.nombre}</label>`;
        contenedor.appendChild(div);
    });
}

function guardarYConfigurar() {
    const seleccionados = Array.from(document.querySelectorAll('.ej-check:checked'));
    
    if (seleccionados.length !== 4) {
        alert("Por favor, selecciona exactamente 4 ejercicios para la rutina de 7 minutos.");
        return;
    }

    const minutos = parseFloat(document.getElementById('intervalo').value);
    if (isNaN(minutos) || minutos <= 0) return alert("Ingresa un tiempo válido.");

    // Armamos la rutina con los 4 elegidos
    rutinaEjercicios = seleccionados.map(check => {
        const ej = bibliotecaEjercicios[check.value];
        return { ...ej, tiempo: 105 }; // 1:45 cada uno
    });

    detenerAlarma();
    sistemaActivo = true;
    localStorage.setItem('intervaloKine', minutos);

    timer = setInterval(() => { if (sistemaActivo) iniciarSesionCompleta(); }, minutos * 60 * 1000);

    alert(`¡Rutina guardada! Se activará cada ${minutos} min.`);
    document.getElementById('estado-proxima').innerText = `Estado: ACTIVO (${minutos} min)`;
    // Dentro de guardarYConfigurar, después de definir rutinaEjercicios:
const indicesSeleccionados = seleccionados.map(check => check.value);
localStorage.setItem('ejerciciosSeleccionados', JSON.stringify(indicesSeleccionados));
}

// ... (Las funciones iniciarSesionCompleta, ejecutarPasoRutina, finalizarSesionTotal, detenerAlarma, registrarExito, actualizarVistaHistorial y borrarHistorial se mantienen igual que en el código anterior) ...

function iniciarSesionCompleta() {
    if (!sistemaActivo) return;
    alert("¡Momento de tu sesión de 7 minutos! Mantén la pantalla encendida.");
    ejecutarPasoRutina(0);
}

function ejecutarPasoRutina(indice) {
    if (!sistemaActivo || indice >= rutinaEjercicios.length) {
        if (indice >= rutinaEjercicios.length) finalizarSesionTotal();
        return;
    }

    const ej = rutinaEjercicios[indice];
    document.getElementById('nombre-ejercicio').innerText = ej.nombre;
    document.getElementById('instrucciones').innerText = ej.info;
    document.getElementById('pantalla-ejercicio').classList.remove('hidden');

    let tiempoRestante = ej.tiempo;
    const display = document.getElementById('cronometro-display');

    if (sessionInterval) clearInterval(sessionInterval);

    sessionInterval = setInterval(() => {
        if (!sistemaActivo) { clearInterval(sessionInterval); return; }

        let min = Math.floor(tiempoRestante / 60);
        let seg = tiempoRestante % 60;
        display.innerText = `${min}:${seg < 10 ? '0' : ''}${seg}`;

        if (tiempoRestante <= 0) {
            clearInterval(sessionInterval);
            if ("vibrate" in navigator) navigator.vibrate(200);
            ejecutarPasoRutina(indice + 1);
        }
        tiempoRestante--;
    }, 1000);
}

function finalizarSesionTotal() {
    registrarExito(`Sesión 7m completada`);
    document.getElementById('pantalla-ejercicio').classList.add('hidden');
    alert("¡Excelente! Sesión finalizada.");
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
    if(confirm("¿Borrar progreso?")) {
        localStorage.removeItem('historialKine');
        actualizarVistaHistorial();
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error', err));
    });
}