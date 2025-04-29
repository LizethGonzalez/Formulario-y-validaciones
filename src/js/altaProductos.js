import botones from './botones.js';

document.addEventListener("DOMContentLoaded", function () {
    ocultarTablaProductos();
});
let productos = [];
let filaEditando = null; // Para rastrear la fila que se está editando

function validacionText(texto) {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto.trim());
}

function validacionPrecio(precio) {
    return !isNaN(precio) && parseFloat(precio) >= 0;
}

function mostrarError(input, mensaje) {
    input.classList.add("is-invalid");
    input.nextElementSibling.textContent = mensaje;
}

function limpiarErrores(inputs) {
    inputs.forEach(input => {
        input.classList.remove("is-invalid");
        input.nextElementSibling.textContent = "";
    });
}

function agregarProducto() {
    const nombreInput = document.getElementById("nombre");
    const marcaInput = document.getElementById("marca");
    const descripcionInput = document.getElementById("descripcion");
    const precioInput = document.getElementById("precio");
    const texturaInput = document.getElementById("textura");
    const categoriaInput = document.getElementById("categoria");

    const nombre = nombreInput.value.trim();
    const marca = marcaInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const precio = precioInput.value.trim();
    const textura = texturaInput.value.trim();
    const categoria = categoriaInput.value;

    let esValido = true;

    limpiarErrores([nombreInput, marcaInput, descripcionInput, precioInput, texturaInput, categoriaInput]);
    if (!validacionText(nombre)) {
        mostrarError(nombreInput, "Solo se permiten letras y espacios.");
        esValido = false;
    }
    if (!validacionText(marca)) {
        mostrarError(marcaInput, "Solo se permiten letras y espacios.");
        esValido = false;
    }
    if (!validacionText(descripcion)) {
        mostrarError(descripcionInput, "Solo se permiten letras y espacios.");
        esValido = false;
    }
    if (!validacionText(textura)) {
        mostrarError(texturaInput, "Solo se permiten letras y espacios.");
        esValido = false;
    }
    if (!validacionPrecio(precio)) {
        mostrarError(precioInput, "El precio debe ser un número positivo.");
        esValido = false;
    }
    if (!categoria) {
        mostrarError(categoriaInput, "Selecciona una categoría.");
        esValido = false;
    }

    if (!esValido) return false;

    productos.push({ nombre, marca, descripcion, precio, textura, categoria });
    mostrarProductos(productos);
    return true;
}

function mostrarProductos(lista) {
    const tbody = document.querySelector("#productTable tbody");
    const productTable = document.getElementById("productTable");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        productTable.style.display = "none";
    } else {
        productTable.style.display = "table";

        lista.forEach((p, index) => {
            const row = tbody.insertRow();
            row.dataset.index = index;

            let cell = row.insertCell();
            cell.textContent = p.nombre;
            cell = row.insertCell();
            cell.textContent = p.marca;
            cell = row.insertCell();
            cell.textContent = p.descripcion;
            cell = row.insertCell();
            cell.textContent = p.precio;
            cell = row.insertCell();
            cell.textContent = p.textura;
            cell = row.insertCell();
            cell.textContent = p.categoria;

            const accionesCell = row.insertCell();
            accionesCell.classList.add('acciones');

            // Crear y agregar botones de acción
            const btnEditarImg = botones.crearBotonImagen(botones.botones.btnEditar);
            const btnEliminarImg = botones.crearBotonImagen(botones.botones.btnDelete);

            accionesCell.appendChild(btnEditarImg);
            accionesCell.appendChild(btnEliminarImg);

            // Agregar event listeners a los botones creados
            btnEditarImg.addEventListener('click', () => editarProducto(index, row));
            btnEliminarImg.addEventListener('click', () => eliminarProducto(index));
        });
    }
}

function editarProducto(index, row) {
    if (filaEditando) {
        restaurarFila(filaEditando);
    }
    filaEditando = row;
    const producto = productos[index];
    const celdas = row.querySelectorAll('td:not(.acciones)');

    // Convertir celdas a inputs
    celdas.forEach((celda, i) => {
        const valor = celda.textContent;
        celda.innerHTML = `<input type="text" class="form-control form-control-sm" value="${valor}">`;
    });

    const accionesCell = row.querySelector('.acciones');
    accionesCell.innerHTML = '';
    const btnGuardarImg = botones.crearBotonImagen(botones.botones.btnSave);
    const btnCancelarImg = botones.crearBotonImagen(botones.botones.btnCancel);
    accionesCell.appendChild(btnGuardarImg);
    accionesCell.appendChild(btnCancelarImg);

    btnGuardarImg.addEventListener('click', () => guardarProducto(index, row));
    btnCancelarImg.addEventListener('click', () => cancelarEdicion(row, producto));
}

function guardarProducto(index, row) {
    const inputs = row.querySelectorAll('td:not(.acciones) input');
    const productoEditado = {
        nombre: inputs[0].value.trim(),
        marca: inputs[1].value.trim(),
        descripcion: inputs[2].value.trim(),
        precio: inputs[3].value.trim(),
        textura: inputs[4].value.trim(),
        categoria: inputs[5].value
    };



    productos[index] = productoEditado;
    mostrarProductos(productos);
    filaEditando = null;
}


function cancelarEdicion(row, productoOriginal) {
    const celdas = row.querySelectorAll('td:not(.acciones)');
    celdas.forEach((celda, i) => {
        switch (i) {
            case 0: celda.textContent = productoOriginal.nombre; break;
            case 1: celda.textContent = productoOriginal.marca; break;
            case 2: celda.textContent = productoOriginal.descripcion; break;
            case 3: celda.textContent = productoOriginal.precio; break;
            case 4: celda.textContent = productoOriginal.textura; break;
            case 5: celda.textContent = productoOriginal.categoria; break;
        }
    });

    const accionesCell = row.querySelector('.acciones');
    accionesCell.innerHTML = '';
    const btnEditarImg = botones.crearBotonImagen(botones.botones.btnEditar);
    const btnEliminarImg = botones.crearBotonImagen(botones.botones.btnDelete);
    accionesCell.appendChild(btnEditarImg);
    accionesCell.appendChild(btnEliminarImg);

    btnEditarImg.addEventListener('click', () => editarProducto(parseInt(row.dataset.index), row));
    btnEliminarImg.addEventListener('click', () => eliminarProducto(parseInt(row.dataset.index)));

    filaEditando = null;
}

function restaurarFila(row) {
    const index = parseInt(row.dataset.index);
    const productoOriginal = productos[index];
    cancelarEdicion(row, productoOriginal);
}


function eliminarProducto(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos.splice(index, 1);
        mostrarProductos(productos);
    }
}



function filterTable(categoria) {
    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de mostrar los productos filtrados

    if (categoria === 'tablaOriginal') {
        mostrarProductos(productos);
    } else {
        const filtrados = productos.filter(p => p.categoria === categoria);
        mostrarProductos(filtrados);
    }
}

document.getElementById("productoForm").addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const form = this;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const agregado = agregarProducto();
    if (agregado) {
        form.classList.remove("was-validated");
        form.reset(); // Limpiar el formulario después de agregar el producto
    }
});

function ocultarTablaProductos() {
    const productTable = document.getElementById('productTable');//RECUPERAR LA TABLA
    productTable.style.display = 'none'; // Ocultar la tabla de productos
}

export { filterTable };
window.filterTable = filterTable;