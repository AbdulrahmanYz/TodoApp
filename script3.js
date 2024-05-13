document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const allBtn = document.getElementById("allBtn");
    const activeBtn = document.getElementById("activeBtn");
    const completedBtn = document.getElementById("completedBtn");
    const clearBtn = document.getElementById("clearBtn");
    let tasks = [];

    addTaskBtn.addEventListener("click", addTask);

    taskList.addEventListener("click", function(e) {
        if (e.target.classList.contains("delete")) {
            deleteTask(e.target.parentElement);
        } else if (e.target.tagName === "LI") {
            toggleTaskCompletion(e.target);
        }
        updateLocalStorage();
    });

    allBtn.addEventListener("click", function() {
        renderTasks("all");
    });

    activeBtn.addEventListener("click", function() {
        renderTasks("active");
    });

    completedBtn.addEventListener("click", function() {
        renderTasks("completed");
    });

    clearBtn.addEventListener("click", function() {
        tasks = tasks.filter(task => !task.completed);
        renderTasks("all");
        updateLocalStorage();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                timestamp: new Date ().toLocaleString()
            };
            tasks.push(task);
            renderTasks("all");
            taskInput.value = "";
            updateLocalStorage();
        }
    }

    function renderTasks(filter) {
        taskList.innerHTML = "";
        const filteredTasks = filterTasks(filter);
        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = `${task.text} (Added: ${task.timestamp})`;
            if (task.completed) {
                li.classList.add("completed");
            }
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete");
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    function deleteTask(taskElement) {
        tasks = tasks.filter(task => task.id !== parseInt(taskElement.dataset.id));
        taskElement.remove();
        updateLocalStorage();
    }

    function toggleTaskCompletion(taskElement) {
        const taskId = parseInt(taskElement.dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        taskElement.classList.toggle("completed");
    }

    function filterTasks(filter) {
        switch (filter) {
            case "all":
                return tasks;
            case "active":
                return tasks.filter(task => !task.completed);
            case "completed":
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }

    function updateLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (storedTasks) {
            tasks = storedTasks;
            renderTasks("all");
        }
    }

    loadTasks();
});
