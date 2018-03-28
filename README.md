# Bivy (v2.0.0)

## Install
- Install NodeJS: https://nodejs.org/en/
- Download Bivy and move it under a memorable directory.
- Install Bivy:
  1. `cd path/to/where/you-saved/bivy`
  2. `npm install -g`

**Note:** If you run into file permission errors, you may need to give
permissions to Bivy's entry file using the following command on a UNIX
machine: `chmod u+rwx ./src/index.js`


## Usage
For help, type `bivy -h` in your command line. To stop Bivy from running you
can press the `CTRL` key plus the `C` key.

The simplest way to use Bivy is by opening your command line and typing `bivy`
without any options. Using the command this way assumes that you want your
**arrival** date to be _two days from today_, and that you want to stay a total
of **1 night**. The search task runs only once and it exits when it's done.

#### --interval option
The `--interval` option allows you to run the search task at a specified
interval. For example, to run the search every hour and 30 minutes you would
type `bivy --interval='1hr 30min'`. Again, this assumes your arrival date to
be two days from today.

You could specify hours, minutes, or both. For example, to run the search every
30 minutes you would type `bivy --interval='30min'`.

#### --arrival and --nights options
The `--arrival` and `--nights` options allow you to construct the dates you are
interested in. For example: `bivy --arrival="Sat Mar 31 2018" --nights=2`. These
options can of course be used in combination with the `--interval` option like
this: `bivy --arrival="Sat Mar 31 2018" --nights=2 --interval="30min"`

**Note:** The order of the options does **not** matter.


## Sending email
Under the `src/` folder there is a _mailgun.js_ file where you can specify
your Mailgun settings. Mailgun is an Email service that allows you to send up
to 10,000 emails per month for free - more at https://www.mailgun.com/.

**Note:** You'll need to sign up for a free Mailgun account before you can
configure Bivy to send you emails.


## Sending text message
Bivy does **not** send MMS messages, but you can set up email forwarding from your
email client to your phone number using one of the following carrier addresses:
- `YOUR_PHONE_NUMBER@vzwpix.com` for Verizon
- `YOUR_PHONE_NUMBER@mms.att.net` for AT&T
- `YOUR_PHONE_NUMBER@tmomail.net` for T-Mobile
- `YOUR_PHONE_NUMBER@pm.sprint.com` for Sprint

For more information on how the above carrier email addresses work do a Google
search for _"send text message from email to cell phone"_. Your email forwarding
will look like this:
- From: `postmaster@MAILGUN_SANDBOX_DOMAIN_NAME`
- To: `YOU@EXAMPLE.com`
- Forward to: `YOUR_PHONE_NUMBER@vzwpix.com` for Verizon


## Compatibility
Bivy was tested using the following:
- Mac version 10.12.6 (macOS Sierra)
- NodeJS 8.3.0


## Dependencies
- NodeJS <https://nodejs.org/en/> with NPM
- Puppeteer <https://www.npmjs.com/package/puppeteer>
- Commander <https://www.npmjs.com/package/commander>
- Mailgun <https://www.mailgun.com/> and MailgunJS <https://www.npmjs.com/package/mailgun-js>
