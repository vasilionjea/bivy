const mailgun = require('mailgun-js')({
  apiKey: 'API_KEY_HERE',
  domain: 'SANDBOX_DOMAIN_HERE.mailgun.org'
});

let settings = {
  from: 'Bivy Notification <postmaster@SANDBOX_DOMAIN_HERE.mailgun.org>',
  to: 'you@example.com',
};

module.exports = {
  sendEmail(options, callback) {
    const data = Object.assign(settings, options);
    return mailgun.messages().send(data, callback);
  },

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
  }
};
