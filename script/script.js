let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.innerText = cart.length;
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

async function loadTrendingProducts() {
  const container = document.getElementById("trendingProducts");

  container.innerHTML =
   `<span class="loading loading-spinner loading-lg mx-auto"></span>`;

  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  const topRated = data
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 3);

  container.innerHTML = "";

  topRated.forEach(product => {
    container.innerHTML += `
      <div class="card bg-base-100 shadow-md rounded-xl">
        
        <figure class="p-6 h-52 bg-gray-200">
          <img src="${product.image}" 
               class="h-full object-contain mx-auto"/>
        </figure>

        <div class="card-body">

          <div class="flex justify-between items-center text-sm">
            <span class="text-indigo-500 font-bold bg-indigo-100 px-2 rounded-lg capitalize">
              ${product.category}
            </span>

            <span class="text-warning font-semibold">
              ⭐ ${product.rating.rate} 
              <span class="text-gray-500">
                (${product.rating.count})
              </span>
            </span>
          </div>

          <h2 class="card-title text-sm mt-2">
            ${product.title.substring(0,45)}...
          </h2>

          <p class="text-primary font-bold text-lg">
            $${product.price}
          </p>

          <div class="flex gap-3 mt-4">
            <button class="btn btn-sm flex-1">
             <i class="fa-regular fa-eye"></i> Details
            </button>

            <button 
              onclick='addToCart(${JSON.stringify(product)})'
              class="btn btn-primary btn-sm flex-1">
              <i class="fa-solid fa-cart-arrow-down"></i> Add
            </button>
          </div>

        </div>
      </div>
    `;
  });
}

updateCartCount();
loadTrendingProducts();

