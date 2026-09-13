const records = [
  {
    id: "01",
    title: "University Digital Archive",
    category: "General Records",
    status: "Verified",
    date: "2026-04-17",
    desc: "Publicly available information from the university archive.",
  },
  {
    id: "02",
    title: "Campus Research Register",
    category: "Research",
    status: "Verified",
    date: "2026-04-12",
    desc: "Indexed research projects and historical academic references.",
  },
  {
    id: "03",
    title: "Administrative Circulars",
    category: "Administrative",
    status: "Verified",
    date: "2026-03-29",
    desc: "Selected public administrative records.",
  },
  {
    id: "04",
    title: "Student Project Index",
    category: "Research",
    status: "Verified",
    date: "2026-03-18",
    desc: "Historical student project references and archive metadata.",
  },
  {
    id: "05",
    title: "General Records Register",
    category: "General Records",
    status: "Verified",
    date: "2026-03-03",
    desc: "General records retained for public archival reference.",
  },
  {
    id: "06",
    title: "Legacy Collection Index",
    category: "General Records",
    status: "Archived",
    date: "2025-12-21",
    desc: "Reference index for older archive collections.",
  },
];
let logs = [
  ["19:04:22", "OK", "Archive service initialized"],
  ["19:03:58", "OK", "Public record index synchronized"],
  ["18:59:31", "OK", "Integrity verification completed"],
  ["18:57:10", "WARN", "Legacy collection access reviewed"],
  ["18:51:44", "OK", "Record 01 checksum verified"],
];
const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);
function toast(x) {
  let t = $("#toast");
  t.textContent = x;
  t.classList.add("show");
  clearTimeout(window.tt);
  window.tt = setTimeout(() => t.classList.remove("show"), 2200);
}
function page(id) {
  $$(".page").forEach((x) => x.classList.toggle("active", x.id === id));
  $$(".nav").forEach((x) =>
    x.classList.toggle("active", x.dataset.page === id),
  );
  $("#side").classList.remove("open");
  scrollTo(0, 0);
}
$$(".nav").forEach((x) => (x.onclick = () => page(x.dataset.page)));
$$("[data-goto]").forEach((x) => (x.onclick = () => page(x.dataset.goto)));
$("#menu").onclick = () => $("#side").classList.toggle("open");
function row(r) {
  return `<div class="record"><div><h3>Record ${r.id} — ${r.title}</h3><p>${r.category} · ${r.date}</p></div><div><span class="badge">${r.status.toUpperCase()}</span><button class="open" onclick="openRecord('${r.id}')">Open</button></div></div>`;
}
function card(r) {
  return `<article class="recordcard"><small>REC-${r.id}</small><span class="badge">${r.status.toUpperCase()}</span><h3>${r.title}</h3><p>${r.desc}</p><p>Category: ${r.category}<br>Date: ${r.date}</p><button class="open" onclick="openRecord('${r.id}')">View document →</button></article>`;
}
function render() {
  $("#recent").innerHTML = records.slice(0, 3).map(row).join("");
  renderGrid();
  renderLogs();
}
function renderGrid() {
  let q = $("#filter").value.toLowerCase(),
    c = $("#category").value;
  let a = records.filter(
    (r) =>
      (r.title + r.category + r.id + r.status).toLowerCase().includes(q) &&
      (c === "all" || r.category === c),
  );
  $("#grid").innerHTML = a.length
    ? a.map(card).join("")
    : '<p class="results">No records match your filter.</p>';
}
function renderLogs() {
  let h = logs
    .map(
      (x) =>
        `<div class="activity"><time>${x[0]}</time><span class="${x[1] === "OK" ? "ok" : ""}">[${x[1]}]</span><span>${x[2]}</span></div>`,
    )
    .join("");
  $("#feed").innerHTML = logs
    .slice(0, 5)
    .map(
      (x) =>
        `<div class="activity"><time>${x[0]}</time><span class="${x[1] === "OK" ? "ok" : ""}">[${x[1]}]</span><span>${x[2]}</span></div>`,
    )
    .join("");
  $("#logs").innerHTML = h;
}
function search(q) {
  if (!q) {
    $("#results").textContent = "Start typing to search the public index.";
    return;
  }
  let a = records.filter((r) =>
    (r.title + r.category + r.id + r.status)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  $("#results").innerHTML = a.length
    ? a.slice(0, 4).map(row).join("")
    : "No matching records found.";
}
$("#search").oninput = (e) => search(e.target.value);
$("#filter").oninput = renderGrid;
$("#category").onchange = renderGrid;
$$("[data-q]").forEach(
  (b) =>
    (b.onclick = () => {
      $("#search").value = b.dataset.q;
      search(b.dataset.q);
      page("dashboard");
    }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    $("#search").focus();
  }
  if (e.key === "Escape") $("#modal").classList.remove("show");
});
window.openRecord = (id) => {
  let r = records.find((x) => x.id === id);
  $("#doc").innerHTML =
    `<div class="document"><h2>${r.title}</h2><p class="meta">RECORD ID: ${r.id} | STATUS: ${r.status.toUpperCase()} | DATE: ${r.date}</p><p>This record contains publicly available information from the university archive.</p><p>${r.desc}</p><p><b>Category:</b> ${r.category}</p><p>For older materials, refer to the archive repository and its historical record trail.</p><hr><small>Digital Archive Reference Node / Record ${r.id}</small></div>`;
  $("#modal").classList.add("show");
  logs.unshift([
    new Date().toLocaleTimeString("en-GB"),
    "OK",
    `Record ${id} opened in document viewer`,
  ]);
  renderLogs();
};
$("#close").onclick = () => $("#modal").classList.remove("show");
$("#modal").onclick = (e) => {
  if (e.target.id === "modal") $("#modal").classList.remove("show");
};
document.querySelector("[data-open]").onclick = () => openRecord("01");
$("#clear").onclick = () => {
  logs = [];
  renderLogs();
  toast("Local activity view cleared");
};
$("#check").onclick = () => {
  let out = $("#terminal");
  out.textContent = "";
  [
    "Connecting to archive services...",
    "Checking record index........ OK",
    "Checking file service......... OK",
    "Checking integrity monitor.... OK",
    "Checking audit service........ OK",
    "Running final verification.... PASSED",
    "SYSTEM STATUS: OPERATIONAL",
  ].forEach((x, i) =>
    setTimeout(() => {
      out.textContent += x + "\n";
      if (i === 6) {
        logs.unshift([
          new Date().toLocaleTimeString("en-GB"),
          "OK",
          "Manual diagnostics completed",
        ]);
        renderLogs();
        toast("System check completed");
      }
    }, i * 350),
  );
};
function clock() {
  $("#clock").textContent = new Date().toLocaleTimeString("en-GB", {
    hour12: false,
  });
}
setInterval(clock, 1000);
clock();
render();
