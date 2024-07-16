import Tab from "bootstrap/js/dist/tab";

export class Mailbox {
  constructor() {
    this.emails = [];
    const localData = localStorage.getItem("currentFolder");
    if (
      localData &&
      typeof localData === "string" &&
      localData !== "undefined"
    ) {
      this.currentFolder = localData;
      console.log(this.currentFolder);
    } else {
      this.currentFolder = "Inbox";
    }
  }

  async fetchMails() {
    // localStorage.removeItem("emailData");
    const localData = localStorage.getItem("emails");
    if (
      localData &&
      typeof localData === "string" &&
      localData !== "undefined"
    ) {
      this.emails = JSON.parse(localData);
    } else {
      try {
        const response = await fetch("./public/mails.json");
        if (!response.ok) {
          throw new Error(
            `Error fetching mails: ${response.status} ${response.statusText}`
          );
        }
        this.emails = await response.json();
        this.updateDatabase();
      } catch (error) {
        alert(`An error occurred while fetching data: ${error.message}`);
      }
    }
  }

  viewFolder(folderName) {
    this.currentFolder = folderName;
    const emails = this.emails.filter(
      (q) => q.folders.filter((q2) => q2 === this.currentFolder).length > 0
    );

    emails.sort(function (x, y) {
      return new Date(x.timestamp) < new Date(y.timestamp) ? 1 : -1;
    });

    const selectedFolder = document.getElementById(
      `${this.currentFolder.toLowerCase()}`
    );

    if (emails.length === 0) {
      selectedFolder.innerHTML = "No emails here";
      return;
    }

    selectedFolder.innerHTML = ""; // cleaning up for later use

    const table = document.createElement("table");
    table.classList.add("inbox-table");
    const body = document.createElement("tbody");
    table.appendChild(body);

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      body.innerHTML += `
          <tr id="${i}">
          <td>${
            email.isStarred
              ? `<i data-index="${email.mailId}" class="bi bi-star-fill"></i>`
              : `<i data-index="${email.mailId}" class="bi bi-star"></i>`
          }</td>
  
          <td>
            <a href="/email.html?folder=${this.currentFolder}&mailId=${
        email.mailId
      }">
              ${email.from}</td>
            </a>
          <td>
            <a href="/email.html?folder=${this.currentFolder}&mailId=${
        email.mailId
      }">
              ${email.subject}</td>
            </a>
          <td>
            <a href="/email.html?folder=${this.currentFolder}&mailId=${
        email.mailId
      }">
          ${email.body}
            </a>
          </td>
          <td>${new Date(emails[i].timestamp).toLocaleDateString("en-UK", {
            day: "numeric",
            month: "long",
          })}</td>
          <td>${
            email.isRead
              ? `<i data-index="${email.mailId}" class="bi bi-envelope-fill"></i>`
              : `<i data-index="${email.mailId}" class="bi bi-envelope-open"></i>`
          }</td>
          <td>
          ${email.isDeleted ? "" : `<i class="bi bi-trash-fill"></i>`}
          </td>
          
          </tr>
       `;
    }

    selectedFolder.append(table);
  
    const tabTriggerEl = document.querySelector("#" + this.currentFolder.toLowerCase() + "-tab");
    const tab = new Tab(tabTriggerEl);
    tab.show();

    this.updateDatabase();
  }

  viewEmail(mailId) {
    const email = this.emails[this.findIndexByMailId(mailId)];

    const mailContainer = document.getElementById("mail-container");
    if (!email) {
      mailContainer.innerHTML = "no emails here!";
      return;
    }
    const bootstrapContainer = document.createElement("div");
    bootstrapContainer.classList.add("container");
    bootstrapContainer.innerHTML += `
     <div>
        ${
          email.isStarred
            ? `<i class="bi bi-star-fill"></i>`
            : `<i class="bi bi-star"></i>`
        }
      ${
        email.isRead
          ? `<i class="bi bi-envelope-fill"></i>`
          : `<i class="bi bi-envelope-open"></i>`
      }
     </div>


    <h1 class="mt-3 mb-3" id="subject">${email.subject}</h1>
    <div class="d-flex justify-content-between">
        <p>
            <strong>From: ${email.from}</strong> <span id="sender"></span>
        </p>
        <p><span id="date">${new Date(email.timestamp).toLocaleDateString(
          "en-UK",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false, // Use 12-hour clock (AM/PM)
          }
        )}</span></p>
    </div>
    <div class="d-flex justify-content-between">
        <p>
            <strong>To: ${email.to}</strong> <span id="recipient"></span>
        </p>
        ${
          email.cc.length === 0
            ? ""
            : `<p><strong>CC:</strong> ${email.cc.join(", ")}</p>`
        }
        
    </div>
    <div class="email-body" id="body">
        ${email.body}
    </div>
   `;
    mailContainer.appendChild(bootstrapContainer);

    this.updateDatabase();
  }

  toggleStar(mailId) {
    const idx = this.findIndexByMailId(mailId);
    this.emails[idx].isStarred = !this.emails[idx].isStarred;

    this.updateView();
  }

  toggleRead(mailId) {
    const idx = this.findIndexByMailId(mailId);
    this.emails[idx].isRead = !this.emails[idx].isRead;

    this.updateView();
  }

  delete(mailId) {
    this.emails[this.findIndexByMailId(mailId)].isDeleted = true;

    this.updateView();
  }

  moveToFolder(mailId, targetFolder) {
    this.emails[this.findIndexByMailId(mailId)].folders = [targetFolder];

    this.updateView();
  }

  // private functions
  findIndexByMailId(mailId) {
    const idx = this.emails.findIndex((q) => q.mailId === mailId);

    if (idx === -1) {
      alert(`Invalid email id ${mailId}`);
    }

    return idx;
  }

  updateDatabase() {
    localStorage.setItem("emails", JSON.stringify(this.emails));
    localStorage.setItem("currentFolder", this.currentFolder);
  }

  updateView() {
    this.updateDatabase();
    this.viewFolder(this.currentFolder);
  }

  triggerTabClick(tabId) {
    // const tabTriggerEl = document.getElementById(tabId);
    // if (tabTriggerEl) {
    //   const clickEvent = new MouseEvent("click", {
    //     cancelable: false,
    //   });
    //   tabTriggerEl.dispatchEvent(clickEvent);
    // }
  }
}
