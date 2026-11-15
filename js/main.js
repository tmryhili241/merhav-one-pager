/**
 * main.js - Interactive behavior for the "מגישים בקשת רכש מלאה" learning unit.
 *
 * This script runs after the DOM is fully loaded and handles:
 * 1. Mobile navigation auto-collapse on link click.
 * 2. Section 3 form exploration tracking (state, vertical progress bar, completed badges).
 * 3. Section unlocking (enabling continue button, removing 'inert' and 'is-locked', smooth scrolling, and focusing).
 * 4. Section 4 question evaluation and accessible feedback (single-choice and multi-choice).
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // =========================================================================
  // State Management
  // Single state object to track user progress across the unit.
  // =========================================================================
  const unitState = {
    openedFormParts: new Set(),
    isFormStructureComplete: false,
    isQ2Revealed: false,
    isQ1Hidden: false,
    unlockedSections: new Set(),
    questions: {
      q1: { status: null, selected: [] },
      q2: { status: null, selected: [] }
    }
  };

  // IDs of the 3 collapsible explanation containers in Section 3
  const formPartCollapseIds = ["explainPart1", "explainPart2", "explainPart3"];

  // =========================================================================
  // 1. Mobile Navigation
  // =========================================================================

  /**
   * Initializes mobile navbar behavior.
   * Listens for clicks on any navigation link within the collapsible menu.
   * If the menu is currently expanded (has class 'show'), it automatically hides it
   * via Bootstrap's Collapse API. On desktop screens, this has no effect.
   *
   * @returns {void}
   */
  function initMobileNavbar() {
    const navbarCollapse = document.getElementById("mainNavbarMenu");
    if (!navbarCollapse) return;

    const navLinks = navbarCollapse.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navbarCollapse.classList.contains("show")) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
            toggle: false
          });
          bsCollapse.hide();
        }
      });
    });
  }

  // =========================================================================
  // 2. Section 3: Form Structure Tracking
  // =========================================================================

  /**
   * Updates Section 3 progress indicators and triggers completion logic:
   * - Sets vertical progress bar height according to opened parts (0%, 33%, 67%, 100%).
   * - Updates aria-valuenow and aria-label on the progressbar for accessibility.
   * - Updates the visible progress counter text (0/3 to 3/3).
   * - Marks opened hotspot buttons with the .is-completed CSS class (displays checkmark).
   * - Updates button aria-label to include "(נפתח)".
   * - Enables the "להמשך" continue button once all 3 parts have been viewed.
   *
   * @returns {void}
   */
  function updateFormStructureProgress() {
    const totalParts = formPartCollapseIds.length;
    const openedCount = unitState.openedFormParts.size;

    // Percentages mapping for 0 to 3 parts
    const progressPercentages = {
      0: 0,
      1: 33,
      2: 67,
      3: 100
    };
    const percentage = progressPercentages[openedCount] ?? Math.round((openedCount / totalParts) * 100);

    // Update progress bar element
    const progressBar = document.getElementById("form-structure-progress-bar");
    const progressContainer = document.getElementById("form-structure-progress");
    const progressText = document.getElementById("form-structure-progress-text");

    if (progressBar) {
      progressBar.style.height = percentage + "%";
    }

    if (progressContainer) {
      progressContainer.setAttribute("aria-valuenow", String(openedCount));
      progressContainer.setAttribute("aria-label", `התקדמות: ${openedCount} מתוך ${totalParts} חלקים`);
    }

    if (progressText) {
      progressText.textContent = `${openedCount}/${totalParts}`;
    }

    // Update hotspot buttons for opened parts
    formPartCollapseIds.forEach(function (collapseId) {
      if (unitState.openedFormParts.has(collapseId)) {
        const triggerBtn = document.querySelector(`[data-bs-target="#${collapseId}"]`);
        if (triggerBtn) {
          triggerBtn.classList.add("is-completed");
          const currentLabel = triggerBtn.getAttribute("aria-label") || "";
          if (!currentLabel.includes("(נפתח)")) {
            triggerBtn.setAttribute("aria-label", `${currentLabel} (נפתח)`);
          }
        }
      }
    });

    // Check completion condition: all 3 parts have been opened at least once
    if (openedCount === totalParts && !unitState.isFormStructureComplete) {
      unitState.isFormStructureComplete = true;

      const continueBtn = document.getElementById("continue-btn");
      if (continueBtn) {
        continueBtn.disabled = false;
      }

      // =======================================================================
      // LMS / SCORM Integration Hook:
      // When connecting to an LMS or SCORM standard in the next stage, report
      // section 3 completion or lesson progress bookmarking here:
      // e.g., scorm.set("cmi.core.lesson_location", "section-check");
      // =======================================================================
    }
  }

  /**
   * Initializes event listeners for the Section 3 collapsible parts.
   * Loops through the 3 explanation elements and listens for the 'shown.bs.collapse' event.
   * Each part is registered in unitState.openedFormParts only on its first open.
   *
   * @returns {void}
   */
  function initFormStructureTracking() {
    formPartCollapseIds.forEach(function (collapseId) {
      const collapseEl = document.getElementById(collapseId);
      if (!collapseEl) return;

      collapseEl.addEventListener("shown.bs.collapse", function () {
        if (!unitState.openedFormParts.has(collapseId)) {
          unitState.openedFormParts.add(collapseId);
          updateFormStructureProgress();
        }
      });
    });

    // Set initial progress bar state
    updateFormStructureProgress();
  }

  // =========================================================================
  // 3. Section Unlocking & Navigation (Chained progression)
  // =========================================================================

  /**
   * Unlocks a target section and navigates the user to it:
   * 1. Removes the .is-locked class and 'inert' attribute from the section.
   * 2. Smoothly scrolls the section into view.
   * 3. Sets keyboard and screen-reader focus to the section's heading element (which has tabindex="-1").
   * 4. Persists the unlocked state in unitState.unlockedSections.
   *
   * @param {string} sectionId - DOM ID of the section to unlock ("check" or "practice").
   * @param {string} headingId - DOM ID of the heading inside that section to receive focus.
   * @returns {void}
   * @runs Triggered when user clicks "להמשך" in Section 3 or "להמשך לתרגול" in Section 4.
   */
  function unlockAndNavigateToSection(sectionId, headingId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.classList.remove("is-locked");
    section.removeAttribute("inert");
    unitState.unlockedSections.add(sectionId);

    const heading = document.getElementById(headingId);

    section.scrollIntoView({ behavior: "smooth" });

    if (heading) {
      heading.focus({ preventScroll: true });
    }
  }

  /**
   * Initializes the section progression buttons:
   * - Section 3 "להמשך" button: unlocks Section 4 (#check) only.
   * - Section 4 "להמשך לתרגול" button: unlocks Section 5 (#practice) only.
   *
   * @returns {void}
   * @runs Called once during DOMContentLoaded.
   */
  function initSectionUnlocking() {
    const continueBtn = document.getElementById("continue-btn");
    if (continueBtn) {
      continueBtn.addEventListener("click", function () {
        unlockAndNavigateToSection("check", "check-heading");
      });
    }

    const practiceContinueBtn = document.getElementById("practice-continue-btn");
    if (practiceContinueBtn) {
      practiceContinueBtn.addEventListener("click", function () {
        unlockAndNavigateToSection("practice", "practice-heading");
      });
    }
  }

  // =========================================================================
  // 4. Section 4: Evaluation Questions & Feedback
  // =========================================================================

  /**
   * Clears highlight classes from choices belonging to a specific question.
   *
   * @param {string} questionId - ID of the question ("q1" or "q2").
   * @returns {void}
   * @runs Triggered whenever user changes their selection or submits a new check.
   */
  function clearQuestionHighlights(questionId) {
    const form = document.getElementById(`form-${questionId}`);
    if (!form) return;
    const formChecks = form.querySelectorAll(".form-check");
    formChecks.forEach(function (checkEl) {
      checkEl.classList.remove("choice-correct");
    });
  }

  /**
   * Evaluates the selected options for a given question against unitData.questions.
   * Determines status: 'empty', 'correct', 'partial', or 'wrong'.
   * Updates unitState with the result for future LMS reporting.
   *
   * @param {string} questionId - ID of the question to evaluate ("q1" or "q2").
   * @returns {Object|null} Evaluation result containing status, selected values, and correctSelected values.
   * @runs Triggered when the user clicks the "בדיקה" button for that question.
   */
  function checkQuestion(questionId) {
    // Access unitData directly without window prefix (top-level const in data.js does not attach to window)
    if (typeof unitData === "undefined" || !Array.isArray(unitData.questions)) {
      return null;
    }

    const questionData = unitData.questions.find(function (q) {
      return q.id === questionId;
    });
    if (!questionData) return null;

    const checkedInputs = Array.from(document.querySelectorAll(`input[name="${questionId}"]:checked`));
    const selectedValues = checkedInputs.map(function (input) {
      return input.value;
    });

    let status = "empty";
    let correctSelected = [];

    if (selectedValues.length === 0) {
      status = "empty";
    } else {
      const correctSet = new Set(questionData.correct);
      correctSelected = selectedValues.filter(function (val) {
        return correctSet.has(val);
      });
      const wrongSelected = selectedValues.filter(function (val) {
        return !correctSet.has(val);
      });

      const isFullyCorrect = correctSelected.length === questionData.correct.length && wrongSelected.length === 0;

      if (isFullyCorrect) {
        status = "correct";
      } else if (correctSelected.length === 0) {
        status = "wrong";
      } else {
        // At least one correct answer chosen, but not completely correct
        status = "partial";
      }
    }

    // Persist status in unitState for future scoring and LMS integration
    if (unitState.questions[questionId]) {
      unitState.questions[questionId].status = status;
      unitState.questions[questionId].selected = selectedValues;
    }

    return {
      status: status,
      selected: selectedValues,
      correctSelected: correctSelected,
      feedbackText: questionData.feedback[status] || ""
    };
  }

  /**
   * Displays the evaluation feedback alert inside the question's feedback area.
   * Applies accessible styling according to Design Rules 5 and 7 (border colors, black text).
   * Highlights correctly chosen items during partial feedback.
   *
   * @param {string} questionId - ID of the question ("q1" or "q2").
   * @param {Object} evaluation - Evaluation result from checkQuestion().
   * @returns {void}
   * @runs Triggered immediately after checkQuestion() returns.
   */
  function displayFeedback(questionId, evaluation) {
    const feedbackArea = document.getElementById(`feedback-${questionId}`);
    if (!feedbackArea || !evaluation) return;

    // Reset previous visual highlights
    clearQuestionHighlights(questionId);

    // Build accessible Bootstrap Alert safely using textContent instead of innerHTML
    feedbackArea.innerHTML = "";
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert feedback-alert feedback-alert-${evaluation.status} mb-0`;
    alertDiv.setAttribute("role", "alert");
    alertDiv.textContent = evaluation.feedbackText;
    feedbackArea.appendChild(alertDiv);

    // Highlight correct choices during partial feedback (Rule 7: green border, text remains black)
    if (evaluation.status === "partial") {
      evaluation.correctSelected.forEach(function (val) {
        const input = document.querySelector(`input[name="${questionId}"][value="${val}"]`);
        if (input) {
          const formCheck = input.closest(".form-check");
          if (formCheck) {
            formCheck.classList.add("choice-correct");
          }
        }
      });
    }
  }

  /**
   * Reveals Question 2 after Question 1 has been submitted with a non-empty answer.
   * Removes 'hidden' attribute and updates unitState.
   * NOTE: Focus is intentionally NOT moved to question 2 to avoid interrupting
   * the aria-live screen-reader announcement of question 1's feedback.
   * Once revealed, Question 2 remains visible.
   *
   * @returns {void}
   * @runs Triggered after checking Question 1 when its evaluation status is not 'empty'.
   */
  function revealQuestion2() {
    const cardQ2 = document.getElementById("card-q2");
    if (!cardQ2) return;

    cardQ2.removeAttribute("hidden");
    unitState.isQ2Revealed = true;
  }

  /**
   * Checks whether both evaluation questions have been answered with a non-empty choice.
   * If both questions have been submitted, enables the "להמשך לתרגול" button.
   *
   * @returns {void}
   * @runs Triggered after evaluating either question in Section 4.
   */
  function updatePracticeContinueButton() {
    const q1Status = unitState.questions.q1.status;
    const q2Status = unitState.questions.q2.status;

    const isQ1Answered = q1Status !== null && q1Status !== "empty";
    const isQ2Answered = q2Status !== null && q2Status !== "empty";

    if (isQ1Answered && isQ2Answered) {
      const practiceContinueBtn = document.getElementById("practice-continue-btn");
      if (practiceContinueBtn) {
        practiceContinueBtn.disabled = false;
      }
    }
  }

  /**
   * Initializes event listeners for Section 4 evaluation questions:
   * - "בדיקה" button clicks: runs validation, presents feedback, progressively reveals Q2, and checks if practice is unlockable.
   * - Form Q1 input change events: clears feedback and highlights for Q1.
   * - Form Q2 input change events: on first interaction, hides Question 1 card permanently, and clears feedback/highlights for Q2.
   *
   * @returns {void}
   * @runs Called once on page load during DOMContentLoaded.
   */
  function initQuestionHandlers() {
    const checkButtons = document.querySelectorAll(".check-btn");
    checkButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const questionId = btn.getAttribute("data-question-id");
        if (!questionId) return;

        const evaluation = checkQuestion(questionId);
        if (evaluation) {
          displayFeedback(questionId, evaluation);

          // Progressive disclosure: checking Q1 with any valid answer (correct or wrong, not empty) reveals Q2
          if (questionId === "q1" && evaluation.status !== "empty" && !unitState.isQ2Revealed) {
            revealQuestion2();
          }

          // Chained unlocking: check if both questions have been submitted to enable continue to practice
          updatePracticeContinueButton();
        }
      });
    });

    // Reset highlights and feedback when user changes their selection in Form Q1
    const formQ1 = document.getElementById("form-q1");
    if (formQ1) {
      formQ1.addEventListener("change", function () {
        clearQuestionHighlights("q1");
        const feedbackArea = document.getElementById("feedback-q1");
        if (feedbackArea) {
          feedbackArea.innerHTML = "";
        }
      });
    }

    // Form Q2 change listener: on the first checkbox change, hide Question 1 permanently
    const formQ2 = document.getElementById("form-q2");
    if (formQ2) {
      formQ2.addEventListener("change", function () {
        if (!unitState.isQ1Hidden) {
          const cardQ1 = document.getElementById("card-q1");
          if (cardQ1) {
            cardQ1.setAttribute("hidden", "");
          }
          unitState.isQ1Hidden = true;
        }

        clearQuestionHighlights("q2");
        const feedbackArea = document.getElementById("feedback-q2");
        if (feedbackArea) {
          feedbackArea.innerHTML = "";
        }
      });
    }
  }

  // =========================================================================
  // Initialize all interactive modules
  // =========================================================================
  initMobileNavbar();
  initFormStructureTracking();
  initSectionUnlocking();
  initQuestionHandlers();
});
