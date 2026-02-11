document.getElementById('year').textContent = new Date().getFullYear();

const phoneInputs = document.querySelectorAll('input[type="tel"]');
const masks = [];

phoneInputs.forEach(input => {
    const mask = IMask(input, {
        mask: '+{38} (000) 000-00-00',
        lazy: false
    });
    masks.push(mask);
    input.dataset.maskIndex = masks.length - 1;
});

const TOKEN = "7998577503:AAHK6dcWzWjfkBAp-9CSbgDp3MY47IZlS5I";
const CHAT_ID = "-1003600227487";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

function switchFormType(type) {
    const btnTraining = document.getElementById('btn-training');
    const btnCertificate = document.getElementById('btn-certificate');
    const orderInput = document.getElementById('order_type');
    const levelBlock = document.getElementById('level-block');
    const submitBtn = document.getElementById('submit-btn');
    const commentLabel = document.getElementById('comment-label');

    orderInput.value = type;

    const activeClass = "flex-1 py-3 text-sm font-bold rounded-lg bg-white text-emerald-700 shadow-sm text-center transition-all duration-300 cursor-default";
    const inactiveClass = "flex-1 py-3 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-700 text-center transition-all duration-300 cursor-pointer";

    if (type === 'training') {
        btnTraining.className = activeClass;
        btnCertificate.className = inactiveClass;

        levelBlock.style.maxHeight = "100px";
        levelBlock.style.opacity = "1";
        levelBlock.style.marginBottom = "0px";

        submitBtn.textContent = "Забронювати";
        commentLabel.textContent = "Коментар (опціонально)";
    } else {
        btnCertificate.className = activeClass;
        btnTraining.className = inactiveClass;

        levelBlock.style.maxHeight = "0px";
        levelBlock.style.opacity = "0";
        levelBlock.style.marginBottom = "-16px";

        submitBtn.textContent = "Замовити сертифікат";
        commentLabel.textContent = "На яку суму або послугу?";
    }
}

function activateCertificateMode() {
    const bookSection = document.getElementById('book');
    bookSection.scrollIntoView({behavior: 'smooth'});
    switchFormType('certificate');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const phoneInput = form.querySelector('input[type="tel"]');
    const maskIndex = phoneInput.dataset.maskIndex;
    const currentMask = masks[maskIndex];

    if (currentMask && !currentMask.masked.isComplete) {
        alert('Будь ласка, введіть номер телефону повністю.');
        phoneInput.focus();
        return;
    }

    const nameVal = form.querySelector('[name="name"]').value;
    const commentVal = form.querySelector('textarea').value;

    const orderTypeInput = form.querySelector('[name="order_type"]');
    const isCertificate = orderTypeInput && orderTypeInput.value === 'certificate';

    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\.com|\.net|\.org|\.ru)/i;
    if (urlPattern.test(nameVal) || urlPattern.test(commentVal)) {
        alert('Будь ласка, не додавайте посилання у форму.');
        return;
    }

    let message = "";

    if (isCertificate) {
        message += `<b>🎁 ЗАМОВЛЕННЯ СЕРТИФІКАТУ!</b>\n\n`;
    } else {
        message += `<b>🚀 Нова заявка на тренування!</b>\n\n`;
    }

    message += `👤 <b>Ім'я:</b> ${nameVal}\n`;
    message += `📞 <b>Телефон:</b> ${phoneInput.value}\n`;

    if (!isCertificate) {
        const levelSelect = form.querySelector('select[name="level"]');
        if (levelSelect) {
            message += `📊 <b>Рівень:</b> ${levelSelect.value}\n`;
        }
    }

    if (commentVal) {
        message += `💬 <b>Коментар:</b> ${commentVal}`;
    }

    fetch(URI_API, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'html'
        })
    })
        .then(res => {
            if (res.ok) {
                form.reset();
                currentMask.value = "";
                currentMask.updateValue();

                if (isCertificate) {
                    switchFormType('training');
                }

                showModal();
            } else {
                alert('Сталася помилка. Зателефонуйте нам, будь ласка.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Помилка мережі.');
        });
}

const bookForm = document.getElementById('book-form');
const contactForm = document.getElementById('contact-form');

if (bookForm) bookForm.addEventListener('submit', handleFormSubmit);
if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

const modal = document.getElementById('success-modal');
const modalContent = document.getElementById('modal-content');
let modalTimeout;

function showModal() {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
    modalTimeout = setTimeout(closeModal, 4000);
}

function closeModal() {
    clearTimeout(modalTimeout);
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
}

const gallery = document.getElementById('scrolling-gallery');

function autoScroll() {
    if (gallery.matches(':hover')) return;
    const cardWidth = gallery.firstElementChild.getBoundingClientRect().width;
    const gap = 16;
    if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 10) {
        gallery.scrollTo({left: 0, behavior: 'smooth'});
    } else {
        gallery.scrollBy({left: cardWidth + gap, behavior: 'smooth'});
    }
}

setInterval(autoScroll, 2000);

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("heroVideo");
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
        const p = video.play();
        if (p !== undefined) {
            p.catch(() => {
            });
        }
    };

    tryPlay();

    document.addEventListener("touchstart", tryPlay, {once: true});
    document.addEventListener("click", tryPlay, {once: true});
});

