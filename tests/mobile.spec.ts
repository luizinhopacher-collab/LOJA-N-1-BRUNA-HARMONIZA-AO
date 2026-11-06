import {test, expect} from '@playwright/test';

test('telas pequenas, áreas de toque e texto ampliado', async ({page}, info) => {
 test.skip(info.project.name !== 'mobile', 'Validação específica de telas móveis');
 await page.emulateMedia({reducedMotion:'reduce'});
 for (const width of [320, 360, 390, 430, 760]) {
  await page.setViewportSize({width,height:640});
  await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), `overflow em ${width}px`).toBe(true);
  if (width===320 || width===390) await page.screenshot({path:`test-results/mobile-${width}.png`,fullPage:true});
  const cta=page.getByRole('link',{name:'AGENDAR AVALIAÇÃO',exact:true});
  await expect(cta).toBeVisible();
  const box=await cta.boundingBox();
  expect(box!.width).toBeGreaterThan(width * .8);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  const heading=await page.getByRole('heading',{level:1}).boundingBox();
  expect(heading!.x+heading!.width).toBeLessThanOrEqual(width);
  for (const button of await page.locator('.carousel-controls button').all()) {
   const rect=await button.boundingBox();
   expect(rect!.width).toBeGreaterThanOrEqual(44);
   expect(rect!.height).toBeGreaterThanOrEqual(44);
  }
  await page.getByRole('button',{name:'Abrir menu'}).click();
  await expect(page.locator('main')).toHaveAttribute('inert','');
  expect(await page.evaluate(()=>getComputedStyle(document.body).overflow)).toBe('hidden');
  await page.getByRole('navigation',{name:'Navegação móvel'}).getByRole('link',{name:'Contato',exact:true}).click();
  await expect(page.locator('main')).not.toHaveAttribute('inert');
  expect(await page.evaluate(()=>getComputedStyle(document.body).overflow)).not.toBe('hidden');
 }
 await page.setViewportSize({width:320,height:568});
 await page.goto('/');
 await page.addStyleTag({content:'p { font-size: 22px !important; }'});
 const clipped=await page.locator('.experience-slide.active .slide-copy').evaluate(e=>e.scrollHeight>e.clientHeight);
 expect(clipped).toBe(false);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.setViewportSize({width:667,height:375});
 await page.getByRole('button',{name:'Abrir menu'}).click();
 const menu=page.getByRole('navigation',{name:'Navegação móvel'});
 await menu.getByRole('link',{name:'Agendar avaliação'}).scrollIntoViewIfNeeded();
 await expect(menu.getByRole('link',{name:'Agendar avaliação'})).toBeInViewport();
});

test('carrossel responde ao gesto horizontal e preserva gesto vertical', async ({page}, info) => {
 test.skip(info.project.name !== 'mobile','Gesto de toque em celular');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 const stage=page.locator('.slide-stage');
 await stage.scrollIntoViewIfNeeded();
 const session = await page.context().newCDPSession(page);
 const box = (await stage.boundingBox())!;
 const startX = box.x + box.width * .75;
 const endX = box.x + box.width * .25;
 const y = box.y + 80;
 async function swipe(x1:number,y1:number,x2:number,y2:number) {
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y:y1}]});
  for (let step=1;step<=5;step++) {
   await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1+(x2-x1)*step/5,y:y1+(y2-y1)*step/5}]});
  }
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }
 await swipe(startX,y,endX,y+5);
 await expect(page.locator('.experience-slide.active h3')).toHaveText('Um olhar individual.');
 await swipe(endX,y,endX+20,y+100);
 await expect(page.locator('.experience-slide.active h3')).toHaveText('Um olhar individual.');
 await stage.scrollIntoViewIfNeeded();
 const nextBox=(await stage.boundingBox())!;
 await swipe(endX,nextBox.y+80,startX,nextBox.y+85);
 await expect(page.locator('.experience-slide.active h3')).toHaveText('Tempo para ouvir.');
});
