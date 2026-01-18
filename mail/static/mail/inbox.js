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
  const resultBox = document.querySelector('#compose-result');
  if (resultBox) {
    resultBox.style.display = 'none';
    resultBox.innerHTML = '';
  }


  
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

      if (!result.error){
        load_mailbox('sent');
      }else{
        document.querySelector('#compose-result').innerHTML = result.error;
        document.querySelector('#compose-result').style.display = 'block';
      
      }
      
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
      if (emails.length === 0){
        const emailDiv = document.createElement('div');
        emailDiv.innerHTML = "No emails"
        emailDiv.style.color = "gray";
        emailDiv.style.textAlign = "center";
        emailDiv.style.marginTop = "10px";
        container.appendChild(emailDiv);
        return;  // ⬅ important!
      }

      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        // emailDiv.className = "email-item";
        // emailDiv.style.border = '1px solid #ccc';
        // emailDiv.style.padding = '10px';
        // emailDiv.style.margin = '5px';
        // emailDiv.style.cursor = 'pointer';
        let firstColumn = (section != "sent") ? `From: ${email.sender}` : `<strong>To: ${email.recipients}</strong>`;
       
        emailDiv.addEventListener("click", () => view_email(email.id));

        emailDiv.innerHTML = `
          <div class="col-6 col-sm-7 col-md-4 p-2 text-truncate">${firstColumn}</div>
          <div class="col-6 col-sm-5 col-md-3 p-2 order-md-2 small text-right text-muted font-italic font-weight-lighter align-self-center">${email.timestamp}</div>
          <div class="col px-2 pb-2 pt-md-2 order-md-1 text-truncate">${email.subject}</div>
          
  
        `;
        emailDiv.className = 'row justify-content-between border border-left-0 border-right-0 border-bottom-0 pointer-link p-2';
        emailDiv.style.backgroundColor = email.read ? '#f2f2f2' : 'white';

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
   
        <div class="d-flex justify-content-between flex-nowrap-sm flex-wrap">
        <h4 class="text-wrap">${email.subject}</h5>
        <small class="mr-lg-4 ml-0 ml-sm-2 font-weight-lighter align-self-center text-muted text-right"><em>${email.timestamp}</em></small>
        </div>

        <div class="d-flex justify-content-between flex-nowrap-sm flex-wrap">
        <div>
          <h5><strong>From:</strong> ${email.sender}</h5>
          <h5><strong>To:</strong> ${email.recipients.join(", ")}</h5>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
        <button class="btn btn-sm btn-outline-secondary" id="archive">${email.archived ? "Unarchive" : "Archive"}</button>
        </div>
        </div>

        
        
    
        <hr>
        <p>${email.body}</p>
         
      `;


      fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
    })
    });

    document.querySelector("#archive").addEventListener("click", ()=> toggle_archived(id, email.archived));
    document.querySelector("#reply").addEventListener("click", ()=> reply_email(email));
});
}

function toggle_archived(id, currentStatus){
  fetch(`/emails/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: !currentStatus
  })
}).then(() => load_mailbox("inbox"));
}

function reply_email(email) {
  compose_email();
  document.querySelector("#compose-recipients").value = email.sender;
  document.querySelector("#compose-subject").value =
    email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`;
  document.querySelector("#compose-body").value = 
    `\n\nOn ${email.timestamp}, ${email.sender} wrote:\n${email.body}`;
}
