// Wait for the entire DOM to load before running script
document.addEventListener("DOMContentLoaded", () => {
  // Select form and input fields
  const form = document.getElementById("studentForm");
  const nameInput = document.getElementById("name");
  const idInput = document.getElementById("studentId");
  const emailInput = document.getElementById("email");
  const contactInput = document.getElementById("contact");
  const tableBody = document.getElementById("recordTable");

  // Load student data from localStorage or start with an empty array
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let editIndex = null; // To track the current index being edited

  // Function to render all student entries in the table
  function renderStudents() {
    tableBody.innerHTML = "";

    // Show default message if no students exist
    if (students.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;">No students registered yet.</td></tr>';
      return;
    }

    // Generate table rows for each student
    students.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.id}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td>
          <button class="edit-btn" onclick="editStudent(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Save the current students array to localStorage
  function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
  }

  // Make editStudent function globally accessible (via inline HTML)
  window.editStudent = function (index) {
    const student = students[index];
    nameInput.value = student.name;
    idInput.value = student.id;
    emailInput.value = student.email;
    contactInput.value = student.contact;
    editIndex = index;

    // Change button text to "Update"
    document.querySelector(".register-btn").innerHTML =
      '<i class="fas fa-save"></i> Update';
  };

  // Delete a student by index
  window.deleteStudent = function (index) {
    if (confirm("Are you sure you want to delete this record?")) {
      students.splice(index, 1);
      saveToLocalStorage();
      renderStudents();
      showNotification("Record deleted successfully!", "error");
    }
  };

  // Validate form inputs before submission
  function validateInputs() {
    const nameRegex = /^[A-Za-z ]+$/;
    const idRegex = /^\d+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^\d{10}$/;

    // Check for empty fields
    if (
      !nameInput.value.trim() ||
      !idInput.value.trim() ||
      !emailInput.value.trim() ||
      !contactInput.value.trim()
    ) {
      showNotification("All fields are required.", "error");
      return false;
    }

    // Validate name (letters only)
    if (!nameRegex.test(nameInput.value.trim())) {
      showNotification("Name must contain only letters.", "error");
      return false;
    }

    // Validate ID (digits only)
    if (!idRegex.test(idInput.value.trim())) {
      showNotification("Student ID must be a number.", "error");
      return false;
    }

    // Validate email format
    if (!emailRegex.test(emailInput.value.trim())) {
      showNotification("Enter a valid email.", "error");
      return false;
    }

    // Validate contact number (10 digits)
    if (!contactRegex.test(contactInput.value.trim())) {
      showNotification("Contact number must be 10 digits.", "error");
      return false;
    }

    // Prevent duplicate student ID (only for new entries)
    if (
      editIndex === null &&
      students.some((s) => s.id === idInput.value.trim())
    ) {
      showNotification("Student ID already exists.", "error");
      return false;
    }

    return true; // All validations passed
  }

  // Clear the form after submit or cancel
  function clearForm() {
    nameInput.value = "";
    idInput.value = "";
    emailInput.value = "";
    contactInput.value = "";
    editIndex = null;

    // Reset button text to "Register"
    document.querySelector(".register-btn").innerHTML =
      '<i class="fas fa-paper-plane"></i> Register';
  }

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    // Stop if validation fails
    if (!validateInputs()) return;

    const newStudent = {
      name: nameInput.value.trim(),
      id: idInput.value.trim(),
      email: emailInput.value.trim(),
      contact: contactInput.value.trim(),
    };

    if (editIndex !== null) {
      // Update existing student
      students[editIndex] = newStudent;
      showNotification("Student updated successfully!", "success");
    } else {
      // Add new student
      students.push(newStudent);
      showNotification("Student registered successfully!", "success");
    }

    saveToLocalStorage(); // Persist changes
    renderStudents(); // Refresh list
    clearForm(); // Reset form

    // Scroll to student list smoothly
    document
      .getElementById("studentList")
      .scrollIntoView({ behavior: "smooth" });
  });

  // Show success or error alert
  function showNotification(message, type) {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.className = `alert ${type}`;
    document.body.appendChild(alert);

    // Remove alert after 3 seconds
    setTimeout(() => alert.remove(), 3000);
  }

  // Initial render of saved students (if any)
  renderStudents();
});
