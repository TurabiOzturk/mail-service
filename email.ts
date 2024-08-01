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

const returnedUrlParams = validateUrlParams()!;

mailbox.viewEmail(returnedUrlParams.mailId);

document.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;

  // Yıldız tıklama işlemleri
  if (target.classList.contains("star-email")) {
    const mailId: string = target.dataset.index as string;

    mailbox.toggleStar(mailId, false);
    target.classList.toggle("bi-star");
    target.classList.toggle("bi-star-fill");
  }

  // Okundu işlemleri
  if (target.classList.contains("envelope-email")) {
    const mailId: string = target.dataset.index as string;

    mailbox.toggleRead(mailId, false);
    target.classList.toggle("bi-envelope-fill");
    target.classList.toggle("bi-envelope-open");
  }

  // delete mail
  if (target.classList.contains("delete-email")) {
    const mailId: string = target.dataset.index as string;

    mailbox.delete(mailId, false);
    target.classList.toggle("bi-envelope-arrow-up-fill");
    target.classList.toggle("bi-trash-fill");
  }

  if (target.classList.contains("undelete-email")) {
    const mailId: string = target.dataset.index as string;

    mailbox.undelete(mailId, false);
    target.classList.toggle("bi-envelope-arrow-up-fill");
    target.classList.toggle("bi-trash-fill");
  }

  if (target.classList.contains("folders-dropdown")) {
    mailbox.moveToFolder(
      target.dataset.index!,
      target.textContent!,
      false
    );
    event.preventDefault();
  }
});

