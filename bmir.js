const fields = ["sex", "age", "height", "weight", "activity"];

/* ---------------- persistence ---------------- */

function save() {
  const data = {};
  fields.forEach(id => data[id] = document.getElementById(id).value);
  localStorage.setItem("bmiApp", JSON.stringify(data));
}

function load() {
  const data = JSON.parse(localStorage.getItem("bmiApp"));
  if (!data) return;
  fields.forEach(id => {
    if (data[id] !== undefined) {
      document.getElementById(id).value = data[id];
    }
  });
}

/* ---------------- math ---------------- */

function calculateBMI(weightKg, heightCm) {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25)   return "Normal weight";
  if (bmi < 30)   return "Overweight";
  return "Obese";
}

function bmiClassname(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25)   return "normalweight";
  if (bmi < 30)   return "overweight";
  return "obese";
}

function calculateBMR(weightKg, heightCm, age, sex) {
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  return sex === "male" ? bmr + 5 : bmr - 161;
}

function calculateHealthyRange(heightCm) {
  let h = heightCm / 100;

  return {
    min: (h * h * 18.5),
    mid: (h * h * 21.75),
    max: (h * h * 25)
  };
}

/* ---------------- main logic ---------------- */

function recalculate() {
  const sex = document.getElementById("sex").value;
  const age = Number(document.getElementById("age").value);
  let height = Number(document.getElementById("height").value);
  let weight = Number(document.getElementById("weight").value);
  const activity = Number(document.getElementById("activity").value);

  const error = document.getElementById("error");
  const result = document.getElementById("result");

  error.textContent = "";
  range.hidden = true;
  result.className = "result"; // Restore default state.
  result.hidden = true;

  // validation without alerts
  if (age <= 0 || height <= 0 || weight <= 0) {
    error.textContent = "Please enter positive values for age, height and weight.";
    return;
  }

  // Range/midpoint
  const healthyRange = calculateHealthyRange(height);

  document.getElementById("healthy-range").textContent =
    healthyRange.min.toFixed(1) + " - " + healthyRange.max.toFixed(1) + " kg";
  document.getElementById("reference-weight").textContent =
    healthyRange.mid.toFixed(1) + " kg";
  range.hidden = false;

  // BMI/BMR and TDEE
  const bmi = calculateBMI(weight, height);
  const bmr = calculateBMR(weight, height, age, sex);
  const tdee = bmr * activity;

  document.getElementById("bmi-value").textContent  = bmi.toFixed(1)
    + " (" + bmiCategory(bmi) + ")";
  document.getElementById("bmr-value").textContent  = Math.round(bmr)
    + " kcal/day";
  document.getElementById("tdee-value").textContent = Math.round(tdee)
    + " kcal/day";

  result.classList.add(bmiClassname(bmi));
  result.hidden = false;

  save();
}

/* ---------------- wiring ---------------- */

// live recalculation: every change triggers recompute
fields.forEach(id => {
  document.getElementById(id).addEventListener("input", recalculate);
  document.getElementById(id).addEventListener("change", recalculate);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

load();
recalculate();

