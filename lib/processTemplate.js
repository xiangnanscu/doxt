'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.produceJsReport = exports.extractQuery = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reportUtils = require('./reportUtils');

var _jsSandbox = require('./jsSandbox');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEBUG = process.env.DEBUG_DOCX_TEMPLATES;

/* eslint-disable no-param-reassign, no-constant-condition */

var log = DEBUG ? require('./debug').mainStory : null;
var chalk = DEBUG ? require('./debug').chalk : null;

// Load the fs module (will only succeed in node)
var fs = void 0;
try {
  fs = require('fs-extra'); // eslint-disable-line
} catch (err) {
  /* ignore */
}

var gCntIf = 0;

// Go through the document until the query string is found (normally at the beginning)
var extractQuery = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(template, options) {
    var ctx, nodeIn, fFound, _parent, nextSibling, parent;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx = {
              fCmd: false,
              cmd: '',
              fSeekQuery: true, // ensure no command will be processed, except QUERY
              query: null,
              loops: [],
              options: options
            };
            nodeIn = template;

          case 2:
            if (!true) {
              _context.next = 30;
              break;
            }

            if (!nodeIn._children.length) {
              _context.next = 7;
              break;
            }

            nodeIn = nodeIn._children[0];
            _context.next = 20;
            break;

          case 7:
            // Move sideways or up
            fFound = false;

          case 8:
            if (!(nodeIn._parent != null)) {
              _context.next = 18;
              break;
            }

            _parent = nodeIn._parent;
            nextSibling = (0, _reportUtils.getNextSibling)(nodeIn);

            if (!nextSibling) {
              _context.next = 15;
              break;
            }

            nodeIn = nextSibling;
            fFound = true;
            return _context.abrupt('break', 18);

          case 15:
            nodeIn = _parent;
            _context.next = 8;
            break;

          case 18:
            if (fFound) {
              _context.next = 20;
              break;
            }

            return _context.abrupt('break', 30);

          case 20:
            if (nodeIn) {
              _context.next = 22;
              break;
            }

            return _context.abrupt('break', 30);

          case 22:
            parent = nodeIn._parent;

            if (!(nodeIn._fTextNode && parent && !parent._fTextNode && // Flow, don't complain
            parent._tag === 'w:t')) {
              _context.next = 26;
              break;
            }

            _context.next = 26;
            return processText(null, nodeIn, ctx);

          case 26:
            if (!(ctx.query != null)) {
              _context.next = 28;
              break;
            }

            return _context.abrupt('break', 30);

          case 28:
            _context.next = 2;
            break;

          case 30:
            return _context.abrupt('return', ctx.query);

          case 31:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function extractQuery(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var produceJsReport = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data, template, options) {
    var out, ctx, nodeIn, nodeOut, move, deltaJump, curLoop, nextSibling, refNode, refNodeLevel, parent, tag, fRemoveNode, buffers, nodeOutParent, imgNode, _parent2, linkNode, _parent3, htmlNode, _parent4, _tag, newNode, _parent5, newNodeAsTextNode;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            out = (0, _reportUtils.cloneNodeWithoutChildren)(template);
            ctx = {
              level: 1,
              fCmd: false,
              cmd: '',
              fSeekQuery: false,
              query: null,
              buffers: {
                'w:p': { text: '', cmds: '', fInsertedText: false },
                'w:tr': { text: '', cmds: '', fInsertedText: false }
              },
              pendingImageNode: null,
              imageId: 0,
              images: {},
              pendingLinkNode: null,
              linkId: 0,
              links: {},
              pendingHtmlNode: null,
              htmlId: 0,
              htmls: {},
              vars: {},
              loops: [],
              fJump: false,
              shorthands: {},
              options: options
            };
            nodeIn = template;
            nodeOut = out;
            move = void 0;
            deltaJump = 0;

          case 6:
            if (!true) {
              _context2.next = 75;
              break;
            }

            // eslint-disable-line no-constant-condition
            curLoop = (0, _reportUtils.getCurLoop)(ctx);
            nextSibling = void 0;

            // =============================================
            // Move input node pointer
            // =============================================

            if (!ctx.fJump) {
              _context2.next = 20;
              break;
            }

            if (curLoop) {
              _context2.next = 12;
              break;
            }

            throw new Error('INTERNAL_ERROR');

          case 12:
            refNode = curLoop.refNode, refNodeLevel = curLoop.refNodeLevel;
            // DEBUG && log.debug(`Jumping to level ${refNodeLevel}...`,
            //   { attach: cloneNodeForLogging(refNode) });

            deltaJump = ctx.level - refNodeLevel;
            nodeIn = refNode;
            ctx.level = refNodeLevel;
            ctx.fJump = false;
            move = 'JUMP';

            // Down (only if he haven't just moved up)
            _context2.next = 37;
            break;

          case 20:
            if (!(nodeIn._children.length && move !== 'UP')) {
              _context2.next = 26;
              break;
            }

            nodeIn = nodeIn._children[0];
            ctx.level += 1;
            move = 'DOWN';

            // Sideways
            _context2.next = 37;
            break;

          case 26:
            if (!(nextSibling = (0, _reportUtils.getNextSibling)(nodeIn))) {
              _context2.next = 31;
              break;
            }

            nodeIn = nextSibling;
            move = 'SIDE';

            // Up
            _context2.next = 37;
            break;

          case 31:
            parent = nodeIn._parent;

            if (!(parent == null)) {
              _context2.next = 34;
              break;
            }

            return _context2.abrupt('break', 75);

          case 34:
            nodeIn = parent;
            ctx.level -= 1;
            move = 'UP';

          case 37:
            // DEBUG && log.debug(`Next node [${chalk.green.bold(move)}]`,
            //   { attach: cloneNodeForLogging(nodeIn) });

            // =============================================
            // Process input node
            // =============================================
            // Delete the last generated output node in several special cases
            // --------------------------------------------------------------
            if (move !== 'DOWN') {
              tag = nodeOut._fTextNode ? null : nodeOut._tag;
              fRemoveNode = false;
              // Delete last generated output node if we're skipping nodes due to an empty FOR loop

              if ((tag === 'w:p' || tag === 'w:tbl' || tag === 'w:tr') && (0, _reportUtils.isLoopExploring)(ctx)) {
                fRemoveNode = true;
                // Delete last generated output node if the user inserted a paragraph
                // (or table row) with just a command
              } else if (tag === 'w:p' || tag === 'w:tr') {
                buffers = ctx.buffers[tag];

                fRemoveNode = buffers.text === '' && buffers.cmds !== '' && !buffers.fInsertedText;
              }
              // Execute removal, if needed. The node will no longer be part of the output, but
              // the parent will be accessible from the child (so that we can still move up the tree)
              if (fRemoveNode && nodeOut._parent != null) {
                nodeOut._parent._children.pop();
              }
            }

            // Handle an UP movement
            // ---------------------

            if (!(move === 'UP')) {
              _context2.next = 48;
              break;
            }

            // Loop exploring? Update the reference node for the current loop
            if ((0, _reportUtils.isLoopExploring)(ctx) && curLoop && // Flow, don't complain
            nodeIn === curLoop.refNode._parent) {
              curLoop.refNode = nodeIn;
              curLoop.refNodeLevel -= 1;
              // DEBUG && log.debug(`Updated loop '${curLoop.varName}' refNode:`,
              //   { attach: cloneNodeForLogging(nodeIn) });
            }
            nodeOutParent = nodeOut._parent;

            if (!(nodeOutParent == null)) {
              _context2.next = 43;
              break;
            }

            throw new Error('INTERNAL_ERROR');

          case 43:
            // Flow-prevention

            // Execute the move in the output tree
            nodeOut = nodeOutParent;

            // If an image was generated, replace the parent `w:t` node with
            // the image node
            if (ctx.pendingImageNode && !nodeOut._fTextNode && // Flow-prevention
            nodeOut._tag === 'w:t') {
              imgNode = ctx.pendingImageNode;
              _parent2 = nodeOut._parent;

              if (_parent2) {
                imgNode._parent = _parent2;
                _parent2._children.pop();
                _parent2._children.push(imgNode);
                // Prevent containing paragraph or table row from being removed
                ctx.buffers['w:p'].fInsertedText = true;
                ctx.buffers['w:tr'].fInsertedText = true;
              }
              ctx.pendingImageNode = null;
            }

            // If a link was generated, replace the parent `w:r` node with
            // the link node
            if (ctx.pendingLinkNode && !nodeOut._fTextNode && // Flow-prevention
            nodeOut._tag === 'w:r') {
              linkNode = ctx.pendingLinkNode;
              _parent3 = nodeOut._parent;

              if (_parent3) {
                linkNode._parent = _parent3;
                _parent3._children.pop();
                _parent3._children.push(linkNode);
                // Prevent containing paragraph or table row from being removed
                ctx.buffers['w:p'].fInsertedText = true;
                ctx.buffers['w:tr'].fInsertedText = true;
              }
              ctx.pendingLinkNode = null;
            }

            // If a html page was generated, replace the parent `w:p` node with
            // the html node
            if (ctx.pendingHtmlNode && !nodeOut._fTextNode && // Flow-prevention
            nodeOut._tag === 'w:p') {
              htmlNode = ctx.pendingHtmlNode;
              _parent4 = nodeOut._parent;

              if (_parent4) {
                htmlNode._parent = _parent4;
                _parent4._children.pop();
                _parent4._children.push(htmlNode);
                // Prevent containing paragraph or table row from being removed
                ctx.buffers['w:p'].fInsertedText = true;
                ctx.buffers['w:tr'].fInsertedText = true;
              }
              ctx.pendingHtmlNode = null;
            }

            // `w:tc` nodes shouldn't be left with no `w:p` children; if that's the
            // case, add an empty `w:p` inside
            if (!nodeOut._fTextNode && // Flow-prevention
            nodeOut._tag === 'w:tc' && !nodeOut._children.filter(function (o) {
              return !o._fTextNode && o._tag === 'w:p';
            }).length) {
              nodeOut._children.push({
                _parent: nodeOut,
                _children: [],
                _fTextNode: false,
                _tag: 'w:p',
                _attrs: {}
              });
            }

          case 48:
            if (!(move === 'DOWN' || move === 'SIDE')) {
              _context2.next = 65;
              break;
            }

            if (!(move === 'SIDE')) {
              _context2.next = 53;
              break;
            }

            if (!(nodeOut._parent == null)) {
              _context2.next = 52;
              break;
            }

            throw new Error('INTERNAL_ERROR');

          case 52:
            // Flow-prevention
            nodeOut = nodeOut._parent;

          case 53:

            // Reset node buffers as needed if a `w:p` or `w:tr` is encountered
            _tag = nodeIn._fTextNode ? null : nodeIn._tag;

            if (_tag === 'w:p' || _tag === 'w:tr') {
              ctx.buffers[_tag] = { text: '', cmds: '', fInsertedText: false };
            }

            // Clone input node and append to output tree
            newNode = (0, _reportUtils.cloneNodeWithoutChildren)(nodeIn);

            newNode._parent = nodeOut;
            nodeOut._children.push(newNode);
            _parent5 = nodeIn._parent;

            // If it's a text node inside a w:t, process it

            if (!(nodeIn._fTextNode && _parent5 && !_parent5._fTextNode && // Flow-prevention
            _parent5._tag === 'w:t')) {
              _context2.next = 64;
              break;
            }

            newNodeAsTextNode = newNode;
            _context2.next = 63;
            return processText(data, nodeIn, ctx);

          case 63:
            newNodeAsTextNode._text = _context2.sent;

          case 64:

            // Execute the move in the output tree
            nodeOut = newNode;

          case 65:
            if (!(move === 'JUMP')) {
              _context2.next = 73;
              break;
            }

          case 66:
            if (!(deltaJump > 0)) {
              _context2.next = 73;
              break;
            }

            if (!(nodeOut._parent == null)) {
              _context2.next = 69;
              break;
            }

            throw new Error('INTERNAL_ERROR');

          case 69:
            // Flow-prevention
            nodeOut = nodeOut._parent;
            deltaJump -= 1;
            _context2.next = 66;
            break;

          case 73:
            _context2.next = 6;
            break;

          case 75:
            return _context2.abrupt('return', {
              report: out,
              images: ctx.images,
              links: ctx.links,
              htmls: ctx.htmls
            });

          case 76:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function produceJsReport(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var processText = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data, node, ctx) {
    var cmdDelimiter, text, segments, outText, idx, segment, cmdResultText;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            cmdDelimiter = ctx.options.cmdDelimiter;
            text = node._text;

            if (!(text == null || text === '')) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt('return', '');

          case 4:
            segments = text.split(cmdDelimiter[0]).map(function (s) {
              return s.split(cmdDelimiter[1]);
            }).reduce(function (x, y) {
              return x.concat(y);
            });
            outText = '';
            idx = 0;

          case 7:
            if (!(idx < segments.length)) {
              _context3.next = 22;
              break;
            }

            // Include the separators in the `buffers` field (used for deleting paragraphs if appropriate)
            if (idx > 0) appendTextToTagBuffers(cmdDelimiter[0], ctx, { fCmd: true });

            // Append segment either to the `ctx.cmd` buffer (to be executed), if we are in "command mode",
            // or to the output text
            segment = segments[idx];
            // DEBUG && log.debug(`Token: '${segment}' (${ctx.fCmd})`);

            if (ctx.fCmd) ctx.cmd += segment;else if (!(0, _reportUtils.isLoopExploring)(ctx)) outText += segment;
            appendTextToTagBuffers(segment, ctx, { fCmd: ctx.fCmd });

            // If there are more segments, execute the command (if we are in "command mode"),
            // and toggle "command mode"

            if (!(idx < segments.length - 1)) {
              _context3.next = 19;
              break;
            }

            if (!ctx.fCmd) {
              _context3.next = 18;
              break;
            }

            _context3.next = 16;
            return processCmd(data, node, ctx);

          case 16:
            cmdResultText = _context3.sent;

            if (cmdResultText != null) {
              outText += cmdResultText;
              appendTextToTagBuffers(cmdResultText, ctx, {
                fCmd: false,
                fInsertedText: true
              });
            }

          case 18:
            ctx.fCmd = !ctx.fCmd;

          case 19:
            idx++;
            _context3.next = 7;
            break;

          case 22:
            return _context3.abrupt('return', outText);

          case 23:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function processText(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

// ==========================================
// Command processor
// ==========================================
var processCmd = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(data, node, ctx) {
    var cmd, cmdNameMatch, cmdName, cmdRest, out, aliasMatch, aliasName, fullCmd, img, pars, html;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            cmd = getCommand(ctx);

            DEBUG && log.debug('Processing cmd: ' + chalk.cyan.bold(cmd));
            _context4.prev = 2;

            // Extract command name
            cmdNameMatch = /^(\S+)\s*/.exec(cmd);
            cmdName = void 0;
            cmdRest = '';

            if (cmdNameMatch != null) {
              cmdName = cmdNameMatch[1].toUpperCase();
              cmdRest = cmd.slice(cmdName.length).trim();
            }

            // Seeking query?

            if (!ctx.fSeekQuery) {
              _context4.next = 10;
              break;
            }

            if (cmdName === 'QUERY') ctx.query = cmdRest;
            return _context4.abrupt('return', null);

          case 10:

            // Process command
            out = void 0;

            if (!(cmdName === 'QUERY' || cmdName === 'CMD_NODE')) {
              _context4.next = 14;
              break;
            }

            _context4.next = 78;
            break;

          case 14:
            if (!(cmdName === 'ALIAS')) {
              _context4.next = 24;
              break;
            }

            aliasMatch = /^(\S+)\s+(.+)/.exec(cmdRest);

            if (aliasMatch) {
              _context4.next = 18;
              break;
            }

            throw new Error('Invalid ALIAS command: ' + cmd);

          case 18:
            aliasName = aliasMatch[1];
            fullCmd = aliasMatch[2];

            ctx.shorthands[aliasName] = fullCmd;
            DEBUG && log.debug('Defined alias \'' + aliasName + '\' for: ' + fullCmd);

            // VAR <varName> <expression>
            // } else if (cmdName === 'VAR') {
            //   if (!isLoopExploring(ctx)) {
            //     const varMatch = /^(\S+)\s+(.+)/.exec(cmdRest);
            //     if (!varMatch) throw new Error(`Invalid VAR command: ${cmd}`);
            //     const varName = varMatch[1];
            //     const code = varMatch[2];
            //     const varValue = await runUserJsAndGetString(data, code, ctx);
            //     ctx.vars[varName] = varValue;
            //     // DEBUG && log.debug(`${varName} is now: ${JSON.stringify(varValue)}`);
            //   }

            // FOR <varName> IN <expression>
            // IF <expression>
            _context4.next = 78;
            break;

          case 24:
            if (!(cmdName === 'FOR' || cmdName === 'IF')) {
              _context4.next = 30;
              break;
            }

            _context4.next = 27;
            return processForIf(data, node, ctx, cmd, cmdName, cmdRest);

          case 27:
            out = _context4.sent;
            _context4.next = 78;
            break;

          case 30:
            if (!(cmdName === 'END-FOR' || cmdName === 'END-IF')) {
              _context4.next = 34;
              break;
            }

            out = processEndForIf(data, node, ctx, cmd, cmdName, cmdRest);

            // INS <expression>
            _context4.next = 78;
            break;

          case 34:
            if (!(cmdName === 'INS')) {
              _context4.next = 41;
              break;
            }

            if ((0, _reportUtils.isLoopExploring)(ctx)) {
              _context4.next = 39;
              break;
            }

            _context4.next = 38;
            return (0, _jsSandbox.runUserJsAndGetString)(data, cmdRest, ctx);

          case 38:
            out = _context4.sent;

          case 39:
            _context4.next = 78;
            break;

          case 41:
            if (!(cmdName === 'EXEC')) {
              _context4.next = 47;
              break;
            }

            if ((0, _reportUtils.isLoopExploring)(ctx)) {
              _context4.next = 45;
              break;
            }

            _context4.next = 45;
            return (0, _jsSandbox.runUserJsAndGetRaw)(data, cmdRest, ctx);

          case 45:
            _context4.next = 78;
            break;

          case 47:
            if (!(cmdName === 'IMAGE')) {
              _context4.next = 57;
              break;
            }

            if ((0, _reportUtils.isLoopExploring)(ctx)) {
              _context4.next = 55;
              break;
            }

            _context4.next = 51;
            return (0, _jsSandbox.runUserJsAndGetRaw)(data, cmdRest, ctx);

          case 51:
            img = _context4.sent;

            if (!(img != null)) {
              _context4.next = 55;
              break;
            }

            _context4.next = 55;
            return processImage(ctx, img);

          case 55:
            _context4.next = 78;
            break;

          case 57:
            if (!(cmdName === 'LINK')) {
              _context4.next = 67;
              break;
            }

            if ((0, _reportUtils.isLoopExploring)(ctx)) {
              _context4.next = 65;
              break;
            }

            _context4.next = 61;
            return (0, _jsSandbox.runUserJsAndGetRaw)(data, cmdRest, ctx);

          case 61:
            pars = _context4.sent;

            if (!(pars != null)) {
              _context4.next = 65;
              break;
            }

            _context4.next = 65;
            return processLink(ctx, pars);

          case 65:
            _context4.next = 78;
            break;

          case 67:
            if (!(cmdName === 'HTML')) {
              _context4.next = 77;
              break;
            }

            if ((0, _reportUtils.isLoopExploring)(ctx)) {
              _context4.next = 75;
              break;
            }

            _context4.next = 71;
            return (0, _jsSandbox.runUserJsAndGetRaw)(data, cmdRest, ctx);

          case 71:
            html = _context4.sent;

            if (!(html != null)) {
              _context4.next = 75;
              break;
            }

            _context4.next = 75;
            return processHtml(ctx, html);

          case 75:
            _context4.next = 78;
            break;

          case 77:
            throw new Error('Invalid command syntax: \'' + cmd + '\'');

          case 78:
            return _context4.abrupt('return', out);

          case 81:
            _context4.prev = 81;
            _context4.t0 = _context4['catch'](2);
            throw new Error('Error executing command: ' + cmd + '\n' + _context4.t0.message);

          case 84:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[2, 81]]);
  }));

  return function processCmd(_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();
var builtInCommands = ['HTML', 'LINK', 'IMAGE', 'EXEC', 'INS', 'END-FOR', 'END-IF', 'FOR', 'IF', 'ALIAS', 'QUERY', 'CMD_NODE'];
var notBuiltIns = function notBuiltIns(cmd) {
  return !builtInCommands.some(function (word) {
    return new RegExp('^' + word).test(cmd.toUpperCase());
  });
};
var getCommand = function getCommand(ctx) {
  var cmd = ctx.cmd;

  if (cmd[0] === '*') {
    var aliasName = cmd.slice(1).trim();
    if (!ctx.shorthands[aliasName]) throw new Error('Unknown alias');
    cmd = ctx.shorthands[aliasName];
    DEBUG && log.debug('Alias for: ' + cmd);
  } else if (cmd[0] === '=') {
    cmd = 'INS ' + cmd.slice(1).trim();
  } else if (cmd[0] === '!') {
    cmd = 'EXEC ' + cmd.slice(1).trim();
  } else if (notBuiltIns(cmd) && /^[a-zA-Z$`'"]/.test(cmd)) {
    cmd = 'INS ' + cmd.trim();
  }
  ctx.cmd = '';
  return cmd.trim();
};

// ==========================================
// Individual commands
// ==========================================
var processForIf = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(data, node, ctx, cmd, cmdName, cmdRest) {
    var isIf, forMatch, varName, curLoop, parentLoopLevel, fParentIsExploring, loopOver, shouldRun;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            isIf = cmdName === 'IF';

            // Identify FOR/IF loop

            forMatch = void 0;
            varName = void 0;

            if (!isIf) {
              _context5.next = 8;
              break;
            }

            if (node._ifName == null) {
              node._ifName = '__if_' + gCntIf;
              gCntIf += 1;
            }
            varName = node._ifName;
            _context5.next = 12;
            break;

          case 8:
            forMatch = /^(\S+)\s+IN\s+(.+)/i.exec(cmdRest);

            if (forMatch) {
              _context5.next = 11;
              break;
            }

            throw new Error('Invalid FOR command: ' + cmd);

          case 11:
            varName = forMatch[1];

          case 12:

            // New FOR? If not, discard
            curLoop = (0, _reportUtils.getCurLoop)(ctx);

            if (curLoop && curLoop.varName === varName) {
              _context5.next = 34;
              break;
            }

            parentLoopLevel = ctx.loops.length - 1;
            fParentIsExploring = parentLoopLevel >= 0 && ctx.loops[parentLoopLevel].idx === -1;
            loopOver = void 0;

            if (!fParentIsExploring) {
              _context5.next = 21;
              break;
            }

            loopOver = [];
            _context5.next = 33;
            break;

          case 21:
            if (!isIf) {
              _context5.next = 28;
              break;
            }

            _context5.next = 24;
            return (0, _jsSandbox.runUserJsAndGetRaw)(data, cmdRest, ctx);

          case 24:
            shouldRun = !!_context5.sent;

            loopOver = shouldRun ? [1] : [];
            _context5.next = 33;
            break;

          case 28:
            if (forMatch) {
              _context5.next = 30;
              break;
            }

            throw new Error('Invalid FOR command: ' + cmd);

          case 30:
            _context5.next = 32;
            return (0, _jsSandbox.runUserJsAndGetRaw)(data, forMatch[2], ctx);

          case 32:
            loopOver = _context5.sent;

          case 33:
            ctx.loops.push({
              refNode: node,
              refNodeLevel: ctx.level,
              varName: varName,
              loopOver: loopOver,
              isIf: isIf,
              // run through the loop once first, without outputting anything
              // (if we don't do it like this, we could not run empty loops!)
              idx: -1
            });

          case 34:
            (0, _reportUtils.logLoop)(ctx.loops);

            return _context5.abrupt('return', null);

          case 36:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function processForIf(_x12, _x13, _x14, _x15, _x16, _x17) {
    return _ref5.apply(this, arguments);
  };
}();

var processEndForIf = function processEndForIf(data, node, ctx, cmd, cmdName, cmdRest) {
  var curLoop = (0, _reportUtils.getCurLoop)(ctx);
  if (!curLoop) throw new Error('Invalid command: ' + cmd);
  var isIf = cmdName === 'END-IF';
  var varName = isIf ? curLoop.varName : cmdRest;
  if (curLoop.varName !== varName) throw new Error('Invalid command: ' + cmd);
  var loopOver = curLoop.loopOver,
      idx = curLoop.idx;

  var _getNextItem = getNextItem(loopOver, idx),
      nextItem = _getNextItem.nextItem,
      curIdx = _getNextItem.curIdx;

  if (nextItem != null) {
    // next iteration
    ctx.vars[varName] = nextItem;
    ctx.fJump = true;
    curLoop.idx = curIdx;
  } else {
    // loop finished
    ctx.loops.pop();
  }

  return null;
};

/* eslint-disable */
var processImage = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx, imagePars) {
    var cx, cy, id, relId, alt, node, pic, drawing;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            cx = (imagePars.width * 360e3).toFixed(0);
            cy = (imagePars.height * 360e3).toFixed(0);

            ctx.imageId += 1;
            id = String(ctx.imageId);
            relId = 'img' + id;
            _context6.next = 7;
            return getImageData(imagePars);

          case 7:
            ctx.images[relId] = _context6.sent;
            alt = imagePars.alt || 'desc';
            node = _reportUtils.newNonTextNode;
            pic = node('pic:pic', { 'xmlns:pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture' }, [node('pic:nvPicPr', {}, [node('pic:cNvPr', { id: '0', name: 'Picture ' + id, descr: alt }), node('pic:cNvPicPr', {}, [node('a:picLocks', { noChangeAspect: '1', noChangeArrowheads: '1' })])]), node('pic:blipFill', {}, [node('a:blip', { 'r:embed': relId, cstate: 'print' }, [node('a:extLst', {}, [node('a:ext', { uri: '{28A0092B-C50C-407E-A947-70E740481C1C}' }, [node('a14:useLocalDpi', {
              'xmlns:a14': 'http://schemas.microsoft.com/office/drawing/2010/main',
              val: '0'
            })])])]), node('a:srcRect'), node('a:stretch', {}, [node('a:fillRect')])]), node('pic:spPr', { bwMode: 'auto' }, [node('a:xfrm', {}, [node('a:off', { x: '0', y: '0' }), node('a:ext', { cx: cx, cy: cy })]), node('a:prstGeom', { prst: 'rect' }, [node('a:avLst')]), node('a:noFill'), node('a:ln', {}, [node('a:noFill')])])]);
            drawing = node('w:drawing', {}, [node('wp:inline', { distT: '0', distB: '0', distL: '0', distR: '0' }, [node('wp:extent', { cx: cx, cy: cy }), node('wp:docPr', { id: id, name: 'Picture ' + id, descr: alt }), node('wp:cNvGraphicFramePr', {}, [node('a:graphicFrameLocks', {
              'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
              noChangeAspect: '1'
            })]), node('a:graphic', { 'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main' }, [node('a:graphicData', { uri: 'http://schemas.openxmlformats.org/drawingml/2006/picture' }, [pic])])])]);

            ctx.pendingImageNode = drawing;

          case 13:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function processImage(_x18, _x19) {
    return _ref6.apply(this, arguments);
  };
}();

var getImageData = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(imagePars) {
    var data, extension, imgPath, buffer;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            data = imagePars.data, extension = imagePars.extension;

            if (!data) {
              _context7.next = 5;
              break;
            }

            if (extension) {
              _context7.next = 4;
              break;
            }

            throw new Error('If you return image `data`, make sure you return an extension as well!');

          case 4:
            return _context7.abrupt('return', { extension: extension, data: data });

          case 5:
            imgPath = imagePars.path;

            if (imgPath) {
              _context7.next = 8;
              break;
            }

            throw new Error('Specify either image `path` or `data`');

          case 8:
            if (fs) {
              _context7.next = 10;
              break;
            }

            throw new Error('Cannot read image from file in the browser');

          case 10:
            _context7.next = 12;
            return fs.readFile(imgPath);

          case 12:
            buffer = _context7.sent;
            return _context7.abrupt('return', { extension: _path2.default.extname(imgPath).toLowerCase(), data: buffer });

          case 14:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function getImageData(_x20) {
    return _ref7.apply(this, arguments);
  };
}();

var processLink = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(ctx, linkPars) {
    var url, _linkPars$label, label, id, relId, node, link;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            url = linkPars.url;
            _linkPars$label = linkPars.label, label = _linkPars$label === undefined ? url : _linkPars$label;

            ctx.linkId += 1;
            id = String(ctx.linkId);
            relId = 'link' + id;

            ctx.links[relId] = { url: url };
            node = _reportUtils.newNonTextNode;
            link = node('w:hyperlink', { 'r:id': relId, 'w:history': '1' }, [node('w:r', {}, [node('w:rPr', {}, [node('w:u', { 'w:val': 'single' })]), node('w:t', {}, [(0, _reportUtils.newTextNode)(label)])])]);

            ctx.pendingLinkNode = link;

          case 9:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function processLink(_x21, _x22) {
    return _ref8.apply(this, arguments);
  };
}();

var processHtml = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(ctx, data) {
    var id, relId, node, html;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            ctx.htmlId += 1;
            id = String(ctx.htmlId);
            relId = 'html' + id;

            ctx.htmls[relId] = data;
            node = _reportUtils.newNonTextNode;
            html = node('w:altChunk', { 'r:id': relId });

            ctx.pendingHtmlNode = html;

          case 7:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function processHtml(_x23, _x24) {
    return _ref9.apply(this, arguments);
  };
}();

// ==========================================
// Helpers
// ==========================================
var appendTextToTagBuffers = function appendTextToTagBuffers(text, ctx, options) {
  if (ctx.fSeekQuery) return;
  var fCmd = options.fCmd,
      fInsertedText = options.fInsertedText;

  var type = fCmd ? 'cmds' : 'text';
  (0, _keys2.default)(ctx.buffers).forEach(function (key) {
    var buf = ctx.buffers[key];
    buf[type] += text;
    if (fInsertedText) buf.fInsertedText = true;
  });
};

var getNextItem = function getNextItem(items, curIdx0) {
  var nextItem = null;
  var curIdx = curIdx0 != null ? curIdx0 : -1;
  while (nextItem == null) {
    curIdx += 1;
    if (curIdx >= items.length) break;
    var tempItem = items[curIdx];
    if ((typeof tempItem === 'undefined' ? 'undefined' : (0, _typeof3.default)(tempItem)) === 'object' && tempItem.isDeleted) continue;
    nextItem = tempItem;
  }
  return { nextItem: nextItem, curIdx: curIdx };
};

// ==========================================
// Public API
// ==========================================
exports.extractQuery = extractQuery;
exports.produceJsReport = produceJsReport;