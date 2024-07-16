import { Mailbox } from "./mailbox";
import Tab from 'bootstrap/js/dist/tab';

const mailbox = new Mailbox();
// Fetch initial emails
(async () => {
  await mailbox.fetchMails();
  await mailbox.viewFolder(mailbox.currentFolder);
  console.log(mailbox.currentFolder);
})();

document.addEventListener("click", async (event) => {
  // Klasör tıklama işlemleri
  if (event.target.classList.contains("folders")) {
    mailbox.viewFolder(event.target.dataset.folder);
  }

  // Yıldız tıklama işlemleri
  if (
    event.target.classList.contains("bi-star") ||
    event.target.classList.contains("bi-star-fill")
  ) {
    const mailId = event.target.dataset.index;

    mailbox.toggleStar(mailId);
    event.target.classList.toggle("bi-star");
    event.target.classList.toggle("bi-star-fill");
  }

  // Okundu işlemleri
  if (
    event.target.classList.contains("bi-envelope-fill") ||
    event.target.classList.contains("bi-envelope-open")
  ) {
    const mailId = event.target.dataset.index;

    mailbox.toggleRead(mailId);
    event.target.classList.toggle("bi-envelope-fill");
    event.target.classList.toggle("bi-envelope-open");
  }
});
