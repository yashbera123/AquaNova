
document.addEventListener("DOMContentLoaded", ()=>{
  const nav = document.querySelector(".navbar-nav");
  const li = document.createElement("li");
  li.className = "nav-item";
  li.innerHTML = '<a class="nav-link" onclick="navigate(\'pricingSection\', this)">Pricing</a>';
  nav.appendChild(li);
});



  let userType = "";
document.getElementById("userTypeSelect").addEventListener("change", e => {
  userType = e.target.value;
});
  let groundwaterData = [];
  let chart = null;
  let selectedState = "";
  let selectedDistrict = "";


  function showAlert(msg, type="warning", ms=2200){
    const id = "a" + Date.now();
    const wrap = document.getElementById("alertArea");
    const el = document.createElement("div");
    el.id = id;
    el.className = `alert alert-${type} shadow-sm`;
    el.style.transition = "opacity .25s";
    el.innerText = msg;
    wrap.appendChild(el);
    setTimeout(()=> el.style.opacity = "0.0", ms - 300);
    setTimeout(()=> { try{ wrap.removeChild(el); }catch(e){} }, ms);
  }


  function navigate(sectionId, navLinkElem){

    if(sectionId === "predictionSection" && (!selectedState || !selectedDistrict)) {
      showAlert("Please choose a State & District from Home first.", "info");
      showSection("homeSection");

      document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
      return;
    }

    document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
    if(navLinkElem) navLinkElem.classList.add("active");
    showSection(sectionId);
  }

  function generateInsights(rec) {
    const box = document.getElementById("insightsContent");
    box.innerHTML = "";

    const banner = document.getElementById("userTypeBanner");
    const span = document.getElementById("activeUserType");
    span.textContent = userType.charAt(0).toUpperCase() + userType.slice(1);

    banner.className = "alert text-center mt-2 mb-3"; // reset
    if(userType === "policymaker") banner.classList.add("alert-info");
    else if(userType === "researcher") banner.classList.add("alert-warning");
    else if(userType === "planner") banner.classList.add("alert-success");

    banner.style.opacity = 0;
    banner.style.display = "block";
    requestAnimationFrame(() => { 
        banner.style.opacity = 1; 
    });

    let insights = [];

    const draftVsAvailability = rec.TotalDraft / (rec.NetAvailability || 1);
    const demandVsAvailability = rec.ProjectedDemand / (rec.NetAvailability || 1);
    const rechargeTrend = rec.Y2023 - rec.Y2022; 
    const stage = rec.StageDevelopment;

    if(userType === "policymaker") {
        if(stage > 70) insights.push("⚠️ High Stage of Development — consider stricter regulations.");
        if(draftVsAvailability > 0.8) insights.push("Water extraction is nearing availability limits — policy review needed.");
        if(demandVsAvailability > 1) insights.push("Projected demand exceeds supply — urgent policy action required.");
        if(rechargeTrend < 0) insights.push("Recharge is declining — consider incentives for recharge programs.");
    }

    if(userType === "researcher") {
        if(rechargeTrend < 0) insights.push("Recharge trend decreasing — investigate rainfall and aquifer response.");
        if(stage > 60 && stage < 90) insights.push("Stage of development rising — study industrial & agricultural impacts.");
        if(Math.abs(rec.TotalDraft - (rec.Y2022 + rec.Y2023)/2) > 50) insights.push("Significant draft vs recharge difference detected — examine extraction patterns.");
        if(draftVsAvailability < 0.5) insights.push("Aquifer under low stress — study potential for sustainable use.");
    }

    if(userType === "planner") {
        if(demandVsAvailability > 0.9) insights.push("Projected shortfall detected — plan irrigation efficiency improvements.");
        if(stage > 80) insights.push("High stress area — plan for alternate water sources (surface, treated wastewater).");
        if(rechargeTrend > 0) insights.push("Recharge improving — opportunities to enhance water storage infrastructure.");
        if(rec.NetAvailability > rec.TotalDraft) insights.push("Surplus availability detected — scale up planned projects responsibly.");
    }

    if(insights.length === 0) insights.push("No extreme conditions detected — continue monitoring regularly.");

    box.innerHTML = "<ul>" + insights.map(i => `<li>${i}</li>`).join("") + "</ul>";
    document.getElementById("insightsSubtitle").textContent =
        `Tailored insights for ${userType.charAt(0).toUpperCase() + userType.slice(1)}`;
  }

  function showSection(id){
    const old = document.querySelector("section.active");
    const next = document.getElementById(id);
    if(old && old.id === id) return;


    if(old){
      old.classList.add("section-exit");
      setTimeout(()=> {
        old.classList.remove("active", "section-exit");
      }, 360);
    }

    next.classList.add("section-enter");
    next.classList.add("active");

    requestAnimationFrame(()=> requestAnimationFrame(()=> next.classList.remove("section-enter")));
  }


  fetch("data.json")
    .then(r => r.json())
    .then(json => {
      groundwaterData = json;
      mapAndNormalize(); 
      populateStates();
    })
    .catch(e => {
      showAlert("Failed to load data.json — drop file alongside index.html", "danger", 4000);
      console.error(e);
    });


  function mapAndNormalize(){
    groundwaterData = groundwaterData.map(rec => {

      if(rec.Y2022 !== undefined) return rec;
      const safe = k => parseFloat(rec[k]) || 0;
      return {
        STATE: rec.STATE || rec.State || rec.state || "",
        District: rec.District || rec.district || rec.DISTRICT || "",
        NetAvailability: safe("Net Annual Ground Water Availability  (Ham)") || safe("NetAnnualGroundWaterAvailability"),
        TotalDraft: safe("Total annual Draft(Ham)") || safe("TotalDraft"),
        StageDevelopment: safe("Stage of Ground Water Develop ment (%)") || safe("StageDevelopment") || 0,
        ProjectedDemand: safe("Projected demand for Domestic and Industrial uses  upto 2025 (Ham)") || safe("ProjectedDemand") || 0,
        Y2022: safe("Recharge from Rainfall during Monsoon season(Ham)") + safe("Recharge From Other Sources during monsoon season(Ham)"),
        Y2023: safe("Recharge from Rainfall during non-monsoon season(Ham)") + safe("Recharge From Other Sources during non-monsoon season(Ham)"),
        Y2024: safe("Annual Replenishable resources(Ham)") || safe("AnnualReplenishableResources") || 0
      };
    });
  }

  function populateStates(){
    const states = [...new Set(groundwaterData.map(d => d.STATE).filter(Boolean))].sort();
    const sel = document.getElementById("stateSelect");

    sel.innerHTML = '<option value="">--Choose State--</option>';
    states.forEach(s => {
      const o = document.createElement("option");
      o.value = s; o.textContent = s;
      sel.appendChild(o);
    });
  }


  document.getElementById("stateSelect").addEventListener("change", (e) => {
    selectedState = e.target.value;
    selectedDistrict = "";
    const districts = [...new Set(groundwaterData.filter(d => d.STATE === selectedState).map(d => d.District).filter(Boolean))].sort();
    const ds = document.getElementById("districtSelect");
    ds.innerHTML = '<option value="">--Choose District--</option>';
    districts.forEach(d => {
      const o = document.createElement("option"); o.value = d; o.textContent = d;
      ds.appendChild(o);
    });
    document.getElementById("goToPrediction").disabled = true;
  });

  document.getElementById("districtSelect").addEventListener("change", (e) => {
    selectedDistrict = e.target.value;
    document.getElementById("goToPrediction").disabled = !selectedDistrict;
  });


  document.getElementById("goToPrediction").addEventListener("click", () => {
    const rec = groundwaterData.find(d => d.STATE === selectedState && d.District === selectedDistrict);
    if(!rec) { showAlert("Record not found for selection", "danger"); return; }
    showMetrics(rec);
    renderChart(rec);

    generateInsights(rec);

    document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));

    const nav = Array.from(document.querySelectorAll(".nav-link")).find(n => n.textContent.trim() === "Predictions");
    if(nav) nav.classList.add("active");
    showSection("predictionSection");
  });


  document.getElementById("backBtn").addEventListener("click", () => {

    document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
    const navHome = Array.from(document.querySelectorAll(".nav-link")).find(n => n.textContent.trim() === "Home");
    if(navHome) navHome.classList.add("active");
    showSection("homeSection");
  });


  document.getElementById("recalcBtn").addEventListener("click", () => {
    const rec = groundwaterData.find(d => d.STATE === selectedState && d.District === selectedDistrict);
    if(!rec) return;
    renderChart(rec);
    showAlert("Prediction recalculated", "success", 1400);
  });


  function showMetrics(rec){
    const container = document.getElementById("metrics");
    container.innerHTML = "";
    const list = [
      {label: "Net Availability", val: rec.NetAvailability},
      {label: "Annual Draft", val: rec.TotalDraft},
      {label: "Stage Development (%)", val: rec.StageDevelopment},
      {label: "Projected Demand", val: rec.ProjectedDemand}
    ];
    list.forEach((f, idx) => {
      const col = document.createElement("div");
      col.className = "col-md-3";
      col.innerHTML = `<div class="metric-card"><h6>${f.label}</h6><p>${f.val}</p></div>`;
      container.appendChild(col);

      setTimeout(()=> {
        col.querySelector(".metric-card").classList.add("show");
      }, 80 * idx);
    });
  }


  function getPredictedTrend(values, futureYears = 3, noisePct = 0.10){
    const n = values.length;
    const x = Array.from({length:n}, (_,i) => i+1);
    const y = values.map(v => parseFloat(v) || 0);
    const x_mean = x.reduce((a,b)=>a+b)/n;
    const y_mean = y.reduce((a,b)=>a+b)/n;
    let num = 0, den = 0;
    for(let i=0;i<n;i++){ num += (x[i]-x_mean)*(y[i]-y_mean); den += (x[i]-x_mean)**2; }
    const m = den === 0 ? 0 : num/den;
    const b = y_mean - m*x_mean;

    const total = n + futureYears;
    return Array.from({length: total}, (_, i) => {
      let base = m*(i+1) + b;
      if(i >= n) base += (Math.random() - 0.5) * (base * noisePct); 
      return parseFloat(base.toFixed(2));
    });
  }


  function renderChart(rec){
    const years = ["2022","2023","2024"];
    const values = [+rec.Y2022 || 0, +rec.Y2023 || 0, +rec.Y2024 || 0];
    const futureCount = 3;
    const predicted = getPredictedTrend(values, futureCount, 0.10);
    const allYears = years.concat(Array.from({length: futureCount}, (_,i) => (parseInt(years.at(-1)) + i + 1).toString()));


    const actualData = [...values, ...Array(futureCount).fill(null)];
    const predictedData = predicted;


    const canvas = document.getElementById("districtChart");
    canvas.parentElement.style.opacity = 0;
    setTimeout(()=> canvas.parentElement.style.opacity = 1, 40);

    if(chart) chart.destroy();
    chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: allYears,
        datasets: [
          { label: "Actual", data: actualData, borderColor: "#00796b", backgroundColor: "rgba(0,121,107,0.16)", fill: true, tension: 0.38, pointRadius: 4 },
          { label: "Predicted", data: predictedData, borderColor: "#ff1744", borderDash: [6,4], pointBackgroundColor: "#ff1744", fill: false, tension: 0.38, pointRadius: 3 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { font: { size: 13 } } } },
        scales: {
          x: { title: { display: true, text: "Year" } },
          y: { title: { display: true, text: "Value (Ham / units in dataset)" }, beginAtZero: false }
        }
      }
    });
  }


  document.addEventListener("DOMContentLoaded", ()=> {

    showSection("homeSection");
  });


    let currentPlan = 'free'; 
    

    document.addEventListener("DOMContentLoaded", ()=>{
      document.querySelectorAll("#pricingSection button").forEach(btn => {
        btn.addEventListener("click", (e)=>{
          const planText = btn.parentElement.querySelector("h5").textContent.toLowerCase();
          currentPlan = planText; 
          showAlert(`${planText.charAt(0).toUpperCase()+planText.slice(1)} plan activated`, 'success');

          showSection('homeSection');
          document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
          const navHome = Array.from(document.querySelectorAll(".nav-link")).find(n => n.textContent.trim() === "Home");
          if(navHome) navHome.classList.add("active");
        });
      });
    });
    

    const originalShowMetrics = showMetrics;
    showMetrics = function(rec){
      originalShowMetrics(rec); 
    
      if(currentPlan === 'free'){
        const metricCards = document.querySelectorAll("#metrics .metric-card");
        metricCards.forEach(card=>{
          if(card.querySelector("h6").textContent.includes("Projected Demand")){
            card.style.display = "none";
          }
        });
      }
    };
    

const originalRenderChart = renderChart;
renderChart = function(rec){
  let futureCount = 3; 
  if(currentPlan === 'free') futureCount = 1;
  else if(currentPlan === 'pro') futureCount = 5;
  else if(currentPlan === 'enterprise') futureCount = 7;

  const years = ["2022","2023","2024"];
  const values = [+rec.Y2022 || 0, +rec.Y2023 || 0, +rec.Y2024 || 0];


  const predictedFull = getPredictedTrend(values, futureCount, 0.10);

  const predictedData = predictedFull.slice(0, values.length + futureCount);

  const allYears = years.concat(
    Array.from({length: futureCount}, (_,i) => (parseInt(years.at(-1)) + i + 1).toString())
  );
  const actualData = [...values, ...Array(futureCount).fill(null)];

  const canvas = document.getElementById("districtChart");
  canvas.parentElement.style.opacity = 0;
  setTimeout(()=> canvas.parentElement.style.opacity = 1, 40);

  if(chart) chart.destroy();
  chart = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: allYears,
      datasets: [
        { label: "Actual", data: actualData, borderColor: "#00796b", backgroundColor: "rgba(0,121,107,0.16)", fill: true, tension: 0.38, pointRadius: 4 },
        { label: "Predicted", data: predictedData, borderColor: "#ff1744", borderDash: [6,4], pointBackgroundColor: "#ff1744", fill: false, tension: 0.38, pointRadius: 3 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { font: { size: 13 } } } },
      scales: {
        x: { title: { display: true, text: "Year" } },
        y: { title: { display: true, text: "Value (Ham / units in dataset)" }, beginAtZero: false }
      }
    }
  });
};

function updatePlanBanner(){
  const banner = document.getElementById("planBanner");
  const nameSpan = document.getElementById("activePlanName");
  nameSpan.textContent = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  banner.style.display = "block";
}


document.querySelectorAll("#pricingSection button").forEach(btn => {
  btn.addEventListener("click", (e)=>{
    const planText = btn.parentElement.querySelector("h5").textContent.toLowerCase();
    currentPlan = planText; 


    const banner = document.getElementById("planBanner");
    const nameSpan = document.getElementById("activePlanName");
    nameSpan.textContent = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
    banner.style.display = "block";

    showAlert(`${planText.charAt(0).toUpperCase()+planText.slice(1)} plan activated`, 'success');


    showSection('homeSection');
    document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
    const navHome = Array.from(document.querySelectorAll(".nav-link"))
                          .find(n => n.textContent.trim() === "Home");
    if(navHome) navHome.classList.add("active");
  });
});


const originalNavigate = navigate;
navigate = function(sectionId, navLinkElem){
  originalNavigate(sectionId, navLinkElem);
  if(sectionId === "predictionSection") updatePlanBanner();
};


