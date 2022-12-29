// Base de datos //

document.addEventListener('DOMContentLoaded', () => {

    // Mis variables de stock

    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Cafe Latte',
            precio: 300,
            imagen: '/img/latte.jpg'
        },
        {
            id: 2,
            nombre: 'Mocca',
            precio: 350,
            imagen: '/img/moccha.jpg'
        }, {
            id: 3,
            nombre: 'Americano',
            precio: 200,
            imagen: '/img/americano.jpg'
        }, {
            id: 4,
            nombre: 'Cappuccino',
            precio: 450,
            imagen: '/img/cappuccino.jpg'
        }, {
            id: 5,
            nombre: 'Espresso',
            precio: 200,
            imagen: '/img/espresso.jpg'
        }, {
            id: 6,
            nombre: 'Cafe con leche',
            precio: 450,
            imagen: '/img/cafelatte.jpg'
        },

    ];
    //  variables DOM

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonPagar = document.querySelector('#boton-pagar');
    const miLocalStorage = window.localStorage;

    // Productos a partir de la base de datos


    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            // Estructura
            const miBase = document.createElement('div');
            miBase.classList.add('card', 'col-sm-4');
            // Body
            const miBaseCardBody = document.createElement('div');
            miBaseCardBody.classList.add('card-body');
            // Titulo
            const miBaseTitle = document.createElement('h5');
            miBaseTitle.classList.add('card-title');
            miBaseTitle.textContent = info.nombre;
            // Imagen
            const miBaseImagen = document.createElement('img');
            miBaseImagen.classList.add('img-fluid');
            miBaseImagen.setAttribute('src', info.imagen);
            // Precio
            const miBasePrecio = document.createElement('p');
            miBasePrecio.classList.add('card-text');
            miBasePrecio.textContent = `${info.precio}${divisa}`;
            // Boton 
            const miBaseBoton = document.createElement('button');
            miBaseBoton.classList.add('btn', 'btn-primary');
            miBaseBoton.textContent = '+';
            miBaseBoton.setAttribute('marcador', info.id);
            miBaseBoton.addEventListener('click', agregarCarrito);
            // Insertamos
            miBaseCardBody.appendChild(miBaseImagen);
            miBaseCardBody.appendChild(miBaseTitle);
            miBaseCardBody.appendChild(miBasePrecio);
            miBaseCardBody.appendChild(miBaseBoton);
            miBase.appendChild(miBaseCardBody);
            DOMitems.appendChild(miBase);
        });
    }

    // Agregar Carrito

    function agregarCarrito(evento) {

        carrito.push(evento.target.getAttribute('marcador'))
        renderizarCarrito();
        guardarCarritoLS();

    }
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            // Base del carrito
            const miBase = document.createElement('li');
            miBase.classList.add('list-group-item', 'text-right', 'mx-2');
            miBase.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-1');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mergeamos
            miBase.appendChild(miBoton);
            DOMcarrito.appendChild(miBase);
        });
        // suma
        DOMtotal.textContent = calcularTotal();
    }

    // Borrar  carrito

    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;

        });
        renderizarCarrito();
        guardarCarritoLS();



    }

    // Suma de precios del carrito

    function calcularTotal() {
        return carrito.reduce((total, item) => {

            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    // borrar item
    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    
    function pagarCarrito(){
        alert('Muchas gracias por su compra.')

    }

    function guardarCarritoLS () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargaCarritoLS () {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonPagar.addEventListener('click', pagarCarrito);



    cargaCarritoLS();
    renderizarProductos();
    renderizarCarrito();




});