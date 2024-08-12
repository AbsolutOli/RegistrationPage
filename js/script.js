"use strict"

window.addEventListener("load", () => {
    document.documentElement.classList.add(`loaded`);
})

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const suggestionList = document.getElementById("suggestionList");
    const suggestedText = document.getElementById("suggestedText");
    const suggestedEmailBtn = document.getElementById("suggestedEmailBtn");

    const domains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "aol.com",
      "msn.com",
      "icloud.com",
      "verizon.net",
      "mail.com",
      "att.net",
      "live.com",
      "comcast.net",
      "gmx.com",
      "outlook.com",
    ];

    let suggestions = [];
    let activeSuggestionIndex = -1;
    let suggestedEmail = "";

    emailInput.addEventListener("input", onInput);
    emailInput.addEventListener("keydown", onKeyDown);
    emailInput.addEventListener("blur", onBlur);

    suggestionList.addEventListener("mousedown", (event) => {
      event.preventDefault(); 
    });

    suggestedEmailBtn.addEventListener("click", (event) => {
      event.preventDefault(); 
      if (suggestedEmail) {
        emailInput.value = suggestedEmail;
        suggestedText.style.display = "none";
        suggestions = [];
        renderSuggestions();
        validationField(true, email);
      }
    });

    function onInput() {
      const atPosition = emailInput.value.indexOf("@");
      if (atPosition !== -1) {
        const domainPart = emailInput.value.substring(atPosition + 1);
        suggestions = domains.filter((domain) =>
          domain.startsWith(domainPart)
        );
        activeSuggestionIndex = -1;
        renderSuggestions();
      } else {
        suggestions = [];
        renderSuggestions();
      }
    }

    function scrollToActiveSuggestion() {
      if (
        activeSuggestionIndex >= 0 &&
        suggestionList.children.length > 0
      ) {
        const activeElement =
          suggestionList.children[activeSuggestionIndex];
        if (activeElement) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }

    function renderSuggestions() {
      if (suggestions.length > 0) {
        suggestionList.innerHTML = "";
        suggestions.forEach((suggestion, index) => {
          const li = document.createElement("li");
          li.textContent =
            emailInput.value.split("@")[0] + "@" + suggestion;
          if (index === activeSuggestionIndex) {
            li.classList.add("active");
          }
          li.addEventListener("mousedown", (event) => {
            event.preventDefault();
            selectSuggestion(suggestion);
          });
          suggestionList.appendChild(li);
        });
        suggestionList.style.display = "block"; 
        scrollToActiveSuggestion(); 
      } else {
        suggestionList.style.display = "none";
      }
    }

    function selectSuggestion(suggestion) {
      const atPosition = emailInput.value.indexOf("@");
      if (atPosition !== -1) {
        emailInput.value =
          emailInput.value.substring(0, atPosition + 1) + suggestion;
        suggestions = [];
        renderSuggestions();
        checkEmail();
      }
    }

    function checkEmail() {
      const [localPart, domainPart] = emailInput.value.split("@");
      if (domainPart && !domains.includes(domainPart)) {
        const closestMatch = domains.find((domain) =>
          domain.startsWith(domainPart[0])
        );
        if (closestMatch) {
          suggestedEmail = `${localPart}@${closestMatch}`;
          suggestedText.style.display = "block";
          suggestedEmailBtn.textContent = suggestedEmail;
        }
      } else {
        suggestedEmail = "";
        suggestedText.style.display = "none";
      }
    }

    function onKeyDown(event) {
      if (suggestions.length > 0) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          activeSuggestionIndex =
            (activeSuggestionIndex + 1) % suggestions.length;
          renderSuggestions();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          activeSuggestionIndex =
            (activeSuggestionIndex + suggestions.length - 1) %
            suggestions.length;
          renderSuggestions();
        } else if (event.key === "Enter" && activeSuggestionIndex !== -1) {
          event.preventDefault();
          selectSuggestion(suggestions[activeSuggestionIndex]);
        }
      }
    }

    function onBlur() {
      setTimeout(() => {
        suggestions = [];
        renderSuggestions();
        checkEmail();
      }, 100);
    }
  });