(function (root, factory) {
  if(typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TabsChannel = factory();
  }
}(this, function() {
    /**
     * Namespace for localstorage items
     * @private
     * @type {String}
     */
    var namespace = '6cd3556deb0da54bca060b4c39479839';

    var defaultProxyOrigin = 'https://rawgit.com';
    var defaultProxyPath = '/vitkarpov/tabs-channel/master/proxy.html';

    /**
     * Properties to configure an instance
     * @typedef {Object} Proxy~props
     * @property {string} id channel id, should be the same for the different tabs
     * @property {string} proxyOrigin origin of the proxy page
     * @property {string} proxyPath url of the proxy page
     */

    /**
     * @class
     * @param {Proxy~props}
     */
    function Proxy(props) {
        this.channelId = namespace + props.id;
        this.proxyOrigin = props.proxyOrigin || defaultProxyOrigin;
        this.proxyPath = props.proxyPath || defaultProxyPath;

        this.__id = Math.random();
        this.__onReceive = this.__onReceive.bind(this);
        this.__initMessageChannel();
    }

    Proxy.prototype =
    /**
     * @lends Proxy
     */
    {
        /**
         * Each instance could implement this method
         * @param {String} message a message received from the channel
         */
        onReceive: function(message) {},

        /**
         * send a new message to the channel
         * @param  {string} message string message (could be json)
         * @returns {Proxy}
         */
        send: function(message) {
            var data = {
                channelId: this.channelId,
                message: message
            };
            this.__iframeWindow.postMessage(data, this.proxyOrigin);
            return this;
        },

        /**
         * destroy the channel
         * @returns {void}
         */
        destroy: function() {
            this.__destroyMessageChannel();
        },

        /**
         * @private
         * @param  {Event} e
         * @returns {Proxy}
         */
        __onReceive: function(e) {
            if (e.origin === this.proxyOrigin) {
                try {
                    this.onReceive(e.data);
                } catch (e) {
                    throw e;
                }
            }
            return this;
        },

        /**
         * @private
         * @returns {Proxy}
         */
        __initMessageChannel: function() {
            var iframe = document.createElement("iframe");
            var url = this.proxyOrigin + this.proxyPath;

            iframe.src = url + '?' + this.channelId;
            iframe.id = this.__id;
            iframe.style.setProperty('display', 'none');

            document.body.appendChild(iframe);

            this.__iframeWindow = iframe.contentWindow;
            window.addEventListener('message', this.__onReceive);

            return this;
        },

        /**
         * @private
         * @returns {Proxy}
         */
        __destroyMessageChannel: function() {
            window.removeEventListener('message', this.__onReceive);
            document.body.removeChild(this.__iframeWindow);
            this.__iframeWindow = null;

            return this;
        }
    }

    return Proxy;
}));
