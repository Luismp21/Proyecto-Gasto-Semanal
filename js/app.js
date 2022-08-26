//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const agregarGastos = document.querySelector("#gastos ul");

//Eventos
eventListener();
function eventListener() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

//Classes
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const dineroGastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );

    this.restante = this.presupuesto - dineroGastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    //Extrayendo los valores
    const { presupuesto, restante } = cantidad;

    //Agregar al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  insertarMensaje(mensaje, tipo) {
    const divMensaje = document.createElement("div");

    if (tipo === "error") {
      divMensaje.classList.add("alert", "alert-danger", "text-center");
    } else {
      divMensaje.classList.add("alert", "alert-success", "text-center");
    }

    //Mensaje de error
    divMensaje.textContent = mensaje;

    //Insertar el HTML
    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    //Eliminiarl el mensaje despues de 3 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 2000);
  }

  mostrarGastos(gastos) {
    //Elimina el HTML previo
    this.limpiarHTML();

    //Iterar sobre los gastos
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      //Crear in LI
      const nuevoGasto = document.createElement("li");
      nuevoGasto.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-item-center"
      );

      nuevoGasto.dataset.id = id;

      //Agregar el HTML del gasto
      nuevoGasto.innerHTML = `<span class="pt-1">${nombre}</span> <span class="badge badge-primary badge-pill espaciado"> $ ${cantidad}</span>`;

      //Boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "Borrar";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);

      //Agregar al HTML
      agregarGastos.appendChild(nuevoGasto);
    });
  }

  //Elimina los gastos duplicados
  limpiarHTML() {
    while (agregarGastos.firstChild) {
      agregarGastos.removeChild(agregarGastos.firstChild);
    }
  }

  //Actualiza el valor restante
  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  //Comprueba el presupuesto y cambia el color segun el restante que esta quedando
  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;

    const restanteDiv = document.querySelector(".restante");

    //Comprobar el 25%
    if (presupuesto / 4 >= restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    }
    //Comprobar el 50%
    else if (presupuesto / 2 >= restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    //Si el total es 0 o menor
    if (restante <= 0) {
      ui.insertarMensaje("El presupuesto se ha agotado", "error");

      formulario.querySelector("button[type='submit']").disabled = true;
    }
  }
}

//Instanciando las classes
let presupuesto;
const ui = new UI();

//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Ingrese su Presupuesto");
  console.log(presupuestoUsuario);
  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  //Presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  ui.insertarPresupuesto(presupuesto);
}

//Agregar Gastos
function agregarGasto(e) {
  e.preventDefault();

  //Leer datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //Validar el ingreso de los datos
  if (nombre === "" || cantidad === "") {
    ui.insertarMensaje("Debe rellenar los campos", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.insertarMensaje("Debe agregar una cantidad valida", "error");
    return;
  } else {
    ui.insertarMensaje("Gasto agregado correctamente");
  }

  //Generar un Objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };

  //Agregar un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  //Imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
  //Reinicia el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //Elimina del Objeto
  presupuesto.eliminarGasto(id);

  //Elimina los gastos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
}
