const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

let habits = [];

// Add new habit
addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();
  if (habitName === "") return alert("Please enter a habit!");

  const habit = {
    id: Date.now(),
    name: habitName,
    completed: false,
  };

  habits.push(habit);
  habitInput.value = "";
  renderHabits();
});

// Toggle completion
function toggleHabit(id) {
  const habit = habits.find((h) => h.id === id);
  habit.completed = !habit.completed;
  renderHabits();
}

// Delete habit
function deleteHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  renderHabits();
}

// Render list
function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = habit.completed ? "completed" : "";
    li.innerHTML = `
      <span onclick="toggleHabit(${habit.id})">${habit.name}</span>
      <button onclick="deleteHabit(${habit.id})">❌</button>
    `;
    habitList.appendChild(li);
  });
}
