const SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require("../config");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.email_api_key;

const emailClient = new SibApiV3Sdk.TransactionalEmailsApi()

module.exports = emailClient ;
