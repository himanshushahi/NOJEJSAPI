const eye = document.getElementById("eye");
const infoDiv = document.getElementById("infoDiv");

if (eye != undefined) {
  eye.addEventListener("click", () => {
    let passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
      eye.classList.remove("fa-eye");
      eye.classList.remove("fa-sharp");
      eye.classList.add("fa-eye-slash");
      passwordField.type = "text";
    } else {
      passwordField.type = "password";
      eye.classList.add("fa-eye");
      eye.classList.add("fa-sharp");
      eye.classList.remove("fa-eye-slash");
    }
  });
}

function showModal(success,location,addClass) {
  if (success) {
    document.getElementById("modalBackground").style.visibility = "visible";
    document.getElementById("automatic").style.display = "block";
    infoDiv.classList.add(addClass);
    document.getElementById("modal").style.transform = "translateY(0%)";
    let flag = 3;
    setInterval(() => {
      document.getElementById("timeSpan").innerText = flag;
      flag--;
    }, 1000);
    setTimeout(() => {
      window.location.href = location;
    }, 4000);
  } else {
    document.getElementById("modalBackground").style.visibility = "visible";
    infoDiv.classList.add(addClass);
    document.getElementById("modal").style.transform = "translateY(0%)";
    document.getElementById("automatic").style.display = "none";
  }
}

function NoLoadModal(success,addClass){
  if (success) {
    document.getElementById("modalBackground").style.visibility = "visible";
    infoDiv.classList.add(addClass);
    document.getElementById("modal").style.transform = "translateY(0%)";
  } else {
    document.getElementById("modalBackground").style.visibility = "visible";
    infoDiv.classList.add(addClass);
    document.getElementById("modal").style.transform = "translateY(0%)";
  }
}

const registerForm = document.getElementById("Registerform");

if (registerForm !== null) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let password = document.getElementById("password");
    let cpassword = document.getElementById("cpassword");
    let passwordInfo = document.getElementById("password-info");
    if (cpassword.value !== password.value) {
      passwordInfo.textContent = "Please Type Same Password On Both Field";
      passwordInfo.style.display = "inline";
      return;
    }

    passwordInfo.style.display = "none";
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      age: document.getElementById("age").value,
      city: document.getElementById("city").value,
      pin: document.getElementById("pin").value,
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

    const recieveData = await fetch("/user/signup", options);

    const mainData = await recieveData.json();

    infoDiv.innerText = mainData.message;
    if(mainData.success){
      showModal(mainData.success,"/login","success")
    }else{
      showModal(mainData.success,"/signup","danger")
    }
  });
}



let loginForm = document.getElementById("loginform");

if (loginForm !== null) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
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

    const recieveData = await fetch("/user/login", options);

    const mainData = await recieveData.json();
    infoDiv.innerText = mainData.message;
    if (mainData.success) {
     showModal(mainData.success,"/","success")
    } else {
      showModal(mainData.success,"/login","danger")
    }
  });
}

const button = document.getElementsByClassName("loginButton");
const dataDiv = document.getElementById("data-div");
window.onload = async () => {
  dataDiv.innerHTML = `<div class="spinner-container">
  <div class="spinner"></div>
</div>    `;
  const logoutButton = document.createElement("button");
  logoutButton.id = "logoutButton";
  logoutButton.className = "btn2";
  logoutButton.textContent = "Logout";

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

    document.querySelector(".contactUs").classList.remove("display-none");

    document.querySelector("#buttonSpan").append(logoutButton);
    document.querySelector(".userName").textContent =
      "Welcome " + data.data.name;
    dataDiv.innerHTML = ` <table>
    <tr>
        <th>Name</th>
        <td id="nameTd">${data.data.name}</td>
    </tr>
    <tr>
        <th>Email</th>
        <td id="emailTd">${data.data.email}</td>
    </tr>
    <tr>
        <th>Age</th>
        <td id="ageTd">${data.data.age}</td>
    </tr>
    <tr>
        <th>City</th>
        <td id="cityTd">${data.data.city}</td>
    </tr>
    <tr>
        <th>Pin</th>
        <td id="pinTd">${data.data.pin}</td>
    </tr>

</table> <a class="btn2" id="edit" href="/update">Edit</a>`;
  }else{
    dataDiv.innerHTML = "";
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
        showModal(mainData.success,"/","success")
      }else{
        showModal(mainData.success,"/","danger")
      }
    });
  }
};

let cross = document.getElementById("cross");
if (cross !== null) {
  cross.addEventListener("click", () => {
    document.getElementById("modal").style.transform = "translateY(-100%)";
    document.getElementById("modalBackground").style.visibility = "hidden";
    infoDiv.removeAttribute("class");
  });
}
// const imageInput = document.getElementById('imageInput');
// const imagePreview = document.getElementById('imagePreview');

// imageInput.addEventListener('change', (event) => {
//   console.log(event.target.files[0])
//   const file = event.target.files[0];
//   const reader = new FileReader();

//   reader.onload = (event) => {
//     const image = document.createElement('img');
//     image.src = event.target.result;
//     imagePreview.appendChild(image);
//   }

//   reader.readAsDataURL(file);
// });
