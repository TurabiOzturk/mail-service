// get windowh dimensions
let vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);
let vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);

// select elements
const mainContainer = document.getElementById("main-container")!;
const headerRow = document.getElementById("header-row")!;
const bodyRow = document.getElementById("body-row")!;
const mailsCont = document.getElementById("mails-cont")!;

// parsing dimensions dynamically
const bodyRowHeight = vh - headerRow.clientHeight;
mainContainer.setAttribute("style", `height: ${vh}px`)
bodyRow.setAttribute("style", `height: ${bodyRowHeight}px`)


// Get references to the inbox element and initial dimensions
const inboxElement = document.getElementById("Inbox")!;
let prevViewportWidth = window.innerWidth;
let prevViewportHeight = window.innerHeight;
let prevInboxWidth = inboxElement.offsetWidth;
let prevInboxHeight = inboxElement.offsetHeight;

// Function to handle resize events
export default function handleResize() {
  // Calculate changes for viewport
  const newViewportWidth = window.innerWidth;
  const newViewportHeight = window.innerHeight;
  const viewportWidthChange = newViewportWidth - prevViewportWidth;
  const viewportHeightChange = newViewportHeight - prevViewportHeight;

  // Calculate changes for inbox element
  const newInboxWidth = inboxElement.offsetWidth;
  const newInboxHeight = inboxElement.offsetHeight;
  const inboxWidthChange = newInboxWidth - prevInboxWidth;
  const inboxHeightChange = newInboxHeight - prevInboxHeight;

  

  // Update previous dimensions for the next resize event
  prevViewportWidth = newViewportWidth;
  prevViewportHeight = newViewportHeight;
  prevInboxWidth = newInboxWidth;
  prevInboxHeight = newInboxHeight;
}

// Attach event listener for resize events
window.addEventListener("resize", handleResize);

