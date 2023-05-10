const forgetForm = document.getElementById("forgetForm");
forgetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = JSON.stringify({
    email: document.getElementById("email").value,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body,
  };

  const responce = await fetch("/user/forget", options);

  const data = await responce.json();
  infoDiv.innerText = data.message;
  if (data.success) {
    NoLoadModal(data.success, "success");
    document.querySelector(".loginContainer").innerHTML = `
        <form id="verifyForm">
            <h1>Verify</h1>
            <input type="Number" name="otp" id="opt" placeholder="Enter OTP We Sent On Your Email">
            <button type="submit" id="send" class="btn">Send</button>
        </form>`;
  }else{
    NoLoadModal(data.success, "danger");
  }

  const verifyForm = document.getElementById("verifyForm");
  if (verifyForm !== null) {
    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const body = JSON.stringify({
        otp: document.getElementById("opt").value,
      });

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: body,
      };

      const responce = await fetch("/user/verify", options);
      const data = await responce.json();
      infoDiv.innerText = data.message;
      if (data.success) {
        NoLoadModal(data.success, "success");
        document.querySelector(".loginContainer").innerHTML = `
            <form id="updatePasswordForm">
                <h1>Forgot password</h1>
                <input type="password" name="password" id="password" placeholder="Create New Password">
                <input type="password" name="cpassword" id="cpassword" placeholder="Re-Enter New Password">
                <p id="info" style="color:red;"></p>
                <button type="submit" id="send" class="btn">Create</button>
            </form>`;
      }else{
        NoLoadModal(data.success, "danger");
      }

      const updatePasswordForm = document.getElementById("updatePasswordForm");

      if (updatePasswordForm !== null) {
        updatePasswordForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const password = document.getElementById("password").value;
          const cpassword = document.getElementById("cpassword").value;
          if (password == cpassword) {
            const body = JSON.stringify({
              password: password,
            });

            const options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: body,
            };

            const responce = await fetch("user/update", options);

            const data = await responce.json();
            infoDiv.innerText = data.message;
            if (data.success) {
              NoLoadModal(data.success ,"success");
              setTimeout(()=>{
                window.location.href = "/login";
              },2000)
            } else {
              NoLoadModal(data.success, "danger");
            }
          } else {
            document.getElementById("info").textContent =
              "Password And Confirm Password Is Not Same Try Again";
          }
        });
      }
    });
  }
});

// function showModal(success, location, addClass) {
//   if (success) {
//     document.getElementById("modalBackground").style.visibility = "visible";
//     document.getElementById("automatic").style.display = "block";
//     infoDiv.classList.add(addClass);
//     document.getElementById("modal").style.transform = "translateY(0%)";
//     let flag = 2;
//     setInterval(() => {
//       document.getElementById("timeSpan").innerText = flag;
//       flag--;
//     }, 1000);
//     setTimeout(() => {
//       window.location.href = location;
//     }, 3000);
//   } else {
//     document.getElementById("modalBackground").style.visibility = "visible";
//     infoDiv.classList.add("danger");
//     document.getElementById("modal").style.transform = "translateY(0%)";
//     document.getElementById("automatic").style.display = "none";
//   }
// }
