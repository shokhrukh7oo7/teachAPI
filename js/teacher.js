const catigoryRow = document.querySelector(".categories-row");
const catigoryForm = document.querySelector(".category-form");
const categoryModal = document.querySelector("#categoryModal");
const modalBtn = document.querySelector(".modal-btn");
const addBtn = document.querySelector("#add-btn");
const pagination = document.querySelector(".pagination");
const searchInput = document.querySelector("#search");

const formElements = catigoryForm.elements;

let selected = null;
let page = 1;
let search = "";

function getCategoryCard({
  firstName,
  lastName,
  avatar,
  email,
  groups,
  phone,
  isMarried,
  id,
}) {
  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
  <div class="card">
    <img src=${avatar} class="card-img-top" alt="" />
    <div class="card-body">
      <h5 class="card-title">${firstName}</h5>
      <h6 class="card-text">${lastName}</h6>
      <p class="card-text">${email}💻</p>
      <div class="groups">${groups ? groups : groups} :Group😎</div>
      <div class="card-tel">${phone}📱</div>
      <h6 class="isMarried">${isMarried ? "Married" : "Not Married"}💑</h6>
      <button
        class="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#categoryModal"
        onclick="editCategory(${id})"
      >
        Edit
      </button>
      <button class="btn btn-danger" onclick="deleteCategory(${id})">Delete</button>
      <a class="btn btn-primary" onclick="saveId(${id})" href="student.html?teacher=${id}">See Student ${id}</a>
    </div>
  </div>
</div>
  `;
}

// request("teacher").then((res) => {
//   catigoryRow.innerHTML = "";
//   res.forEach((teacher) => {
//     catigoryRow.innerHTML += getCategoryCard(teacher);
//   });
// });
/* */
// function getCategories() {
//   catigoryRow.innerHTML = "...loading";

//   // axios(ENDPOINT + "teacher")
//   axiosInstance("teacher?page=1&limit")
//     .then((res) => {

//       catigoryRow.innerHTML = "";
//       res.data.forEach((teacher) => {
//         catigoryRow.innerHTML += getCategoryCard(teacher);
//       });
//     })
//     .catch((err) => {
//       alert(err.response.data);
//       catigoryRow.innerHTML = "";
//     });
// }
// getCategories();
/* */
function getCategories() {
  catigoryRow.innerHTML = "...loading";
  // axios(ENDPOINT + "category")
  axiosInstance(`teacher?page=${page}&limit=${LIMIT}&firstName=${search}`)
    .then((res) => {
      let categories = res.data;

      axiosInstance(`teacher?name=${search}`).then((res) => {
        let pages;

        pages = Math.ceil(res.data.length / LIMIT);

        if (pages > 1) {
          pagination.innerHTML = `<li class="page-item">
            <button class="page-link" onClick="getPage(${
              page - 1
            })">Previous</button>
          </li>`;

          for (let i = 1; i <= pages; i++) {
            pagination.innerHTML += `<li class="page-item ${
              i == page ? "active" : ""
            }">
              <button class="page-link" onClick="getPage(${i})">${i}</button>
            </li>`;
          }

          pagination.innerHTML += `<li class="page-item">
            <button class="page-link" onClick="getPage(${
              page + 1
            })">Next</button>
          </li>`;
        } else {
          pagination.innerHTML = "";
        }
      });

      catigoryRow.innerHTML = "";

      categories.forEach((category) => {
        catigoryRow.innerHTML += getCategoryCard(category);
      });
    })
    .catch((err) => {
      alert(err.response.data);
      catigoryRow.innerHTML = "";
    });
}

function getPage(p) {
  page = p;
  getCategories();
}

getCategories();

catigoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let firstName = formElements.firstName.value;
  let lastName = formElements.lastName.value;
  let avatar = formElements.avatar.value;
  let email = formElements.email.value;
  let groups = formElements.groups.value;
  let phone = formElements.phone.value;
  let gridCheck = formElements.gridCheck.checked;
  let id = formElements.id.value;
  let data = {
    firstName,
    lastName,
    avatar,
    email,
    groups,
    phone,
    gridCheck,
    id,
  };
  // request("teacher", {
  //   method: "POST",
  //   body: JSON.stringify(data),
  //   headers: { "content-type": "application/json" },
  // });
  // axios.post(ENDPOINT + "teacher", data).then((res) => {
  //   bootstrap.Modal.getInstance(categoryModal).hide();
  //   getCategories();
  // });
  if (selected === null) {
    axiosInstance.post("teacher", data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      getCategories();
    });
  } else {
    axiosInstance.put(`teacher/${selected}`, data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      getCategories();
    });
  }
});

async function editCategory(id) {
  selected = id;
  let teacher = await axiosInstance(`teacher/${id}`);
  formElements.firstName.value = teacher.data.firstName;
  formElements.lastName.value = teacher.data.lastName;
  formElements.avatar.value = teacher.data.avatar;
  formElements.email.value = teacher.data.email;
  formElements.groups.value = teacher.data.groups;
  formElements.phone.value = teacher.data.phone;
  formElements.gridCheck.value = teacher.data.gridCheck;
  formElements.id.value = teacher.data.id;
  modalBtn.innerHTML = "Save";
}

addBtn.addEventListener("click", function () {
  selected = null;
  modalBtn.innerHTML = "Add category";
  catigoryForm.reset();
});

async function deleteCategory(id) {
  let check = confirm("Are you serious?😎");
  if (check) {
    await axiosInstance.delete(`teacher/${id}`);
    getCategories();
  }
}
searchInput.addEventListener("keyup", function () {
  search = this.value;
  getCategories();
});
function saveId(id) {
  localStorage.setItem("ID", JSON.stringify(id));
}
