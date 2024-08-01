import { Mailbox } from "./mailbox.ts";
const mailbox = new Mailbox();
// Fetch initial emails
(async () => {
  mailbox.fetchMails();
  mailbox.viewFolder(mailbox.currentFolder);
})();

document.addEventListener("click", async (event) => {
  // Klasör tıklama işlemleri
  const target = event.target as HTMLElement;

  if (target.classList.contains("folders")) {
    mailbox.viewFolder(target.dataset.folder!);
  }

  // Yıldız tıklama işlemleri
  if (target.classList.contains("star-folder")) {
    const mailId = target.dataset.index!;

    mailbox.toggleStar(mailId);
    target.classList.toggle("bi-star");
    target.classList.toggle("bi-star-fill");
  }

  // Okundu işlemleri
  if (target.classList.contains("envelope-folder")) {
    //FIXME: casting looks sus
    const mailId: string = target.dataset.index as string;
    console.log(mailId);

    mailbox.toggleRead(mailId);
    target.classList.toggle("bi-envelope-fill");
    target.classList.toggle("bi-envelope-open");
  }

  // delete mail
  if (target.classList.contains("delete-folder")) {
    //FIXME: casting looks sus
    const mailId: string = target.dataset.index as string;

    mailbox.delete(mailId, true);
    target.classList.toggle("bi-envelope-arrow-up-fill");
    target.classList.toggle("bi-trash-fill");
  }

  if (target.classList.contains("undelete-folder")) {
    //FIXME: casting looks sus
    const mailId: string = target.dataset.index as string;

    mailbox.undelete(mailId, true);
    target.classList.toggle("bi-envelope-arrow-up-fill");
    target.classList.toggle("bi-trash-fill");
  }
});
