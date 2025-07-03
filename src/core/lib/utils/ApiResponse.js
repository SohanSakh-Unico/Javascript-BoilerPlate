const config = require('../../config');
const httpStatusCodes = require('../../utils/httpStatusCodes');

class ApiResponse {
  constructor(statusCode, message, data, path, developer_message = null) {
    this.timestamp = new Date().toISOString();
    this.path = path;
    this.statusCode = statusCode;
    this.status = this.#getStatusCategory(statusCode);
    this.message = message || this.#getDefaultMessage(statusCode);
    this.data = data;

    if (config.env !== 'production' && developer_message) {
      this.developer = developer_message;
    }
  }

  #getDefaultMessage(statusCode) {
    for (const category in httpStatusCodes) {
      for (const status in httpStatusCodes[category]) {
        if (httpStatusCodes[category][status].code === statusCode) {
          return httpStatusCodes[category][status].message;
        }
      }
    }
    return 'An unexpected error occurred.';
  }

  #getStatusCategory(statusCode) {
    if (statusCode >= 100 && statusCode < 200) return 'Informational';
    if (statusCode >= 200 && statusCode < 300) return 'Success';
    if (statusCode >= 300 && statusCode < 400) return 'Redirection';
    if (statusCode >= 400 && statusCode < 500) return 'Client Error';
    if (statusCode >= 500 && statusCode < 600) return 'Server Error';
    return 'Unknown';
  }
}

module.exports = ApiResponse;