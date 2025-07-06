const config = require('../../../config');
const httpStatusMap = require('./httpStatusMap');

class ApiResponse {
  constructor(statusCode, message, data, path, developer_message = null) {
    const statusDetails = httpStatusMap[statusCode] || { message: 'An unexpected error occurred.', category: 'Unknown' };

    this.timestamp = new Date().toISOString();
    this.path = path;
    this.statusCode = statusCode;
    this.status = statusDetails.category;
    this.message = message || statusDetails.message;
    this.data = data;

    if (config.env !== 'production' && developer_message) {
      this.developer = developer_message;
    }
  }
}

module.exports = ApiResponse;
