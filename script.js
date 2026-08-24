// =========================
// Application State
// =========================

let tasks = [];

let currentFilter = "all";

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const categoryInput =
  document.getElementById("categoryInput");

const priorityInput =
  document.getElementById("priorityInput");

const taskList =
  document.getElementById("taskList");

const totalTasks =
  document.getElementById("totalTasks");

const activeTasks =
  document.getElementById("activeTasks");

const completedTasks =
  document.getElementById("completedTasks");

const currentDate =
  document.getElementById("currentDate");

const progressPercentage =
  document.getElementById("progressPercentage");

const progressFill =
  document.getElementById("progressFill");

const progressText =
  document.getElementById("progressText");

function displayDate() {
  const today = new Date();

  currentDate.textContent =
    today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✓</div>

        <h3>Ready to get started?</h3>

        <p>
          Create your first task and take the first step
          toward completing your goals.
        </p>
      </div>
    `;

    return;
  }

  tasks.forEach((task) => {
    const taskElement = document.createElement("article");

    taskElement.className = "task-item";

    if (task.completed) {
      taskElement.classList.add("completed");
    }

    taskElement.innerHTML = `
      <input
        type="checkbox"
        class="task-checkbox"
        data-id="${task.id}"
        ${task.completed ? "checked" : ""}
      >

      <div class="task-content">
        <p class="task-title">${task.title}</p>

        <div class="task-meta">
          <span class="task-tag">${task.category}</span>
          <span class="task-tag">${task.priority} priority</span>
        </div>
      </div>

      <button
        class="delete-task"
        data-id="${task.id}"
        type="button"
      >
        Delete
      </button>
    `;

    taskList.appendChild(taskElement);
  });
}

function updateStatistics() {               // statistics section
  const total = tasks.length;

  const completed =
    tasks.filter(task => task.completed).length;

  const active =
    tasks.filter(task => !task.completed).length;

    const progress =
  total === 0
    ? 0
    : Math.round((completed / total) * 100);

  totalTasks.textContent = total;
  activeTasks.textContent = active;
  completedTasks.textContent = completed;
  progressPercentage.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
  progressText.textContent =
  `${completed} of ${total} tasks completed.`;
}

function addTask(title, category, priority) {           //task creation function
  const newTask = {
    id: Date.now(),
    title: title,
    category: category,
    priority: priority,
    completed: false
  };

  tasks.push(newTask);

  renderTasks();
  updateStatistics();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const category = categoryInput.value;
  const priority = priorityInput.value;

  if (title === "") {
    return;
  }

  addTask(title, category, priority);

  taskForm.reset();
});

taskList.addEventListener("click", (event) => {

  // Complete / uncomplete task
  if (event.target.classList.contains("task-checkbox")) {

    const taskId =
      Number(event.target.dataset.id);

    const task =
      tasks.find(task => task.id === taskId);

    if (!task) {
      return;
    }

    task.completed =
      event.target.checked;

    saveTasks();

    renderTasks();
    updateStatistics();

    return;
  }

  // Delete task
  if (event.target.classList.contains("delete-task")) {

    const taskId =
      Number(event.target.dataset.id);

    tasks =
      tasks.filter(task => task.id !== taskId);

    saveTasks();

    renderTasks();
    updateStatistics();
  }
});


loadTasks();
displayDate();
renderTasks();
updateStatistics();