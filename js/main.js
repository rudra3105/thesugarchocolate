// ========================================
// Global Variables
// ========================================
let products = []
let cart = JSON.parse(localStorage.getItem("cart")) || []
let currentTestimonial = 0
let currentLightboxImage = 0
let lightboxImages = []

// ========================================
// Initialize
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  loadProducts()
  updateCartCount()
  initializeTestimonials()
  initializeLightbox()
  initializeForms()

  // Page-specific initialization
  if (document.getElementById("products-grid")) {
    initializeMenu()
  }

  if (document.getElementById("featured-products")) {
    loadFeaturedProducts()
  }
})

// ========================================
// Navigation
// ========================================
function initializeNavigation() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      const isExpanded = navMenu.classList.contains("active")
      mobileMenuToggle.setAttribute("aria-expanded", isExpanded)
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav") && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active")
      mobileMenuToggle.setAttribute("aria-expanded", "false")
    }
  })

  // Cart icon click
  const cartIcon = document.querySelector(".cart-icon")
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault()
      openCartModal()
    })
  }
}

// ========================================
// Products
// ========================================
async function loadProducts() {
  try {
    const response = await fetch("assets/data/products.json")
    products = await response.json()
    console.log("[v0] Products loaded:", products.length)
  } catch (error) {
    console.error("[v0] Error loading products:", error)
    products = []
  }
}

function loadFeaturedProducts() {
  const container = document.getElementById("featured-products")
  if (!container || products.length === 0) return

  // Show first 3 products as featured
  const featured = products.slice(0, 3)
  container.innerHTML = featured.map((product) => createProductCard(product)).join("")
}

function createProductCard(product) {
  const egglessBadge = product.eggless ? '<span class="badge badge-eggless">Eggless</span>' : ""
  const badges = product.badges ? product.badges.map((badge) => `<span class="badge">${badge}</span>`).join("") : ""

  return `
    <div class="product-card" data-category="${product.category}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-badges">
          ${egglessBadge}
          ${badges}
        </div>
      </div>
      <div class="product-content">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${product.price}</span>
          <button class="btn-order" onclick="openOrderModal('${product.id}')">Order</button>
        </div>
      </div>
    </div>
  `
}

// ========================================
// Menu Page
// ========================================
function initializeMenu() {
  const productsGrid = document.getElementById("products-grid")
  const filterButtons = document.querySelectorAll(".filter-btn")
  const searchInput = document.getElementById("search-input")

  // Display all products initially
  displayProducts(products)

  // Filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active state
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter products
      const category = button.dataset.category
      const filtered = category === "all" ? products : products.filter((p) => p.category === category)

      displayProducts(filtered)
    })
  })

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm),
      )
      displayProducts(filtered)
    })
  }
}

function displayProducts(productsToShow) {
  const productsGrid = document.getElementById("products-grid")
  const noResults = document.getElementById("no-results")

  if (productsToShow.length === 0) {
    productsGrid.innerHTML = ""
    if (noResults) noResults.style.display = "block"
    return
  }

  if (noResults) noResults.style.display = "none"
  productsGrid.innerHTML = productsToShow.map((product) => createProductCard(product)).join("")
}

// ========================================
// Order Modal
// ========================================
function openOrderModal(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const modal = document.getElementById("order-modal")
  const details = document.getElementById("order-product-details")

  details.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h3>${product.name}</h3>
      <p style="color: var(--text-light);">${product.description}</p>
      <p style="font-size: 1.25rem; font-weight: 700; color: var(--primary); margin-top: 0.5rem;">${product.price}</p>
    </div>
  `

  modal.classList.add("active")
  modal.setAttribute("aria-hidden", "false")

  // Handle form submission
  const form = document.getElementById("quick-order-form")
  form.onsubmit = (e) => {
    e.preventDefault()
    addToCart(product, Number.parseInt(document.getElementById("order-quantity").value))
    closeOrderModal()
    form.reset()
  }

  // Close on background click
  modal.onclick = (e) => {
    if (e.target === modal) closeOrderModal()
  }

  // Close button
  const closeBtn = modal.querySelector(".modal-close")
  closeBtn.onclick = closeOrderModal
}

function closeOrderModal() {
  const modal = document.getElementById("order-modal")
  modal.classList.remove("active")
  modal.setAttribute("aria-hidden", "true")
}

// ========================================
// Cart
// ========================================
function addToCart(product, quantity) {
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    })
  }

  saveCart()
  updateCartCount()
  showNotification(`${product.name} added to cart!`)
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  updateCartCount()
  displayCart()
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")
  if (cartCount) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = total
  }
}

function openCartModal() {
  const modal = document.getElementById("cart-modal")
  modal.classList.add("active")
  modal.setAttribute("aria-hidden", "false")
  displayCart()

  // Close on background click
  modal.onclick = (e) => {
    if (e.target === modal) closeCartModal()
  }

  // Close button
  const closeBtn = modal.querySelector(".modal-close")
  closeBtn.onclick = closeCartModal
}

function closeCartModal() {
  const modal = document.getElementById("cart-modal")
  modal.classList.remove("active")
  modal.setAttribute("aria-hidden", "true")
}

function displayCart() {
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total-amount")

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>'
    cartTotal.textContent = "0"
    return
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
      </div>
      <div class="cart-item-price">${item.price}</div>
      <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</div>
    </div>
  `,
    )
    .join("")

  // Note: Since prices are ranges, we show "Contact for Quote"
  cartTotal.textContent = "Contact for Quote"
}

// ========================================
// Testimonials
// ========================================
function initializeTestimonials() {
  const prevBtn = document.querySelector(".testimonial-btn.prev")
  const nextBtn = document.querySelector(".testimonial-btn.next")

  if (prevBtn) {
    prevBtn.addEventListener("click", () => changeTestimonial(-1))
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => changeTestimonial(1))
  }

  // Auto-rotate every 5 seconds
  setInterval(() => changeTestimonial(1), 5000)
}

function changeTestimonial(direction) {
  const testimonials = document.querySelectorAll(".testimonial")
  if (testimonials.length === 0) return

  testimonials[currentTestimonial].classList.remove("active")

  currentTestimonial += direction

  if (currentTestimonial >= testimonials.length) {
    currentTestimonial = 0
  } else if (currentTestimonial < 0) {
    currentTestimonial = testimonials.length - 1
  }

  testimonials[currentTestimonial].classList.add("active")
}

// ========================================
// Lightbox
// ========================================
function initializeLightbox() {
  const lightbox = document.getElementById("lightbox")
  if (!lightbox) return

  const images = document.querySelectorAll(".masonry-item img, .gallery-item img")
  lightboxImages = Array.from(images)

  images.forEach((img, index) => {
    img.parentElement.addEventListener("click", () => {
      openLightbox(index)
    })
  })

  // Navigation
  const closeBtn = lightbox.querySelector(".lightbox-close")
  const prevBtn = lightbox.querySelector(".lightbox-prev")
  const nextBtn = lightbox.querySelector(".lightbox-next")

  closeBtn.addEventListener("click", closeLightbox)
  prevBtn.addEventListener("click", () => changeLightboxImage(-1))
  nextBtn.addEventListener("click", () => changeLightboxImage(1))

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox()
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return

    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") changeLightboxImage(-1)
    if (e.key === "ArrowRight") changeLightboxImage(1)
  })
}

function openLightbox(index) {
  const lightbox = document.getElementById("lightbox")
  const lightboxImg = document.getElementById("lightbox-img")

  currentLightboxImage = index
  const img = lightboxImages[index]

  lightboxImg.src = img.src
  lightboxImg.alt = img.alt

  lightbox.classList.add("active")
  lightbox.setAttribute("aria-hidden", "false")
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox")
  lightbox.classList.remove("active")
  lightbox.setAttribute("aria-hidden", "true")
}

function changeLightboxImage(direction) {
  currentLightboxImage += direction

  if (currentLightboxImage >= lightboxImages.length) {
    currentLightboxImage = 0
  } else if (currentLightboxImage < 0) {
    currentLightboxImage = lightboxImages.length - 1
  }

  const lightboxImg = document.getElementById("lightbox-img")
  const img = lightboxImages[currentLightboxImage]

  lightboxImg.src = img.src
  lightboxImg.alt = img.alt
}

// ========================================
// Forms
// ========================================
function initializeForms() {
  const contactForm = document.getElementById("contact-form")
  const orderForm = document.getElementById("order-form-main")

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  if (orderForm) {
    // Set minimum date to today
    const dateInput = document.getElementById("order-date")
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0]
      dateInput.min = today
    }

    orderForm.addEventListener("submit", handleOrderForm)
  }
}

function handleContactForm(e) {
  e.preventDefault()

  if (!validateForm(e.target)) {
    return
  }

  // Simulate form submission
  const formData = new FormData(e.target)
  console.log("[v0] Contact form submitted:", Object.fromEntries(formData))

  showSuccessModal("Your message has been sent successfully! We'll get back to you soon.")
  e.target.reset()
  clearFormErrors(e.target)
}

function handleOrderForm(e) {
  e.preventDefault()

  if (!validateForm(e.target)) {
    return
  }

  // Simulate form submission
  const formData = new FormData(e.target)
  console.log("[v0] Order form submitted:", Object.fromEntries(formData))

  showSuccessModal("Your order has been received! We'll contact you shortly to confirm the details.")
  e.target.reset()
  clearFormErrors(e.target)
}

function validateForm(form) {
  let isValid = true
  clearFormErrors(form)

  const requiredFields = form.querySelectorAll("[required]")

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      showFieldError(field, "This field is required")
      isValid = false
    } else if (field.type === "email" && !isValidEmail(field.value)) {
      showFieldError(field, "Please enter a valid email address")
      isValid = false
    } else if (field.type === "tel" && field.value && !isValidPhone(field.value)) {
      showFieldError(field, "Please enter a valid phone number")
      isValid = false
    }
  })

  return isValid
}

function showFieldError(field, message) {
  const formGroup = field.closest(".form-group")
  formGroup.classList.add("error")
  const errorMsg = formGroup.querySelector(".error-message")
  if (errorMsg) {
    errorMsg.textContent = message
  }
}

function clearFormErrors(form) {
  const errorGroups = form.querySelectorAll(".form-group.error")
  errorGroups.forEach((group) => {
    group.classList.remove("error")
    const errorMsg = group.querySelector(".error-message")
    if (errorMsg) {
      errorMsg.textContent = ""
    }
  })
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone) {
  return /^[\d\s+\-$$$$]{10,}$/.test(phone)
}

function showSuccessModal(message) {
  const modal = document.getElementById("success-modal")
  const messageEl = document.getElementById("success-message")

  messageEl.textContent = message
  modal.classList.add("active")
  modal.setAttribute("aria-hidden", "false")

  // Close button
  const closeBtn = modal.querySelector(".modal-close")
  closeBtn.onclick = closeSuccessModal

  // Close on background click
  modal.onclick = (e) => {
    if (e.target === modal) closeSuccessModal()
  }
}

function closeSuccessModal() {
  const modal = document.getElementById("success-modal")
  modal.classList.remove("active")
  modal.setAttribute("aria-hidden", "true")
}

// ========================================
// Notifications
// ========================================
function showNotification(message) {
  // Simple console log for now
  console.log("[v0] Notification:", message)

  // You could implement a toast notification here
  alert(message)
}

// ========================================
// Make functions globally accessible
// ========================================
window.openOrderModal = openOrderModal
window.closeOrderModal = closeOrderModal
window.closeCartModal = closeCartModal
window.removeFromCart = removeFromCart
window.closeSuccessModal = closeSuccessModal
