class GetMailbox {
  constructor(currentFolder) {
    this.data = [];
    this.fetchedMails = [];
    this.currentFolder = currentFolder;
  }

  async loadMailBox() {
    localStorage.removeItem("emailData");

    const storedData = localStorage.getItem("emailData");
    if (storedData && typeof storedData === "string") {
      this.data = JSON.parse(storedData);
      console.log("if");
    } else {
      console.log("else");

      try {
        const response = await fetch("./public/mails.json");
        // some error handling
        if (!response.ok) {
          throw new Error(
            `Error fetching mails: ${response.status} ${response.statusText}`
          );
        }
        this.data = await response.json();
        localStorage.setItem("emailData", JSON.stringify(this.data));
      } catch (error) {
        console.log("catch");
        console.error(
          `An error occurred while fetching data: ${error.message}`
        );
      }
    }
  }

  async fetchFolder() {
    this.fetchedMails = this.data.filter((email) =>
      email.folders.includes(this.currentFolder)
    );
    this.sortFetchedMailsDescending();
  }

  sortFetchedMailsDescending() {
    this.fetchedMails.sort((a, b) => {
      const idA = parseInt(a.mailId.split("_")[1]) || a.mailId;
      const idB = parseInt(b.mailId.split("_")[1]) || b.mailId;

      if (typeof idA === "number" && typeof idB === "number") {
        return idA - idB; // Numerical comparison (descending)
      } else {
        return b.mailId.localeCompare(a.mailId); // String comparison (descending)
      }
    });
  }

  async toggleStarredStatus(emailIndex) {
    try {
      emailIndex = parseInt(emailIndex, 10);

      if (
        isNaN(emailIndex) ||
        emailIndex < 0 ||
        emailIndex >= this.fetchedMails.length
      ) {
        console.log("Geçersiz e-posta indeksi:", emailIndex);
        return;
      }

      const mailId = this.fetchedMails[emailIndex].mailId;
      const dataEmailIndex = this.data.findIndex(
        (email) => email.mailId === mailId
      );

      if (dataEmailIndex === -1) {
        console.log("Mail ID, data dizisinde bulunamadı:", mailId);
        return;
      }

      // Önceki durumu logla
      console.log("Önceki durum:", this.fetchedMails[emailIndex]);

      // Her iki dizideki isStarred durumunu değiştir
      const newIsStarredStatus = !this.data[dataEmailIndex].isStarred;
      this.data[dataEmailIndex].isStarred = newIsStarredStatus;
      this.fetchedMails[emailIndex].isStarred = newIsStarredStatus;

      // Yeni durumu logla
      console.log("Yeni durum:", this.fetchedMails[emailIndex]);

      // Yerel depolamayı güncelle
      localStorage.setItem("emailData", JSON.stringify(this.data));
      console.log(
        "Yerel depolama güncellendi:",
        localStorage.getItem("emailData")
      );

      // Kullanıcı arayüzünü güncelle
      await this.fetchFolder();
      await this.iterateData();

      // Durum değişikliğini kontrol et
      const updatedMail = this.fetchedMails[emailIndex];
      console.log("Güncellenen e-posta durumu:", updatedMail.isStarred);
      if (updatedMail.isStarred === newIsStarredStatus) {
        console.log("Durum başarıyla güncellendi.");
      } else {
        console.log("Durum güncellenemedi.");
      }
    } catch (error) {
      console.log("Durum güncellenirken hata oluştu:", error);
    }
  }
  async toggleReadStatus(emailIndex) {
    try {
      emailIndex = parseInt(emailIndex, 10);

      if (
        isNaN(emailIndex) ||
        emailIndex < 0 ||
        emailIndex >= this.fetchedMails.length
      ) {
        console.log("Geçersiz e-posta indeksi:", emailIndex);
        return;
      }

      const mailId = this.fetchedMails[emailIndex].mailId;
      const dataEmailIndex = this.data.findIndex(
        (email) => email.mailId === mailId
      );

      if (dataEmailIndex === -1) {
        console.log("Mail ID, data dizisinde bulunamadı:", mailId);
        return;
      }

      // Önceki durumu logla
      console.log("Önceki durum:", this.fetchedMails[emailIndex]);

      // Her iki dizideki isRead durumunu değiştir
      const newIsReadStatus = !this.data[dataEmailIndex].isRead;
      this.data[dataEmailIndex].isRead = newIsReadStatus;
      this.fetchedMails[emailIndex].isRead = newIsReadStatus;

      // Yeni durumu logla
      console.log("Yeni durum:", this.fetchedMails[emailIndex]);

      // Yerel depolamayı güncelle
      localStorage.setItem("emailData", JSON.stringify(this.data));
      console.log(
        "Yerel depolama güncellendi:",
        localStorage.getItem("emailData")
      );

      // Kullanıcı arayüzünü güncelle
      await this.fetchFolder();
      await this.iterateData();

      // Durum değişikliğini kontrol et
      const updatedMail = this.fetchedMails[emailIndex];
      console.log("Güncellenen e-posta durumu:", updatedMail.isStarred);
      if (updatedMail.isRead === newIsReadStatus) {
        console.log("Durum başarıyla güncellendi.");
      } else {
        console.log("Durum güncellenemedi.");
      }
    } catch (error) {
      console.log("Durum güncellenirken hata oluştu:", error);
    }
  }
  iterateData() {
    const selectedFolder = document.getElementById(
      `${this.currentFolder.toLowerCase()}`
    );

    const mailTable = document.createElement("table");
    mailTable.classList.add("inbox-table");
    const mailTableBody = document.createElement("tbody");
    mailTable.appendChild(mailTableBody);
    this.fetchedMails.length > 0
      ? selectedFolder.appendChild(mailTable)
      : (selectedFolder.innerHTML = "no emails here!");

    for (let i = 0; i < this.fetchedMails.length; i++) {
      const timestamp = this.fetchedMails[i].timestamp;
      const date = new Date(timestamp);
      const options = { day: "numeric", month: "long" };
      const formattedDate = date.toLocaleDateString("en-UK", options);

      mailTableBody.innerHTML += `
        <tr id="${i}">
        <td>${
          this.fetchedMails[i].isStarred
            ? `<i data-index="${i}" class="bi bi-star-fill"></i>`
            : `<i data-index="${i}" class="bi bi-star"></i>`
        }</td>

        <td>
          <a href="/email.html?folder=${this.currentFolder}&mailId=${
        this.fetchedMails[i].mailId
      }">
            ${this.fetchedMails[i].from}</td>
          </a>
        <td>
          <a href="/email.html?folder=${this.currentFolder}&mailId=${
        this.fetchedMails[i].mailId
      }">
            ${this.fetchedMails[i].subject}</td>
          </a>
        <td>
          <a href="/email.html?folder=${this.currentFolder}&mailId=${
        this.fetchedMails[i].mailId
      }">
        ${this.fetchedMails[i].body}
          </a>
        </td>
        <td>${formattedDate}</td>
        <td>${
          this.fetchedMails[i].isRead
            ? `<i data-index="${i}" class="bi bi-envelope-fill"></i>`
            : `<i data-index="${i}" class="bi bi-envelope-open"></i>`
        }</td>
        <td>
        ${
          this.fetchedMails[i].isDeleted
            ? ""
            : `<i class="bi bi-trash-fill"></i>`
        }
        </td>
        
        </tr>
     `;
    }
  }

  async callNewFolder(folder) {
    const mailbox = new GetMailbox(folder);
    await mailbox.loadMailBox();
    await mailbox.fetchFolder();
    await mailbox.sortFetchedMailsDescending();
    await mailbox.iterateData();
  }

}

let mailbox;

// Fetch initial emails
(async () => {
  mailbox = new GetMailbox("Inbox");
  await mailbox.loadMailBox();
  await mailbox.fetchFolder();
  await mailbox.iterateData();
})();

document.addEventListener("click", async (event) => {
  try {
    // Klasör tıklama işlemleri
    if (event.target.classList.contains("folders")) {
      const folderName = event.target.dataset.folder;

      if (!folderName) {
        console.log("Klasör adı eksik.");
        return;
      }

      // Mevcut posta kutusu örneğini yeniden kullan
      mailbox.currentFolder = folderName;
      await mailbox.fetchFolder();
      await mailbox.iterateData();
    }

    // Yıldız tıklama işlemleri
    if (
      event.target.classList.contains("bi-star") ||
      event.target.classList.contains("bi-star-fill")
    ) {
      const mailIndex = event.target.dataset.index;

      if (mailIndex === undefined) {
        console.log("Mail indeksi eksik.");
        return;
      }

      await mailbox.toggleStarredStatus(mailIndex);
      event.target.classList.toggle("bi-star");
      event.target.classList.toggle("bi-star-fill");
    }

    // Okundu işlemleri
    if (
      event.target.classList.contains("bi-envelope-fill") ||
      event.target.classList.contains("bi-envelope-open")
    ) {
      const mailIndex = event.target.dataset.index;
      if (mailIndex === undefined) {
        console.log("Mail indeksi eksik.");
        return;
      }

      await mailbox.toggleReadStatus(mailIndex);
      event.target.classList.toggle("bi-envelope-fill");
      event.target.classList.toggle("bi-envelope-open");
    }
  } catch (error) {
    console.log("Tıklama olayında hata oluştu:", error);
  }
});
