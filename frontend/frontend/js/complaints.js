function submitComplaint() {
  const issue = document.getElementById("issue").value;

  fetch(`${BASE_URL}/api/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken()
    },
    body: JSON.stringify({ issue })
  })
  .then(() => loadMyComplaints());
}

function loadMyComplaints() {
  fetch(`${BASE_URL}/api/complaints/my`, {
    headers: { Authorization: getToken() }
  })
  .then(res => res.json())
  .then(renderComplaints);
}

function loadAllComplaints() {
  fetch(`${BASE_URL}/api/complaints/all`, {
    headers: { Authorization: getToken() }
  })
  .then(res => res.json())
  .then(renderComplaints);
}

function renderComplaints(data) {
  let html = "";
  data.forEach(c => {
    html += `<p>${c.issue} - ${c.status}</p>`;
  });
  document.getElementById("complaints").innerHTML = html;
}
