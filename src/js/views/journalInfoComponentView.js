import { importSignals } from "../signals";
import { HEADER_TITLE_LENGTH, SIDEBAR_JOURNAL_TITLE_LENGTH } from "../config";
import { valueEclipser, svgMarkup } from "../helpers";

class JournalInfoComponentView {
  _parentElement = document.querySelector(".container-main-content .row");
  _eventHandlers;
  _events = ["keyup", "click"];
  _timer;
  //init import of signal
  _signals = importSignals.object = importSignals.import()

  //signals to route sidebarclose event to sidebar component
  init(modelHandler) {
    modelHandler();
  }

  pass() { }

  addComponentHandlers(handlers) {
    this._eventHandlers = handlers;
  }

  addDelegationEventListener(e) {
    e.stopPropagation();
    this._events.find((evt) => evt === e.type)
      ? this._handleEvents(e)
      : this.pass();
  }

  _handleEvents(e) {
    if (this._journalNameChangeMatchStrategy(e))
      this._handleJournalEventDelay(this._handleJournalNameChangeEvent.bind(this, e))//this._handleJournalNameChangeEvent(e);
    if (this._journalDescChangeMatchStrategy(e))
      this._handleJournalEventDelay(this._handleJournalDescChangeEvent.bind(this, e));//this._handleJournalDescChangeEvent(e);

    this._signals.observe(e, "journalInfo");
  }

  _journalNameChangeMatchStrategy(e) {
    if (e.type === "keyup") {
      const matchStrategy =
        e.target.classList.contains("journal-title-input") ||
        e.target.closest(".journal-title-input");
      return matchStrategy;
    }
  }

  _journalDescChangeMatchStrategy(e) {
    if (e.type === "keyup") {
      const matchStrategy =
        e.target.classList.contains("content-description-input") ||
        e.target.closest(".content-description-input");
      return matchStrategy;
    }
  }

  _clearPreviousTimer() {
    clearInterval(this._timer)
    console.log("cleared... ")
    this._timer = null
  }

  _handleJournalEventDelay(eventToTrigger) {
    if (this._timer) this._clearPreviousTimer()
    console.log("input update event")
    this._timer = setTimeout(() => {
      eventToTrigger()

    }, 2 * 1000)
  }

  _handleJournalNameChangeEvent(e) {
    const nameInputVal = e.target.textContent.trim();
    const sideBarJournalTitle = document.querySelector(
      ".nav-options-journal .nav-options-text"
    );
    const headerTitle = document.querySelector(
      ".container-header .nav-options-text"
    );
    headerTitle.textContent =
      nameInputVal.length > 0 ? valueEclipser(nameInputVal, HEADER_TITLE_LENGTH) : "Untitled";
    sideBarJournalTitle.textContent =
      nameInputVal.length > 0 ? valueEclipser(nameInputVal, SIDEBAR_JOURNAL_TITLE_LENGTH) : "Untitled";
    const payload = {
      name: nameInputVal,
    };
    this._eventHandlers.controlUpdateJournalInfo(payload);
  }

  _handleJournalDescChangeEvent(e) {
    const descInputVal = e.target.innerHTML;

    const payload = {
      description: descInputVal,
    };
    this._eventHandlers.controlUpdateJournalInfo(payload);
  }

  _generateHeader(journal) {
    return `
        <div class="container-header">
            <div class="nav-options-journal-icon">
              ${svgMarkup("journal-icon icon", "journal-icon")}
            </div>

            <div class="nav-options-text">${journal.name.length > 0 ? journal.name : "Untitled"
      }</div>
        </div>
    `;
  }

  _generateMainContent(journal) {
    debugger
    return `
        <div class="main-content-info">
            <div class="main-content-heading">
              <div class="nav-options-journal-icon">
                ${svgMarkup("journal-icon icon", "journal-icon")}
              </div>

              <h2
                class="journal-title-input"
                contenteditable="true"
                placeholder="Untitled"
              >${journal.name.trim()}</h2>
            </div>
            <div class="main-content-description">
              <div
                class="content-description-input"
                contenteditable="true"
              >
                ${journal.description}
              </div>
            </div>
        </div>
    `;
  }

  render(model) {
    //add header
    const headerMarkup = this._generateHeader(model);
    const headerContainer = document.querySelector(".content-container .row");
    headerContainer.insertAdjacentHTML("afterbegin", headerMarkup);

    //add info
    const contentInfoMarkup = this._generateMainContent(model);
    this._parentElement.insertAdjacentHTML("afterbegin", contentInfoMarkup);
  }
}
// export const importJournalInfoComponentView = (() => new JournalInfoComponentView());

export const importJournalInfoComponentView = {
  import: (() => new JournalInfoComponentView()), object: null
}
