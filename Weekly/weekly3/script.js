console.log('==========================');
console.log('HSI STUDENT MANAGEMENT');
console.log('==========================');

let students = [];
let editingId = null;

// Ambil elemen HTML
const studentList = document.getElementById('studentList');
const studentForm = document.getElementById('studentForm');
const studentName = document.getElementById('studentName');
const studentScore = document.getElementById('studentScore');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const alertMessage = document.getElementById('alertMessage');
const totalStudents = document.getElementById('totalStudents');
const averageScore = document.getElementById('averageScore');

// Ambil data dari LocalStorage
const savedStudents = localStorage.getItem('students');

if (savedStudents) {
  students = JSON.parse(savedStudents);
}

// Simpan Array ke LocalStorage
function saveStudents() {
  localStorage.setItem('students', JSON.stringify(students));
}

// Tampilkan pesan
function showAlert(message) {
  alertMessage.textContent = message;
  alertMessage.classList.add('show');

  setTimeout(function () {
    alertMessage.textContent = '';
    alertMessage.classList.remove('show');
  }, 3000);
}

// Tampilkan daftar siswa
function renderStudentList() {
  studentList.innerHTML = '';

  if (students.length === 0) {
    studentList.innerHTML =
      "<div class='empty'>Belum ada data siswa</div>";
  } else {
    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      studentList.innerHTML += `
        <div class="student-item">
          <div class="student-name">
            <span class="student-number">${i + 1}.</span>
            ${student.name}
          </div>

          <div class="score">${student.score}</div>

          <div class="action-buttons">
            <button class="edit-btn" type="button" data-id="${student.id}">
              ✏️ Ubah
            </button>

            <button class="delete-btn" type="button" data-id="${student.id}">
              🗑️ Hapus
            </button>
          </div>
        </div>
      `;
    }
  }

  updateStats();
}

// Tambah student
function addStudent() {
  const name = studentName.value.trim();
  const score = Number(studentScore.value);

  const newStudent = {
    id: Date.now(),
    name: name,
    score: score
  };

  students.push(newStudent);

  saveStudents();
  renderStudentList();
  studentForm.reset();

  showAlert('✅ Data siswa ' + name + ' berhasil ditambahkan.');
}

// Edit student
function editStudent(id) {
  const student = students.find(function (item) {
    return item.id === id;
  });

  if (student) {
    editingId = id;

    studentName.value = student.name;
    studentScore.value = student.score;

    formTitle.textContent = '✏️ Ubah Siswa';
    submitBtn.textContent = '💾 Update Siswa';
    cancelBtn.style.display = 'block';

    studentName.focus();
  }
}

// Update student
function updateStudent() {
  const name = studentName.value.trim();
  const score = Number(studentScore.value);

  const student = students.find(function (item) {
    return item.id === editingId;
  });

  if (student) {
    student.name = name;
    student.score = score;

    saveStudents();
    renderStudentList();
    resetForm();

    showAlert('🔄 Data siswa ' + name + ' berhasil diperbarui.');
  }
}

// Delete student
function deleteStudent(id) {
  const student = students.find(function (item) {
    return item.id === id;
  });

  if (!student) {
    return;
  }

  const yakin = confirm(
    'Apakah kamu yakin ingin menghapus siswa ' + student.name + '?'
  );

  if (yakin) {
    students = students.filter(function (item) {
      return item.id !== id;
    });

    saveStudents();
    renderStudentList();

    if (editingId === id) {
      resetForm();
    }

    showAlert('🗑️ Data siswa ' + student.name + ' berhasil dihapus.');
  }
}

// Reset form
function resetForm() {
  editingId = null;
  studentForm.reset();

  formTitle.textContent = '➕ Tambah Siswa';
  submitBtn.textContent = '➕ Tambah Siswa';
  cancelBtn.style.display = 'none';
}

// Update statistik
function updateStats() {
  totalStudents.textContent = students.length;

  if (students.length === 0) {
    averageScore.textContent = 0;
  } else {
    let totalScore = 0;

    for (let i = 0; i < students.length; i++) {
      totalScore += Number(students[i].score);
    }

    const average = totalScore / students.length;
    averageScore.textContent = average.toFixed(1);
  }
}

// Submit form
studentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (editingId === null) {
    addStudent();
  } else {
    updateStudent();
  }
});

// Klik tombol Ubah / Hapus
studentList.addEventListener('click', function (event) {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);

  if (button.classList.contains('edit-btn')) {
    editStudent(id);
  }

  if (button.classList.contains('delete-btn')) {
    deleteStudent(id);
  }
});

// Batal edit
cancelBtn.addEventListener('click', function () {
  resetForm();
});

// Render saat halaman dibuka
renderStudentList();
