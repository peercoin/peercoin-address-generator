# Welcome do UnoCode Docs

Welcome to UnoCode. This is a developer guide on how to start using UnoCode.

Feel free to navigate on the left menu or search for anything in the topbar.

## What is UnoCode?

In a nutshell: UnoCode is a front-end product that makes possible to inject code and edit your webpage, web system, or webapp. You don't have to update anything in your server, other than adding the UnoCode `<script>` tag itself.

Once you have an UnoCode `<script>` tag in your website, UnoCode can change, update, and fix basically anything in your page. From CSS to HTML, and even JavaScript.

You can also add more features to your website, or make a legacy code work in newer browsers. The size of the change you will apply to your webpage is totally up to you.

So once you add a tag like this in your page:

```html
<script src="https://unocode.triggolabs.com/script/my-project/unocode.js"></script>
```

You can have changes like those:

![Before and After](/img/before-after.png)

# Getting Started

In order to start developing with UnoCode, you basically need two things: **UnoCode Extension** and **A basic new project**.

As of today, our **UnoCode Extension** is available only on Chrome. You can download it here:

[https://chrome.google.com/webstore/detail/unocode-devplugin/nljpfonjanpnklcoonkcmkakcgealcnb](https://chrome.google.com/webstore/detail/unocode-devplugin/nljpfonjanpnklcoonkcmkakcgealcnb)

After that, you will need to setup a new UnoCode project locally. We **highly recommend** you to use our CLI for such tasks. You can install UnoCode CLI on your machine vie this command:

```
npm i -g @unocode/cli
```

After that you will be able to easily start a new project.

## CLI

A Command Line Interface (CLI) is an useful way to run actions that help you with your UnoCode project. Once you install UnoCode CLI, it gets accessible via `uno` command in your terminal.

Here is how you can install it using npm:

```
npm i -g @unocode/cli
```

After that you can type `uno` in your terminal and see what it returns.

```
UnoCode Available Commands:

  init     -  [name] - Create a new empty project
  new      -  [action|helper] - generate (and registers) an action or helper
  version  -  Shows CLI current version
  help     -  Shows available options in CLI

UnoCode CLI and UnoCode are made possible by TriggoLabs.

triggolabs.com
```

If you see a message like above, UnoCode CLI is successfully installed in your environment.

### uno init

To create a new project, you have the `init` command.

This command expects a name, which will be used to create the directory containing your code.

You can use it as follows:

```
uno init my-folder-name
```

This command will fetch our [Boilerplate](https://github.com/unocode/boilerplate) (empty) project and give you further instructions on how to start the dev server to see UnoCode in action.

### uno new

When using UnoCode, you generally want to separate your code into modules, since each module will be running on an specific page or condition. Those modules make your code easier to read and understand, instead of writing all your conditions on a big, monolithic file.

In UnoCode, those modules are called **actions**.

To create a new action you can use `uno new` command as follows:

```
uno new MyActionHere
```

This will generate a new folder with all needed files and the action will already be linked to your `index.js` file.

#### Helpers

If you want to create a helper module (a function or class with methods used by several actions), you can run the command:

```
uno new helper MyHelper
```

This will generate your helper file in `helpers` folder.

## Creating a new project

In order to create a new project with the CLI all you have to do is run:

```
uno init my-project-name
```

UnoCode CLI will then fetch our boilerplate project for you and add a new folder with everything you need to get started. You will also receive some basic instructions after the command finishes running.

A new UnoCode project consists of basically three base files:

- `package.json`
- `webpack.config.js`
- `index.js`

Bellow is their usage and properties:

### package.json

Since an UnoCode project is also a npm project, it will always start with a `package.json` file defining basic tasks and packages needed for UnoCode to run in your machine.

By being an npm project, UnoCode also makes it easy for you to install any dependency available in the npm ecosystem.

### webpack.config.js

UnoCode also uses webpack for bundling/building your project. It comes with basic configuration to help you run a dev server or compile your code for production. But you are totally free to add plugins and make any changes you need on this file as long as you keep the basic functionalities working.

Poor changes and problematic plugins may result in broken builds and hard-to-catch bugs in your project.

### index.js

This file is the entrypoint file from where you will bundle/compile your project. Every new action you create must be referenced here in order for UnoCode to know it has to run them.

Also, keep in mind that when you generate a new action with our CLI, it is automatically added to this file, saving you some time.

----

Once you have a new project created, simply run `npm install` inside it and then `npm start` to start the dev server.

You can now open Chrome, right click on UnoCode Extrension, go in "options" and check if the server is up and running, we've made a video below showing you how to it:

# Components and Libraries

UnoCode comes with a handful of components and libraries published on npm to help you with your applications. Here you can have an overview of each one of them.

## UnoAB

UnoCode A/B Testing, aka. UnoAB is a library to help you easily run random conditional code in your project.

### Instalation

You can install UnoAB via **npm**:

```
npm install --save @unocode/ab
```

### Usage

```js
import UnoAB from '@unocode/ab';

const ab = new UnoAB();

ab.addTest(() => { console.log('I am test A!'); });
ab.addTest(() => { console.log('I am test B!'); });

ab.run();

ab.hasFired // true
ab.codeFired // returns the function that was executed
```

### Persisting or Not Persisting

By default, UnoAB persists the function call, so only different users will experience different tests. You can disable this (and let user receive a new test on each run) as follows:

```js
import UnoAB from '@unocode/ab';

const ab = new UnoAB({ persist: false });

ab.addTest(() => { console.log('I am test A!'); });
ab.addTest(() => { console.log('I am test B!'); });

ab.run();
```

## Password Activation

Enables UnoCode execution on a page only if user has a password.

### Installation

```
npm install --save @unocode/password-activation
```

### Usage

```js
import PasswordActivation from '@unocode/password-activation';

const component = new PasswordActivation({
  target: document.body,
  data: {
    password: 'hello123'
  }
});

// Show button
check.show();

// Hide button
check.hide();

// Startup usage example:
if (check.hasSavedPassword() && check.passwordsMatches()) {
  // Start your application here.
} else {
  check.show();
}


// Detect password change event
component.on('passwordChanged', (data) => {
  data.password;        // string
  data.inputPassword;   // string
  data.matches;         // boolean (true|false)
});
```

You can check if password got correctly with:

```js
const component = new PasswordActivation({
  target: document.body,
  data: {
    password: 'hello123'
  }
});

component.on('passwordChanged', (data) => {
  if (data.matches) {
    alert('Success!');
  } else {
    alert('Password wrong!');
  }
});
```

## Reverse Polyfill

Simulates older browsers (IE 8) behavior, so older functions from legacy systems can work on newer browsers.

### Instalation

You can install UnoPolyfills via **npm**:

```
npm install --save @unocode/polyfills
```

### Usage

```js
import UnoPolyfills from '@unocode/polyfills';

const polyfills = new UnoPolyfills();

polyfills.fix_document_getElementById();
polyfills.fix_window_open();
polyfills.fix_window_show_modal_dialog();
```

### Using original methods after polyfills replaced them

UnoPolyfills save the original methods, so you can easily use them after you replaced them:

```js
import UnoPolyfills from '@unocode/polyfills';

const polyfills = new UnoPolyfills();

// Overrides getElementById() behavior.
polyfills.fix_document_getElementById();

// Runs with new behavior
document.getElementById('my-id');

// Runs original method (without polyfill)
polyfills.replaced.getElementById('my-id');
```

## UnoCode Automatic Navigator

Navigate and fill forms by writing code.

### Instalation

You can install UnoAutomaticNavigator via **npm**:

```
npm install --save @unocode/automatic-navigator
```

### Usage

```js
import UnoAutomaticNavigator from '@unocode/automatic-navigator';

const nav = new UnoAutomaticNavigator();

nav.input('.my-input-selector').value('Hello World!');
nav.button('.my-button').click();
```

### Functions available

```js
import UnoAutomaticNavigator from '@unocode/ab';

const nav = new UnoAutomaticNavigator();

nav.select('#select').index(1);
nav.select('#select').value('option-3');

nav.input('#input').value('Hello from input!');

nav.radio('#radio.radio-2').checked(true);
nav.radio('#radio.radio-2').checked(false);

nav.checkbox('#checkbox.checkbox-3').checked(true);
nav.checkbox('#checkbox.checkbox-3').checked(false);

nav.element('#div-with-click-event').clicked();
nav.element('a[href="/my-url"]').clicked();
```

You can also wait some time before triggering actions by using `wait(ms)`:

```js
import UnoAutomaticNavigator from '@unocode/ab';

const nav = new UnoAutomaticNavigator();

// Wait 5 seconds, then click button.
nav.wait(5000)
then(() => nav.button('.my-button').click());
```























## UnoCode Converter

Useful functions for fast-converting elements such as tables to `display: block` and fixed widths to relative widths.

### Instalation

You can install UnoConverter via **npm**:

```
npm install --save @unocode/converter
```

### Usage

```js
import UnoConverter from '@unocode/converter';

const converter = new UnoConverter();

converter.toDiv('table.my-broken-table');
```


### .toDiv(selector): Converting Table to DIV

What this function does is converting table's (and children recursively) `display` to `block`, this way mimicking the same functionality a div has, and making easier to apply responsiveness to a page.

```js
import UnoConverter from '@unocode/converter';

const converter = new UnoConverter();

converter.toDiv('table.my-broken-table');
```

### .toRelativeWidth(selector, overflowType? = [auto|scroll|hidden|visible]): Removing fixed width

With this function you're able to prevent layouts from exploding width max resolution on mobile interfaces. This method forces all elements under a given selector to ignore their set widths and behave with relative (percentage) widths. If that alone doesn't solve the issue, a second parameter `overflowType` can be passed with `hidden` or `scroll` values to prevent any bigger element from causing horizontal scroll in the body of the page.

```js
import UnoConverter from '@unocode/converter';

const converter = new UnoConverter();

// Force all elements to ignore their widths and fit on screen
converter.toRelativeWidth('body');

// Force a certain element to hide anything under
// itself that still doesn't fits the screen
converter.toRelativeWidth('.my-element-with-big-children', 'hidden');

// Same as above, but making those elements to get a horizontal scroll
// on .my-element-with-big-children
converter.toRelativeWidth('.my-element-with-big-children', 'scroll');
```

### .removeClasses(selector): Removing all CSS classes

If you need to clean elements (and their children) from all CSS classes, you can use this function to do so.

```js
import UnoConverter from '@unocode/converter';

const converter = new UnoConverter();

// Remove all classes from all buttons in the page
converter.removeClasses('button');

// Remove all classes from all elements containing this class
converter.removeClasses('.remove-this-class');
```