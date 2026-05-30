// =============================================
//   KadoKita — script.js
//   Handles: Navbar, Modal, FAQ, Animations
// =============================================

/* ---- SELECTORS ---- */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const step1        = document.getElementById('step1');
const step2        = document.getElementById('step2');
const btnLanjut    = document.getElementById('btnLanjut');
const btnBuatLagi  = document.getElementById('btnBuatLagi');
const btnCopy      = document.getElementById('btnCopy');
const btnWa        = document.getElementById('btnWa');
const btnIg        = document.getElementById('btnIg');
const toast        = document.getElementById('toast');

// Tombol-tombol yang membuka modal
const openModalBtns = [
  document.getElementById('btnBuat'),
  document.getElementById('btnBuatMobile'),
  document.getElementById('btnHero'),
  document.getElementById('btnCta'),
];

// Input fields
const inputPengirim = document.getElementById('inputPengirim');
const inputPenerima = document.getElementById('inputPenerima');
const inputPesan    = document.getElementById('inputPesan');
const selectJenis   = document.getElementById('selectJenis');

// Preview fields
const previewPengirim = document.getElementById('previewPengirim');
const previewPenerima = document.getElementById('previewPenerima');
const previewPesan    = document.getElementById('previewPesan');
const previewType     = document.getElementById('previewType');
const linkKado        = document.getElementById('linkKado');


/* ---- NAVBAR: Scroll Effect ---- */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ---- HAMBURGER MENU ---- */
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
});

// Tutup mobile menu saat klik link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});


/* ---- MODAL: Buka & Tutup ---- */
function bukaModal(jenisKado = null) {
  // Reset ke step 1
  step1.classList.remove('hidden');
  step2.classList.add('hidden');

  // Jika dipanggil dari grid kado, set jenis otomatis
  if (jenisKado) {
    const options = selectJenis.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].text.includes(jenisKado)) {
        selectJenis.selectedIndex = i;
        break;
      }
    }
  }

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Fokus ke input pertama
  setTimeout(() => inputPengirim.focus(), 300);
}

function tutupModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Tombol buat kado (semua)
openModalBtns.forEach(btn => {
  if (btn) btn.addEventListener('click', () => bukaModal());
});

// Tombol "Pilih" di grid kado
document.querySelectorAll('.btn-pilih').forEach(btn => {
  btn.addEventListener('click', () => {
    const jenisKado = btn.closest('.gift-item').dataset.type;
    bukaModal(jenisKado);
  });
});

// Tutup via tombol close
modalClose.addEventListener('click', tutupModal);

// Tutup via klik overlay (luar modal)
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) tutupModal();
});

// Tutup via tombol Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
    tutupModal();
  }
});


/* ---- MODAL: Step 1 → Step 2 ---- */
btnLanjut.addEventListener('click', () => {
  const pengirim = inputPengirim.value.trim();
  const penerima = inputPenerima.value.trim();
  const pesan    = inputPesan.value.trim();

  // Validasi sederhana
  if (!pengirim) {
    showError(inputPengirim, 'Masukkan nama kamu dulu ya!');
    return;
  }
  if (!penerima) {
    showError(inputPenerima, 'Masukkan nama penerima kado!');
    return;
  }
  if (!pesan) {
    showError(inputPesan, 'Jangan lupa tulis pesanmu!');
    return;
  }

  // Isi preview
  previewPengirim.textContent = pengirim;
  previewPenerima.textContent = penerima;
  previewPesan.textContent = '"' + pesan + '"';
  previewType.textContent = selectJenis.value;

  // Generate link unik (simulasi)
  const randomId = Math.random().toString(36).substring(2, 9);
  linkKado.value = `https://kadokita.id/kado/${randomId}`;

  // Ke step 2
  step1.classList.add('hidden');
  step2.classList.remove('hidden');
});


/* ---- MODAL: Kembali ke Step 1 ---- */
btnBuatLagi.addEventListener('click', () => {
  step2.classList.add('hidden');
  step1.classList.remove('hidden');
  resetForm();
});


/* ---- COPY LINK ---- */
btnCopy.addEventListener('click', () => {
  const link = linkKado.value;
  navigator.clipboard.writeText(link).then(() => {
    showToast('✅ Link berhasil disalin!');
    btnCopy.textContent = 'Tersalin!';
    setTimeout(() => { btnCopy.textContent = 'Salin'; }, 2000);
  }).catch(() => {
    // Fallback untuk browser yang tidak support clipboard API
    linkKado.select();
    document.execCommand('copy');
    showToast('✅ Link berhasil disalin!');
  });
});


/* ---- SHARE BUTTONS ---- */
btnWa.addEventListener('click', () => {
  const link = linkKado.value;
  const penerima = previewPenerima.textContent;
  const msg = encodeURIComponent(
    `Hei ${penerima}! Ada kado spesial untukmu 🎁\nBuka di sini: ${link}`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
});

btnIg.addEventListener('click', () => {
  // Instagram tidak mendukung deep link share, tampilkan toast panduan
  showToast('📋 Salin link dulu, lalu paste di Instagram Story ya!');
  navigator.clipboard.writeText(linkKado.value).catch(() => {});
});


/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer  = btn.nextElementSibling;
    const isOpen  = btn.getAttribute('aria-expanded') === 'true';

    // Tutup semua yang terbuka
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    // Buka yang diklik (jika belum terbuka)
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});


/* ---- SCROLL ANIMATION (Intersection Observer) ---- */
const fadeUpEls = document.querySelectorAll(
  '.gift-item, .step, .faq-item, .about-card-stack, .acard, .feat, .hero-stats'
);

fadeUpEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeUpEls.forEach(el => observer.observe(el));


/* ---- HERO GIFT CARD: Klik efek ---- */
const heroGiftCard = document.getElementById('heroGiftCard');
if (heroGiftCard) {
  heroGiftCard.addEventListener('click', () => {
    heroGiftCard.style.animation = 'none';
    heroGiftCard.style.transform = 'scale(1.05) rotate(0deg)';
    setTimeout(() => {
      heroGiftCard.style.transform = '';
      heroGiftCard.style.animation = '';
    }, 400);
    showToast('🎁 Buka kado dengan klik "Buat Kado Sekarang"!');
  });
}


/* ---- HELPER FUNCTIONS ---- */

/**
 * Tampilkan pesan error pada input
 */
function showError(inputEl, msg) {
  inputEl.style.borderColor = '#e63946';
  inputEl.focus();

  // Buat atau update pesan error
  let errMsg = inputEl.nextElementSibling;
  if (!errMsg || !errMsg.classList.contains('err-msg')) {
    errMsg = document.createElement('span');
    errMsg.classList.add('err-msg');
    errMsg.style.cssText = 'color:#e63946;font-size:0.78rem;margin-top:4px;display:block;';
    inputEl.parentNode.insertBefore(errMsg, inputEl.nextSibling);
  }
  errMsg.textContent = msg;

  // Hapus error saat user mulai mengetik
  inputEl.addEventListener('input', () => {
    inputEl.style.borderColor = '';
    if (errMsg) errMsg.textContent = '';
  }, { once: true });
}

/**
 * Tampilkan notifikasi toast
 */
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Reset form ke kondisi awal
 */
function resetForm() {
  inputPengirim.value = '';
  inputPenerima.value = '';
  inputPesan.value    = '';
  selectJenis.selectedIndex = 0;
  document.querySelectorAll('.err-msg').forEach(el => el.remove());
  document.querySelectorAll('.modal-form input, .modal-form select, .modal-form textarea')
    .forEach(el => el.style.borderColor = '');
}


/* ---- SMOOTH SCROLL untuk anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
