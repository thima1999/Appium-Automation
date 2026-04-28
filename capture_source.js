const { remote } = require('webdriverio');
const fs = require('fs');

async function capturePageSource() {
  const browser = await remote({
    hostname: 'localhost',
    port: 4723,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': '1A041FDF6001N1',
      'appium:appPackage': 'com.bluelotus360.bl360erpgo',
      'appium:appActivity': 'crc6482fc87f8f0f2a928.MainActivity',
      'appium:noReset': true
    }
  });

  try {
    const source = await browser.getPageSource();
    fs.writeFileSync('current_page_source.xml', source);
    console.log('Page source saved to current_page_source.xml');
  } catch (error) {
    console.error('Error capturing page source:', error);
  } finally {
    await browser.deleteSession();
  }
}

capturePageSource();