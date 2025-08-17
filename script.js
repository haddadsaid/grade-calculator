// Preset classes & weights
const classes = {
  "Algebra II": {
    weights: { tests: 0.5, homework: 0.3, quizzes: 0.2 },
    assignments: []
  },
  "Chemistry": {
    weights: { labs: 0.4, tests: 0.4, homework: 0.2 },
    assignments: []
  },
  "English": {
    weights: { essays: 0.5, homework: 0.25, participation: 0.25 },
    assignments: []
  },
  "History": {
    weights: { projects: 0.3, tests: 0.4, homework: 0.3 },
    assignments: []
  },
  "Spanish": {
    weights: { tests: 0.4, homework: 0.4, participation: 0.2 },
    assignments: []
  },
  "Computer Science": {
    weights: { projects: 0.5, quizzes: 0.3, homework: 0.2 },
    assignments: []
  },
  "PE": {
    weights: { participation: 1.0 },
    assignments: []
  }
};

// Load saved progress
let saved = JSON.parse(localStorage.getItem("grades"));
if (saved) {
  for (let cls in classes) {
    if (saved[cls]) classes[cls].assignments = saved[cls].assignments;
  }
}

// Render UI
function render() {
  const container = document.getElementById("classes");
  container.innerHTML = "";
  
  for (let cls in classes) {
    const div = document.createElement("div");
    div.className = "class-card";
    
    const title = document.createElement("h2");
    title.textContent = cls;
    div.appendChild(title);

    // assignment table
    const table = document.createElement("table");
    const header = `<tr><th>Name</th><th>Category</th><th>Score</th><th>Out Of</th></tr>`;
    table.innerHTML = header;
    
    classes[cls].assignments.forEach(a => {
      let row = document.createElement("tr");
      row.innerHTML = `<td>${a.name}</td><td>${a.category}</td><td>${a.score}</td><td>${a.outOf}</td>`;
      table.appendChild(row);
    });
    div.appendChild(table);

    // Add assignment form
    const form = document.createElement("form");
    form.innerHTML = `
      <input placeholder="Name" required/>
      <select>
        ${Object.keys(classes[cls].weights).map(w => `<option>${w}</option>`).join("")}
      </select>
      <input type="number" placeholder="Score" required/>
      <input type="number" placeholder="Out Of" required/>
      <button>Add</button>
    `;
    form.onsubmit = e => {
      e.preventDefault();
      let [name, cat, score, outOf] = [
        form[0].value,
        form[1].value,
        parseFloat(form[2].value),
        parseFloat(form[3].value)
      ];
      classes[cls].assignments.push({ name, category: cat, score, outOf });
      save();
      render();
    };
    div.appendChild(form);

    // show grade
    let grade = calcGrade(classes[cls]);
    let p = document.createElement("p");
    p.textContent = `Current grade: ${grade.toFixed(2)}%`;
    div.appendChild(p);

    container.appendChild(div);
  }
}

function calcGrade(cls) {
  let totals = {};
  for (let cat in cls.weights) totals[cat] = { earned: 0, possible: 0 };
  
  cls.assignments.forEach(a => {
    if (totals[a.category]) {
      totals[a.category].earned += a.score;
      totals[a.category].possible += a.outOf;
    }
  });
  
  let grade = 0;
  for (let cat in cls.weights) {
    if (totals[cat].possible > 0) {
      grade += (totals[cat].earned / totals[cat].possible) * cls.weights[cat] * 100;
    }
  }
  return grade;
}

function save() {
  localStorage.setItem("grades", JSON.stringify(classes));
}

function resetData() {
  for (let cls in classes) classes[cls].assignments = [];
  save();
  render();
}

render();