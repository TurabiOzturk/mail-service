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

const returnedUrlParams = validateUrlParams();
const mailId = returnedUrlParams.mailId;
const folder = returnedUrlParams.folder;

class GetEmail {
  constructor(currentFolder) {
    this.data = [];
    this.fetchedMails = [];
    this.currentFolder = folder;
    this.currentEmailId = mailId;
  }

  async loadEmail() {
    const storedData = localStorage.getItem("emailData");
    if (storedData && typeof storedData === "string") {
      this.data = JSON.parse(storedData);
    } else {
      try {
        console.log("try");
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

  async getEmailDetails() {
    this.currentEmail = this.fetchedMails.filter(
      (email) => email.mailId == this.currentEmailId
    );
    console.log(this.currentEmail);
  }

  async parseEmail() {
    //const selectedFolderTab = document.getElementById(`"${this.currentFolder.toLowerCase()}"`);
    const mailRow = document.getElementById("mail-row");

    const mailTable = document.createElement("table");
    mailTable.classList.add("inbox-table");
    const mailTableBody = document.createElement("tbody");
    mailTable.appendChild(mailTableBody);

     // suck ass date conversion start

     const timestamp = this.currentEmail[0].timestamp;
     const date = new Date(timestamp);
     const options = {  day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false // Use 12-hour clock (AM/PM)  
        };
     const formattedDate = date.toLocaleDateString("en-UK", options);
     console.log(this.currentFolder);
     // suck ass date conversion end

    this.fetchedMails.length > 0
      ? mailRow.appendChild(mailTable)
      : (mailRow.innerHTML = "no emails here!");

      mailTableBody.innerHTML += `
      <td style="font-size: 40px">
        
          ${this.currentEmail[0].subject}</td>
      <tr>
      <td>${this.currentEmail[0].isStarred
          ? '<i class="bi bi-star-fill"></i>'
          : '<i class="bi bi-star"></i>'
      }</td>
      <td>
        
          ${this.currentEmail[0].from}</td>
      
      <td style="overflow: hidden; text-overflow: ellipsis;">

      ${this.currentEmail[0].body}
      </td>
      <td>${formattedDate}</td>
      </tr>
   `;
}

  
}

const email = new GetEmail();
await email.loadEmail();
await email.fetchFolder();
await email.getEmailDetails();
await email.parseEmail();
