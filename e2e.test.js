const puppeteer = require('puppeteer');

describe('End-to-End Tests', () => {
  test('Application loads', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await expect(page.title()).resolves.toMatch('记账应用');
    await browser.close();
  });

  // 其他端到端测试用例
});
