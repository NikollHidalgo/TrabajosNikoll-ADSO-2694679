const readline = require('readline');

class Producto {
  constructor(nombre, precio, cantidadEnStock) {
    this.nombre = nombre;
    this.precio = precio;
    this.cantidadEnStock = cantidadEnStock;
  }

  disminuirStock(cantidad) {
    if (this.cantidadEnStock < cantidad) {
      throw new Error("No hay suficiente stock para este producto");
    }
    this.cantidadEnStock -= cantidad;
  }
}

class Carrito {
  constructor() {
    this.productos = [];
    this.precioTotal = 0;
  }

  agregarProducto(producto, cantidad) {
    producto.disminuirStock(cantidad);
    this.productos.push({ producto, cantidad });
    this.precioTotal += producto.precio * cantidad;
  }

  obtenerPrecioTotal() {
    return this.precioTotal;
  }
}

class Orden {
  constructor(cliente, carrito) {
    this.cliente = cliente;
    this.carrito = carrito;
  }

  procesarPago() {
    // Simular el procesamiento del pago
    console.log("Procesando pago...");
    console.log(`Pago realizado por un total de ${this.carrito.obtenerPrecioTotal()}`);
  }
}

// Crear una interfaz para leer desde la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(productosDisponibles, carrito) {
  rl.question('Ingrese el nombre del producto: ', (nombreProducto) => {
    const producto = productosDisponibles.find(prod => prod.nombre === nombreProducto);
    if (producto) {
      rl.question('Ingrese la cantidad a agregar al carrito: ', (cantidadString) => {
        const cantidad = parseInt(cantidadString);
        if (!isNaN(cantidad) && cantidad > 0) {
          carrito.agregarProducto(producto, cantidad);
          console.log(`Producto '${producto.nombre}' agregado al carrito.`);
          rl.question('¿Desea agregar otro producto al carrito? (S/N): ', (respuesta) => {
            if (respuesta.toUpperCase() === 'S') {
              agregarProductoAlCarrito(productosDisponibles, carrito);
            } else {
              mostrarResumen(carrito);
            }
          });
        } else {
          console.log('La cantidad ingresada no es válida.');
          rl.close();
        }
      });
    } else {
      console.log('El producto ingresado no está disponible.');
      rl.close();
    }
  });
}

// Función para mostrar el resumen del carrito y procesar el pago
function mostrarResumen(carrito) {
  console.log('\n--- Resumen del Carrito ---');
  carrito.productos.forEach((item, index) => {
    console.log(`${index + 1}. ${item.producto.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.producto.precio * item.cantidad}`);
  });
  console.log(`Precio total: $${carrito.obtenerPrecioTotal()}`);
  
  rl.question('\n¿Desea procesar el pago? (S/N): ', (respuesta) => {
    if (respuesta.toUpperCase() === 'S') {
      const orden = new Orden({ nombre: "Juan Pérez", dirección: "Calle 123" }, carrito);
      orden.procesarPago();
    } else {
      console.log('Pago cancelado.');
    }
    rl.close(); // Mover la llamada a close() aquí
  });
}

// Ejemplo de uso
const productosDisponibles = [
  new Producto("Camiseta", 20, 10),
  new Producto("Pantalón", 30, 5)
];

const carrito = new Carrito();

// Agregar productos al carrito
console.log('Productos disponibles:');
productosDisponibles.forEach((producto, index) => {
  console.log(`${index + 1}. ${producto.nombre} - Precio: $${producto.precio} - Stock: ${producto.cantidadEnStock}`);
});

agregarProductoAlCarrito(productosDisponibles, carrito);
