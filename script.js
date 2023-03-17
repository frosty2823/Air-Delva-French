window.addEventListener("load", function () {
  const buttons = document.querySelectorAll(".airDelva");
  const personalNote = document.querySelector("#personalNote");
  const successLabel = document.querySelector("#clipped");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      runCopyFunction(button.textContent, personalNote.value, successLabel);
    });
  });
});

async function runCopyFunction(buttonText, personalNote, successLabel) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let nextTab;
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: copyToClickBoard,
      args: [buttonText, personalNote],
    },
    (result) => {
      console.log(result);
      successLabel.innerText = result[0].result;
      setTimeout(function () {
        successLabel.innerText = " ";
      }, 2000);
    }
  );

  // Switching the Tabs
  chrome.tabs.query({ currentWindow: true }, (tabsArray) => {
    // If only 1 tab is present, do nothing.
    if (tabsArray.length === 1) return;

    // Otherwise switch to the next available tab.
    // Find index of the currently active tab.
    let activeTabIndex = null;
    tabsArray.forEach((tab, index) => {
      if (tab.active === true) {
        activeTabIndex = index;
      }
    });

    // Obtain the next tab. If the current active
    // tab is the last tab, the next tab should be
    // the first tab.
    let tabUrl = "";
    for (let i = 0; i < tabsArray.length; i++) {
      let checkTab = tabsArray[(activeTabIndex + (i + 1)) % tabsArray.length];
      tabUrl = checkTab.url;
      if (tabUrl.includes("airtable")) {
        nextTab = tabsArray[(activeTabIndex + (i + 1)) % tabsArray.length];
        break;
      } else if (tabUrl.includes("spreadsheet")) {
        nextTab = tabsArray[(activeTabIndex + (i + 1)) % tabsArray.length];
        break;
      }
    }

    // Switch to the next tab.
    if (tabUrl.includes("airtable")) {
      chrome.scripting.executeScript({
        target: { tabId: nextTab.id },
        function: runAirTable,
      });
    } else if (tabUrl.includes("spreadsheet")) {
      chrome.scripting.executeScript({
        target: { tabId: nextTab.id },
        function: runGoogleSheet,
      });
    }

    chrome.tabs.update(nextTab.id, { active: true });
  });
}

const runAirTable = function () {
  setTimeout(function () {
    if (
      document.querySelector(
        ".dataRow.leftPane.rowExpansionEnabled.rowSelectionEnabled.cursorCell"
      ) != null
    ) {
      document
        .querySelector(".dataRow.ghost.leftPane.rowInsertionEnabled")
        .click();
      document
        .querySelector(".dataRow.ghost.leftPane.rowInsertionEnabled")
        .click();
      setTimeout(function () {
        document.execCommand("paste");
      }, 1000);
    } else {
      document
        .querySelector(".dataRow.ghost.leftPane.rowInsertionEnabled")
        .click();

      setTimeout(function () {
        document.execCommand("paste");
      }, 1000);
    }
  }, 2000);
};

const runGoogleSheet = function () {
  setTimeout(function () {
    document
      .querySelectorAll(".goog-inline-block.grid4-inner-container")[1]
      .focus();
    setTimeout(function () {
      let evt = new CustomEvent("keydown");
      evt.which = 13;
      evt.keyCode = 13;
      let var1 = document.querySelector(".jfk-textinput.waffle-name-box");
      let var2 = document.querySelector(".cell-input");
      for (let i = 1; i <= 1000; i++) {
        var1.value = `A${i}`;
        const ke = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          keyCode: 13,
        });
        var1.dispatchEvent(ke);
        let var3 = var2.textContent;
        if (var3.length == 0) {
          break;
        }
        console.log(var3.length);
      }
      setTimeout(function () {
        document.execCommand("paste");
      }, 1000);
    }, 1000);
  }, 2000);
};

const copyToClickBoard = function (buttonText, personalNote) {
  if (document.querySelector(".adx")) {
    document.querySelector(".adx").click();
  }
  const arr = document.querySelectorAll(".a3s.aiL");
  let ar = document.querySelector(".nH.aHU").children[0].children[2].children;
  let current = 0;
  for (let i = 0; i < ar.length; i++) {
    let a = ar[i];
    if (a.ariaExpanded == "true") {
      current = i;
      break;
    }
  }
  let email = "";
  let fullName = "";
  let date = "";
  let lastEmailContent = "";
  let newEmail = "";
  let breakThis = 0;
  let generateEmailList = ar[current].children[0].children[0].querySelectorAll(
    "[data-hovercard-id]"
  );
  let validEmail = generateEmailList.forEach(function (checkThis) {
    if (checkThis.getAttribute("email") != null && breakThis != 1) {
      newEmail = checkThis.getAttribute("email");
      breakThis = 1;
    }
  });
  email = newEmail;
  const domainName = email.split("@").pop();
  let newName = "";
  let breakThisForName = 0;
  let generateNameList = ar[current].children[0].children[0].querySelectorAll(
    "[data-hovercard-id]"
  );
  let validName = generateNameList.forEach(function (checkThis) {
    if (
      !(
        checkThis.getAttribute("name").includes(":") &&
        checkThis.getAttribute("name").length <= 4
      ) &&
      breakThisForName != 1 &&
      !checkThis.getAttribute("name").includes("undefined")
    ) {
      newName = checkThis.getAttribute("name");
      breakThisForName = 1;
    }
  });
  fullName = newName;
  if (current == ar.length - 1) {
    notLast1 = arr[arr.length - 2].innerText.split("\n");
    for (let i = 0; i < notLast1.length; i++) {
      if (notLast1[i] == undefined) continue;
      notLast1[i] = notLast1[i].replace("\t", " ");
    }
    lastEmailContent = notLast1.join(" ");
    date = ar[ar.length - 1].innerText.split("\n")[1];
  } else {
    let notLast1 = document
      .querySelector(".nH.hx")
      .children[2].children[current].innerText.split("\n");
    if (
      notLast1.includes("Translate message") &&
      !notLast1.join("").includes("Save email as template")
    ) {
      let checkthisNow = notLast1.indexOf("Translate message") + 1;
      for (let i = 0; i <= checkthisNow; i++) {
        delete notLast1[i];
      }
      lastEmailContent = notLast1.join("");
    }
    if (notLast1.join("").includes("Save email as template")) {
      const newArray = notLast1.join(" ");
      let checkthisNow = newArray.substring(
        newArray.indexOf("Save email as template")
      );
      lastEmailContent = checkthisNow
        .replace("Save email as template", "")
        .split("\t")
        .join(" ");
    } else if (notLast1[3].includes("me")) {
      delete notLast1[0];
      delete notLast1[1];
      delete notLast1[2];
      delete notLast1[3];
      delete notLast1[4];
      for (let i = 0; i < notLast1.length; i++) {
        if (notLast1[i] == undefined) continue;
        notLast1[i] = notLast1[i].replace("\t", " ");
      }
      lastEmailContent = notLast1.join(" ");
    } else {
      delete notLast1[0];
      delete notLast1[1];
      delete notLast1[2];
      delete notLast1[3];
      for (let i = 0; i < notLast1.length; i++) {
        if (notLast1[i] == undefined) continue;
        notLast1[i] = notLast1[i].replace("\t", " ");
      }
      lastEmailContent = notLast1.join(" ");
    }
    date = ar[current].innerText.split("\n")[1];
  }
  const conversationURL = document.location.href;
  let dateFrom = ar[current]
    .querySelector(".g3")
    .getAttribute("title")
    .split(" ");
  let day = dateFrom[dateFrom.length - 4];
  let month = dateFrom[dateFrom.length - 3];
  let year = dateFrom[dateFrom.length - 2];
  let y2 = new Date();
  y3 = y2.getFullYear() > year ? year : y2.getFullYear();
  if (month == "janv.") month = 1;
  else if (month.includes("f")) month = 2;
  else if (month == "mars") month = 3;
  else if (month == "avr.") month = 4;
  else if (month == "mai") month = 5;
  else if (month == "juin") month = 6;
  else if (month == "juil.") month = 7;
  else if (month.includes("ao")) month = 8;
  else if (month == "sept.") month = 9;
  else if (month == "oct.") month = 10;
  else if (month == "nov.") month = 11;
  else if (month.includes("c.")) month = 12;
  date = `${month}/${day}/${y3}`;
  var textArea = document.createElement("textarea");
  textArea.value =
    fullName +
    "\t" +
    date +
    "\t" +
    domainName +
    "\t" +
    email +
    "\t" +
    buttonText +
    "\t" +
    lastEmailContent +
    "\t" +
    personalNote +
    "\t" +
    conversationURL;
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "Coupé(e)" : "Non Coupé";
    return msg;
  } catch (err) {
    console.error("Error");
  }

  document.body.removeChild(textArea);
};

// Keydown Event
// Press Event
