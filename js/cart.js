const conversionUyuDolar = 1 / 40; // 1 Dólar = 40 UYU

let cartArray = [];
let subtotalUyu = 0; // Subtotal en UYU
let costoEnvio = 0;
let precioFinal = 0;
let currency; // Variable para almacenar la moneda del carrito

async function getPrechargedProduct() {
  const respuesta = await fetch(`https://japceibal.github.io/emercado-api/user_cart/${25801}.json`);
  response = await respuesta.json();
  userCart = response.articles[0];
  userCart.quantity = userCart.count;
  return userCart;
}

function prechargedProduct(products) {
  let htmlContentToAppend = "";
  htmlContentToAppend = `
    <td class="h-25" style="width: 100px"><img src="${products.image}" alt="${products.name}" class="img-thumbnail"></td>
    <td>${products.name}</td>
    <td>${products.currency} ${products.currency === 'UYU' ? (products.unitCost * conversionUyuDolar).toFixed(2) : products.unitCost}</td>
    <td>
    <button class="btn btn-sm btn-primary" onclick="reducirCantidadPrecharged('${products.id}')">-</button>
    <span class="mx-2">${products.quantity}</span>
    <button class="btn btn-sm btn-primary" onclick="aumentarCantidadPrecharged('${products.id}')">+</button>
    </td>
    <td id="total_${products.id}"><b>${products.currency} ${products.currency === 'UYU' ? (products.unitCost * products.quantity * conversionUyuDolar).toFixed(2) : products.unitCost * products.quantity}</b></td>
    <td><input id="id${products.id}" class="cartbttn" type="button" value="Sacar del carrito""></td>`;

  document.getElementById("cart-container").innerHTML += htmlContentToAppend;
  currency = products.currency; // Almacena la moneda del carrito
}

function aumentarCantidadPrecharged() {
  if (userCart.quantity) {
    userCart.quantity += 1;
    vaciarCarrito();
    prechargedProduct(userCart);
    getUserCart();
  }
}

function reducirCantidadPrecharged() {
  if (userCart.quantity && userCart.quantity > 1) {
    userCart.quantity -= 1;
    vaciarCarrito();
    prechargedProduct(userCart);
    getUserCart();
  }
}

function getUserCart() {
  cartArray = JSON.parse(localStorage.getItem("cart")) || [];
  let htmlContentToAppend = "";
  subtotalUyu = 0; // Inicializar el subtotal en UYU
  for (let i = 0; i < cartArray.length; i++) {
    let cart = cartArray[i];
    let costoTotalUyu = cart.cost * cart.quantity; // Subtotal en UYU
    let costoTotalUsd = currency === 'USD' ? cart.cost : costoTotalUyu * conversionUyuDolar; // Subtotal en USD si ya está en USD
    subtotalUyu += costoTotalUyu; // Sumar al subtotal en UYU
    htmlContentToAppend += `<tr>
      <td class="h-25" style="width: 100px">
        <img src="${cart.image}" alt "${cart.name}" class="img-thumbnail"></td>
      <td>${cart.name}</td>
      <td>${currency} ${currency === 'UYU' ? (cart.cost * conversionUyuDolar).toFixed(2) : cart.cost}</td>
      <td>
        <button class "btn btn-sm btn-primary" onclick="reducirCantidad('${cart.id}')">-</button>
        <span class="mx-2">${cart.quantity}</span>
        <button class="btn btn-sm btn-primary" onclick="aumentarCantidad('${cart.id}')">+</button>
      </td>
      <td id="total_${cart.id}"><b>${currency} ${currency === 'UYU' ? (costoTotalUsd).toFixed(2) : cart.cost * cart.quantity}</b></td>
      <td><input id="id${cart.id}" class="cartbttn" type="button" value="Sacar del carrito" onclick="eliminarDelCarrito(${cart.id})"></td>
    </tr>`;
  }

  document.getElementById("precio-final").textContent = `Total a pagar: ${currency} ${(subtotalUyu * conversionUyuDolar).toFixed(2)}`;
  document.getElementById("cart-container").innerHTML = htmlContentToAppend;
  calcularEnvio();
}

function aumentarCantidad(productoId) {
  var product = cartArray.find(p => p.id == productoId);
  if (product) {
    product.quantity += 1;
    actualizarCarritoEnLocalStorage();
    vaciarCarrito();
    prechargedProduct(userCart);
    getUserCart();
  }
}

function reducirCantidad(productoId) {
  var product = cartArray.find(p => p.id == productoId);
  if (product) {
    if (product.quantity > 1) {
      product.quantity -= 1;
      actualizarCarritoEnLocalStorage();
      vaciarCarrito();
      prechargedProduct(userCart);
      getUserCart();
    }
  }
}

function vaciarCarrito() {
  var cartContainer = document.getElementById("cart-container");
  if (cartContainer) {
    cartContainer.innerHTML = "";
  }
}

function actualizarCarritoEnLocalStorage() {
  var cartString = JSON.stringify(cartArray);
  localStorage.setItem('cart', cartString);
}

function eliminarDelCarrito(productoId) {
  const index = cartArray.findIndex((p) => p.id === productoId);
  if (index !== -1) {
    cartArray.splice(index, 1);
    const productoCarrito = document.getElementById(productoId);
    if (productoCarrito) {
      productoCarrito.remove();
    }

    const precioTotalElement = document.getElementById('precioTotalElement');
    if (precioTotalElement) {
      precioTotal = cartArray.reduce((total, p) => total + (p.currency === 'UYU' ? p.cost * conversionUyuDolar : p.cost), 0);
      precioTotalElement.textContent = `Precio Total: ${currency} ${(precioTotal * conversionUyuDolar).toFixed(2)}`;
    }
    localStorage.setItem("cart", JSON.stringify(cartArray));
    actualizarCarritoEnLocalStorage();
    vaciarCarrito();
    prechargedProduct(userCart);
    getUserCart();
  }
}

async function main() {
  try {
    const userCart = await getPrechargedProduct();
    prechargedProduct(userCart);
    getUserCart();
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
  }
}

main();

function calcularEnvio() {
  const radioButtons = document.getElementsByName("inlineRadioOptions");
  let porcentajeEnvio = 0.0;

  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      const selectedValue = radioButtons[i].value.toLowerCase();

      if (selectedValue === "premium") {
        porcentajeEnvio = 0.15;
      } else if (selectedValue === "express") {
        porcentajeEnvio = 0.07;
      } else if (selectedValue === "estandar") {
        porcentajeEnvio = 0.05;
      }

      break;
    }
  }

  costoEnvio = subtotalUyu * porcentajeEnvio * conversionUyuDolar;
  precioFinal = subtotalUyu * conversionUyuDolar + costoEnvio;

  document.getElementById("costo-envio").textContent = `Costo de envío: ${currency} ${(costoEnvio).toFixed(2)}`;
  document.getElementById("subtotal-final").textContent = `Subtotal: ${currency} ${(subtotalUyu * conversionUyuDolar).toFixed(2)}`;
  document.getElementById("precio-final").textContent = `Total a pagar: ${currency} ${(precioFinal).toFixed(2)}`;
}
