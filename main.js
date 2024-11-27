const todoList = document.getElementById("todo-list");
const addTaskButton = document.getElementById("add-task-btn");
const descriptionInput = document.getElementById("todo-description"); 
const priorityInput = document.getElementById("todo-priority");
const dateInput = document.getElementById("todo-date");
const timeInput = document.getElementById("todo-time");
const searchBar = document.getElementById("search-bar");
const filterSelect = document.getElementById("filter-container");
const sortOptions = document.getElementById("sort-options");


let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(filter = "all", searchQuery = "") {
  todoList.innerHTML = ""; 

  let filteredTodos = todos.filter((todo) => {
    if (filter === "Done") return todo.status === "Done";
    if (filter === "not done") return todo.status === "Not Done";
    if (filter === "Overdue") {
      const todoDate = new Date(`${todo.date}T${todo.time}`);
      return todoDate < new Date() && todo.status === "Not Done";
    }
    if (filter === "urgent") return todo.priority === "urgent";
    if (filter === "normal") return todo.priority === "normal";
    if (filter === "not urgent") return todo.priority === "not urgent";
    return true;
  });

  if (searchQuery) {
    filteredTodos = filteredTodos.filter((todo) =>
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort todos yang dipilih
  if (sortOptions.value === "priority") {
    const priorityOrder = { urgent: 1, normal: 2, "not urgent": 3 };
    filteredTodos.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  } else if (sortOptions.value === "time") {
    filteredTodos.sort((a, b) =>
      new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );
  } else if (sortOptions.value === "Alphabetical") {
    filteredTodos.sort((a, b) =>
      a.description.localeCompare(b.description)
    );
  } else if (sortOptions.value === "status") {
    filteredTodos.sort((a, b) =>
      a.status.localeCompare(b.status)
    );
  }

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span><strong>${todo.description}</strong></span>
      <span>Priority: ${todo.priority}</span>
      <span>${todo.date} ${todo.time}</span>
      <span>Status: ${todo.status}</span>
      <button class="done-btn">${todo.status === "Not Done" ? "Task Done" : "Undo"}</button>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    // Tombol Task Done/Undo
    li.querySelector(".done-btn").addEventListener("click", () => {
      todos[index].status = todos[index].status === "Not Done" ? "Done" : "Not Done";
      saveTodos();
      renderTodos(filter, searchQuery);
    });

    // Tombol Edit
    li.querySelector(".edit-btn").addEventListener("click", () => {
      descriptionInput.value = todo.description;
      priorityInput.value = todo.priority;
      dateInput.value = todo.date;
      timeInput.value = todo.time;

      // Hapus todo yang sedang diedit
      todos.splice(index, 1);
      saveTodos();
      renderTodos(filter, searchQuery);
    });

    // Tombol Delete
    li.querySelector(".delete-btn").addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos(filter, searchQuery);
    });

    todoList.appendChild(li);
  });
}


addTaskButton.addEventListener("click", () => {
  const description = descriptionInput.value.trim();
  const priority = priorityInput.value;
  const date = dateInput.value;
  const time = timeInput.value;

  if (!description || !date || !time) {
    alert("Please fill out all fields!");
    return;
  }

  todos.push({
    description,
    priority,
    date,
    time,
    status: "Not Done",
  });

  saveTodos();
  renderTodos();

  descriptionInput.value = "";
  priorityInput.value = "urgent";
  dateInput.value = "";
  timeInput.value = "";
});

searchBar.addEventListener("input", (e) => {
  const searchQuery = e.target.value;
  renderTodos(filterSelect.value, searchQuery);
});

filterSelect.addEventListener("change", (e) => {
  const filter = e.target.value;
  renderTodos(filter);
});

sortOptions.addEventListener("change", () => {
  renderTodos(filterSelect.value, searchBar.value);
});

renderTodos();
