
function guardarUsuario(){
  function usuario(nombre,puntaje){
    this.nombre=nombre;
    this.puntaje=puntaje;
  }
  let nombreGuardar = document.getElementById("nombre").value;
  let puntajeGuardar = 0;
  nuevoUsuario = new usuario(nombreGuardar,puntajeGuardar);
};
let arrUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
function add(){
  arrUsuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios',JSON.stringify(arrUsuarios));
  document.getElementById("ingresoUsuario").style.display = "none";;
};

function cargarPreguntas() {
  let ID = 0;
  let html = "";

  for (const p of baseDatos) {
    let opciones = [...p.incorrectas];
    opciones.push(p.respuesta);
    for (let i = 0; i < 4; i++) {
      opciones.sort(() => Math.random() - 0.5);
    }
    html += `
     <div id="encabezado-pregunta">
          
          <div id="pregunta" style="margin: 20px;">
               ${p.pregunta}
          </div>
          ${
            p.imagen
              ? `
               <img src="${p.imagen}" style="width: 90%;height: 200px;object-fit: contain;">
               `
              : ""
          }
          <br><br>
          ${
            p.ayuda
              ? `
               <a class="btn btn-primary" onclick="
                    Swal.fire({
                         title: 'Ayuda',
                         html: '${p.ayuda}',
                         imageUrl: '${p.ayudaImg}',
                         imageHeight: 200,
                    })
               ">
                    Ayuda
               </a>
               `
              : ""
          }
     </div>
     <div>
          <input type="radio" name="opcion-${ID}" id="opcion1-${ID}">
          <label for="opcion1-${ID}" id="label1-${ID}"> ${opciones[0]} </label>
     </div>
     <div>
          <input type="radio" name="opcion-${ID}" id="opcion2-${ID}">
          <label for="opcion2-${ID}" id="label2-${ID}"> ${opciones[1]} </label>
     </div>
     <div>
          <input type="radio" name="opcion-${ID}" id="opcion3-${ID}">
          <label for="opcion3-${ID}" id="label3-${ID}"> ${opciones[2]} </label>
     </div>
     <div>
          <input type="radio" name="opcion-${ID}" id="opcion4-${ID}">
          <label for="opcion4-${ID}" id="label4-${ID}"> ${opciones[3]} </label>
     </div><hr>
     `;
    ID++;
  }
  html += `<div style="margin: 20px;">
  <a class="btn btn-success" onclick="resultados()">
      <h2>
       Resultados
      </h2>
  </a>
</div>
<button onClick="window.location.reload();">JUGAR DE NUEVO</button>
`
  document.getElementById("container").innerHTML = html;
  
}

async function resultados() {
  let contadorPuntos = 0;
  let html = `<ol style="display: inline-block;">`;
  for (let i = 0; i < baseDatos.length; i++) {
    p = baseDatos[i];
    for (let j = 1; j <= 5; j++) {
      if (j == 5) {
        await Swal.fire({
          title: nuevoUsuario.nombre + " Advertencia",
          text: "Faltan preguntas por responder",
          icon: "warning",
        });
        return;
      }
      if (document.getElementById(`opcion${j}-${i}`).checked) {
        let txt = document.getElementById(`label${j}-${i}`).innerHTML;
        if (p.respuesta.trim() == txt.trim()) {
          html += `<li>Correcta</li>`;
          contadorPuntos++;
        } else {
          html += `<li>Incorrecta - (${p.respuesta})</li>`;
        }
        break;
      }
    }
  }
  html += `</ol>`;
  puntaje = (100 * contadorPuntos) / baseDatos.length;
  html =  `<h1>Tu Puntaje: ${puntaje.toFixed(2)}%</h1>` + html;
  document.getElementById("resumen").innerHTML = html;
  nuevoUsuario.puntaje = puntaje;
  localStorage.setItem('usuarios',JSON.stringify(arrUsuarios));
  swal.fire({
    title: "Resumen de: " + nuevoUsuario.nombre,
    html,
    icon: puntaje < 60 ? "error" : "success",
  });
  
  let ultimosUsuarios = arrUsuarios.map(function(bar){
    return '<tbody style=" border: 1px solid lightgray;"><th>'+bar.nombre+'</th><th>'+bar.puntaje.toFixed(2)+' %</th></tbody>';})
    document.getElementById("top").innerHTML = ultimosUsuarios.join('');
    
}


