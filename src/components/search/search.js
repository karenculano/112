import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';
import svgToggleClass from '../../globals/js/misc/svg-toggle-class';
import defaultOptions from './options';

class Search extends mixin(createComponent, initComponentBySearch, handles) {
  /**
   * Search with Options.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as the search component.
   * @param {Object} [options] The component options
   * @property {string} [options.selectorInit]
   *   The selector to find search UIs with options.
   * @property {string} [options.selectorSearchView]
   *   The selector to find the search view icon containers.
   * @property {string} [options.selectorSearchInput]
   *   The selector to find the search input.
   * @property {string} [options.selectorClearIcon]
   *   The selector for the clear icon that clears the search box.
   * @property {string} [options.selectorIconContainer] The data attribute selector for the icon layout container.
   * @property {string} [options.classClearHidden] The class used to hide the clear icon.
   * @property {string} [options.classLayoutHidden] The class used to hide nonselected layout view.
   */
  constructor(element, options) {
    super(element, options);
    const closeIcon = this.element.querySelector(this.options.selectorClearIcon);
    const input = this.element.querySelector(this.options.selectorSearchInput);
    if (!input) {
      throw new Error('Cannot find the search input.');
    }

    if (closeIcon) {
      this.manage(
        on(closeIcon, 'click', () => {
          svgToggleClass(closeIcon, this.options.classClearHidden, true);
          input.value = '';
          input.focus();
        })
      );
    }

    this.manage(
      on(this.element, 'click', evt => {
        const toggleItem = eventMatches(evt, this.options.selectorIconContainer);
        if (toggleItem) this.toggleLayout(toggleItem);
      })
    );

    this.manage(
      on(input, 'input', evt => {
        if (closeIcon) this.showClear(evt.target.value, closeIcon);
      })
    );
  }

  /**
   * Toggles between the grid and list layout.
   * @param {HTMLElement} element The element contining the layout toggle.
   */
  toggleLayout(element) {
    [...element.querySelectorAll(this.options.selectorSearchView)].forEach(item => {
      item.classList.toggle(this.options.classLayoutHidden);
    });
  }

  /**
   * Toggles the clear icon visibility
   * @param {HTMLElement} input The element serving as the search input.
   * @param {HTMLElement} icon The element serving as close icon.
   */
  showClear(value, icon) {
    svgToggleClass(icon, this.options.classClearHidden, value.length === 0);
  }

  /**
   * The component options.
   * If `options` is specified in the constructor,
   * {@linkcode Search.create .create()}, or {@linkcode Search.init .init()},
   * properties in this object are overriden for the instance being created
   * and how {@linkcode Search.init .init()} works.
   * @member Search.options
   * @type {Object}
   * @property {string} [options.selectorInit]
   *   The selector to find search UIs with options.
   * @property {string} [options.selectorSearchView]
   *   The selector to find the search view icon containers.
   * @property {string} [options.selectorSearchInput]
   *   The selector to find the search input.
   * @property {string} [options.selectorClearIcon]
   *   The selector for the clear icon that clears the search box.
   * @property {string} [options.selectorIconContainer] The data attribute selector for the icon layout container.
   * @property {string} [options.classClearHidden] The class used to hide the clear icon.
   * @property {string} [options.classLayoutHidden] The class used to hide nonselected layout view.
   */
  static get options() {
    return defaultOptions(settings);
  }

  /**
   * The map associating DOM element and search instance.
   * @member Search.components
   * @type {WeakMap}
   */
  static components = new WeakMap();
}

export default Search;
