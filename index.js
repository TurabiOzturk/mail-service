import { Mailbox } from "./mailbox";
const mailbox = new Mailbox();
// Fetch initial emails
(async () => {
  mailbox.fetchMails();
  mailbox.viewFolder(mailbox.currentFolder);
})();

document.addEventListener("click", async (event) => {
  // Klasör tıklama işlemleri
  if (event.target.classList.contains("folders")) {
    mailbox.viewFolder(event.target.dataset.folder);
  }

  // Yıldız tıklama işlemleri
  if (event.target.classList.contains("star-folder")) {
    const mailId = event.target.dataset.index;

    mailbox.toggleStar(mailId);
    event.target.classList.toggle("bi-star");
    event.target.classList.toggle("bi-star-fill");
  }

  // Okundu işlemleri
  if (event.target.classList.contains("envelope-folder")) {
    const mailId = event.target.dataset.index;

    mailbox.toggleRead(mailId);
    event.target.classList.toggle("bi-envelope-fill");
    event.target.classList.toggle("bi-envelope-open");
  }

  // delete mail
  if(event.target.classList.contains("delete-folder")){
    const mailId = event.target.dataset.index;
    
    mailbox.delete(mailId, true)
    event.target.classList.toggle("bi-envelope-arrow-up-fill");
    event.target.classList.toggle("bi-trash-fill");    
  }

  if(event.target.classList.contains("undelete-folder")){
    const mailId = event.target.dataset.index;
    
    mailbox.undelete(mailId, true)
    event.target.classList.toggle("bi-envelope-arrow-up-fill");
    event.target.classList.toggle("bi-trash-fill");    
  }
});
