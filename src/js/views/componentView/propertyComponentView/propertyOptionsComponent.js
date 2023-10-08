import { svgMarkup } from "../../../helpers.js";

export default class PropertyOptionsComponent {
  _generateOptions(properties, propertyComponent) {
    let propertiesMarkup = "";

    properties.forEach((property) => {
      propertiesMarkup += `
            <div class="${`${propertyComponent}-property-content`} action-property-content">
              <div class="action-property-icon">
                ${svgMarkup("property-icon", `${property.icon}`)}
              </div>
              <div class="action-property-text">${property.text}</div>
            </div>       
          `;
    });
    return propertiesMarkup;
  }
  _generateAddedRuleMarkup(propertyComponent) {
    return `<div class="${propertyComponent}-added-rule added-rule"></div>`;
  }

  _generateRuleMarkup(property, propertyComponent) {
    //prettier-ignore
    return `
        <div class="${propertyComponent}-action-container property-action-container">
            <div class="${propertyComponent}-added-rule-box property-added-rule-box">
              <div class="property-added-rule-property">
                <div class="property-rule-icon">
                  ${svgMarkup("property-added-rule-icon", `${property.icon}`)}
                </div>
                <div class="${propertyComponent}-added-rule-name property-added-rule-name">${
                  property.text
                }:</div>
              </div>
              ${
                propertyComponent === "filter"
                  ? this._generateAddedRuleMarkup(propertyComponent)
                  : ""
              }
              <div class="added-rule-icon">
                ${svgMarkup("rule-icon icon-sm", "arrow-down")}
              </div>
            </div>
    `;
  }

  _generateMarkup(properties, propertyComponent) {
    const placeHolder =
      propertyComponent[0].toUpperCase() + propertyComponent.slice(1);
    return `
          <div class="${propertyComponent}-add-action--options property-add-action--options component-options">
            <div class="property-options">
              <div class="property-options-property--option">
                <div class="property-content-box">
                  <form action="" id="property-content-forms">
                    <input
                      type="text"
                      name="${propertyComponent}-search property-search"
                      class="${propertyComponent}-search property-search component-form"
                      placeholder="${placeHolder} by..."
                    />
                  </form>
                  <div class="property-content">
                    <div class="${propertyComponent}-content-search property-content-search">
                      ${this._generateOptions(properties, propertyComponent)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
  }

  _propertyOptionFormStrategy(e, propertyComponent) {
    const propertyOptionsFormStrategy =
      e.type === "keyup" &&
      e.target.classList.contains(`${propertyComponent}-search`);

    return propertyOptionsFormStrategy;
  }

  _handlePropertyOptionsForm(properties, propertyComponent) {
    const propertyOptionsContainer = document.querySelector(
      `.${propertyComponent}-content-search`
    );

    const propertyOptionForm = document.querySelector(
      `.${propertyComponent}-search`
    );

    const renderProperties = properties
      .filter((property) => property.text.toLowerCase() !== "created")
      .filter((property) =>
        property.text
          .toLowerCase()
          .includes(propertyOptionForm.value.trim().toLowerCase())
      );
    propertyOptionsContainer.innerHTML = "";
    propertyOptionsContainer.insertAdjacentHTML(
      "beforeend",
      this._generateOptions(renderProperties)
    );
  }

  _propertyOptionsOptionStrategy(e) {
    const propertyOptionsOptionStrategy =
      e.type === "click" &&
      (e.target.classList.contains("action-property-text") ||
        e.target.closest(".action-property-content"));
    return propertyOptionsOptionStrategy;
  }

  _handlePropertyOptionsOption(e, options) {
    const clickedProperty = e.target.closest(".action-property-content");
    const propertyContainer = document.querySelector(`.property-actions`);
    const selectedProperty = options.props.properties.find(
      (property) =>
        property.text.toLowerCase() ===
        clickedProperty.textContent.replace(":", "").trim().toLowerCase()
    );
    const propertyOptionsOptionMarkup = this._generateRuleMarkup(
      selectedProperty,
      options.property
    );

    propertyContainer.insertAdjacentHTML(
      options.property === "sort" ? "afterbegin" : "beforeend",
      propertyOptionsOptionMarkup
    );

    options.state.property = selectedProperty;
    options.callBack(selectedProperty, options.state);
  }

  _handleRemoveRuleBoxEvent(e) {
    if (!this._state.ruleBoxActive) {
      this._state.children.forEach((child) => child.remove(false));
      this._state.children = [];
    }

    if (this._state.ruleBoxActive) this._state.ruleBoxActive = false; //sets the component active state back to not just rendered
  }
}
