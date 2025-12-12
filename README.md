# The Sugar Chocolate - Website

A complete, fully responsive website for **The Sugar Chocolate**, a home-based chocolatier business by Shreya Soni.

## 🍫 Features

- **5 Complete Pages**: Home, Menu, Gallery, About, and Contact
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Dynamic Menu**: Products loaded from JSON with category filtering and search
- **Shopping Cart**: LocalStorage-based cart system
- **Image Gallery**: Masonry grid with lightbox viewer
- **Forms**: Contact and order forms with JavaScript validation
- **Testimonials Slider**: Auto-rotating customer reviews
- **Accessibility**: Semantic HTML, ARIA labels, proper contrast
- **Performance**: Lazy loading, responsive images, optimized assets

## 🎨 Brand Colors

The website theme is derived from the uploaded logo:

- **Primary**: `#5C3D2E` (Rich chocolate brown)
- **Secondary**: `#C9A961` (Golden/cream)
- **Accent**: `#D4AF37` (Bright gold)
- **Dark**: `#3D2417` (Deep brown)
- **Light**: `#F5F1E8` (Cream/off-white)

These colors are defined as CSS variables in `css/styles.css` and can be easily customized.

## 📁 File Structure

\`\`\`
the-sugar-chocolate/
├── index.html              # Home page
├── menu.html               # Products menu
├── gallery.html            # Image gallery
├── about.html              # About us & founder story
├── contact.html            # Contact & order forms
├── css/
│   └── styles.css          # All styles with brand colors
├── js/
│   └── main.js             # All JavaScript functionality
├── assets/
│   ├── images/             # All product & gallery images
│   │   ├── hero-chocolates.jpg
│   │   ├── strawberry-bonbons.jpg
│   │   ├── ferrero-cake.jpg
│   │   └── ... (12 total images)
│   └── data/
│       └── products.json   # Product data
└── README.md               # This file
\`\`\`

## 🚀 Getting Started

1. **Download & Extract**: Extract all files maintaining the folder structure
2. **Open in Browser**: Open `index.html` in any modern web browser
3. **View Pages**: Navigate through all pages using the navigation menu

## 📝 Customization Guide

### Updating Products

Edit `assets/data/products.json`:

\`\`\`json
{
  "id": "unique-id",
  "name": "Product Name",
  "category": "chocolates|cakes|cupcakes|cheesecakes|giftboxes",
  "description": "Product description",
  "price": "₹600 - ₹1200",
  "image": "assets/images/your-image.jpg",
  "eggless": true,
  "badges": ["Bestseller", "Premium"]
}
\`\`\`

### Changing Colors

Edit CSS variables in `css/styles.css`:

\`\`\`css
:root {
  --primary: #5C3D2E;
  --secondary: #C9A961;
  --accent: #D4AF37;
  /* ... adjust as needed */
}
\`\`\`

### Adding Images

1. Add images to `assets/images/` folder
2. Use descriptive filenames (e.g., `dark-chocolate-truffles.jpg`)
3. Update `products.json` or HTML files to reference new images
4. Recommended: Use photorealistic, high-quality images (1200px+ width)

### Updating Contact Information

Edit the footer and contact page in HTML files:

- Email: Search for `shreya@thesugarchocolate.com`
- Phone: Search for `+91 98765 43210`
- Address: Search for `Mumbai, India`

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Proper heading hierarchy
- Alt text for all images
- Color contrast compliance
- Focus indicators

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: Below 768px

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, CSS Variables, Animations
- **JavaScript (ES6+)**: Vanilla JS (no frameworks)
- **Google Fonts**: Playfair Display (headings), Lato (body)

## 📄 Features Breakdown

### Home Page
- Hero section with CTA buttons
- About preview
- Featured products
- Gallery preview
- Testimonials slider

### Menu Page
- Category filters
- Search functionality
- Product cards with "Order" button
- Order modal

### Gallery Page
- Masonry grid layout
- Lightbox image viewer
- Keyboard navigation

### About Page
- Founder story
- Brand values
- Process steps
- Customer testimonials

### Contact Page
- Contact information
- Contact form with validation
- Order form with validation
- Success modal

## 💡 Tips

- All forms show success modals (no backend required)
- Cart data is stored in browser localStorage
- Images are lazy-loaded for performance
- Mobile menu collapses automatically on navigation

## 📞 Support

For questions or customization help, contact:
- **Email**: shreya@thesugarchocolate.com
- **Phone**: +91 98765 43210

---

**Built with ❤️ for The Sugar Chocolate by Shreya Soni**
