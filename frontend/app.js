const API_URL = "https://habitflow-a34m.onrender.com/api/habits";

const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

// Load habits on page load
window.addEventListener("DOMContentLoaded", fetchHabits);

async function fetchHabits() {
  const res = await fetch(API_URL);
  const data = await res.json();
  renderHabits(data);
}

// Add new habit
addHabitBtn.addEventListener("click", async () => {
  const name = habitInput.value.trim();
  if (!name) return alert("Please enter a habit!");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const newHabit = await res.json();
  habitInput.value = "";
  fetchHabits();
});

// Toggle completion
async function toggleHabit(id) {
  await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
  fetchHabits();
}

// Delete habit
async function deleteHabit(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchHabits();
}

// Render list
function renderHabits(habits) {
  habitList.innerHTML = "";
  habits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = habit.completed ? "completed" : "";
    li.innerHTML = `
      <span onclick="toggleHabit('${habit._id}')">${habit.name}</span>
      <button onclick="deleteHabit('${habit._id}')">❌</button>
    `;
    habitList.appendChild(li);
  });
}
