document.addEventListener("DOMContentLoaded", () => {
    // Tries to get tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    // If tasks exist in storage, load them
    if (storedTasks) {
        // Clear the existing tasks array and push the stored ones
        tasks.push(...storedTasks);
        updateTasksList();
        updateStats();
    }
});

let tasks = [];

// Saves the current tasks array to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Adds a new task to the list
const addTask = () => {
    // Correctly get element by ID
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

// Toggles the completion status of a task
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

// Deletes a task from the list
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

// Allows editing a task
const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    // Set input value to the task text
    taskInput.value = tasks[index].text;
    // Remove the old task to be replaced by the "new" edited one
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
    // Focus the input field for a better user experience
    taskInput.focus();
};

// Updates the progress bar and task count
const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    // Handle division by zero when there are no tasks
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById('progress');
    const numbers = document.getElementById('numbers');

    // Correctly set the width using template literals
    progressBar.style.width = `${progress}%`;
    // Correctly set the inner text
    numbers.innerText = `${completedTasks} / ${totalTasks}`;

    // Fix typo: 'taska' to 'tasks' and check if there are any tasks
    if (tasks.length > 0 && completedTasks === totalTasks) {
        // Fix typo: 'blaskconfetti' to 'blastConfetti'
        blastConfetti();
    }
};

// Rerenders the entire task list in the UI
const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    // Clear the existing list before rerendering
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        // Note: I fixed the unclosed quote in the deleteTask onClick attribute
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete(${index})">
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="./edit.png" alt="Edit Icon" onclick="editTask(${index})">
                    <img src="./bin.png" alt="Delete Icon" onclick="deleteTask(${index})">
                </div>
            </div>
        `;
        // Appending the newly created list item
        taskList.append(listItem);
    });
};

// Event listener for the "Add Task" button
document.getElementById('newTask').addEventListener('click', function(e) {
    // Prevent the form from submitting and reloading the page
    e.preventDefault();
    addTask();
});

// Function to trigger a confetti effect
// Fix typo: 'blaskconfetti' to 'blastConfetti'
const blastConfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};