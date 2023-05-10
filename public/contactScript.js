window.onload = async () => {
  document.querySelector(
    ".loginContainer"
  ).innerHTML = `<div class="spinner-container">
  <div class="spinner"></div>
</div>    `;
  const options = {
    method: "GET",
    "Content-Type": "Authorization",
    credentials: "include",
  };

  const responce = await fetch("/user/me", options);

  const data = await responce.json();
  if (data.success) {
    Array.from(button).forEach((e) => {
      e.classList.add("display-none");
    });

    const logoutButton = document.createElement("button");
    logoutButton.id = "logoutButton";
    logoutButton.className = "btn2";
    logoutButton.textContent = "Logout";
    document.querySelector("#buttonSpan").append(logoutButton);

    document.querySelector(".userName").textContent =
      "Welcome " + data.data.name;

    document.querySelector(
      ".loginContainer"
    ).innerHTML = `<form id="contactForm">
    <h1>Contact Us</h1>
    <input type="text" name="name" id="name" placeholder="Enter Your Name" value=${data.data.name}>
    <input type="email" name="email" id="email" placeholder="Enter Your Email" value=${data.data.email}>
    <textarea name="message" id="message" name="message" placeholder="Message"></textarea>
    <button type="submit" id="send" class="btn">Send</button>
</form>`;

    if (logoutButton !== null) {
      logoutButton.addEventListener("click", async (e) => {
        e.preventDefault();
        logoutButton.disabled = true;
        const options = {
          method: "GET",
          "Content-Type": "Authorization",
          credentials: "include",
        };

        const data = await fetch("/user/logout", options);

        const mainData = await data.json();
        infoDiv.innerText = mainData.message;
        if (mainData.success) {
          Array.from(button).forEach((e) => {
            e.classList.remove("display-none");
          });
          e.target.classList.add("display-none");
          NoLoadModal(mainData.success, "success");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          NoLoadModal(mainData.success, "danger");
          logoutButton.disabled = true;
        }
      });
    }
  }
  let contactForm = document.getElementById("contactForm");
  if (contactForm !== null) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let send = document.getElementById("send");
      send.disabled = true;
      const data = {
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        message: document.getElementById("message").value,
      };

      const jsonData = JSON.stringify(data);

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: jsonData,
      };

      const recieveData = await fetch("/user/mail", options);

      const mainData = await recieveData.json();
      infoDiv.innerText = mainData.message;
      if (mainData.success) {
        NoLoadModal(mainData.success, "success");
        send.disabled = false;
      } else {
        NoLoadModal(mainData.success, "danger");
        send.disabled = false;
      }
    });
  }
};
