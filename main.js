// data of employees
let employees = [
  { id: 1,
    name: "Erfan",
    role: "Frontend Developer", 
    status: "Active" 
  },

  { id: 2, 
    name: "Ali", 
    role: "System Anlisys", 
    status: "On Leave" 
  },

  { id: 3, 
    name: "Ahmed", 
    role: "Manager", 
    status: "Active" 
  },
];

let trash = [];
// DOM elements
const employeeForm = document.getElementById("employeeForm");
const employeeList = document.querySelector("#employeeList");
const trashList = document.getElementById("trashList");
const toggleTrashBtn = document.getElementById("toggleTrash");
const hideTrashBtn = document.getElementById("hideTrash");
const trashSection = document.getElementById("trashSection");
const activeCount = document.getElementById("activeCount");
const trashCount = document.getElementById("trashCount");
const dateElement = document.querySelector("#date");

// Initialize the app
function initApp() {
  showEmployees();
  updateCounters();

  employeeForm.addEventListener("submit", emplyeeForm);
  toggleTrashBtn.addEventListener(
    "click",
    () => (trashSection.style.display = "block")
  );
  hideTrashBtn.addEventListener(
    "click",
    () => (trashSection.style.display = "none")
  );

  employeeList.addEventListener("click", handleEmployeeAction);
  trashList.addEventListener("click", handleTrashAction);
}

function emplyeeForm(e) {
  // تختص بالتعامل مع الاضافة موضف جديد
  e.preventDefault(); /// لمنع إعادة تحميل الصفحة عند إرسال النموذج
  //تخزين القيم المدخلة في الفورم  مع حذف المسافات في حقل الاسم و الدور
  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim();
  const status = document.getElementById("status").value;

  // التحقق من اليبانات المدخلة في النموذج
  if (!validateForm(name, role, status)) {
    return;
  }

  // كائن اضافة موضف جديد
  const newEmployee = {
    id: Date.now(),
    name,
    role,
    status,
  };
  employees.push(newEmployee);
  showEmployees();
  updateCounters();

  employeeForm.reset();
}

// التحقق من صحة النموذج
function validateForm(name, role, status) {
  let isValid = true;

  // التحقق من صحة الاسم
  const nameRegex = /^[a-zA-Z\s]/;
  if (!nameRegex.test(name)) {
    document.getElementById("name").classList.add("input-error");
    document.getElementById("nameError").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("name").classList.remove("input-error");
    document.getElementById("nameError").style.display = "none";
  }

  // التحقق من صحة الدور
  const roleRegex = /^./;
  if (!roleRegex.test(role)) {
    document.getElementById("role").classList.add("input-error");
    document.getElementById("roleError").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("role").classList.remove("input-error");
    document.getElementById("roleError").style.display = "none";
  }

  // التحقق من صحة الحالة
  if (!status) {
    document.getElementById("status").classList.add("input-error");
    document.getElementById("statusError").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("status").classList.remove("input-error");
    document.getElementById("statusError").style.display = "none";
  }

  return isValid;
}

// عرض الموظفين على الواجهة
function showEmployees() {
  console.time("showEmployees");

  if (employees.length === 0) {
    employeeList.innerHTML = `
                    <tr>
                        <td colspan="4" class="empty-state">
                            <div>📋</div>
                            <h3>No employees found</h3>
                            <p>Add new employees to get started</p>
                        </td>
                    </tr>
                `;
    console.timeEnd("showEmployees");
    return;
  }

  employeeList.innerHTML = "";

  employees.forEach((employee) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", employee.id);

    let badgeClass = "";
    if (employee.status === "Active") badgeClass = "badge-active";
    else if (employee.status === "On Leave") badgeClass = "badge-leave";
    else if (employee.status === "Terminated") badgeClass = "badge-terminated";

    row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.role}</td>
                    <td><span class="badge ${badgeClass}">${employee.status}</span></td>
                    <td class="actions">
                        <button class="btn btn-warning edit-btn">Edit</button>
                        <button class="btn btn-danger delete-btn">Delete</button>
                    </td>
                `;

    employeeList.appendChild(row);
  });

  console.timeEnd("showEmployees");
}

//  عرض قائمة الموظفين المحذوفين
function showTrashList() {
  if (trash.length === 0) {
    trashList.innerHTML = `
                    <tr>
                        <td colspan="4" class="empty-state">
                            <div>🗑️</div>
                            <h3>Trash is empty</h3>
                            <p>Deleted employees will appear here</p>
                        </td>
                    </tr>
                `;
    return;
  }

  trashList.innerHTML = "";

  trash.forEach((employee) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", employee.id);

    let badgeClass = "";
    if (employee.status === "Active") badgeClass = "badge-active";
    else if (employee.status === "On Leave") badgeClass = "badge-leave";
    else if (employee.status === "Terminated") badgeClass = "badge-terminated";

    row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.role}</td>
                    <td><span class="badge ${badgeClass}">${employee.status}</span></td>
                    <td class="actions">
                        <button class="btn btn-success restore-btn">Restore</button>
                        <button class="btn btn-danger permanent-delete-btn">Delete Permanently</button>
                    </td>
                `;

    trashList.appendChild(row);
  });
}

// handle employee actions (edit/delete)
function handleEmployeeAction(e) {
  if (!e.target.matches(".edit-btn") && !e.target.matches(".delete-btn"))
    return;

  const row = e.target.closest("tr");
  const id = parseInt(row.getAttribute("data-id"));
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) return;

  if (e.target.matches(".edit-btn")) {
    editEmployee(employee);
  } else if (e.target.matches(".delete-btn")) {
    deleteEmployee(id);
  }
}

// handle trash actions (restore/permanent delete)
function handleTrashAction(e) {
  if (
    !e.target.matches(".restore-btn") &&
    !e.target.matches(".permanent-delete-btn")
  )
    return;

  const row = e.target.closest("tr");
  const id = parseInt(row.getAttribute("data-id"));
  const employeeIndex = trash.findIndex((emp) => emp.id === id);

  if (employeeIndex === -1) return;

  if (e.target.matches(".restore-btn")) {
    restoreEmployee(employeeIndex);
  } else if (e.target.matches(".permanent-delete-btn")) {
    permanentDeleteEmployee(employeeIndex);
  }
}

// edit an employee
function editEmployee(employee) {
  const newName = prompt("Enter new name:", employee.name);
  if (newName === null) return; // user canceled

  const newRole = prompt("Enter new role:", employee.role);
  if (newRole === null) return;

  const newStatus = prompt(
    "Enter new status (Active, On Leave, Terminated):",
    employee.status
  );
  if (newStatus === null) return;

  // validate status
  if (!["Active", "On Leave", "Terminated"].includes(newStatus)) {
    alert("Invalid status! Please enter one of: Active, On Leave, Terminated");
    return;
  }

  // update employee
  employee.name = newName.trim();
  employee.role = newRole.trim();
  employee.status = newStatus;

  showEmployees();
}

// delete an employee (move to trash)
function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;

  const employeeIndex = employees.findIndex((emp) => emp.id === id);
  if (employeeIndex === -1) return;

  // move to trash
  const [deletedEmployee] = employees.splice(employeeIndex, 1);
  trash.push(deletedEmployee);

  showEmployees();
  showTrashList();
  updateCounters();
}

// restore an employee from trash
function restoreEmployee(index) {
  const [restoredEmployee] = trash.splice(index, 1);
  employees.push(restoredEmployee);

  showEmployees();
  showTrashList();
  updateCounters();
}

// delete an employee as permanently
function permanentDeleteEmployee(index) {
  if (
    !confirm(
      "Are you sure you want to permanently delete this employee? This cannot be undone"
    )
  )
    return;

  trash.splice(index, 1);
  showTrashList();
  updateCounters();
}

// update counters
function updateCounters() {
  activeCount.textContent = employees.length;
  trashCount.textContent = trash.length;
}

// initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
