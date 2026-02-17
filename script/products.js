let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productContainer = document.getElementById("products");
const categoryContainer = document.getElementById("categories");
const cartCount = document.getElementById("cartCount");

function updateCartCount() {
  if (cartCount) {
    cartCount.innerText = cart.length;
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  updateCartCount();
}

function setActiveButton(btn) {
  document.querySelectorAll("#categories button")
    .forEach(b => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-outline");
    });

  btn.classList.remove("btn-outline");
  btn.classList.add("btn-primary");
}

function showDetails(product) {
  const modal = document.getElementById("productModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <img src="${product.image}"
         class="h-40 mx-auto mb-4 object-contain"/>

    <h3 class="text-xl font-bold mb-2">
      ${product.title}
    </h3>

    <p class="mb-3 text-sm">
      ${product.description}
    </p>

    <p class="font-bold text-primary mb-2">
      $${product.price}
    </p>

    <p class="mb-4">⭐ ${product.rating.rate}</p>

    <button id="modalAddBtn"
      class="btn btn-primary w-full">
      Add To Cart
    </button>
  `;

  modal.showModal();

  // modal button event
  document
    .getElementById("modalAddBtn")
    .addEventListener("click", () => {
      addToCart(product);
      modal.close();
    });
}

async function loadCategories() {
  try {
    const res = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    const categories = await res.json();

    categoryContainer.innerHTML = "";

    // All button
    const allBtn = document.createElement("button");
    allBtn.className = "btn btn-primary btn-sm";
    allBtn.innerText = "All";

    allBtn.addEventListener("click", () => {
      loadProducts();
      setActiveButton(allBtn);
    });

    categoryContainer.appendChild(allBtn);

    // Category buttons
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline btn-sm";
      btn.innerText = cat;

      btn.addEventListener("click", () => {
        loadProducts(cat);
        setActiveButton(btn);
      });

      categoryContainer.appendChild(btn);
    });

  } catch (error) {
    categoryContainer.innerHTML =
      `<p class="text-error">Failed to load categories</p>`;
  }
}

async function loadProducts(category = "") {

  productContainer.innerHTML =
    `<span class="loading loading-spinner loading-lg mx-auto"></span>`;

  try {

    let url = "https://fakestoreapi.com/products";
    if (category) {
      url = `https://fakestoreapi.com/products/category/${category}`;
    }

    const res = await fetch(url);
    const products = await res.json();

    productContainer.innerHTML = "";

    products.forEach(product => {

      const card = document.createElement("div");
      card.className = "card bg-base-100 shadow-md";

      card.innerHTML = `
        <figure class="p-6 h-52">
          <img src="${product.image}"
               class="h-full object-contain"/>
        </figure>

        <div class="card-body">

          <span class="text-indigo-500 font-bold bg-indigo-100 px-2 rounded-lg badge">
            ${product.category}
          </span>

          <h2 class="card-title text-sm">
            ${product.title.substring(0,35)}...
          </h2>

          <p class="text-primary font-bold">
            $${product.price}
          </p>

          <p>⭐ ${product.rating.rate}</p>

          <div class="card-actions justify-between">
            <button class="btn btn-sm details-btn">
             <i class="fa-regular fa-eye"></i> Details
            </button>

            <button class="btn btn-primary btn-sm add-btn">
              <i class="fa-solid fa-cart-arrow-down"></i> Add
            </button>
          </div>

        </div>
      `;

      // Add button event
      card.querySelector(".add-btn")
        .addEventListener("click", () => {
          addToCart(product);
        });

      // Details button event
      card.querySelector(".details-btn")
        .addEventListener("click", () => {
          showDetails(product);
        });

      productContainer.appendChild(card);
    });

  } catch (error) {
    productContainer.innerHTML =
      `<p class="text-error text-center">
         Failed to load products
       </p>`;
  }
}

updateCartCount();
loadCategories();
loadProducts();
