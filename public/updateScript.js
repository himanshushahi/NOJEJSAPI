
window.onload = async () => {
  document.getElementById("update-div").innerHTML =`<div class="spinner-container">
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

    document.querySelector(".userName").textContent ="Welcome " + data.data.name;

    document.getElementById("update-div").innerHTML = `<form id="updateForm">
    <h1>Update</h1>
    <input type="text" name="name" id="name" placeholder="Enter Your Name" value=${data.data.name}>
    <input type="number" name="age" id="age" placeholder="Enter Your Age" value=${data.data.age}>
    <input type="text" name="city" id="city" placeholder="Enter Your City" value=${data.data.city}>
    <input type="number" name="pin" id="pin" placeholder="Enter Area Pin Code" value=${data.data.pin}>
    <button type="submit" class="btn">Update</button>
</form>`;
  }

  let updateForm = document.getElementById("updateForm");
  if (updateForm !== null) {
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("name").value,
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
      infoDiv.innerText = mainData.message;
      if (mainData.success) {
        NoLoadModal(mainData.success,"success")
      } else {
        NoLoadModal(mainData.success,"danger")
      }
    });
  }
  if (logoutButton !== null) {
    logoutButton.addEventListener("click", async (e) => {
      e.preventDefault();
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
        NoLoadModal(mainData.success,"success");
       setTimeout(()=>{
        window.location.href = "/";
       },2000)
      }else{
        NoLoadModal(mainData.success,"danger")
      }
    });
  }
};
