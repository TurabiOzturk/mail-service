import { Mailbox } from "./mailbox";

function validateUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const mailId = urlParams.get("mailId");
    const folder = urlParams.get("folder");
    const allowedFolders = ["Inbox", "Sent", "Drafts"]; // Your allowed folder names
  
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
// const folder = returnedUrlParams.folder;


mailbox.viewEmail(returnedUrlParams.mailId);
