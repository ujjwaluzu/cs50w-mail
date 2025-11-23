// static/mail/inbox.js

document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ inbox.js loaded");

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Attach submit handler to the form
  const composeForm = document.querySelector('#compose-form');
  console.log("composeForm found?", !!composeForm);

  if (composeForm) {
    composeForm.addEventListener('submit', send_email);
  }

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML =
    `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  showSection(mailbox);
}

function send_email(event) {
  event.preventDefault();  // 🔴 THIS STOPS THE PAGE RELOAD

  console.log("📨 send_email called");

  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log("✅ server response:", result);
      load_mailbox('sent');
    })
    .catch(err => {
      console.error("❌ fetch error:", err);
    });
}

function showSection(section) {
  fetch(`/emails/${section}`)
    .then(response => response.json())
    .then(emails => {
      console.log("📬 emails:", emails);
      const container = document.querySelector('#emails-view');

      // clear previous emails but keep the heading
      container.innerHTML =
        `<h3>${section.charAt(0).toUpperCase() + section.slice(1)}</h3>`;

      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.className = "email-item";
        emailDiv.style.border = '1px solid #ccc';
        emailDiv.style.padding = '10px';
        emailDiv.style.margin = '5px';
        emailDiv.style.cursor = 'pointer';
        emailDiv.style.backgroundColor = email.read ? '#f2f2f2' : 'white';
        emailDiv.addEventListener("click", () => view_email(email.id));

        emailDiv.innerHTML = `
          <strong>${email.sender}</strong> &nbsp; | &nbsp;
          ${email.subject} 
          <span style="float:right; color:gray;">${email.timestamp}</span>
        `;

        container.appendChild(emailDiv);
      });
    });
}


function view_email(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';


    document.querySelector("#emails-view").innerHTML = `
        <h5><strong>From:</strong> ${email.sender}</h5>
        <h5><strong>To:</strong> ${email.recipients.join(", ")}</h5>
        <h5><strong>Subject:</strong> ${email.subject}</h5>
        <h5><strong>Timestamp:</strong> ${email.timestamp}</h5>
        <hr>
        <p>${email.body}</p>
        <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
        <button class="btn btn-sm btn-outline-secondary" id="archive">${email.archived ? "Unarchive" : "Archive"}</button>
      `;


    fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
})
});
}