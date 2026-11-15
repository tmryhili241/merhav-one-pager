/**
 * main.js - Interactive behavior for the "מגישים בקשת רכש מלאה" learning unit.
 *
 * This script runs after the DOM is fully loaded and handles:
 * 1. Mobile navigation auto-collapse on link click.
 * 2. Section 3 form exploration tracking (state, vertical progress bar, completed badges).
 * 3. Section unlocking (enabling continue button, removing 'inert' and 'is-locked', smooth scrolling, and focusing).
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // =========================================================================
  // State Management
  // Single state object to track user progress across the unit.
  // =========================================================================
  const unitState = {
    openedFormParts: new Set(),
    isFormStructureComplete: false
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
  // 3. Section Unlocking & Navigation
  // =========================================================================

  /**
   * Initializes the "להמשך" continue button in Section 3.
   * When clicked:
   * 1. Removes the .is-locked class and 'inert' attribute from sections 4, 5, and 6.
   * 2. Smoothly scrolls the page to Section 4 (#check).
   * 3. Sets keyboard focus to the Section 4 heading (#check-heading) for accessibility.
   *
   * @returns {void}
   */
  function initSectionUnlocking() {
    const continueBtn = document.getElementById("continue-btn");
    if (!continueBtn) return;

    continueBtn.addEventListener("click", function () {
      const lockedSections = document.querySelectorAll("#check, #practice, #finish");
      lockedSections.forEach(function (section) {
        section.classList.remove("is-locked");
        section.removeAttribute("inert");
      });

      const checkSection = document.getElementById("check");
      const checkHeading = document.getElementById("check-heading");

      if (checkSection) {
        checkSection.scrollIntoView({ behavior: "smooth" });
      }

      if (checkHeading) {
        // Transfer focus to heading for screen reader and keyboard users without breaking scroll
        checkHeading.focus({ preventScroll: true });
      }
    });
  }

  // =========================================================================
  // Initialize all interactive modules
  // =========================================================================
  initMobileNavbar();
  initFormStructureTracking();
  initSectionUnlocking();
});
