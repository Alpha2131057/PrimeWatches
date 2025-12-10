// Popup logic for PrimeWatches
let orderedWatches = [];

document.addEventListener('DOMContentLoaded', function () {
  // Create checkout popup container
  const checkoutPopup = document.createElement('div');
  checkoutPopup.id = 'checkout-popup';
  checkoutPopup.style.display = 'none';
  checkoutPopup.innerHTML = `
    <div class="checkout-content">
      <span class="checkout-close">&times;</span>
      <div class="checkout-title">Checkout</div>
      <div class="checkout-summary">
        <div class="summary-label">ORDER SUMMARY</div>
        <div class="summary-product"></div>
        <div class="summary-total"></div>
      </div>
      <form class="checkout-form">
        <label>FULL NAME *</label>
        <input type="text" name="name" required placeholder="Enter your full name">
        <label>EMAIL *</label>
        <input type="email" name="email" required placeholder="your@email.com">
        <label>PHONE *</label>
        <input type="tel" name="phone" required placeholder="+880 1XXX-XXXXXX">
        <label>DELIVERY ADDRESS *</label>
        <input type="text" name="address" required placeholder="Street address">
        <div style="display:flex; gap:1em;">
          <div style="flex:1;">
            <label>CITY *</label>
            <input type="text" name="city" required placeholder="City">
          </div>
          <div style="flex:1;">
            <label>ZIP CODE *</label>
            <input type="text" name="zip" required placeholder="Zip">
          </div>
        </div>
        <label>ORDER NOTES <span class="optional">(OPTIONAL)</span></label>
        <textarea name="notes" rows="2" placeholder="Any special instructions..."></textarea>
        <button type="submit" class="checkout-btn">Place Order</button>
      </form>
    </div>
  `;
  document.body.appendChild(checkoutPopup);

  function showCheckout(product) {
    checkoutPopup.querySelector('.summary-product').innerHTML = `${product.name} × 1`;
    checkoutPopup.querySelector('.summary-total').innerHTML = `৳${product.price}`;
    checkoutPopup.style.display = 'flex';
    // Set light theme for popup
    checkoutPopup.querySelector('.checkout-title').style.color = '#222';
    checkoutPopup.querySelector('.checkout-content').style.background = '#faf7ef';
    checkoutPopup.querySelector('.checkout-content').style.color = '#222';
    checkoutPopup.querySelector('.checkout-summary').style.background = '#f3f0e7';
    checkoutPopup.querySelector('.checkout-summary').style.color = '#222';
    checkoutPopup.querySelector('.summary-label').style.color = '#c7a96b';
    checkoutPopup.querySelector('.summary-total').style.color = '#c7a96b';
    // ...other style tweaks if needed
  }
  function hideCheckout() {
    checkoutPopup.style.display = 'none';
  }
  checkoutPopup.querySelector('.checkout-close').onclick = hideCheckout;
  checkoutPopup.onclick = function (e) {
    if (e.target === checkoutPopup) hideCheckout();
  };

  // Handle checkout form submit
  checkoutPopup.querySelector('.checkout-form').onsubmit = function (e) {
    e.preventDefault();
    const product = {
      name: checkoutPopup.querySelector('.summary-product').textContent.split(' ×')[0],
      desc: checkoutPopup.productDesc,
      price: checkoutPopup.querySelector('.summary-total').textContent.replace('৳','')
    };
    orderedWatches.push(product);
    hideCheckout();
    showPopup(`
      <b>Order Successful!</b><br><br>
      <b>${product.name}</b><br>
      <span style='color:#0fffc3;'>${product.desc}</span><br>
      <span style='color:#ff00cc;'>৳${product.price}</span><br><br>
      <span style='color:#fff200;'>Thank you for your purchase!</span>
    `);
  };

  // Create simple popup container for other messages
  const popup = document.createElement('div');
  popup.id = 'prime-popup';
  popup.style.display = 'none';
  popup.innerHTML = `
    <div class="popup-content">
      <span class="popup-close">&times;</span>
      <div class="popup-message"></div>
    </div>
  `;
  document.body.appendChild(popup);

  function showPopup(message) {
    popup.querySelector('.popup-message').innerHTML = message;
    popup.style.display = 'flex';
  }
  function hidePopup() {
    popup.style.display = 'none';
  }
  popup.querySelector('.popup-close').onclick = hidePopup;
  popup.onclick = function (e) {
    if (e.target === popup) hidePopup();
  };

  // Create account popup container
  const accountPopup = document.createElement('div');
  accountPopup.id = 'account-popup';
  accountPopup.style.display = 'none';
  accountPopup.innerHTML = `
    <div class="account-content">
      <span class="account-close">&times;</span>
      <div class="account-title">My Account</div>
      <div class="account-tabs">
        <button class="account-tab active" data-tab="login">Login</button>
        <button class="account-tab" data-tab="register">Register</button>
      </div>
      <form class="account-form" data-tab="login">
        <label>EMAIL</label>
        <input type="email" name="email" required placeholder="your@email.com">
        <label>PASSWORD</label>
        <input type="password" name="password" required placeholder="Your password">
        <button type="submit" class="account-action">Login</button>
      </form>
      <form class="account-form" data-tab="register" style="display:none;">
        <label>EMAIL</label>
        <input type="email" name="email" required placeholder="your@email.com">
        <label>PASSWORD</label>
        <input type="password" name="password" required placeholder="Create a password">
        <button type="submit" class="account-action">Register</button>
      </form>
    </div>
  `;
  document.body.appendChild(accountPopup);

  function showAccount(tab) {
    accountPopup.style.display = 'flex';
    setAccountTab(tab || 'login');
  }
  function hideAccount() {
    accountPopup.style.display = 'none';
  }
  accountPopup.querySelector('.account-close').onclick = hideAccount;
  accountPopup.onclick = function (e) {
    if (e.target === accountPopup) hideAccount();
  };

  function setAccountTab(tab) {
    accountPopup.querySelectorAll('.account-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    accountPopup.querySelectorAll('.account-form').forEach(form => {
      form.style.display = form.dataset.tab === tab ? '' : 'none';
    });
  }
  accountPopup.querySelectorAll('.account-tab').forEach(btn => {
    btn.onclick = () => setAccountTab(btn.dataset.tab);
  });

  // Header buttons
  document.querySelectorAll('.menu a').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      let text = btn.textContent.trim();
      if (btn.classList.contains('cart')) {
        // Show cart popup
        if (orderedWatches.length === 0) {
          showPopup('<div class="cart-title">Your cart is empty.</div>');
        } else {
          let cartHtml = '<div class="cart-title">Your Cart</div><ul class="cart-list">';
          orderedWatches.forEach((w, i) => {
            cartHtml += `<li><span class='cart-name'>${w.name}</span><span class='cart-desc'>${w.desc}</span><span class='cart-price'>৳${w.price}</span> <button class='cart-cancel-btn' data-index='${i}'>Cancel</button></li>`;
          });
          cartHtml += '</ul>';
          showPopup(cartHtml);
          // Add cancel button logic
          setTimeout(() => {
            document.querySelectorAll('.cart-cancel-btn').forEach(btn => {
              btn.onclick = function(e) {
                const idx = parseInt(btn.getAttribute('data-index'));
                orderedWatches.splice(idx, 1);
                // Close popup
                document.querySelector('.popup-close').click();
                // Reopen cart with updated items
                setTimeout(() => {
                  document.querySelector('.cart').click();
                }, 100);
              };
            });
          }, 50);
        }
      } else if (text === 'Contact') {
        showPopup(`
          <b>Contact Us</b><br><br>
          <a href='https://facebook.com/primewatches' target='_blank' style='color:#0fffc3;text-decoration:underline;'>Facebook Page</a><br>
          Gmail: <span style='color:#ff00cc;'>contact@primewatches.com</span><br>
          Phone: <span style='color:#ff00cc;'>+880 1234 567890</span>
        `);
      } else if (text === 'Collection') {
        // Scroll to Signature Collection
        const section = document.querySelector('.product-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (text === 'Home') {
        // Do nothing for Home button
        return;
      } else if (text === 'About') {
        showPopup(`
          <div style='font-size:1.08em; color:#222; text-align:left; max-width:480px; margin:auto;'>
            <b>PrimeWatches</b> is a luxury watch destination crafted for those who value precision, power, and timeless design.<br><br>
            Our curated collection features iconic chronographs, elegant automatics, and masterfully engineered sports watches—each selected for its craftsmanship, performance, and signature style.<br><br>
            At PrimeWatches, we believe a watch is more than a timepiece; it’s a statement of identity, heritage, and ambition.<br>
            From deep-sea chronographs to heritage-inspired classics, every watch in our Signature Collection blends modern engineering with premium artistry.<br><br>
            Whether you are a collector, an enthusiast, or someone exploring luxury timepieces for the first time, PrimeWatches offers a refined and trustworthy shopping experience built for modern elites.<br><br>
            <span style='color:#c7a96b; font-weight:bold;'>Experience time—In Its Prime.</span>
          </div>
        `);
      } else {
        showPopup(`You clicked <b>${text}</b>!`);
      }
    });
  });

  // Buy Now buttons
  document.querySelectorAll('.card .card-buttons button:first-child').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = btn.closest('.card');
      const name = card.querySelector('h3').textContent;
      const desc = card.querySelector('p').textContent;
      const price = card.querySelector('span').textContent.replace('৳','');
      checkoutPopup.productDesc = desc;
      showCheckout({ name, desc, price });
    });
  });

  // Add to Cart buttons
  document.querySelectorAll('.add-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = btn.closest('.card');
      const name = card.querySelector('h3').textContent;
      const desc = card.querySelector('p').textContent;
      const price = card.querySelector('span').textContent.replace('৳','');
      orderedWatches.push({ name, desc, price });
      showPopup(`<div class='success-cart'>Successfully added to cart!</div><b>${name}</b> is now in your cart.`);
    });
  });

  document.querySelector('.login-btn').onclick = function () {
    showAccount('login');
  };
  document.querySelector('.signup-btn').onclick = function () {
    showAccount('register');
  };
});
