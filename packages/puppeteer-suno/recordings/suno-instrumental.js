const puppeteer = require('puppeteer'); // v23.0.0 or later

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1173,
            height: 744
        })
    }
    {
        const targetPage = page;
        await targetPage.goto('https://suno.com/create?wid=default');
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Instrumental)'),
            targetPage.locator('#main-container > div.flex div.min-w-\\[300px\\] div.gap-2 > div.items-center > div'),
            targetPage.locator('::-p-xpath(//*[@id=\\"main-container\\"]/div[1]/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[3]/div[1]/div)'),
            targetPage.locator(':scope >>> #main-container > div.flex div.min-w-\\[300px\\] div.gap-2 > div.items-center > div')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 33,
                y: 20,
              },
            });
    }

    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
