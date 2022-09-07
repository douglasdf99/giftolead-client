import DefaultOptions from './DefaultOptions';
import DisplaySize from './modules/DisplaySize';
import Resize from './modules/Resize';

const knownModules = { DisplaySize, Resize };

export default class ImageResize {
  constructor(quill, options = {}) {
    this.quill = quill;

    let moduleClasses = false;

    if (options.modules) {
      moduleClasses = options.modules.slice();
    }

    this.options = DefaultOptions;

    if (moduleClasses !== false) {
      this.options.modules = moduleClasses;
    }

    document.execCommand('enableObjectResizing', false, 'false');

    this.quill.root.addEventListener('click', this.handleClick, false);

    this.quill.root.parentNode.style.position = this.quill.root.parentNode.style.position || 'relative';

    this.moduleClasses = this.options.modules;

    this.modules = [];
  }

  initializeModules = () => {
    this.removeModules();

    this.modules = this.moduleClasses.map(
      ModuleClass => new (knownModules[ModuleClass] || ModuleClass)(this),
    );

    this.modules.forEach(
      (module) => {
        module.onCreate();
      },
    );

    this.onUpdate();
  };

  onUpdate = () => {
    this.repositionElements();
    this.modules.forEach(
      (module) => {
        module.onUpdate();
      },
    );
  };

  removeModules = () => {
    this.modules.forEach(
      (module) => {
        module.onDestroy();
      },
    );

    this.modules = [];
  };

  handleClick = (evt) => {
    if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'IMG') {
      if (this.img === evt.target) {
        return;
      }

      if (this.img) {
        this.hide();
      }

      this.show(evt.target);
    } else if (this.img) {
      this.hide();
    }
  };

  show = (img) => {
    this.img = img;

    this.showOverlay();

    this.initializeModules();
  };

  showOverlay = () => {
    if (this.overlay) {
      this.hideOverlay();
    }

    this.quill.setSelection(null);

    this.setUserSelect('none');

    document.addEventListener('keyup', this.checkImage, true);
    this.quill.root.addEventListener('input', this.checkImage, true);

    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, this.options.overlayStyles);

    this.quill.root.parentNode.appendChild(this.overlay);

    this.repositionElements();
  };

  hideOverlay = () => {
    if (!this.overlay) {
      return;
    }

    this.quill.root.parentNode.removeChild(this.overlay);
    this.overlay = undefined;

    document.removeEventListener('keyup', this.checkImage);
    this.quill.root.removeEventListener('input', this.checkImage);

    this.setUserSelect('');
  };

  repositionElements = () => {
    if (!this.overlay || !this.img) {
      return;
    }

    const parent = this.quill.root.parentNode;
    const imgRect = this.img.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${(imgRect.left - containerRect.left - 1) + parent.scrollLeft}px`,
      top: `${(imgRect.top - containerRect.top) + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });
  };

  hide = () => {
    this.hideOverlay();
    this.removeModules();
    this.img = undefined;
  };

  setUserSelect = (value) => {
    [
      'userSelect',
      'mozUserSelect',
      'webkitUserSelect',
      'msUserSelect',
    ].forEach((prop) => {
      this.quill.root.style[prop] = value;
      document.documentElement.style[prop] = value;
    });
  };

  checkImage = (evt) => {
    if (this.img) {
      if (evt.keyCode === 46 || evt.keyCode === 8) {
        this.quill.find(this.img).deleteAt(0);
      }

      this.hide();
    }
  };
}
