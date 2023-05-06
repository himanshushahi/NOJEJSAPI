
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

    document.querySelector(".userName").textContent = data.data.name;

    document.getElementById("update-div").innerHTML = `<form id="updateForm">
    <h1>Update</h1>
    <input type="text" name="name" id="name" placeholder="Enter Your Name" value=${data.data.name}>
    <input type="email" name="email" id="email" placeholder="Enter Your Email" value=${data.data.email}>
    <input type="number" name="age" id="age" placeholder="Enter Your Age" value=${data.data.age}>
    <input type="text" name="city" id="city" placeholder="Enter Your City" value=${data.data.city}>
    <input type="number" name="pin" id="pin" placeholder="Enter Area Pin Code" value=${data.data.pin}>
    <button type="submit" id="updateForm" class="btn">Update</button>
</form>`;
  }

  let updateForm = document.getElementById("updateForm");
  if (updateForm !== null) {
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value,
        city: document.getElementById("city").value,
        pin: document.getElementById("pin").value,
      };

      const jsonData = JSON.stringify(data);

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: jsonData,
      };

      const recieveData = await fetch("/user/me", options);

      const mainData = await recieveData.json();
      if (mainData.success) {
        alert(mainData.message);
        window.location.href = "/";
      } else {
        alert(mainData.message);
      }
    });
  }

  if (document.getElementById("logoutButton") !== null) {
    document.getElementById("logoutButton") .addEventListener("click", async (e) => {
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
        window.location.href = "/"
      }
    });
  }

};
