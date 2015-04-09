/**
 * Request Extension
 * Request Handling
 * Usually with Ajax, but implement as required by the Environment
 */
// AMD, Node, or browser global
(function( root, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['easycore', 'underscore'], factory);
    } else if ( typeof exports === 'object' ) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('easycore', 'underscore'));
    } else {
        // Browser globals (root is window)
        factory(root.easyCore, root._);
    }
}(this, function( easyCore, _ ) {
    easyCore.registerExtension('request', function( core, settings ) {
        /**
         * Default configuration
         * @namespace
         * @property {object} defaults
         * @property {object} defaults.ajaxSettings - for more info see the jQuery Api docs
         * @property {string[]} defaults.settingsWhitelist - allowed settings to be set in sandbox requests
         */
        var defaults = {
            ajaxSettings: {
                cache: false,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'html',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                ifModified: false,
                processData: true,
                timeout: 30000,
                type: 'GET'
            },
            settingsWhitelist: ['success', 'error', 'url', 'type', 'method', 'data', 'cache', 'timeout', 'dataType', 'contentType']
        };
        /** @type {object} - merged conf */
        var conf = core.extend(true, {}, defaults, settings);

        /**
         * Core request api
         * Returns full request implementation
         *
         * @param {object} [settings] - request settings to be merged with defaults
         * @returns {object} - jqXHR
         */
        core.request = function( settings ) {
            var request;

            settings = core.extend(true, {}, conf.ajaxSettings, settings);
            request = $.ajax(settings);

            return request;
        };

        /**
         * Sandbox request api
         *
         * @param {object} [settings] - request settings to be merged with defaults
         * @returns {object} - simplified request implementation, just an abort function as the full request implementation is not needed for modules
         */
        core.Sandbox.prototype.request = function( settings ) {
            var request;

            if ( core.getType(settings.success) != 'function' || core.getType(settings.error) != 'function' ) return false;

            // keep whitelisted settings
            settings = _.pick(settings, conf.settingsWhitelist);

            settings = core.extend(true, {}, conf.ajaxSettings, settings);
            request = $.ajax(settings);

            return {
                abort: request.abort
            };
        };

    });
}));