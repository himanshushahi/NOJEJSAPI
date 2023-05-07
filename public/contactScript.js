window.onload = async () => {
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

    document.querySelector(".userName").textContent = "Welcome " + data.data.name;

    document.getElementById("name").value = data.data.name;
    document.getElementById("email").value = data.data.email;

    if (document.getElementById("logoutButton") !== null) {
      document
        .getElementById("logoutButton")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          const options = {
            method: "GET",
            "Content-Type": "Authorization",
            credentials: "include",
          };

          const data = await fetch("/user/logout", options);

          const mainData = await data.json();
          console.log(mainData);

          if (mainData.success) {
            alert(mainData.message);
            Array.from(button).forEach((e) => {
              e.classList.remove("display-none");
            });
            e.target.classList.add("display-none");
            window.location.href = "/";
          } else {
            alert(mainData.message);
          }
        });
    }
  } else {
    alert(data.message);
  }
};

const contactForm = document.getElementById("contactForm");

if (contactForm !== null) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
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
    alert(mainData.message)
  });
}
