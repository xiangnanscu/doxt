'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _timm = require('timm');

var _zip = require('./zip');

var _xml = require('./xml');

var _preprocessTemplate = require('./preprocessTemplate');

var _preprocessTemplate2 = _interopRequireDefault(_preprocessTemplate);

var _processTemplate = require('./processTemplate');

var _reportUtils = require('./reportUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign, no-console */

var DEBUG = process.env.DEBUG_DOCX_TEMPLATES;
var DEFAULT_CMD_DELIMITER = '+++';
var DEFAULT_LITERAL_XML_DELIMITER = '||';

var log = DEBUG ? require('./debug').mainStory : null;
var chalk = DEBUG ? require('./debug').chalk : null;

// ==========================================
// Main
// ==========================================
var getCmdDelimiter = function getCmdDelimiter(delimiter) {
  if (!delimiter) {
    return [DEFAULT_CMD_DELIMITER, DEFAULT_CMD_DELIMITER];
  } else if (typeof delimiter == 'string') {
    return [delimiter, delimiter];
  } else {
    return delimiter;
  }
};
var createReport = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
    var template, data, queryVars, _probe, templatePath, literalXmlDelimiter, createOptions, xmlOptions, zip, templateXml, tic, parseResult, jsTemplate, tac, finalTemplate, queryResult, query, result, report1, images1, links1, htmls1, reportXml, numImages, numHtmls, files, images, links, htmls, i, filePath, raw, js0, js, _ref3, report2, images2, links2, htmls2, xml, segments, documentComponent, contentTypesPath, contentTypesXml, contentTypes, ensureContentType, finalContentTypesXml, output;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            DEBUG && log.debug('Report options:', { attach: options });
            template = options.template, data = options.data, queryVars = options.queryVars, _probe = options._probe;
            templatePath = 'word';
            literalXmlDelimiter = options.literalXmlDelimiter || DEFAULT_LITERAL_XML_DELIMITER;
            createOptions = {
              cmdDelimiter: getCmdDelimiter(options.cmdDelimiter),
              literalXmlDelimiter: literalXmlDelimiter,
              processLineBreaks: options.processLineBreaks != null ? options.processLineBreaks : true,
              noSandbox: options.noSandbox || false,
              runJs: options.runJs,
              additionalJsContext: options.additionalJsContext || {}
            };
            xmlOptions = { literalXmlDelimiter: literalXmlDelimiter };

            // ---------------------------------------------------------
            // Unzip
            // ---------------------------------------------------------

            DEBUG && log.debug('Unzipping...');
            (0, _zip.zipInit)();
            _context2.next = 10;
            return (0, _zip.zipLoad)(template);

          case 10:
            zip = _context2.sent;


            // ---------------------------------------------------------
            // Read the 'document.xml' file (the template) and parse it
            // ---------------------------------------------------------
            DEBUG && log.debug('Reading template...');
            _context2.next = 14;
            return (0, _zip.zipGetText)(zip, templatePath + '/document.xml');

          case 14:
            templateXml = _context2.sent;

            DEBUG && log.debug('Template file length: ' + templateXml.length);
            DEBUG && log.debug('Parsing XML...');
            tic = new Date().getTime();
            _context2.next = 20;
            return (0, _xml.parseXml)(templateXml);

          case 20:
            parseResult = _context2.sent;
            jsTemplate = parseResult;
            tac = new Date().getTime();

            DEBUG && log.debug('File parsed in ' + (tac - tic) + ' ms', {
              attach: jsTemplate,
              attachLevel: 'trace'
            });

            // ---------------------------------------------------------
            // Preprocess template
            // ---------------------------------------------------------
            DEBUG && log.debug('Preprocessing template...');
            // DEBUG && log.debug('Preprocessing template...', {
            //   attach: jsTemplate,
            //   attachLevel: 'debug',
            //   ignoreKeys: ['_parent', '_fTextNode', '_attrs'],
            // });
            finalTemplate = (0, _preprocessTemplate2.default)(jsTemplate, createOptions);

            // ---------------------------------------------------------
            // Fetch the data that will fill in the template
            // ---------------------------------------------------------

            queryResult = null;

            if (!(typeof data === 'function')) {
              _context2.next = 38;
              break;
            }

            DEBUG && log.debug('Looking for the query in the template...');
            _context2.next = 31;
            return (0, _processTemplate.extractQuery)(finalTemplate, createOptions);

          case 31:
            query = _context2.sent;

            DEBUG && log.debug('Query: ' + (query || 'no query found'));
            _context2.next = 35;
            return data(query, queryVars);

          case 35:
            queryResult = _context2.sent;
            _context2.next = 39;
            break;

          case 38:
            queryResult = data;

          case 39:

            // ---------------------------------------------------------
            // Process document.xml:
            // - Generate the report
            // - Build output XML and write it to disk
            // - Images
            // ---------------------------------------------------------
            DEBUG && log.debug('Generating report...');
            // DEBUG &&
            //   log.debug('Generating report...', {
            //     attach: finalTemplate,
            //     attachLevel: 'debug',
            //     ignoreKeys: ['_parent', '_fTextNode', '_attrs'],
            //   });
            _context2.next = 42;
            return (0, _processTemplate.produceJsReport)(queryResult, finalTemplate, createOptions);

          case 42:
            result = _context2.sent;
            report1 = result.report, images1 = result.images, links1 = result.links, htmls1 = result.htmls;

            if (!(_probe === 'JS')) {
              _context2.next = 46;
              break;
            }

            return _context2.abrupt('return', report1);

          case 46:

            // DEBUG &&
            //   log.debug('Report', {
            //     attach: report,
            //     attachLevel: 'debug',
            //     ignoreKeys: ['_parent', '_fTextNode', '_attrs'],
            //   });
            DEBUG && log.debug('Converting report to XML...');
            reportXml = (0, _xml.buildXml)(report1, xmlOptions);

            if (!(_probe === 'XML')) {
              _context2.next = 50;
              break;
            }

            return _context2.abrupt('return', reportXml);

          case 50:
            DEBUG && log.debug('Writing report...');
            (0, _zip.zipSetText)(zip, templatePath + '/document.xml', reportXml);

            numImages = (0, _keys2.default)(images1).length;
            numHtmls = (0, _keys2.default)(htmls1).length;
            _context2.next = 56;
            return processImages(images1, 'document.xml', zip, templatePath);

          case 56:
            _context2.next = 58;
            return processLinks(links1, 'document.xml', zip, templatePath);

          case 58:
            _context2.next = 60;
            return processHtmls(htmls1, 'document.xml', zip, templatePath, xmlOptions);

          case 60:

            // ---------------------------------------------------------
            // Process all other XML files (they may contain headers, etc.)
            // ---------------------------------------------------------
            files = [];

            zip.forEach(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filePath) {
                var regex;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        regex = new RegExp(templatePath + '\\/[^\\/]+\\.xml');

                        if (regex.test(filePath) && filePath !== templatePath + '/document.xml' && filePath.indexOf(templatePath + '/template') !== 0) {
                          files.push(filePath);
                        }

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

            images = images1;
            links = links1;
            htmls = htmls1;
            i = 0;

          case 66:
            if (!(i < files.length)) {
              _context2.next = 101;
              break;
            }

            filePath = files[i];

            DEBUG && log.info('Processing ' + chalk.bold(filePath) + '...');
            _context2.next = 71;
            return (0, _zip.zipGetText)(zip, filePath);

          case 71:
            raw = _context2.sent;
            _context2.next = 74;
            return (0, _xml.parseXml)(raw);

          case 74:
            js0 = _context2.sent;
            js = (0, _preprocessTemplate2.default)(js0, createOptions);
            _context2.next = 78;
            return (0, _processTemplate.produceJsReport)(queryResult, js, createOptions);

          case 78:
            _ref3 = _context2.sent;
            report2 = _ref3.report;
            images2 = _ref3.images;
            links2 = _ref3.links;
            htmls2 = _ref3.htmls;

            images = (0, _timm.merge)(images, images2);
            links = (0, _timm.merge)(links, links2);
            htmls = (0, _timm.merge)(htmls, htmls2);
            xml = (0, _xml.buildXml)(report2, xmlOptions);

            (0, _zip.zipSetText)(zip, filePath, xml);

            numImages += (0, _keys2.default)(images2).length;
            numHtmls += (0, _keys2.default)(htmls2).length;

            segments = filePath.split('/');
            documentComponent = segments[segments.length - 1];
            _context2.next = 94;
            return processImages(images2, documentComponent, zip, templatePath);

          case 94:
            _context2.next = 96;
            return processLinks(links2, 'document.xml', zip, templatePath);

          case 96:
            _context2.next = 98;
            return processHtmls(htmls2, 'document.xml', zip, templatePath, xmlOptions);

          case 98:
            i++;
            _context2.next = 66;
            break;

          case 101:
            if (!(numImages || numHtmls)) {
              _context2.next = 115;
              break;
            }

            DEBUG && log.debug('Completing [Content_Types].xml...');
            contentTypesPath = '[Content_Types].xml';
            _context2.next = 106;
            return (0, _zip.zipGetText)(zip, contentTypesPath);

          case 106:
            contentTypesXml = _context2.sent;
            _context2.next = 109;
            return (0, _xml.parseXml)(contentTypesXml);

          case 109:
            contentTypes = _context2.sent;

            // DEBUG && log.debug('Content types', { attach: contentTypes });
            ensureContentType = function ensureContentType(extension, contentType) {
              var children = contentTypes._children;
              if (children.filter(function (o) {
                return !o._fTextNode && o._attrs.Extension === extension;
              }).length) {
                return;
              }
              (0, _reportUtils.addChild)(contentTypes, (0, _reportUtils.newNonTextNode)('Default', {
                Extension: extension,
                ContentType: contentType
              }));
            };

            if (numImages) {
              DEBUG && log.debug('Completing [Content_Types].xml for IMAGES...');
              ensureContentType('png', 'image/png');
              ensureContentType('jpg', 'image/jpeg');
              ensureContentType('jpeg', 'image/jpeg');
              ensureContentType('gif', 'image/gif');
              ensureContentType('bmp', 'image/bmp');
              ensureContentType('svg', 'image/svg+xml');
            }
            if (numHtmls) {
              DEBUG && log.debug('Completing [Content_Types].xml for HTML...');
              ensureContentType('html', 'text/html');
            }
            finalContentTypesXml = (0, _xml.buildXml)(contentTypes, xmlOptions);

            (0, _zip.zipSetText)(zip, contentTypesPath, finalContentTypesXml);

          case 115:

            // ---------------------------------------------------------
            // Zip the results
            // ---------------------------------------------------------
            DEBUG && log.debug('Zipping...');
            _context2.next = 118;
            return (0, _zip.zipSave)(zip);

          case 118:
            output = _context2.sent;
            return _context2.abrupt('return', output);

          case 120:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function createReport(_x) {
    return _ref.apply(this, arguments);
  };
}();

// ==========================================
// Process images
// ==========================================
var processImages = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(images, documentComponent, zip, templatePath) {
    var imageIds, relsPath, rels, i, imageId, _images$imageId, extension, imgData, imgName, imgPath, finalRelsXml;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            DEBUG && log.debug('Processing images for ' + documentComponent + '...');
            imageIds = (0, _keys2.default)(images);

            if (!imageIds.length) {
              _context3.next = 28;
              break;
            }

            DEBUG && log.debug('Completing document.xml.rels...');
            relsPath = templatePath + '/_rels/' + documentComponent + '.rels';
            _context3.next = 7;
            return getRelsFromZip(zip, relsPath);

          case 7:
            rels = _context3.sent;
            i = 0;

          case 9:
            if (!(i < imageIds.length)) {
              _context3.next = 26;
              break;
            }

            imageId = imageIds[i];
            _images$imageId = images[imageId], extension = _images$imageId.extension, imgData = _images$imageId.data;
            imgName = 'template_' + documentComponent + '_image' + (i + 1) + extension;

            DEBUG && log.debug('Writing image ' + imageId + ' (' + imgName + ')...');
            imgPath = templatePath + '/media/' + imgName;

            if (!(typeof imgData === 'string')) {
              _context3.next = 20;
              break;
            }

            _context3.next = 18;
            return (0, _zip.zipSetBase64)(zip, imgPath, imgData);

          case 18:
            _context3.next = 22;
            break;

          case 20:
            _context3.next = 22;
            return (0, _zip.zipSetBinary)(zip, imgPath, imgData);

          case 22:
            (0, _reportUtils.addChild)(rels, (0, _reportUtils.newNonTextNode)('Relationship', {
              Id: imageId,
              Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image',
              Target: 'media/' + imgName
            }));

          case 23:
            i++;
            _context3.next = 9;
            break;

          case 26:
            finalRelsXml = (0, _xml.buildXml)(rels, {
              literalXmlDelimiter: DEFAULT_LITERAL_XML_DELIMITER
            });

            (0, _zip.zipSetText)(zip, relsPath, finalRelsXml);

          case 28:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function processImages(_x3, _x4, _x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

// ==========================================
// Process links
// ==========================================
var processLinks = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(links, documentComponent, zip, templatePath) {
    var linkIds, relsPath, rels, i, linkId, url, finalRelsXml;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            DEBUG && log.debug('Processing links for ' + documentComponent + '...');
            linkIds = (0, _keys2.default)(links);

            if (!linkIds.length) {
              _context4.next = 11;
              break;
            }

            DEBUG && log.debug('Completing document.xml.rels...');
            relsPath = templatePath + '/_rels/' + documentComponent + '.rels';
            _context4.next = 7;
            return getRelsFromZip(zip, relsPath);

          case 7:
            rels = _context4.sent;

            for (i = 0; i < linkIds.length; i++) {
              linkId = linkIds[i];
              url = links[linkId].url;

              (0, _reportUtils.addChild)(rels, (0, _reportUtils.newNonTextNode)('Relationship', {
                Id: linkId,
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',
                Target: url,
                TargetMode: 'External'
              }));
            }
            finalRelsXml = (0, _xml.buildXml)(rels, {
              literalXmlDelimiter: DEFAULT_LITERAL_XML_DELIMITER
            });

            (0, _zip.zipSetText)(zip, relsPath, finalRelsXml);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function processLinks(_x7, _x8, _x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var processHtmls = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(htmls, documentComponent, zip, templatePath) {
    var htmlIds, htmlFiles, relsPath, rels, i, htmlId, htmlData, htmlName, htmlPath, finalRelsXml;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            DEBUG && log.debug('Processing htmls for ' + documentComponent + '...');
            htmlIds = (0, _keys2.default)(htmls);

            if (!htmlIds.length) {
              _context5.next = 12;
              break;
            }

            // Process rels
            DEBUG && log.debug('Completing document.xml.rels...');
            htmlFiles = [];
            relsPath = templatePath + '/_rels/' + documentComponent + '.rels';
            _context5.next = 8;
            return getRelsFromZip(zip, relsPath);

          case 8:
            rels = _context5.sent;

            for (i = 0; i < htmlIds.length; i++) {
              htmlId = htmlIds[i];
              htmlData = htmls[htmlId];
              htmlName = 'template_' + documentComponent + '_' + htmlId + '.html';

              DEBUG && log.debug('Writing html ' + htmlId + ' (' + htmlName + ')...');
              htmlPath = templatePath + '/' + htmlName;

              htmlFiles.push('/' + htmlPath);
              (0, _zip.zipSetText)(zip, htmlPath, htmlData);
              (0, _reportUtils.addChild)(rels, (0, _reportUtils.newNonTextNode)('Relationship', {
                Id: htmlId,
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk',
                Target: '' + htmlName
              }));
            }
            finalRelsXml = (0, _xml.buildXml)(rels, {
              literalXmlDelimiter: DEFAULT_LITERAL_XML_DELIMITER
            });

            (0, _zip.zipSetText)(zip, relsPath, finalRelsXml);

          case 12:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function processHtmls(_x11, _x12, _x13, _x14) {
    return _ref6.apply(this, arguments);
  };
}();

var getRelsFromZip = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(zip, relsPath) {
    var relsXml;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _zip.zipGetText)(zip, relsPath);

          case 2:
            relsXml = _context6.sent;

            if (!relsXml) {
              relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n        <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n        </Relationships>';
            }
            return _context6.abrupt('return', (0, _xml.parseXml)(relsXml));

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function getRelsFromZip(_x15, _x16) {
    return _ref7.apply(this, arguments);
  };
}();

// ==========================================
// Public API
// ==========================================
exports.default = createReport;