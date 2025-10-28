// Form ve giriş alanlarını seçiyoruz
const form = document.querySelector('.form');
const delayInput = form.querySelector('input[name="delay"]');
const stateRadios = form.querySelectorAll('input[name="state"]');


// Form gönderildiğinde Promise oluşturulacak
form.addEventListener('submit', (e) => {
e.preventDefault(); // Sayfanın yenilenmesini engeller


// Kullanıcının girdiği gecikme değerini al
const delay = Number(delayInput.value);
// Hangi radyo seçilmiş onu bul
const state = [...stateRadios].find(r => r.checked)?.value;


if (!delay || !state) return;


// Yeni bir Promise oluşturuluyor
const promise = new Promise((resolve, reject) => {
// Kullanıcının belirttiği süre kadar bekle
setTimeout(() => {
if (state === 'fulfilled') {
resolve(delay);
} else {
reject(delay);
}
}, delay);
});


// Promise sonucuna göre bildirim göster
promise
.then((delay) => {
// Başarılı durum bildirimi
iziToast.success({
title: '',
message: `Fulfilled promise in ${delay}ms`,
position: 'topRight',
timeout: 3000
});
})
.catch((delay) => {
// Başarısız durum bildirimi
iziToast.error({
title: '',
message: `Rejected promise in ${delay}ms`,
position: 'topRight',
timeout: 3000
});
});


// Formu sıfırlayalım
form.reset();
});