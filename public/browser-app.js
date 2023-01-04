function getElement(selection) {
  const element = document.querySelector(selection);

  if (!element) {
    throw new Error(`Please check if your ${selection} exist and try again...`)
  }
  return element;
}

let purchase = [
  { id: 1, name: "fridge", price: 4899 },
  { id: 2, name: "sofa", price: 1299 }
];

let totalAmount = 70590;
let shipping_fee = 1299;

// This is your test publishable API key.
const stripe = Stripe("pk_test_51LcpgsBBG8kFNAV0Zc1DbPRulY9UkcVrQyUWmhtDzJjkkMnyg0P1EOVTHx8UUIrm8MjiyJDZlo0o9QMJC9FlHUyb00VsLkmQzS");

getElement('button').disabled = true;
fetch("/stripe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ purchase, shipping_fee, totalAmount }),
})
  .then(function (result) {
    return result.json();
  })
  .then(function (data) {
    var element = stripe.elements();

    var style = {
      base: {
        color: `#32325d`,
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: `#32325d`
        },
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: `#fa755a`,
      },
    };

    var card = element.create('card', { style: style });

    card.mount('#card-element')

    card.on('change', function (e) {
      getElement('button').disabled = e.empty;
      getElement('#payment-message').textContent = e.error ? e.error.message : '';
    });

    var form = getElement('#payment-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      payWithCard(stripe, card, data.clientSecret);
    })
   
  });

var payWithCard = function (stripe, card, clientSecret) {
  setLoading(true)
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
    },
  })
    .then(function (result) {
      if (result.error) {
        showMessage(result.error.message);
      } else {
        // showMessage("An unexpected error occurred.");
        orderComplete(result.paymentIntent.id);
      }
    })
};
  
var orderComplete = function (paymentIntentId) {
  setLoading(false);
  getElement('.result-message a').setAttribute(
    'href',
    'https://dashboard.stripe.com/test/payments/' + paymentIntentId
  );
  getElement('.result-message').classList.remove('hidden');
  getElement('button').disabled = true;
};

function showMessage(messageText) {
  setLoading(false);
  const messageContainer = getElement("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
};

function setLoading(isLoading) {
  if (isLoading) {
    getElement("button").disabled = true;
    getElement("#spinner").classList.remove("hidden");
    getElement("#button-text").classList.add("hidden");
  } else {
    getElement("button").disabled = false;
    getElement("#spinner").classList.add("hidden");
    getElement("#button-text").classList.remove("hidden");
  }
};
