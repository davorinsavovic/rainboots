const { EventEmitter } = require('events');

// Global emitter to broadcast progress from anywhere in the backend
const progressEmitter = new EventEmitter();

module.exports = progressEmitter;
