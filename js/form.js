(function () {
  var form = document.getElementById('repair-form');
  var status = document.getElementById('form-status');
  var COOLDOWN_KEY = 'twinbrother_form_cooldown';
  var COOLDOWN_MS = 60000;

  var LIMITS = {
    name: 100,
    email: 254,
    phone: 20,
    machine: 100,
    message: 2000
  };

  if (!form || !status) return;

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'form__status is-visible form__status--' + type;
  }

  function clearStatus() {
    status.textContent = '';
    status.className = 'form__status';
  }

  function getHCaptchaToken() {
    var field = form.querySelector('textarea[name="h-captcha-response"]');
    return field ? field.value : '';
  }

  function getRemainingCooldown() {
    var lastSubmit = sessionStorage.getItem(COOLDOWN_KEY);
    if (!lastSubmit) return 0;
    var elapsed = Date.now() - parseInt(lastSubmit, 10);
    return Math.max(0, COOLDOWN_MS - elapsed);
  }

  function validateFields() {
    var name = form.querySelector('[name="name"]');
    var email = form.querySelector('[name="email"]');
    var phone = form.querySelector('[name="phone"]');
    var machine = form.querySelector('[name="machine"]');
    var message = form.querySelector('[name="message"]');

    name.value = name.value.trim();
    email.value = email.value.trim();
    phone.value = phone.value.trim();
    machine.value = machine.value.trim();
    message.value = message.value.trim();

    if (!name.value) {
      showStatus('Please enter your name.', 'error');
      name.focus();
      return false;
    }

    if (!email.value) {
      showStatus('Please enter your email address.', 'error');
      email.focus();
      return false;
    }

    if (!message.value) {
      showStatus('Please describe the issue with your machine.', 'error');
      message.focus();
      return false;
    }

    if (name.value.length > LIMITS.name) {
      showStatus('Name is too long (max ' + LIMITS.name + ' characters).', 'error');
      return false;
    }

    if (email.value.length > LIMITS.email) {
      showStatus('Email is too long (max ' + LIMITS.email + ' characters).', 'error');
      return false;
    }

    if (phone.value.length > LIMITS.phone) {
      showStatus('Phone number is too long (max ' + LIMITS.phone + ' characters).', 'error');
      return false;
    }

    if (machine.value.length > LIMITS.machine) {
      showStatus('Machine brand/model is too long (max ' + LIMITS.machine + ' characters).', 'error');
      return false;
    }

    if (message.value.length > LIMITS.message) {
      showStatus('Message is too long (max ' + LIMITS.message + ' characters).', 'error');
      return false;
    }

    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();

    var remaining = getRemainingCooldown();
    if (remaining > 0) {
      var seconds = Math.ceil(remaining / 1000);
      showStatus('Please wait ' + seconds + ' second' + (seconds === 1 ? '' : 's') + ' before submitting again.', 'error');
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!validateFields()) {
      return;
    }

    if (!getHCaptchaToken()) {
      showStatus('Please complete the captcha before submitting.', 'error');
      return;
    }

    var accessKey = form.querySelector('[name="access_key"]').value;
    if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
      showStatus('Form is not configured yet. Add your Web3Forms access key in index.html.', 'error');
      return;
    }

    var submitBtn = form.querySelector('.form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var formData = new FormData(form);
    formData.append('from_name', 'Twin Brother Website');

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.success) {
          sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()));
          showStatus('Thank you! Your repair request has been sent. We\'ll be in touch soon.', 'success');
          form.reset();
        } else {
          showStatus(data.message || 'Something went wrong. Please try again or call us directly.', 'error');
        }
      })
      .catch(function () {
        showStatus('Unable to send your request. Please check your connection or call us directly.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
      });
  });
})();
