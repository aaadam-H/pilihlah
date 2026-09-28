(() => {
  "use strict";

  /**
   * Same design as the native (Compose) version: options is a plain array,
   * not fixed optionA/optionB fields, so scaling to N options later is just
   * a matter of changing MAX_FREE_OPTIONS and unlocking the "+" button —
   * everything below already loops over the array.
   */
  const MAX_FREE_OPTIONS = 2;
  const ABSOLUTE_MAX_OPTIONS = 6; // hard ceiling even for a future paid tier

  const state = {
    options: ["", ""],
    screen: "input", // "input" | "deciding" | "result"
    winnerIndex: -1,
    showError: false,
  };

  // ---------- DOM refs ----------
  const screens = {
    input: document.getElementById("screen-input"),
    deciding: document.getElementById("screen-deciding"),
    result: document.getElementById("screen-result"),
  };
  const optionsListEl = document.getElementById("options-list");
  const errorMsgEl = document.getElementById("error-msg");
  const btnPilih = document.getElementById("btn-pilih");
  const btnAdd = document.getElementById("btn-add");
  const shuffleTextEl = document.getElementById("shuffle-text");
  const winnerTextEl = document.getElementById("winner-text");
  const btnAgain = document.getElementById("btn-again");
  const btnReset = document.getElementById("btn-reset");

  // ---------- Rendering ----------

  function labelFor(index) {
    if (index === 0) return "Pilihan A";
    if (index === 1) return "Pilihan B";
    return "Pilihan " + String.fromCharCode(65 + index);
  }

  function hintFor(index) {
    if (index === 0) return "cth: Nasi Lemak";
    if (index === 1) return "cth: Mee Goreng";
    return "";
  }

  function renderOptions() {
    optionsListEl.innerHTML = "";
    state.options.forEach((value, index) => {
      const row = document.createElement("div");
      row.className = "option-row";

      const field = document.createElement("div");
      field.className = "option-field" + (state.showError && !value.trim() ? " has-error" : "");

      const label = document.createElement("label");
      label.textContent = labelFor(index);

      const input = document.createElement("input");
      input.type = "text";
      input.value = value;
      input.placeholder = hintFor(index);
      input.setAttribute("enterkeyhint", index === state.options.length - 1 ? "done" : "next");
      input.addEventListener("input", (e) => {
        state.options[index] = e.target.value;
        if (state.showError) {
          state.showError = false;
          renderOptions();
          renderError();
        }
      });

      field.appendChild(label);
      field.appendChild(input);
      row.appendChild(field);

      if (state.options.length > 2) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn-remove";
        removeBtn.textContent = "✕";
        removeBtn.addEventListener("click", () => removeOption(index));
        row.appendChild(removeBtn);
      }

      optionsListEl.appendChild(row);
    });
  }

  function renderError() {
    errorMsgEl.hidden = !state.showError;
  }

  function renderAddButton() {
    // Locked for now — this is the exact spot to wire up a purchase/unlock
    // flow later (canAddOption() below is already gating it).
    btnAdd.disabled = true;
  }

  function canAddOption() {
    return state.options.length < MAX_FREE_OPTIONS; // swap in an entitlement check post-paywall
  }

  function removeOption(index) {
    if (state.options.length > 2) {
      state.options.splice(index, 1);
      renderOptions();
    }
  }

  function showScreen(name) {
    state.screen = name;
    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle("active", key === name);
    });
  }

  // ---------- Actions ----------

  function startDeciding() {
    const allFilled = state.options.every((v) => v.trim().length > 0) && state.options.length >= 2;
    if (!allFilled) {
      state.showError = true;
      renderOptions();
      renderError();
      return;
    }
    state.showError = false;
    renderError();
    showScreen("deciding");
    runShuffle();
  }

  function runShuffle() {
    const steps = 16;
    let delayMs = 70;
    let step = 0;

    function tick() {
      const i = Math.floor(Math.random() * state.options.length);
      shuffleTextEl.textContent = state.options[i] || "…";
      step += 1;
      if (step < steps) {
        delayMs = Math.min(delayMs * 1.18, 320);
        setTimeout(tick, delayMs);
      } else {
        pickWinner();
      }
    }
    tick();
  }

  function pickWinner() {
    state.winnerIndex = Math.floor(Math.random() * state.options.length);
    winnerTextEl.textContent = state.options[state.winnerIndex];
    showScreen("result");
  }

  function pickAgain() {
    state.winnerIndex = -1;
    showScreen("deciding");
    runShuffle();
  }

  function resetAll() {
    state.options = state.options.map(() => "");
    while (state.options.length > 2) state.options.pop();
    state.winnerIndex = -1;
    state.showError = false;
    renderOptions();
    renderError();
    showScreen("input");
  }

  // ---------- Wire up ----------

  btnPilih.addEventListener("click", startDeciding);
  btnAgain.addEventListener("click", pickAgain);
  btnReset.addEventListener("click", resetAll);
  btnAdd.addEventListener("click", () => {
    if (canAddOption()) {
      state.options.push("");
      renderOptions();
    }
  });

  renderOptions();
  renderError();
  renderAddButton();
  showScreen("input");
})();
