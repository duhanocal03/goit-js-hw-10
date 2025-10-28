  // Elements
    const datetimePicker = document.querySelector('#datetime-picker');
    const startBtn = document.querySelector('[data-start]');
    const daysEl = document.querySelector('[data-days]');
    const hoursEl = document.querySelector('[data-hours]');
    const minutesEl = document.querySelector('[data-minutes]');
    const secondsEl = document.querySelector('[data-seconds]');

    // State
    let userSelectedDate = null;
    let countdownInterval = null;

    // flatpickr options (as specified)
    const options = {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose(selectedDates) {
        // selectedDates is an array; take first
        const picked = selectedDates[0];
        if (!picked) return;

        // Store and validate
        const now = new Date();
        if (picked <= now) {
          userSelectedDate = null;
          startBtn.disabled = true;
          iziToast.warning({
            title: 'Danger',
            message: 'Please choose a date in the future',
            position: 'topRight',
            timeout: 3000
          });
          return;
        }

        userSelectedDate = picked;
        startBtn.disabled = false;
      },
    };

    const fp = flatpickr(datetimePicker, options);

    // ms çeviricileri
    function convertMs(ms) {
      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const days = Math.floor(ms / day);
      const hours = Math.floor((ms % day) / hour);
      const minutes = Math.floor(((ms % day) % hour) / minute);
      const seconds = Math.floor((((ms % day) % hour) % minute) / second);

      return { days, hours, minutes, seconds };
    }

    // Helper: pad numbers to at least 2 digits (but allow days > 2 digits)
    function addLeadingZero(value) {
      const str = String(value);
      return str.length < 2 ? str.padStart(2, '0') : str;
    }

    // Update UI with the converted values
    function updateUI({ days, hours, minutes, seconds }) {
      // Days can be more than two digits, but if single-digit add leading zero
      daysEl.textContent = addLeadingZero(days);
      hoursEl.textContent = addLeadingZero(hours);
      minutesEl.textContent = addLeadingZero(minutes);
      secondsEl.textContent = addLeadingZero(seconds);
    }

    // başlat butonu
    startBtn.addEventListener('click', () => {
      if (!userSelectedDate) return;

      // Once started, disable controls as required
      startBtn.disabled = true;
      datetimePicker.disabled = true;
      // If you want to prevent opening the calendar too: destroy flatpickr instance so user cannot change
      try { fp.close(); fp.destroy(); } catch (e) {}

      // Run immediately (so UI updates without 1s delay)
      tick();
      countdownInterval = setInterval(tick, 1000);
    });

    // The repeated tick function
    function tick() {
      const now = new Date();
      const delta = userSelectedDate - now;

      if (delta <= 0) {
        // Time's up
        clearInterval(countdownInterval);
        updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        iziToast.success({ title: 'Bitti', message: 'The countdown has reached the target date.', position: 'topRight', timeout: 3000 });
        return;
      }

      const time = convertMs(delta);
      updateUI(time);
    }

    // Ensure Start button is disabled at load
    startBtn.disabled = true;

    // Accessibility: if user presses Enter while input focused and a valid date chosen, start
    datetimePicker.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !startBtn.disabled) {
        startBtn.click();
      }
    });