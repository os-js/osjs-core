/*
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

/**
 * Notification
 *
 * @desc Class that creates a notification
 */
export default class Notification {

  /**
   * Create notification
   *
   * @param {Core} core Core reference
   * @param {Node} root Root DOM element
   * @param {Object} options Options
   * @param {String} options.title Title
   * @param {String} options.message Message
   * @param {String} [options.icon] Icon source
   * @param {number} [options.timeout=5000] Timeout value (0=infinite)
   */
  constructor(core, root, options = {}) {
    const defaultLabel = core.make('osjs/locale')
      .translate('LBL_NOTIFICATION');

    /**
     * Core instance reference
     * @type {Core}
     */
    this.core = core;

    /**
     * Root node reference
     * @type {Node}
     */
    this.$root = root;

    /**
     * Notification DOM node
     * @type {Node}
     */
    this.$element = document.createElement('div');

    /**
     * The notification destruction state
     * @type {Boolean}
     */
    this.destroyed = false;

    /**
     * Options
     * @type {Object}
     */
    this.options = Object.assign({
      icon: null,
      title: defaultLabel,
      message: defaultLabel,
      timeout: 5000
    }, options);

    this.core.emit('osjs/notification:create', this);
  }

  /**
   * Destroy notification
   */
  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.core.emit('osjs/notification:destroy', this);

    this.$element.remove();
    this.$element = null;
    this.$root = null;
  }

  /**
   * Render notification
   */
  render() {
    const template = `<div class="title">${this.options.title}</div>
<div class="message">${this.options.message}</div>`;

    this.$element.classList.add('osjs-notification');
    this.$element.innerHTML = template;

    if (this.options.timeout) {
      setTimeout(() => this.destroy(), this.options.timeout);
    }

    this.$element.addEventListener('click', () => this.destroy());

    this.$root.appendChild(this.$element);
  }

}
