# selenium-with-fingerprints

This is the repo for `selenium-with-fingerprints`, a plugin for the [selenium](https://github.com/SeleniumHQ/selenium) framework that allows you to change a browser fingerprint, generate a virtual identity and improve your browser's stealth.

In order to achieve this, the [FingerprintSwitcher](https://fp.bablosoft.com) service is used, which allows you to replace a list of important browser properties, and thus you will act like a completely new user.

**WARNING:** plugin is still in beta stage, it means that bugs may happen, including critical.

Adding a plugin to your project is very easy - it only takes a few lines of code.
You just need to change the browser startup code a bit and add method calls to get and apply fingerprints.
The rest of the code can remain unchanged.
In general, only **four** basic steps are required, see the example below (code from the example may differ slightly from the real one):

https://user-images.githubusercontent.com/30115373/198843827-f20b628f-49f2-4d13-8ee4-1c72ae490f2e.mp4

Current supported engine version - **138.0.7204.50**.

**IMPORTANT NOTE:** plugin only work on **Windows** operating system, it cannot be installed and used on **Linux**, **macOS** and other systems!

## About

This library allows you to change browser fingerprint and use **selenium** automation framework with enhanced anonymity.
In order to migrate and use it, a minimum of modifications and code changes is required.

**Browser fingerprinting** - is a technique that allows to identify the user by a combination of browser properties, such as - fonts, resolution, list of plugins, navigator properties, etc.
By adding new factors and using browser **API** in a special way, a site can determine exactly which user is visiting it, even if the user is using a proxy.
When using this package and replacing fingerprints, websites will not be able to identify you from other users, as all these properties and results of **API** calls will be replaced with values from real devices.

Let's look at a small example of **WebGL** property substitution.
In the screenshot below, the left column shows the values from the regular browser, and the right column shows the values substituted using ready-made fingerprints.
This result cannot be achieved using only the replacement of various browser properties via **JavaScript**, that's what this plugin and service is for:

![WebGL](https://github.com/CheshireCaat/browser-with-fingerprints/raw/master/assets/webgl.jpg)

You can learn more by following this [link](https://fp.bablosoft.com/#capabilities).

## Installation

To use this plugin in your project, install it with your favorite package manager:

```bash
npm i selenium-with-fingerprints
# or
pnpm i selenium-with-fingerprints
# or
yarn add selenium-with-fingerprints
```

The `selenium-webdriver` package must also be installed. If this package is already installed, you can skip this step:

```bash
npm i selenium-webdriver
```

But keep in mind that some versions may not be supported. In this case, you will get an error when importing the plugin.
You can always find supported version numbers [here](package.json#L65).

Please note that this plugin only supports the default `selenium` library, wrappers have not been tested and may cause errors.
Also, according to the [architecture](#architecture) section, this plugin can only be installed and used on **Windows** operating system.

## Dependencies

In order for the plugin to work correctly, just like in the standard framework, a certain version of `chromedriver` must be installed.
You can manually install the desired version of the driver, add the path to it in the **PATH** environment variable, and so on.
But it's best and safer to use a ready-made [npm](https://www.npmjs.com/package/chromedriver) package:

```bash
npm i chromedriver@132.0.1
```

If you're not sure which version to install, use the current supported engine version number.
After the previous step, just add the package import at the very beginning of your code:

```js
require('chromedriver');
```

You can look at the examples in the corresponding folder - each uses a similar approach.
For more information, also refer to the documentation for the original framework.

## Creating new project

Here's how to start working on a project from scratch.

First you need to import the `selenium-with-fingerprints` library:

```js
const { plugin } = require('selenium-with-fingerprints');
```

No need to require the `selenium-webdriver`.

After that, you need to obtain the fingerprint from the server and apply it:

```js
// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

const fingerprint = await plugin.fetch({
  tags: ['Microsoft Windows', 'Chrome'],
});

plugin.useFingerprint(fingerprint);
```

When this code is executed, the `fingerprint` variable will contain the data required to apply the fingerprint.
It's a string, you can save it to a file and use it later.
Running this code for the first time can be very slow. Additional time is needed to download the browser.

Finally, you need to create the browser instance:

```js
const driver = await plugin.launch();
```

The parameters of the launch method are the same as the corresponding method in the selenium library, [link](https://www.selenium.dev/selenium/docs/api/javascript/Builder.html#build).
The `driver` variable will contain an instance of the [WebDriver](https://www.selenium.dev/selenium/docs/api/javascript/WebDriver.html) class defined in the selenium library.
It means that it can be used to write a new or use an existing selenium script without any changes.
You need to rely on the documentation of the original framework on how to use control browser - [link](https://www.selenium.dev/selenium/docs/api/javascript/).

Here is the complete code, you can copy/paste it and try:

```js
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

(async () => {
  // Get a fingerprint from the server:
  const fingerprint = await plugin.fetch({
    tags: ['Microsoft Windows', 'Chrome'],
  });

  // Apply fingerprint:
  plugin.useFingerprint(fingerprint);

  // Launch the browser instance:
  const driver = await plugin.launch();

  // The rest of the code is the same as for a standard `selenium` library:
  await driver.get('https://example.com');

  // Print the browser viewport size:
  console.log(
    'Viewport:',
    await driver.executeScript(() => ({
      deviceScaleFactor: window.devicePixelRatio,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }))
  );

  await driver.quit();
})();
```

Also take a look at the **TypeScript** declarations [here](src/index.d.ts) for more details about the exported classes, methods, and properties.
Thanks to them, when using the library, auto-completion with detailed descriptions will work.

## Migration

There are a few steps required to start using fingerprints for your existing project:

1. Import `selenium-with-fingerprints` instead of `selenium-webdriver`.
2. Call the `useFingerprint` and/or `useProxy` methods to apply the fingerprint and proxy before starting the browser.
3. Launch the browser using the `plugin.launch` method (the `plugin` variable was imported in the first step).
4. The rest of the code can be left unchanged.

Consider you have the following project using the selenium:

```js
/* Without fingerprints */
const { until, Builder, By } = require('selenium-webdriver');

(async () => {
  const driver = await new Builder().forBrowser('chrome').build();

  await driver.get('https://browserleaks.com/canvas');
  const el = await driver.wait(until.elementLocated(By.id('crc')));

  await driver.wait(until.elementTextContains(el, '✔'));
  console.log('Canvas signature:', await el.getText());

  await driver.quit();
})();
```

It verifies the canvas signature by visiting [this](https://browserleaks.com/canvas) URL and parsing the corresponding value.
No matter how many times you run this test on the same machine, the results will be the **same**.
This is because this test depends on the hardware you are using - if the hardware stays the same, the results will also be the same.
But if we change the fingerprint, the results will be different.

Let's modify this project to add fingerprint support. The updated code will look like this:

```js
/* With fingerprints */

// Import `selenium-with-fingerprints` instead of `selenium-webdriver`
// const { Builder } = require('selenium-webdriver');
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

(async () => {
  // Obtain a fingerprint from the server. The resulting variable contains a string - it can be stored for later use:
  const fingerprint = await plugin.fetch({
    tags: ['Microsoft Windows', 'Chrome'],
  });

  // Apply fingerprint - after calling the `useFingerprint` method, the browser will be launched with a fingerprint:
  plugin.useFingerprint(fingerprint);

  // Replace `builder.build` method call with `plugin.launch`:
  // const driver = await new Builder().forBrowser('chrome').build();
  const driver = await plugin.launch({ builder: new Builder().forBrowser('chrome') });

  // The rest of the code is the same as for the standard `selenium` library:
  await driver.get('https://browserleaks.com/canvas');
  const el = await driver.wait(until.elementLocated(By.id('crc')));

  await driver.wait(until.elementTextContains(el, '✔'));
  console.log('Canvas signature:', await el.getText());

  await driver.quit();
})();
```

After running the updated code, a new fingerprint will be applied each time, so the scores will be different for each run.

## Common problems

You can find information about known issues related to updates, as well as ways to solve them in [this](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/MIGRATION.md) guide.

## Launching the browser

You can launch the browser in two different ways. There are two methods for this - **launch** and **spawn**.

The parameters and return type of the **launch** method are exactly the same as for `Builder.build` method.
You can use the official [API](https://www.selenium.dev/selenium/docs/api/javascript/Builder.html#build) documentation to learn more about them.
The **launch** method also has the same purpose - to start a new browser instance with the given parameters and connect to it.

In addition to the standard functionality, it allows you to change the fingerprint and proxy using the `useFingerprint` and `useProxy` methods.
A detailed description and annotations can also be found [here](src/index.d.ts#L49).

```js
const { plugin } = require('selenium-with-fingerprints');

const browser = await plugin.launch({ builder: new Builder() });
```

The **spawn** method works in a similar way, but uses a separate mechanism to launch the browser.
The main difference is that this method just starts the process, but doesn't connect to it for automation - you can do it yourself later.

This method returns a running browser instance that can be used to connect to an existing session using `selenium`:

```js
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { plugin } = require('selenium-with-fingerprints');

const chrome = await plugin.spawn({ headless: true });

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new Options().debuggerAddress(`localhost:${chrome.port}`))
  .build();

await driver.quit();
await chrome.close();
```

At [this](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/plugin/launcher/index.d.ts#L54) link you can find a detailed description of all the options allowed for **spawn** method.
The same goes for the return type declaration, details of which can be found [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/plugin/launcher/index.d.ts#L6).

If possible, use it only in extreme cases. It is much more convenient to use the **launch** method to launch the browser, which minimizes the number of steps for proper initialization and configuration.

Annotations are described for all plugins methods directly in the library code via the **TypeScript** declarations, so when using it you will be able to see hints for all options and types.
You can also find out about it directly [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts) and [here](src/index.d.ts).

## Configuring plugin

At the moment, it is possible to change the service key, working folder and timeout for requests to the engine, which is used when fetching, applying fingerprints, and so on:

```js
// Set the fingerprint service key for all plugin methods that require it.
plugin.setServiceKey('SERVICE_KEY');

// Set the folder where the plugin engine will be installed:
plugin.setWorkingFolder('./engine');

// Set the timeout used when fetching fingerprints and so on:
plugin.setRequestTimeout(5 * 60000);

// Set the timeout used when installing/downloading engine:
plugin.setEngineTimeout(10 * 60000);
```

The methods from the example above change the settings globally, that is, for all instances of the plugin.

The default values are the `./data` directory for the working folder and `300000` milliseconds for the request timeout.

An empty string is used for the fingerprint service key by default, which means that the free version of the service will be used.

## Configuring browser

In order to change the fingerprint and proxy for your browser, you should use special separate methods:

- **useProxy** - to change the proxy configuration.
- **useProfile** - to change the profile configuration.
- **useFingerprint** - to change the fingerprint configuration.

These methods directly affect only the next launch of the browser. So you should always use them before using the `launch` plugin method.

You cannot change the settings once the browser is launched - more specifically, an already launched instance will not be affected by the new configuration.
But you can safely change the options for the next run, or for a separate browser instance with a different unique configuration.

You can also **chain** calls, since all these methods return the current plugin instance. It does not matter in which order the settings will be applied. It might look like this:

```js
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

const fingerprint = await plugin.fetch({
  tags: ['Microsoft Windows', 'Chrome'],
});

plugin.useProxy('127.0.0.1:8080').useFingerprint(fingerprint);
```

Use these links to see a detailed description of the methods:

- [This](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L94) one for the **useFingerprint** method
  (also see additional options [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fingerprint.d.ts#L4)).
- [This](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L124) one for the **useProfile** method
  (also see additional options [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/profile.d.ts#L4)).
- [This](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L152) one for the **useProxy** method
  (also see additional options [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/proxy.d.ts#L24)).

The usage of these methods is very similar - each takes two parameters, the first of which is the configuration data itself, and the second is additional options.
The fingerprint and proxy will not be changed unless the appropriate method is used. In this case, all settings related to browser fingerprinting will remain at their original values.

Fingerprint and proxy aren't applied instantly when calling methods. Instead, the configuration is saved and used directly when the browser is launched using the **launch** or **spawn** methods.
Thus, you can pre-configure the plugin in a certain way, or change something immediately before launching the browser.

### Configuring browser version

You can change the browser version right while using the plugin - the engine may come with several different builds of the browser.

In order to do this, use the **useBrowserVersion** method.
The `default` value means that the latest available version will be used:

```js
const { plugin } = require('selenium-with-fingerprints');

// Use a specific version:
plugin.useBrowserVersion('128.0.6613.85');

// Use the latest available version:
plugin.useBrowserVersion('default');
```

If you specify an unavailable or invalid version, an appropriate error will be thrown when the browser starts.
Also keep in mind that this property only affects a specific instance of the plugin, not the entire library.

In order to get a list of available versions shipped with the engine, use the **versions** method.
It returns a list of browser versions as strings or objects with additional information, depending on the format passed:

```js
const { plugin } = require('selenium-with-fingerprints');

// The list of versions is always sorted in descending order:
await plugin.versions('extended').then((versions) => {
  // The latest available browser version will be used:
  plugin.useBrowserVersion(versions[0]['browser_version']);
});
```

Thanks to this, you can, for example, use the version that corresponds to a certain fingerprint, and vice versa.

### Fingerprint usage

In order to change the fingerprint, you need to run the `useFingerprint` method before starting the browser, i.e. before using the plugin's `launch` method.

The `useFingerprint` method takes two parameters.
The first is a string with fingerprint data that you can request from the service.
The second is additional options for applying a fingerprint, most of which are applied automatically - for example, the safe replacement of the **BatteryAPI** and **AudioAPI** properties:

```js
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

const fingerprint = await plugin.fetch({
  tags: ['Microsoft Windows', 'Chrome'],
});

plugin.useFingerprint(fingerprint, {
  // It's disabled by default.
  safeElementSize: true,
  // It's enabled by default.
  safeBattery: false,
});
```

In order to obtain fingerprints you should use the **fetch** plugin method.
Pass the service key as the first argument for the **serviceKey** and additional parameters for the **fetch**, if necessary:

```js
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

const fingerprint = await plugin.fetch({
  tags: ['Microsoft Windows', 'Chrome'],
  // Fetch fingerprints only with a browser version higher than 130:
  minBrowserVersion: 130,
  // Fetch fingerprints only with a browser version lower than 132:
  maxBrowserVersion: 132,
  // Fetch fingerprints only collected in the last 15 days:
  timeLimit: '15 days',
});
```

In order to use filters and many other settings from the example above, you will need a premium key, the same applies to tags that differ from the default ones:

```js
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
plugin.setServiceKey('SERVICE_KEY');

// In order to use custom tags you need the premium key:
const fingerprint = await plugin.fetch({
  tags: ['Android', 'Chrome'],
});
plugin.useFingerprint(fingerprint);

await plugin.launch();
```

All possible settings for **fetch** method, as well as their descriptions, you can find [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fetch.d.ts#L35).

The special `current` value can be used to filter fingerprints by browser version - in this case, the version installed for the plugin will be used.
It can be very convenient as the browser and fingerprint versions will be exactly the same and you don't have to enter the exact values in multiple places.

You can **reuse** fingerprints instead of requesting new ones each time.
To do this, you can save them to a file or to a database - use any option convenient for you.
In this way, you can speed up the process of launching the browser with the parameters you need, organize your storage, filter and sort fingerprints locally, and much more:

```js
const { readFile, writeFile } = require('fs/promises');
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

// Save the fingerprint to a file:
const fingerprint = await plugin.fetch({
  tags: ['Microsoft Windows', 'Chrome'],
});
await writeFile('fingerprint.json', fingerprint);

// Load fingerprint from file at next run:
plugin.useFingerprint(await readFile('fingerprint.json', 'utf8'));
```

You can learn more about the options directly when adding these methods - just use the built-in [annotations](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L214).

You can use any [tags](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fetch.d.ts#L13), filters
(e.g. [time](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fetch.d.ts#L6) limit) and settings if you have a service key.

If you specify an empty string as the first argument for the `fetch` or the `setServiceKey` method, the free version will be used.
For a free version you won't be able to use other tags than the default ones, as well as some other filters:

```js
// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

const fingerprint = await plugin.fetch({
  // You can only use these tags with the free version:
  tags: ['Microsoft Windows', 'Chrome'],
  // You also cannot use such filters in the free version:
  // minBrowserVersion: 130,
});
```

In the free version, the [PerfectCanvas](https://wiki.bablosoft.com/doku.php?id=perfectcanvas) technology is also not available.
There are other limitations when using the free version - for example, limiting the number of requests in a certain period of time.
To see the differences and limits of different versions, visit [this](https://fp.bablosoft.com/#pricing) website.

You can buy a key [here](https://bablosoft.com/directbuy/FingerprintSwitcher/2) to avoid limitations.

### Profile usage

In order to use a specific browser profile, you can, among other options, use the `useProfile` method.
As the first parameter, it takes the path to the profile folder - the same value that you specify, for example, for the `user-data-dir` argument.
The second parameter is additional options that are primarily responsible for loading fingerprint and proxy data from the profile folder:

```js
const path = require('path');
const { plugin } = require('selenium-with-fingerprints');

// Set the service key for the plugin (you can buy it here https://bablosoft.com/directbuy/FingerprintSwitcher/2).
// Leave an empty string to use the free version.
plugin.setServiceKey('');

// The key may be required if the fingerprint will be used from the profile.
plugin.useProfile(path.resolve('./profile'), {
  // Don't load fingerprint from profile folder:
  loadFingerprint: false,
  // Don't load proxy from profile folder:
  loadProxy: false,
});
```

By default, the plugin will load proxy and fingerprint data from the profile folder, if they are written there.
You can change this behavior by setting the options to `false` - for example, if you are not sure that the stored proxy is working.
Please note that if you add your fingerprint or proxy through the appropriate methods, then the data you specified will be used regardless of the options.

You can also use other options to set the path to the profile folder, such as the `userDataDir` option, if you don't need additional settings:

```js
const path = require('path');
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { plugin } = require('selenium-with-fingerprints');

const options = new Options().addArguments(
  // Browser arguments can be used as well:
  `--user-data-dir=${path.resolve('./profile')}`
);

const browser = await plugin.launch({ builder: new Builder().setChromeOptions(options) });
```

After launching a browser with your profile, the fingerprint and proxy data you specified will always be stored in the profile folder.
This setting itself is saved between browser launches, that is, it behaves in the same way as other similar methods.
To run different profiles, you need to call this method again with different values for the profile directory.

You can learn more about the parameters and additional options for this method [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L124)
and [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/profile.d.ts#L4).

#### Temporary profiles

Since version `1.3.0` the plugin uses its own logic to configure browser profiles.
This primarily applies to situations where you don't specify options like `user-data-dir` yourself.

Each framework makes temporary profiles in such cases in completely different places, but for the convenience and correct operation of some fingerprint components, a different solution is used.
If you do not specify the path to the profile yourself, then the engine will create its own temporary one - such a profile will be located directly in the engine folder, for example:

```js
const { plugin } = require('selenium-with-fingerprints');

// The profile will be located in the `data/profiles/UNIQUE_ID` folder:
const browser = await plugin.launch();
```

If you specify the path yourself, then everything will work as usual - just the plugin will add additional components, like `widevine` or default extensions, to the specified profile.

Also keep in mind that if you specify your own folder for the engine using the `setWorkingFolder` method, then the profile path will be adjusted.

### Proxy usage

In order to set up a proxy, you should use the `useProxy` method.
The first parameter of this method is a string with information about the proxy.
The second parameter is additional options that will be applied to the browser, for example, automatic change of language and time zone:

```js
const { plugin } = require('selenium-with-fingerprints');

plugin.useProxy('127.0.0.1:8080', {
  // Change browser timezone according to proxy:
  changeTimezone: true,
  // Replace browser geolocation according to proxy:
  changeGeolocation: true,
});
```

You can learn more about the parameters and additional options for this method [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L152)
and [here](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/proxy.d.ts#L24).

The browser supports two types of proxies - **https** and **socks5**.
It is better to always specify the proxy type in the address line - otherwise, **https** will be used by default.

You can use aliases - **http** instead of **https** and **socks** instead of **socks5**.
Proxies with authorization (with login and password) are also supported.

In general, when specifying addresses, you can use many different formats, for example:

- `127.0.0.1:8080`
- `https://127.0.0.1:8080`
- `socks5://127.0.0.1:8181`
- `username:password@127.0.0.1:8080`
- `socks:127.0.0.1:8080:username:password`
- `https://username:password:127.0.0.1:8080`

In order to preserve compatibility with the original library syntax, the proxy can be obtained from the arguments you specified.
The `proxy-server` option will be used as the value, and all other options will be set to their default values.
But this will be done only if you didn't call the appropriate method for the proxy configuration:

```js
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { plugin } = require('selenium-with-fingerprints');

const options = new Options().addArguments(
  // The syntax for specifying an argument value
  // is exactly the same as for using a separate method.
  '--proxy-server=https://127.0.0.1:8080'
);

const browser = await plugin.launch({ builder: new Builder().setChromeOptions(options) });
```

It's better to replace such code with the `useProxy` method. This is much more convenient because you can immediately set the additional options you need.

### More info

If you want to learn more about fingerprint substitution technology, explore the list of replaceable properties and various options, such as tags, get or configure your service key, use [this](https://fp.bablosoft.com) link.
There you can also get a test fingerprint and see ready-made values that can be applied to your browser.

### More examples

Please take a look at the [examples](examples) directory with ready-made real code examples.
You can run them yourself by cloning the repository locally and installing the dependencies.

## Architecture

This plugin uses the [FingerprintSwitcher](https://fp.bablosoft.com) service to get fingerprints.
The resulting fingerprints are used later directly when working with the browser and are applied in a special way using a custom configuration files.

There are some **limitations** in using the package, which may be critical or non-critical depending on your task.
For example, for the correct operation of the fingerprint substitution technology, a custom browser with various patches is required.
This browser is downloaded and installed automatically the first time the **API** methods are called.
It also implies a limitation - it will be impossible to use standard and other various engines.

Fingerprints aren't generated, but downloaded from the service, as they are collected from real devices.
It greatly improves the anonymity and quality of the substitution of various properties.

Also keep in mind that this package only work on the **Windows** operating system.
If you install or run it on other platforms, you will get the corresponding errors.
This is a forced measure due to the presence of some critical **Windows-only** dependencies without which this implementation will not work.

The plugin architecture can be summarized as the following diagram:

![Architecture](https://github.com/CheshireCaat/browser-with-fingerprints/raw/master/assets/plugin.jpg)

All packages can only work with the **Chrome** browser, which comes bundled with the libraries and loads automatically.
The path to the executable file is defined on the plugin side and cannot be changed.
It means that you will not be able to use not only other versions of **Chrome** or **Chromium**, but also other browser engines.
The same goes for some framework-specific launch options.

This library tries to replicate the interfaces of the **selenium** framework as much as possible.
Thus, it's convenient to use it not only for new projects, but also when migrating from the original version to this plugin.
For things not related to launching the browser and the plugin directly, it's better to use the methods and properties of the original library.

### Limitations

Please **note** that there are some restrictions at the moment:

- Only **Windows** operating system is supported.
- Parallel launch of browsers is synchronized between calls.
- Working with **workers** is possible only when specifying a separate working folder for each of them.

Also, there is no guarantee that each of these items will be changed in the future.

## Alternatives

Check out other ready-made plugins for popular automation frameworks that have a similar **API** and architecture:

- Plugin for **puppeteer** - [puppeteer-with-fingerprints](https://github.com/CheshireCaat/puppeteer-with-fingerprints)
- Plugin for **playwright** - [playwright-with-fingerprints](https://github.com/CheshireCaat/playwright-with-fingerprints)

Also check out [BAS](https://bablosoft.com/shop/BrowserAutomationStudio) - a great alternative to automate the **Chrome** browser without programming skills.
It also supports fingerprint substitution, has simple and powerful multithreading and other advantages.

## Documentation

Here you can find a brief description of methods and classes, as well as links to them.

#### [Tag](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fetch.d.ts#L13)

Describes a tag value that can be used to filter fingerprints.

---

#### [Time](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fetch.d.ts#L6)

Describes a time limit that can be used to filter fingerprints.

---

### [Version](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L16)

Describes an object that provides complete information about the available browser version.

---

#### [plugin.versions(format?)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L64)

- `format` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** The output format of the returned result.

Returns: **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Version[]|string[]>** The list of objects with detailed version information, or a list of strings.

Get a list of all available browser versions.

---

#### [plugin.spawn(options?)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L250)

- `options` **[Options](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/plugin/launcher/index.d.ts#L54)?** Launcher options that only apply to the browser when using the `spawn` method.

Returns: **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Browser>** Promise which resolves to a browser instance.

Launches a browser instance with given arguments and options when specified.

---

#### [plugin.launch(options?)](src/index.d.ts#L49)

- `options` **[LaunchOptions](src/index.d.ts#L7)?** Set of configurable options to set on the browser.

Returns: **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Selenium.WebDriver>** Promise which resolves to a browser instance.

Launches **selenium** and launches a browser instance with given arguments and options when specified.

---

#### [plugin.fetch(options?)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L214)

- `options` **[FetchOptions](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fetch.d.ts#L35)?** Set of configurable options for getting a browser fingerprint.

Returns: **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)&lt;string>** Promise which resolves to a fingerprint string.

Obtain a fingerprint using the specified service key and additional options.

---

#### [plugin.useBrowserVersion(version)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L175)

- `value` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Version value as a string.

Returns: **this** The same plugin instance with an updated settings (for optional chaining).

Set the current browser version used by the plugin instance.

---

#### [plugin.useProxy(value?, options?)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L152)

- `value` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Proxy value as a string.
- `options` **[ProxyOptions](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/proxy.d.ts#L24)?** Set of configurable options for applying a proxy.

Set the proxy settings using the specified proxy as a string and additional options when specified.

Returns: **this** The same plugin instance with an updated settings (for optional chaining).

---

#### [plugin.useProfile(value?, options?)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L124)

- `value` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Profile value as a string.
- `options` **[ProfileOptions](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/profile.d.ts#L4)?** Set of configurable options for applying a profile.

Returns: **this** The same plugin instance with an updated settings (for optional chaining).

Set the profile settings using the specified profile as a string and additional options when specified.

---

#### [plugin.useFingerprint(value?, options?)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L94)

- `value` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Fingerprint value as a string.
- `options` **[FingerprintOptions](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/types/fingerprint.d.ts#L4)?** Set of configurable options for applying a fingerprint.

Set the fingerprint settings using the specified fingerprint as a string and additional options when specified.

Returns: **this** The same plugin instance with an updated settings (for optional chaining).

---

#### [plugin.setWorkingFolder(folder)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L301)

- `folder` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The working folder that the plugin engine will use.

Set the working folder that the plugin uses to work with the engine.

---

#### [plugin.setRequestTimeout(timeout)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L267)

- `timeout` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The request timeout that the plugin engine will use.

Set the timeout that the plugin uses when executing requests (pass `0` to disable it).

---

#### [plugin.setEngineTimeout(timeout)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L284)

- `timeout` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The engine timeout that the plugin engine will use.

Set the timeout that the plugin uses when fetching engine (pass `0` to disable it).

---

#### [plugin.setServiceKey(key)](https://github.com/CheshireCaat/browser-with-fingerprints/blob/master/src/index.d.ts#L318)

- `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The service key for obtaining and applying a fingerprint.

Set the fingerprint service key for all plugin methods that require it.

---

## Troubleshooting

If you encounter any issue or bug, please use the [issues](https://github.com/CheshireCaat/selenium-with-fingerprints/issues) section of the repository.

Please describe the problem in as much detail as possible when creating tickets - indicate the sequence of actions (steps) to repeat the problem, error output, and so on.

If the code is large, attach it as files or use sandboxes. At the same time, it's better to remove from it areas that do not relate to the problem - it will be much easier to figure it out.
Format your code and wrap it in special **markdown** tags if you're adding it to an issue report, for example:

```js
// your code
```

Please be careful not to attach various **secrets** in your code or screenshots - for example, fingerprint service keys, account passwords, and so on.
In the case of service keys, this can lead to their blocking without a refund.

If the recommendations are not followed, your ticket may be ignored.

## Testing

The excellent [mocha](https://github.com/mochajs/mocha) framework is used for tests in this library.
Use the command line or ready-made scripts if you want to run them yourself.

You can also use the **FINGERPRINT_CWD** environment variable to specify the directory where the engine will be stored, for example:

```properties
FINGERPRINT_CWD="../plugin-engine"
```

The **FINGERPRINT_TIMEOUT** variable can be set if it's necessary to change the default timeout for executing engine methods, such as applying or fetching a fingerprint:

```properties
FINGERPRINT_TIMEOUT=300000
```

You can define it in any way convenient for you, but by default variables are read from the **env** files using the [dotenv](https://github.com/motdotla/dotenv) library.

## License

Copyright © 2025, [CheshireCaat](https://github.com/CheshireCaat). Released under the [MIT](LICENSE.md) license.
