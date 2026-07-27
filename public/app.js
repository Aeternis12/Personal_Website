const messageList = document.querySelector("#messages");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    getWeather();

    const themeToggleInput = document.querySelector("#dark-mode-toggle");
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";

    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      if (themeToggleInput) themeToggleInput.checked = true;
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      if (themeToggleInput) themeToggleInput.checked = false;
    }

    if (themeToggleInput) {
      themeToggleInput.addEventListener("change", (event) => {
        const newTheme = event.target.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      });
    }
  } catch (error) {
    console.error("Error", error);
  }
});

const navbarToggleButton = document.querySelector("#navbar-toggle");
const navLinks = document.querySelector("#nav-links");
if (navbarToggleButton && navLinks) {
  navbarToggleButton.textContent = "\u2715";
  navbarToggleButton.classList.add("activated");
  navbarToggleButton.addEventListener("click", () => {
    navLinks.classList.toggle("hide");
    navbarToggleButton.classList.toggle("hide");

    if (navbarToggleButton.classList.contains("hide")) {
      navbarToggleButton.textContent = "\u2630";
      navbarToggleButton.setAttribute("aria-label", "Close navigation menu");
    } else {
      navbarToggleButton.textContent = "\u2715";
      navbarToggleButton.setAttribute("aria-label", "Open navigation menu");
    }
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.querySelector("#contactName");
    const email = document.querySelector("#contactEmail");
    const message = document.querySelector("#contactMessage");
    const subject = document.querySelector("#subject");
    const newsCheck = document.querySelector("#news-checkbox");
    const statusMessage = document.querySelector("#form-status");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          message: message.value,
          subject: subject.value,
          newsCheck: newsCheck.checked,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      contactForm.reset();

      if (statusMessage) {
        statusMessage.classList.add("success");
        statusMessage.textContent = "Thanks - Your message was sent!";
      }
    } catch (error) {
      console.error(error);
      if (statusMessage) {
        statusMessage.classList.remove("success");
        statusMessage.textContent = "Message failed to send. Please try again.";
      }
    }
  });
}

function renderMessages(messages) {
  if (messageList) {
    messageList.textContent = "";
    if (messages.length === 0) {
      const noMessages = document.createElement("h3");
      noMessages.id = "no-messages";
      noMessages.textContent = "No messages found";
      messageList.append(noMessages);
      return;
    }

    messages.forEach((message) => {
      const li = document.createElement("li");
      li.classList.add("card");
      const messageHeader = document.createElement("div");
      messageHeader.classList.add("message-header");

      const subject = document.createElement("h3");
      if (message.subject === "Select a Subject") {
        subject.textContent = "No Subject";
      } else {
        subject.textContent = message.subject;
      }

      const sender = document.createElement("div");
      sender.classList.add("message-sender");

      const name = document.createElement("strong");
      name.classList.add("name");
      name.textContent = message.name;

      const email = document.createElement("a");
      email.classList.add("email");
      email.href = `mailto:${message.email}`;
      email.textContent = message.email;

      sender.append(name, " (", email, ")");
      messageHeader.append(subject, sender);

      const messageBody = document.createElement("div");
      messageBody.classList.add("message-body");

      const messageText = document.createElement("p");
      messageText.textContent = message.message;

      messageBody.append(messageText);

      li.append(messageHeader, messageBody);
      messageList.append(li);
    });
  }
}

async function loadMessages() {
  if (messageList) {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const messages = await res.json();
      renderMessages(messages);
    } catch (error) {
      console.error(error);
    }
  }
}

if (messageList) {
  loadMessages();
}

async function getWeather() {
  const weatherSection = document.querySelector("#weather");

  if (weatherSection) {
    const stationId = "KTLH";
    const url = `https://api.weather.gov/stations/${stationId}/observations/latest`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "LandonMartinPortfolio" },
      });
      console.log(res);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const tempC = data.properties.temperature.value;
      const tempF = Math.round((tempC * 9) / 5 + 32);
      console.log(`Current Tallahassee Temperature: ${tempF} Degrees`);
      console.log(data);

      if (weatherSection) {
        const weatherSymbol = document.querySelector("#weather-symbol");
        const temperature = document.querySelector("#temperature");
        temperature.textContent = `${tempF}\u00B0F`;
        weatherSymbol.textContent = "\u2600";
      }
    } catch (error) {
      console.error(`Error getting weather:`, error);
    }
  }
}

const currentPath = window.location.pathname;
const allNavLinks = document.querySelectorAll("nav a");
allNavLinks.forEach((link) => {
  const path = link.getAttribute("href");
  if (path === currentPath || (currentPath === "/" && path === "/index.html")) {
    link.classList.add("active");
  }
});
