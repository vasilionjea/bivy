# Bivy (v3.0.3)
Find a proper bivy site.

- [Install](#install)
- [Upgrade](#upgrade)
- [Usage](#usage)
    + [--interval option](#--interval-option)
    + [--arrival and --nights options](#--arrival-and---nights-options)
- [Sending email](#sending-email)
- [Sending text messages](#sending-text-messages)
- [Playing sound notification](#playing-sound-notification)
- [Compatibility](#compatibility)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [TODO](#todo)


## Install
- Install NodeJS: https://nodejs.org/en/
- Download Bivy.
- Install Bivy:
  1. `cd path/to/where/you-saved/bivy`
  2. `npm install -g`

**Note:** If you run into file permission errors, you may need to give
permissions to Bivy's entry file using the following command on a UNIX
machine: `chmod u+rwx ./src/index.js`


## Upgrade
- Re-download Bivy.
- Re-install Bivy:
  1. `cd path/to/where/you-saved/bivy`
  2. `npm install -g`

After upgrading type `bivy --version` to verify you are using the newly installed version.


## Usage
For help, type `bivy -h` in your command line. You should see the following:
```
Usage: bivy [options]

Options:

  -V, --version            output the version number
  -a, --arrival [string]   (optional) Add arrival date (default: 11/18/2018)
  -n, --nights [number]    (optional) Add number of nights (default: 1)
  -i, --interval [string]  (optional) Add interval with minutes and/or hours to schedule a search (default: 0min)
  -h, --help               output usage information
```

To stop Bivy from running you can press `CTRL` plus `C` at anytime.

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
interested in. For example: `bivy --arrival="11/18/2018" --nights=2`. These
options can of course be used in combination with the `--interval` option like
this: `bivy --arrival="11/18/2018" --nights=2 --interval="30min"`

**Note:** The order of the options does **not** matter.


## Sending email
Under the `src/` folder there is a _mailgun.js_ file where you can specify
your Mailgun settings. Mailgun is an Email service that allows you to send up
to 10,000 emails per month for free - more at https://www.mailgun.com/.

**Note:** You'll need to sign up for a free Mailgun account before you can
configure Bivy to send you emails.


## Sending text messages
Bivy does **not** send MMS messages, but you can set up email forwarding from your
email client to your phone number using one of the following carrier addresses:
- `YOUR_PHONE_NUMBER@vzwpix.com` for Verizon
- `YOUR_PHONE_NUMBER@mms.att.net` for AT&T
- `YOUR_PHONE_NUMBER@tmomail.net` for T-Mobile
- `YOUR_PHONE_NUMBER@pm.sprint.com` for Sprint

For more information on how the above carrier email addresses work do a Web
search for _"send text message from email to cell phone"_. Your email forwarding
will look like this:
- From: `postmaster@SANDBOX_DOMAIN_HERE.mailgun.org`
- To: `YOU@EXAMPLE.com`
- Forward to: `YOUR_PHONE_NUMBER@vzwpix.com` for Verizon


## Playing sound notification
To play a "success" sound notification on your MacOS you should place an audio
file under the `assets/` directory, and also assign the name of your audio file
to the `AUDIO_FILE_SUCCESS` setting inside the _config.js_ file.


## Compatibility
Bivy was tested using the following:
- Mac version 10.12.6 (macOS Sierra)
- NodeJS 8.3.0


## Dependencies
- NodeJS <https://nodejs.org/en/> with NPM
- Puppeteer <https://www.npmjs.com/package/puppeteer>
- Commander <https://www.npmjs.com/package/commander>
- Mailgun <https://www.mailgun.com/> and MailgunJS <https://www.npmjs.com/package/mailgun-js>
- Chalk <https://www.npmjs.com/package/chalk>


## Contributing
- Clone the Git repo locally.
- Instead of installing Bivy globally, execute the main file directly
  `./src/index.js` from the command line.
- Make a pull request for the feature or bug fix.


## TODO
- Mailgun settings shouldn't be hardcoded inside _mailgun.js_. Add ability to
  read settings from [environment variables](https://github.com/dwyl/learn-environment-variables#3-use-a-env-file-locally-which-you-can-gitignore) that are **not** checked in to the Github repository.
- Setup a simple [ExpressJS](https://expressjs.com/) app that responds with static  
  copies of the HTML pages that Bivy crawls. This will help with testing Bivy features
  locally without having to depend on the actual website that it crawls.
- Deploy Bivy in the cloud.
- Perhaps add a `--weather` option that reports the weather. The weather report should be
  visible inside the sent email when Bivy finds a campsite and printed in STDOUT.
