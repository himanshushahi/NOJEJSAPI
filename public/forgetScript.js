const forgetForm = document.getElementById("forgetForm");
// if (forgetForm !== null) {
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

  alert(data.message);
  if (data.success) {
    document.querySelector(".loginContainer").innerHTML = `
        <form id="verifyForm">
            <h1>Verify</h1>
            <input type="Number" name="otp" id="opt" placeholder="Enter OTP We Sent On Your Email">
            <button type="submit" id="send" class="btn">Send</button>
        </form>`;
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
      const mainData = await responce.json();
      alert(mainData.message);
      if (mainData.success) {
        document.querySelector(".loginContainer").innerHTML = `
            <form id="updatePasswordForm">
                <h1>Forgot password</h1>
                <input type="password" name="password" id="password" placeholder="Create New Password">
                <input type="password" name="cpassword" id="cpassword" placeholder="Re-Enter New Password">
                <p id="info" style="color:red;"></p>
                <button type="submit" id="send" class="btn">Create</button>
            </form>`;
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

            const mainData = await responce.json();

            alert(mainData.message);
            if (mainData.success) {
              window.location.href = "/login";
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
// }
