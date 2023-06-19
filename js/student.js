let query = new URLSearchParams(location.search);
let teacherId = query.get("teacher");

const TeacharRow = document.querySelector(".categories-row");
const pupilGroup = document.getElementById("pupilGroup");
const FilterGroup = document.getElementById("filterGroup");
const categoryForm = document.querySelector(".category-form");
const categoryModal = document.querySelector("#categoryModal");
const modalBtnedit = document.getElementById("sendBtn");
const addBtn = document.getElementById("add-btn");
const searchInput = document.querySelector("#search");
const pagination = document.querySelector(".pagination");
const formElements = categoryForm.elements;
const Groups = ["Google", "Microsoft", " Empire", "FCB", "N102", "PRO"];
let selected = null;
let page = 1;
const LIMIT = 6;
let group = "all";

function getCategoryCard({
  avatar,
  createdAt,
  id,
  email,
  phoneNumber,
  lastName,
  isMarried,
  groups,
  firstName,
}) {
  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
  <div class="card">
    <img src=${avatar} class="card-img-top" alt="" />
    <div class="card-body">
      <h5 class="card-title">${firstName}</h5>
      <h6 class="card-text">${lastName}</h6>
      <p class="card-text">${email}</p>
      <div class="groups">${groups ? groups : groups} Group</div>
      <div class="card-tel">${phone}</div>
      <h6 class="isMarried">${isMarried ? "Married" : "Not Married"}</h6>
      <button
        class="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#categoryModal"
        onclick="editCategory(${id})"
      >
        Edit
      </button>
      <button class="btn btn-danger" onclick="deleteCategory(${id})">Delete</button>
    </div>
  </div>
</div>
  `;
}
function getCategories() {
  TeacharRow.innerHTML = "...loading";
  const search = searchInput.value;
  // axios(ENDPOINT + "category")

  axiosInstance(`student?page=${page}&limit=${LIMIT}&firstName=${search}`)
    .then((res) => {
      let categories = res.data;

      axiosInstance(`student`).then((res) => {
        let pages;
        pages = Math.ceil(res.data.length / LIMIT);

        if (pages > 1) {
          pagination.innerHTML = `<li class="page-item ">
              <a class="page-link bg-warning" href="#" aria-label="Previous" onClick="getPage(${
                page - 1
              })">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>`;

          for (let i = 1; i <= pages; i++) {
            pagination.innerHTML += `<li class="page-item  ${
              i == page ? "active" : ""
            }"
                  onClick="getPage(${i})">
                  <button class="page-link" onClick="getPage(${i})">${i}</button>
                </li>`;
          }

          pagination.innerHTML += `<li class="page-item">
              <button class="page-link bg-success" href="#" aria-label="Next" onClick="getPage(${
                page + 1
              })">
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>`;
        } else {
          pagination.innerHTML = "";
        }
      });

      TeacharRow.innerHTML = "";
      let result = categories;
      if (group !== "all") {
        result = categories.filter((category) =>
          category.groups.includes(group.trim())
        );
      }
      result.forEach((category) => {
        TeacharRow.innerHTML += getCategoryCard(category);
      });
    })
    .catch((err) => {
      alert(err.response.data);
      TeacharRow.innerHTML = "";
    });
}

function getPage(p) {
  page = p;
  getCategories();
}

getCategories();

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let groups = formElements.groups.value;
  let avatar = formElements.avatar.value;
  // let createdAt = formElements.createdAt.value;
  let id = formElements.id.value;
  let email = formElements.email.value;
  let phoneNumber = formElements.phoneNumber.value;
  let lastName = formElements.lastName.value;
  let isMarried = formElements.isMarried.checked;
  let firstName = formElements.firstName.value;

  let data = {
    firstName,
    lastName,
    avatar,
    email,
    phoneNumber,
    // createdAt,
    groups,
    id,
    isMarried,
  };

  console.log(data);
  // axios.post(ENDPOINT + "teacher", data).then((res) => {
  //     bootstrap.Modal.getInstance(categoryModal).hide();
  //     getCategories();
  // })
  if (selected === null) {
    axiosInstance.post("student", data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      getCategories();
    });
  } else {
    axiosInstance.put(`student/${selected}`, data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      getCategories();
    });
  }
});

async function editCategory(id) {
  selected = id;
  let student = await axiosInstance(`student/${id}`);
  formElements.groups.value = student.data.groups;
  formElements.avatar.value = student.data.avatar;
  formElements.createdAt.value = student.data.createdAt;
  formElements.id.value = student.data.id;
  formElements.email.value = student.data.email;
  formElements.phoneNumber.value = student.data.phoneNumber;
  formElements.lastName.value = student.data.lastName;
  formElements.isMarried.checked = student.data.isMarried;
  formElements.firstName.value = student.data.firstName;
  modalBtnedit.innerHTML = "Edited";
}

addBtn.addEventListener("click", function () {
  selected = null;
  modalBtnedit.innerHTML = "Add category";
  categoryForm.reset();
});
async function deleteCategory(id) {
  let check = confirm("Are you serious? 😎");
  if (check) {
    await axiosInstance.delete(`student/${id}`);
    getCategories();
  }
}

FilterGroup.addEventListener("change", function () {
  group = this.value;
  getCategories();
});

function getGrupOutput(groupsoha) {
  return `<option value=${groupsoha}>${groupsoha}</option>`;
}
FilterGroup.innerHTML = `<option value="all">All</option>`;
let gropOption = "";

Groups.forEach((groupsoha) => {
  gropOption += getGrupOutput(groupsoha);
});

FilterGroup.innerHTML += gropOption;
pupilGroup.innerHTML = gropOption;

searchInput.addEventListener("keyup", function () {
  search = this.value;
  getCategories();
});
