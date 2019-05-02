/**
 * -------------------------------------------------------------
 * Mailgun settings
 * -------------------------------------------------------------
 *
 * Mailgun requires an API key and a "sandbox" domain name to be
 * generated in order to use their free service.
 *
 */
const MAILGUN_SETTINGS = {
  apiKey: 'API_KEY_HERE', // Go over to https://www.mailgun.com/ to get an API key
  domain: 'SANDBOX_DOMAIN_HERE.mailgun.org'
};

const EMAIL_SETTINGS = {
  from: `Bivy Notification <postmaster@${MAILGUN_SETTINGS.domain}>`,
  to: 'you@example.com',
  cc: 'someone@example.com',
  bcc: 'another@example.com'
};

/**
 * -------------------------------------------------------------
 * Mailgun module
 * -------------------------------------------------------------
 */
const mailgun = require('mailgun-js')(MAILGUN_SETTINGS);

module.exports = {
  /**
   * Sends the email using Mailgun.
   *
   * @param {Object} options
   * @param {Function} callback
   */
  sendEmail(options, callback) {
    if (MAILGUN_SETTINGS.apiKey === 'API_KEY_HERE') {
      return;
    }

    const data = Object.assign({}, EMAIL_SETTINGS, options);

    return mailgun
      .messages()
      .send(data, callback);
  },

  /**
   * Sends a test email using Mailgun.
   */
  sendTestEmail() {
    const data = {
      subject: 'Bivy test email',
      html: this.getTestHtml()
    };

    this.sendEmail(data, (error) => {
      let msg;
      if (error) {
        msg = `Mailgun ${error}`;
      } else {
        msg = 'Test email was sent!';
      }
      console.log(`\n${msg}\n`);
    });
  },

  /**
   * Constructs an HTML string from the provided URLs.
   * @param {Array} urls The URLs to create an HTML list from
   */
  getHtml(urls = []) {
    let body = '<p>Bivy found a few sites you should check out.</p>';

    body += `<ol style="list-style:inside;list-style-type:decimal;padding:0;line-height:1.5">`;
    body = urls.reduce((body, url) => {
      body += `<li style="padding:5px 0">`;
      body += `<a href="${url}" rel="noopener noreferrer" target="_blank">${url}</a>`;
      body += `</li>`;
      return body;
    }, body);
    body += '</ol>';

    return body;
  },

  /**
   * Constructs an HTML string for a test email.
   */
  getTestHtml() {
    let body = `<p>This is a test email from Bivy. Make sure to mark emails from Bivy as important so they don't end up in your spam folder.</p>`;
    body += `<p>To receive text messages to a Verizon phone create an email filter that forwards emails coming from <b>${MAILGUN_SETTINGS.domain}</b> to <b>YOUR_PHONE_NUMBER@vzwpix.com</b></p>`;
    return body;
  }
};
