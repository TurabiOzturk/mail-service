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
    this.currentEmail = this.fetchedMails.find(
      (email) => email.mailId === this.currentEmailId
    );
    console.log(this.currentEmail.cc.toString());
  }

  async parseEmail() {
    console.log(this.currentEmail.isStarred);
    //const selectedFolderTab = document.getElementById(`"${this.currentFolder.toLowerCase()}"`);
    const mailContainer = document.getElementById("mail-container");
    const bootstrapContainer = document.createElement("div");
    bootstrapContainer.classList.add("container");

    // suck ass date conversion start

    const timestamp = this.currentEmail.timestamp;
    const date = new Date(timestamp);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false, // Use 12-hour clock (AM/PM)
    };
    const formattedDate = date.toLocaleDateString("en-UK", options);
    // suck ass date conversion end

    this.fetchedMails.length > 0
      ? mailContainer.appendChild(bootstrapContainer)
      : (mailContainer.innerHTML = "no emails here!");

    bootstrapContainer.innerHTML += `
      ${
        this.currentEmail.isStarred
          ? '<i class="bi bi-star-fill"></i>'
          : '<i class="bi bi-star"></i>'
      }



    <h1 id="subject">${this.currentEmail.subject}</h1>
    <div class="d-flex justify-content-between">
        <p>
            <strong>From: ${
              this.currentEmail.from
            }</strong> <span id="sender"></span>
        </p>
        <p><span id="date">${formattedDate}</span></p>
    </div>
    <div class="d-flex justify-content-between">
        <p>
            <strong>To: ${
              this.currentEmail.to
            }</strong> <span id="recipient"></span>
        </p>
        ${this.currentEmail.cc.length === 0 
            ? "asd" 
            : `<p><strong>CC:</strong> ${this.currentEmail.cc.join(", ")}</p>`
        }
        
    </div>
    <div class="email-body" id="body">
        ${this.currentEmail.body}
    </div>
   `;
  }
}

const email = new GetEmail();
await email.loadEmail();
await email.fetchFolder();
await email.getEmailDetails();
await email.parseEmail();
