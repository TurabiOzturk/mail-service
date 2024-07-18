import { Mailbox } from "./mailbox";

function validateUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const mailId = urlParams.get("mailId");
  const folder = urlParams.get("folder");
  const allowedFolders = ["Inbox", "Sent", "Draft", "Deleted"]; // Your allowed folder names

  // Check if both parameters are present
  if (!mailId || !folder) {
    console.error("Missing mailId or folder in URL.");
    return null;
  }

  // Validate mailId format
  const mailIdPattern = /^email_\d+$/;
  if (!mailIdPattern.test(mailId)) {
    console.error("Invalid mailId format.");
    return null;
  }

  // Validate folder against allowed values
  if (!allowedFolders.includes(folder)) {
    console.error("Invalid folder.");
    return null;
  }

  // If all checks pass, return the parameters as an object
  return { mailId, folder };
}

const mailbox = new Mailbox();
await mailbox.fetchMails();

const returnedUrlParams = validateUrlParams();

mailbox.viewEmail(returnedUrlParams.mailId);

document.addEventListener("click", async (event) => {
  // Yıldız tıklama işlemleri
  if (event.target.classList.contains("star-email")) {
    const mailId = event.target.dataset.index;

    mailbox.toggleStar(mailId, false);
    event.target.classList.toggle("bi-star");
    event.target.classList.toggle("bi-star-fill");
  }

  // Okundu işlemleri
  if (event.target.classList.contains("envelope-email")) {
    const mailId = event.target.dataset.index;

    mailbox.toggleRead(mailId, false);
    event.target.classList.toggle("bi-envelope-fill");
    event.target.classList.toggle("bi-envelope-open");
  }

  // delete mail
  if(event.target.classList.contains("delete-email")){
    const mailId = event.target.dataset.index;
    
    mailbox.delete(mailId, false)
    event.target.classList.toggle("bi-envelope-arrow-up-fill");
    event.target.classList.toggle("bi-trash-fill");    
  }

  if(event.target.classList.contains("undelete-email")){
    const mailId = event.target.dataset.index;
    
    mailbox.undelete(mailId, false)
    event.target.classList.toggle("bi-envelope-arrow-up-fill");
    event.target.classList.toggle("bi-trash-fill");    
  }

  if(event.target.classList.contains("dropdown-item")){
    console.log(event.target.textContent);
    // const targetFolder = event
  }
});

// export const emailBody = document.getElementById("email-body").innerHTML;
