fetch("./js/base.json")
  .then((resp) => resp.json())
  .then((productos_extraccion) => {
    sistema(productos_extraccion);
  })
  .catch((error) => console.log(error));

function sistema(productos) {
  let carrito = [];
  let subTotal = [];
  let total;
  let filtrados = "";
  let filtroCheck = [];
  let cuerpo = document.getElementById("mainHtml");
  let botonBuscarJs = document.getElementById("botonBuscar");
  let inputBuscarHtml = document.getElementById("inputBuscar");
  let contenedorCarritoJs = document.getElementById("contenedorCarrito");
  contenedorCarritoJs.onclick = click_fuera;
  let mostrarCarro = document.getElementById("mostrar");

  inputBuscarHtml.onchange = realizarBusqueda;
  botonBuscarJs.onclick = realizarBusqueda;
  mostrarCarro.onclick = visualizacionCarrito;

  let checkCategorias = document.getElementsByClassName("categorias");
  for (const checkCategoria of checkCategorias) {
    checkCategoria.onclick = filtradoCheck;
  }

  //funcion para crear caja contenedores de productos
  function mostrarProducto(productos) {
    contenedorPrincipal.innerHTML = "";
    productos.forEach(({ id, nombre, categoria, img, precio }) => {
      let contenedorProducto = document.createElement("article");
      contenedorProducto.className = "articulo";
      contenedorProducto.innerHTML = `
        
        <div>
            <h3 class="productos">${categoria}</h3>
            <p > 
                ${nombre}
            </p>
            <img src="${img}">
            <div>
                <h4> $${precio}
                </h4>
                <button class="botonAgregar" id=elimnar${id}> agregar</button>
            </div>
        </div>
    `;
      contenedorPrincipal.appendChild(contenedorProducto);
    });

    let botonAgregarCarrito = document.querySelectorAll(`.botonAgregar`);
    botonAgregarCarrito.forEach((e) => (e.onclick = agregarCarrito));
    if (localStorage.getItem("productoUsuario") != null) {
      carrito = JSON.parse(localStorage.getItem("productoUsuario"));
      renderisadoCarrito();
      mostrarCarro.innerHTML = `<img class="carrito" src="./img/shopping-cart.png" alt=""> <p class="cantidad_carrito"> ${carrito.length}</p>`;
    } else {
      mostrarCarro.innerHTML = `<img class="carrito" src="./img/shopping-cart.png" alt=""> <p class="cantidad_carrito"></p>`;
      localStorage.clear();
      renderisadoCarrito();
    }
    if (contenedorPrincipal.innerHTML == "") {
      contenedorPrincipal.innerHTML = `<p> Producto no encontrado</p>`;
    }
  }
  mostrarProducto(productos);

  //muestra  el contenido en carrito
  function visualizacionCarrito() {
    contenedorPrincipal.classList.toggle("ocultar");
    contenedorCarritoJs.classList.toggle("ocultar");
    if (mostrarCarro.innerHTML.includes("ocultar") == false) {
      mostrarCarro.innerHTML = `<img class="carrito" src="./img/shopping-cart.png" alt=""> <p class="cantidad_carrito"> ${carrito.length} </p>`;
    } else {
      if (carrito.length != 0) {
        mostrarCarro.innerHTML = `<img class="carrito" src="./img/shopping-cart.png" alt=""> <p class="cantidad_carrito"></p>`;
      } else {
        mostrarCarro.innerHTML = `<img class="carrito" src="./img/shopping-cart.png" alt="">`;
      }
    }
  }

  //Busqueda
  let busqueda = "";
  function realizarBusqueda() {
    filtrados = "";
    busqueda = inputBuscarHtml.value.toLowerCase();
    filtrados = productos.filter(
      ({ nombre, categoria }) =>
        categoria.toLowerCase().includes(busqueda) ||
        nombre.toLowerCase().includes(busqueda)
    );
    if (filtroCheck == "") {
      mostrarProducto(filtrados);
    } else {
      filtradoCheck();
    }
  }

  function renderisadoCarrito() {
    subTotal = [];
    carrito.forEach(({ cantidad, precio }) => subTotal.push(cantidad * precio));
    total = subTotal.reduce((a, el) => a + el, 0);

    carrito.forEach(
      ({ id, nombre, cantidad, precio }) =>
        (contenedorCarritoJs.innerHTML += `
            <div id= envio_carrito>
                <p> Nombre: ${nombre}</p> 
                <button  class ="botonRestar" id=restar${id}>- </button>   
                <span> ${cantidad} </span>
                <button class ="class_boton_agregar" id=sumar${id}> + </button>   
                <button class="botonQuitar"  id=quitar${id}>quitar</button>
                <span> ${cantidad * precio} </span> 
            </div>  
        `)
    );
    if (carrito != "") {
      contenedorCarritoJs.innerHTML += `
                <div id= finalizarcompra>
                    <span> Total: $${total} </span>
                    <button  id=finalizar_compra class="botonFinalizar">Finalizar comprar</button>
                </div>
            `;
      let botonesSumar = document.querySelectorAll(`.class_boton_agregar`);
      let botonesRestar = document.querySelectorAll(`.botonRestar`);
      let botonesEliminarArticulos =
        document.querySelectorAll(`.botonQuitar`);

      botonesEliminarArticulos.forEach((el) => (el.onclick = elminar_articulo));
      botonesRestar.forEach((el) => (el.onclick = restar_cantidad));
      botonesSumar.forEach((el) => (el.onclick = sumar_cantidad));
      localStorage.setItem("productoUsuario", JSON.stringify(carrito));

      let finalizadoCompra = document.getElementById("finalizar_compra");
      finalizadoCompra.onclick = envio_info;
    } else {
      contenedorCarritoJs.innerHTML += `
        <section id="sub_contenedor"> 
        <p class="text_sin_articulo">No tiene articulos en su carrito </p>
    </section>
`;
    }
  }

  function click_fuera(e) {
    if (e.target.id == "contenedorCarrito") {
      visualizacionCarrito();
    }
  }

  //funcion para ver si checkbox esta on

  function filtradoCheck() {
    filtroCheck = [];
    for (const checkCategoria of checkCategorias) {
      if (checkCategoria.checked) {
        filtroCheck.push(checkCategoria.id);
      }
    }
    if (busqueda == "") {
      filtrados = productos.filter(({ categoria }) =>
        filtroCheck.includes(cambioEspacios(categoria))
      );
      if (filtroCheck == "") {
        mostrarProducto(productos);
      } else {
        mostrarProducto(filtrados);
      }
    }
  }

  function extractorNumero(cadena) {
    let idObtenido = "";
    for (i = 0; i < cadena.length; i++) {
      if (isNaN(cadena[i]) == false) {
        idObtenido = idObtenido + cadena[i];
      }
    }
    return idObtenido;
  }

  function cambioEspacios(cadena) {
    let resultado = "";
    for (i = 0; i < cadena.length; i++) {
      cadena[i] == " " ? (resultado += "_") : (resultado += cadena[i]);
    }
    return resultado;
  }

  function agregarCarrito(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    let indice = carrito.indexOf(carrito.find(({ id }) => id == id_extraido));
    if (carrito.find(({ id }) => id == id_extraido)) {
      carrito[indice].cantidad++;
    } else {
      carrito.push(productos.find(({ id }) => id == id_extraido));
      carrito[carrito.length - 1].cantidad = 1;
    }
    renderisadoCarrito();

    mostrarCarro.innerHTML = `<img class="carrito" src="./img/shopping-cart.png" alt=""> <p class="cantidad_carrito">${carrito.length}</p>`;

    Toastify({
      text: `Se a agregado un producto  ${productos[id_extraido - 1].nombre} `,
      duration: 2000,
      newWindow: true,
      close: true,
      className: "toastify_estilo",
      gravity: "bottom", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, #ff006a, #eb60df)",
      },
      onClick: function () {}, 
    }).showToast();
  }

  function elminar_articulo(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    let a_eliminar = carrito.indexOf(
      carrito.find(({ id }) => id_extraido == id)
    );
    carrito.splice(a_eliminar, 1);
    if (carrito.length == 0) {
      localStorage.clear();
      contenedorCarritoJs.innerText = "";
    }
    renderisadoCarrito();
  }

  function restar_cantidad(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    if (carrito.find(({ id }) => id == id_extraido)) {
      let indice = carrito.indexOf(carrito.find(({ id }) => id == id_extraido));
      carrito[indice].cantidad > 1 && carrito[indice].cantidad--;
    }
    renderisadoCarrito();
  }

  function sumar_cantidad(e) {
    contenedorCarritoJs.innerText = "";
    let id_extraido = Number(extractorNumero(e.target.id));
    if (carrito.find(({ id }) => id == id_extraido)) {
      let indice = carrito.indexOf(carrito.find(({ id }) => id == id_extraido));
      carrito[indice].cantidad++;
    }
    renderisadoCarrito();
  }

  function envio_info() {
    let ventana_envio = document.createElement("div");
    ventana_envio.className = "ventana_finalizado_comprar";

    carrito.forEach(
      ({ nombre, cantidad, precio }) =>
        (ventana_envio.innerHTML += `
            <div class = ventanaProd>
                <p>Nombre: ${nombre} </p>
                <span>Cantidad: ${cantidad} </span>
                <span>Precio: $${cantidad * precio} </span>
            </div>
        `)
    );
    ventana_envio.innerHTML = `
        <div id= envio_productos>
            ${ventana_envio.innerHTML}
            <div>
                <span> Total: $ ${total} </span>
                <button  id=boton_volver class="botonVolver"> Volver a la tienda</button>
                <button  id=boton_confirmar class="botonConfirmar"> Confirmar compra</button>
            </div>
        </div>
    `;
    cuerpo.appendChild(ventana_envio);

    let boton_confirmar = document.getElementById("boton_confirmar");
    boton_confirmar.onclick = realizar_comprar;

    let boton_volver = document.getElementById("boton_volver");
    boton_volver.onclick = volver_tienda;

    function realizar_comprar() {
      ventana_envio.innerHTML = `
        <div id=envio_productos>
            <p>
                    Gracias por comprar en rage!
                </p>
                <button  id=boton_aceptar class="botonAceptar">aceptar</button>
            </div>   
        `;
      localStorage.clear();
      contenedorCarritoJs.innerText = "";
      carrito = [];
      visualizacionCarrito();
      let boton_aceptar = document.getElementById("boton_aceptar");
      boton_aceptar.onclick = cerra_ventana;
    }

    function volver_tienda() {
      ventana_envio.innerHTML = "";
      ventana_envio.classList.remove("ventana_finalizado_comprar");
    }

    function cerra_ventana() {
      ventana_envio.innerHTML = "";
      ventana_envio.classList.remove("ventana_finalizado_comprar");
      contenedorCarritoJs.innerHTML = `
      <section id="sub_contenedor"> 
      <p class="text_sin_articulo">No tiene articulos en su carrito </p>
  </section>
    `;
    }
  }
}
