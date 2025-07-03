const puppeteer = require('puppeteer'); // v23.0.0 or later

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 902,
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
            targetPage.locator('::-p-aria(Upbeat dark electro song about stolen hoodies)'),
            targetPage.locator("[data-testid='prompt-input-textarea']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"prompt-input-textarea\\"])'),
            targetPage.locator(":scope >>> [data-testid='prompt-input-textarea']")
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 295,
                y: 9,
              },
            });
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down('Shift');
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up('Shift');
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Custom) >>>> ::-p-aria([role=\\"generic\\"])'),
            targetPage.locator('button.text-foreground-primary\\/70 > span'),
            targetPage.locator('::-p-xpath(//*[@id=\\"main-container\\"]/div[1]/div/div[1]/div/div[1]/div[2]/div[2]/button[2]/span)'),
            targetPage.locator(':scope >>> button.text-foreground-primary\\/70 > span'),
            targetPage.locator('::-p-text(Custom)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 16.5625,
                y: 18,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Add your own lyrics here)'),
            targetPage.locator("[data-testid='lyrics-input-textarea']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"lyrics-input-textarea\\"])'),
            targetPage.locator(":scope >>> [data-testid='lyrics-input-textarea']")
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 241,
                y: 33,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Add your own lyrics here)'),
            targetPage.locator("[data-testid='lyrics-input-textarea']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"lyrics-input-textarea\\"])'),
            targetPage.locator(":scope >>> [data-testid='lyrics-input-textarea']")
        ])
            .setTimeout(timeout)
            .fill('This is a test lyrics for SU');
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up('u');
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Add your own lyrics here)'),
            targetPage.locator("[data-testid='lyrics-input-textarea']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"lyrics-input-textarea\\"])'),
            targetPage.locator(":scope >>> [data-testid='lyrics-input-textarea']")
        ])
            .setTimeout(timeout)
            .fill('This is a test lyrics for SUno A');
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up('a');
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Add your own lyrics here)'),
            targetPage.locator("[data-testid='lyrics-input-textarea']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"lyrics-input-textarea\\"])'),
            targetPage.locator(":scope >>> [data-testid='lyrics-input-textarea']")
        ])
            .setTimeout(timeout)
            .fill('This is a test lyrics for SUno Automation');
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Enter style tags)'),
            targetPage.locator("[data-testid='tag-input-textarea']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"tag-input-textarea\\"])'),
            targetPage.locator(":scope >>> [data-testid='tag-input-textarea']")
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 107,
                y: 79,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Enter style tags)'),
            targetPage.locator("[data-testid='tag-input-textarea']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"tag-input-textarea\\"])'),
            targetPage.locator(":scope >>> [data-testid='tag-input-textarea']")
        ])
            .setTimeout(timeout)
            .fill('pop, energetic');
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Create[role=\\"button\\"]) >>>> ::-p-aria([role=\\"image\\"])'),
            targetPage.locator('div.min-w-\\[300px\\] > div > div.h-auto > div.flex-1 svg'),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"create-button\\"]/span/svg)'),
            targetPage.locator(':scope >>> div.min-w-\\[300px\\] > div > div.h-auto > div.flex-1 svg')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 19.0546875,
                y: 1,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('html'),
            targetPage.locator('::-p-xpath(/html)'),
            targetPage.locator(':scope >>> html')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 1030,
                y: 248,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('html'),
            targetPage.locator('::-p-xpath(/html)'),
            targetPage.locator(':scope >>> html')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 1036,
                y: 487,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('html'),
            targetPage.locator('::-p-xpath(/html)'),
            targetPage.locator(':scope >>> html')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 1028,
                y: 254,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('html'),
            targetPage.locator('::-p-xpath(/html)'),
            targetPage.locator(':scope >>> html')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 1009,
                y: 495,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('html'),
            targetPage.locator('::-p-xpath(/html)'),
            targetPage.locator(':scope >>> html')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 1035,
                y: 253,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div:nth-of-type(9) div.cursor-pointer > div > div'),
            targetPage.locator('::-p-xpath(//*[@id=\\"radix-«rfp»\\"]/div[1]/div/div)'),
            targetPage.locator(':scope >>> div:nth-of-type(9) div.cursor-pointer > div > div'),
            targetPage.locator('::-p-text(MP3 Audio)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 33,
                y: 10.5,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Download Anyway) >>>> ::-p-aria([role=\\"generic\\"])'),
            targetPage.locator('div.fixed button:nth-of-type(2) > span'),
            targetPage.locator('::-p-xpath(/html/body/div[11]/div/div[2]/div[3]/div[2]/button[2]/span)'),
            targetPage.locator(':scope >>> div.fixed button:nth-of-type(2) > span'),
            targetPage.locator('::-p-text(Download Anyway)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 127.0390625,
                y: 11,
              },
            });
    }

    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
