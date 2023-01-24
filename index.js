// Base de datos //
var baseDeDatos = [];



document.addEventListener('DOMContentLoaded', () => {
    //  variables DOM

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonVaciar2 = document.querySelector('#boton-vaciar2');
    const DOMbotonPagar = document.querySelector('#boton-pagar');
    const miLocalStorage = window.localStorage;

    // Promesa agregada en forma de deolay para carga de menu
    const pedirProductos = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(baseDeDatos), 3000);
            Swal.fire({
                title: 'Cargando menú...',
                html: 'Please wait...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                timer: 3000,
                didOpen: () => {
                    Swal.showLoading()
                }

            })
        })

    }

    pedirProductos()
        .then((res) => {
            renderizarProductos(res);
            renderizarCarrito(res);

        })

    // Productos a partir de la base de datos en .json

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
            miBaseBoton.textContent = 'Agregar';
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

    // Metodo fecth para leer el archivo .json
    fetch('./data.json')
        .then((response) => response.json())
        .then((json) => {
            json.map(el => {
                baseDeDatos.push(el);
            })


        })
        .catch((e) => { console.log('ERROR:', e) });

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
// Salir de la app y volver al menu

    function vaciarCarrito2() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Desea salir de su pedido',
            text: "Si procede no podra recuperar su pedido!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, salir',
            cancelButtonText: 'No, deseo seguir en mi pedido!',
            reverseButtons: true,
            
           
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Gracias por elegirnos',
                    'Vuelva pronto',
                    'Success',
                    
                    window.location.href = "./index.html",
                )
                
                carrito = [];
                renderizarCarrito();
                localStorage.clear();
                
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Listo',
                    'Puede continuar con su pedido',
                    'success'
                )
            }
        })

    }
    // borrar item
    function vaciarCarrito() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Desea vaciar su pedido?',
            text: "Si procede no podra recuperar su pedido!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, proceder',
            cancelButtonText: 'No, volver a mi pedido!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed)
             {  
                swalWithBootstrapButtons.fire(
                    'Pedido eliminado!',
                    'Su pedido a sido eliminado',
                    'Succes'
                )
                
                carrito = [];
                renderizarCarrito();
                localStorage.clear();
                
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Listo',
                    'Puede continuar con su pedido',
                    'success'
                )
            }
        })

    }


    //Pagar carrito 
    function pagarCarrito() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Desea confirmar su pedido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, proceder',
            cancelButtonText: 'No, volver a mi pedido!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Pedido finalizado!',
                    'Gracias por su compra',

                )
                carrito = [];
                renderizarCarrito();
                localStorage.clear();

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Listo',
                    'Su pedido aun sigue en pie:)',

                )
            }
        })



    }
    function guardarCarritoLS() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));

    }

    function cargaCarritoLS() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));

        }


    }





    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonPagar.addEventListener('click', pagarCarrito);
    DOMbotonVaciar2.addEventListener('click', vaciarCarrito2);


    cargaCarritoLS();
    renderizarProductos();
    renderizarCarrito();




});