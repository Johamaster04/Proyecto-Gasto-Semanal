//Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoLista = document.querySelector("#gastos ul");

//Eventlistener
eventlistener();
function eventlistener() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

  formulario.addEventListener("submit", agregarGastos);
}

//Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularrestante();
  }
  calcularrestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );

    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularrestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;

    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const div = document.createElement("div");
    div.classList.add("text-center", "alert");

    if (tipo === "error") {
      div.classList.add("alert-danger");
    } else {
      div.classList.add("alert-success");
    }

    //mensaje de error
    div.textContent = mensaje;

    //insertar el mensaje
    document.querySelector(".primario").insertBefore(div, formulario);

    setTimeout(() => {
      div.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {
    this.limpiarHTMl();

    //iteramos y anadimos los gatos en el html
    gastos.forEach((gasto) => {
      const { nombre, cantidad, id } = gasto;

      //creamos un li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;

      //Agregamos el Html del Gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

      //Boton para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Borrar &times";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);

      //añadimos el boton al Html
      gastoLista.appendChild(nuevoGasto);
    });
  }

  limpiarHTMl() {
    while (gastoLista.firstChild) {
      gastoLista.removeChild(gastoLista.firstChild);
    }
  }

  actulizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;

    const restanteDiv = document.querySelector(".restante");

    //comprobar 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-succes", "alert-warning");
      restanteDiv.classList.add("alert-danger");
      //comprobar el 50%
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-succes");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-succes");
    }

    //si el restante en menor a 0

    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");

      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

//Instanciamos la clase
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = Number(prompt("Cual Es Tu Presupuesto"));

  if (
    presupuestoUsuario == "" ||
    presupuestoUsuario == null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

function agregarGastos(e) {
  e.preventDefault;

  //Leer datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  //validar
  if (nombre == "" || cantidad == "") {
    ui.imprimirAlerta("Ambos campos son Obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Presupuesto no valido", "error");
    return;
  }

  //generar un objeto Tipo Gasto

  const gasto = { nombre, cantidad, id: Date.now() };

  //Añade un nuevo gasto al objeto Presupuesto
  presupuesto.nuevoGasto(gasto);

  ui.imprimirAlerta("Gasto Agregado Correctamente"); //Agrega el mensaje de Gasto Agregado

  //Insertar en el Html los Gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actulizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  // reinicia el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //Elimina los elementos del objeto
  presupuesto.eliminarGasto(id);

  //Elimina los elementos del HTML
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  //actualiza el restante y comprueba el presupuesto

  ui.actulizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
}
