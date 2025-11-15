const API_URL = "https://habitflow-a34m.onrender.com/api/habits";

const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

const habitsTab = document.getElementById("habitsTab");
const dashboardTab = document.getElementById("dashboardTab");
const habitsSection = document.getElementById("habitsSection");
const dashboardSection = document.getElementById("dashboardSection");

const totalHabitsEl = document.getElementById("totalHabits");
const completedHabitsEl = document.getElementById("completedHabits");
const completionRateEl = document.getElementById("completionRate");

let habits = [];
let chart = null;

// Tabs navigation
habitsTab.addEventListener("click", () => switchTab("habits"));
dashboardTab.addEventListener("click", () => switchTab("dashboard"));

function switchTab(tab) {
  if (tab === "habits") {
    habitsTab.classList.add("active");
    dashboardTab.classList.remove("active");
    habitsSection.style.display = "block";
    dashboardSection.style.display = "none";
  } else {
    dashboardTab.classList.add("active");
    habitsTab.classList.remove("active");
    habitsSection.style.display = "none";
    dashboardSection.style.display = "block";
    updateDashboard();
  }
}

// Fetch habits
window.addEventListener("DOMContentLoaded", fetchHabits);

async function fetchHabits() {
  const res = await fetch(API_URL);
  habits = await res.json();
  renderHabits(habits);
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

// Render habits
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

// Dashboard stats + chart
async function updateDashboard() {
  try {
    const res = await fetch(`${API_URL}/stats`);
    const { total, completed, completionRate } = await res.json();

    totalHabitsEl.textContent = total;
    completedHabitsEl.textContent = completed;
    completionRateEl.textContent = `${completionRate}%`;

    renderChart(completed, total - completed);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
}

// Chart.js
function renderChart(done, pending) {
  const ctx = document.getElementById("habitChart").getContext("2d");

  if (chart) chart.destroy();

  // Read CSS variables so chart colors follow the site's theme (change in styles.css)
  const styles = getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue("--primary").trim() || "#4a90e2";
  const muted = styles.getPropertyValue("--muted").trim() || "#e4ebf5";

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [
        {
          data: [done, pending],
          backgroundColor: [primary, muted],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}
