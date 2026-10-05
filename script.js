// Product data (edit images/prices here)
const products = [
  { id: 1, name: "Slim Fit Blazer",   category: "men",   price: 89, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80" },
  { id: 2, name: "Casual Cotton Shirt", category: "men", price: 35, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" },
  { id: 3, name: "Floral Summer Dress", category: "women", price: 59, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80" },
  { id: 4, name: "Evening Gown",      category: "women", price: 120, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80" },
  { id: 5, name: "Kids Denim Set",    category: "kids",  price: 32, img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80" },
  { id: 6, name: "Kids Party Dress",  category: "kids",  price: 40, img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80" }
];
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#e6dfd3'/><text x='50%' y='50%' text-anchor='middle' fill='#5b6672' font-family='sans-serif' font-size='24'>Image</text></svg>");

let cart = [];
const $ = (id) => document.getElementById(id);

function renderProducts(filter = "all") {
  const list = filter === "all" ? products : products.filter(p => p.category === filter);
  $("productGrid").innerHTML = list.map(p => `
    <article class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
      <div class="card-body">
        <small>${p.category[0].toUpperCase() + p.category.slice(1)}</small>
        <h3>${p.name}</h3>
        <span class="price">$${p.price}</span>
        <button class="btn" data-id="${p.id}">Add to cart</button>
      </div>
    </article>`).join("");
}

function setFilter(filter) {
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.filter === filter));
  renderProducts(filter);
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function renderCart() {
  $("cartCount").textContent = cart.length;
  $("cartItems").innerHTML = cart.length
    ? cart.map((p, i) => `<li><span>${p.name} - $${p.price}</span><button data-i="${i}">Remove</button></li>`).join("")
    : '<li class="empty">Your cart is empty. Add something from the shop.</li>';
  $("cartTotal").textContent = "$" + cart.reduce((s, p) => s + p.price, 0);
}

function toggleCart(open) {
  $("cart").classList.toggle("open", open);
  $("cart").setAttribute("aria-hidden", !open);
}

// Events
$("filters").addEventListener("click", e => {
  if (e.target.dataset.filter) setFilter(e.target.dataset.filter);
});
document.querySelectorAll(".cat").forEach(c =>
  c.addEventListener("click", () => setFilter(c.dataset.filter)));

$("productGrid").addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (!id) return;
  cart.push(products.find(p => p.id == id));
  renderCart();
  toast("Added to cart");
});
$("cartItems").addEventListener("click", e => {
  if (e.target.dataset.i !== undefined) { cart.splice(e.target.dataset.i, 1); renderCart(); }
});
$("cartBtn").addEventListener("click", () => toggleCart(true));
$("closeCart").addEventListener("click", () => toggleCart(false));
$("checkout").addEventListener("click", () => {
  if (!cart.length) return toast("Add an item first");
  cart = []; renderCart(); toggleCart(false);
  toast("Order placed. Arrives in 2 days, free shipping.");
});
$("menuBtn").addEventListener("click", () => $("nav").classList.toggle("open"));
$("nav").addEventListener("click", () => $("nav").classList.remove("open"));

$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  $("formMsg").textContent = `Thanks, ${$("name").value}. We'll reply to ${$("email").value} soon.`;
  e.target.reset();
});

renderProducts();
renderCart();
