import Tab from "bootstrap/js/dist/tab";

interface Email {
  mailId: number;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  body: string;
  timestamp: string;
  folders: string[];
  isRead: boolean;
  isStarred: boolean;
  isDeleted: boolean;
}

export class Mailbox {
  emails: Email[];
  currentFolder: string;
  folders: string[];

  constructor() {
    this.emails = [];
    const localData = localStorage.getItem("currentFolder");
    if (localData) {
      this.currentFolder = localData;
    } else {
      this.currentFolder = "Inbox";
    }

    const foldersString = localStorage.getItem("folders")!;
    if (foldersString) {
      try {
        this.folders = JSON.parse(foldersString);
      } catch (error) {
        console.error("Error parsing folders:", error);
        this.folders = ["Inbox", "Sent", "Draft", "Deleted"];
        localStorage.setItem("folders", JSON.stringify(this.folders));
      }
    } else {
      this.folders = ["Inbox", "Sent", "Draft", "Deleted"];
      localStorage.setItem("folders", JSON.stringify(this.folders));
    }
  }
  async fetchMails() {
    const localData = localStorage.getItem("emails");
    if (localData) {
      this.emails = JSON.parse(localData);
    } else {
      try {
        const response = await fetch("mails.json");
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

  viewFolder(folderName: string) {
    //start setting up folder tabs
    const folderTabs: HTMLElement = document.getElementById("folderTabs")!;

    //fixing space issues that might happen in custom folder names
    for (let i = 0; i < this.folders.length; i++) {
      this.folders[i] = this.folders[i].split(" ").join("_");
    }
    folderTabs.innerHTML = "";
    for (let i = 0; i < this.folders.length; i++) {
      folderTabs.innerHTML += `
        <li class="nav-item" role="presentation">
            <button
                class="nav-link folders"
                id="${this.folders[i]}-tab"
                data-bs-toggle="tab"
                data-bs-target="#${this.folders[i]}"
                type="button"
                role="tab"
                aria-controls="${this.folders[i]}"
                aria-selected="true"
                data-folder="${this.folders[i]}"
            >
            ${this.folders[i].split("_").join(" ")}
            </button>
        </li>
        `;
    }

    //finish setting up folder tabs

    //start setting up panes
    const folderPanes: HTMLElement = document.getElementById("folderPanes")!;
    folderPanes.innerHTML = "";
    for (let i = 0; i < this.folders.length; i++) {
      folderPanes.innerHTML += `
        <div
            class="tab-pane fade show"
            id="${this.folders[i]}"
            role="tabpanel"
            aria-labelledby="${this.folders[i]}-tab"
            >
        </div>
          `;
    }
    //finish setting up panes
    this.currentFolder = folderName;

    const emails = this.emails.filter(
      (q) => q.folders.filter((q2) => q2 === this.currentFolder).length > 0
    );

    emails.sort(function (x, y) {
      return new Date(x.timestamp) < new Date(y.timestamp) ? 1 : -1;
    });

    const selectedFolder: HTMLElement = document.getElementById(
      `${this.currentFolder}`
    )!;

    const tabTriggerEl: HTMLElement = document.querySelector(
      "#" + this.currentFolder + "-tab"
    )!;
    const tab = new Tab(tabTriggerEl);
    tab.show();

    if (emails.length === 0) {
      selectedFolder.innerHTML = "No emails here";
      this.updateDatabase();
      return;
    }

    selectedFolder.innerHTML = ""; // cleaning up for later use

    const table = document.createElement("table");
    table.classList.add("inbox-table");
    const body = document.createElement("tbody");
    table.appendChild(body);
    document.title = "Mailbox - MailService";

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      body.innerHTML += `
          <tr id="${i}">
          <td>${
            email.isStarred
              ? `<i data-index="${email.mailId}" class="bi bi-star-fill star-folder"></i>`
              : `<i data-index="${email.mailId}" class="bi bi-star star-folder"></i>`
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
              ? `<i data-index="${email.mailId}" class="bi bi-envelope-fill envelope-folder"></i>`
              : `<i data-index="${email.mailId}" class="bi bi-envelope-open envelope-folder"></i>`
          }</td>
          <td>
          ${
            email.isDeleted
              ? `<i data-index="${email.mailId}" class="bi bi-envelope-arrow-up-fill undelete-folder"></i>`
              : `<i data-index="${email.mailId}" class="bi bi-trash-fill delete-folder"></i>`
          }
          </td>
          
          </tr>
       `;
    }

    selectedFolder.append(table);

    this.updateDatabase();
  }

  viewEmail(mailId: string) {
    const email = this.emails[this.findIndexByMailId(mailId)];

    // start creating folders dropdown

    const foldersDropDown: HTMLElement =
      document.getElementById("foldersDropDown")!;
    foldersDropDown.innerHTML = "";

    for (let i = 0; i < this.folders.length; i++) {
      foldersDropDown.innerHTML += `
        <li>
            <a class="dropdown-item folders-dropdown ${
              this.folders[i] === this.currentFolder ? `active` : ``
            }" href="#" aria-current="page" data-index="${email.mailId}">${
        this.folders[i]
      }</a>
        </li>
          `;
    }

    // finish creating folders dropdown

    const mailContainer: HTMLElement =
      document.getElementById("mail-container")!;
    if (!email) {
      mailContainer.innerHTML = "no emails here!";
      return;
    }
    const bootstrapContainer = document.createElement("div");
    bootstrapContainer.classList.add("container");
    document.title = `${email.subject} - MailService`;
    bootstrapContainer.innerHTML += `
     <div>
        ${
          email.isStarred
            ? `<i data-index="${email.mailId}" class="bi bi-star-fill star-email"></i>`
            : `<i data-index="${email.mailId}" class="bi bi-star star-email"></i>`
        }
      ${
        email.isRead
          ? `<i data-index="${email.mailId}" class="bi bi-envelope-fill envelope-email"></i>`
          : `<i data-index="${email.mailId}" class="bi bi-envelope-open envelope-email"></i>`
      }
      ${
        email.isDeleted
          ? `<i data-index="${email.mailId}" class="bi bi-envelope-arrow-up-fill undelete-email"></i>`
          : `<i data-index="${email.mailId}" class="bi bi-trash-fill delete-email"></i>`
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
          email.cc.length !== 0
            ? `<p><strong>CC:</strong> ${email.cc.join(", ")}</p>`
            : ""
        }
        
    </div>
    <div class="email-body" id="body">
        ${email.body}
    </div>
   `;
    mailContainer.appendChild(bootstrapContainer);

    this.updateDatabase();
  }

  toggleStar(mailId: string, mailBox?: boolean) {
    const idx = this.findIndexByMailId(mailId);
    this.emails[idx].isStarred = !this.emails[idx].isStarred;
    if (mailBox) {
      this.updateView();
    } else {
    }
    this.updateDatabase();
  }

  toggleRead(mailId: string, mailBox?: boolean) {
    const idx = this.findIndexByMailId(mailId);
    this.emails[idx].isRead = !this.emails[idx].isRead;
    if (mailBox) {
      this.updateView();
    } else {
    }
    this.updateDatabase();
  }

  delete(mailId: string, mailBox?: boolean) {
    const idx = this.findIndexByMailId(mailId);
    this.emails[idx].isDeleted = !this.emails[idx].isDeleted;
    this.moveToFolder(mailId, "Deleted", mailBox);
    this.updateDatabase();
  }

  undelete(mailId: string, mailBox?: boolean) {
    const idx = this.findIndexByMailId(mailId);

    this.emails[idx].isDeleted = !this.emails[idx].isDeleted;

    this.moveToFolder(mailId, "Inbox", mailBox);
    this.updateDatabase();
  }

  moveToFolder(mailId: string, targetFolder?: string, mailBox?: boolean) {
    this.emails[this.findIndexByMailId(mailId)].folders = [
      targetFolder ?? "Inbox",
    ];
    if (mailBox === true) {
      this.updateView();
    } else {
      this.updateDatabase();
      console.log("the email is moved to: " + targetFolder);
    }
    //this.updateView();
  }

  // private functions
  //FIXME: params look sus
  findIndexByMailId(mailId: string | number) {
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
}
