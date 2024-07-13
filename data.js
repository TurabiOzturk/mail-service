
// classes

class GetMailbox {
  constructor(currentFolder) {
    this.data = [];
    this.fetchedMails = [];
    this.currentFolder = currentFolder;
  }

  async loadMailBox() {
    const storedData = localStorage.getItem("emailData");
    if (storedData && typeof storedData === "string") {
      this.data = JSON.parse(storedData);
    } else {
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
      } catch {
        console.log("catch");
        console.error(
          `An error occurred while fetching data: ${response.status} ${response.statusText}`
        );
      }
    }
  }

  async fetchFolder() {
    this.fetchedMails = this.data.filter((email) =>
      email.folders.includes(this.currentFolder)
    );
  }
  async iterateData() {
    //const selectedFolderTab = document.getElementById(`"${this.currentFolder.toLowerCase()}"`);
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
      // suck ass date conversion start

      const timestamp = this.fetchedMails[i].timestamp;
      const date = new Date(timestamp);
      const options = { day: "numeric", month: "long" };
      const formattedDate = date.toLocaleDateString("en-UK", options);
      console.log(this.currentFolder);
      // suck ass date conversion end

      mailTableBody.innerHTML += `
        <tr>
        <td>${
          this.fetchedMails[i].isStarred
            ? '<i class="bi bi-star-fill"></i>'
            : '<i class="bi bi-star"></i>'
        }</td>
        <td>
          <a href="/email.html?folder=${this.currentFolder}&mailId=${this.fetchedMails[i].mailId}">
            ${this.fetchedMails[i].from}</td>
          </a>
        <td>
          <a href="/email.html?folder=${this.currentFolder}&mailId=${this.fetchedMails[i].mailId}">
            ${this.fetchedMails[i].subject}</td>
          </a>
        <td style="overflow: hidden; text-overflow: ellipsis;">
          <a href="/email.html?folder=${this.currentFolder}&mailId=${this.fetchedMails[i].mailId}">
        ${this.fetchedMails[i].body}
          </a>
        </td>
        <td>${formattedDate}</td>
        <td>${this.fetchedMails[i].folders}</td>
        </tr>
     `;
    }
  }

  async callNewFolder(folder) {
    const mailbox = new GetMailbox(folder);
    await mailbox.loadMailBox();

    await mailbox.fetchFolder();

    await mailbox.iterateData();
  }
}

const mailbox = new GetMailbox();

await mailbox.callNewFolder("Inbox");

// Event delegation for folder clicks
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("folders")) {
    const folderName = event.target.dataset.folder;

    const mailbox = new GetMailbox(folderName); // Create a new instance per click
    await mailbox.loadMailBox();
    await mailbox.fetchFolder();
    await mailbox.iterateData();
  }
});
