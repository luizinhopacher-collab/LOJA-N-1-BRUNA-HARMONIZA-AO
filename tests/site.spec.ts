import {test,expect} from '@playwright/test';
test('conteúdo, contatos, carrossel e layout',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('A beleza de ser você');
 await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 const whatsapp=page.getByRole('link',{name:'CONVERSAR PELO WHATSAPP'});await expect(whatsapp).toHaveAttribute('href',/^https:\/\/wa.me\/5547991234466\?text=/);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Ir para etapa 2'}).click();
 await expect(page.locator('.experience-slide.active h3')).toHaveText('Um olhar individual.');
 await page.getByRole('button',{name:'Próxima etapa'}).click();
 await expect(page.locator('.experience-slide.active h3')).toHaveText('Clareza em cada etapa.');
 await page.getByRole('button',{name:'Etapa anterior'}).click();
 await expect(page.locator('.experience-slide.active h3')).toHaveText('Um olhar individual.');
 if(info.project.name==='mobile'){
  await page.getByRole('button',{name:'Abrir menu'}).click();await expect(page.getByRole('navigation',{name:'Navegação móvel'})).toBeVisible();
  await page.getByRole('navigation',{name:'Navegação móvel'}).getByRole('link',{name:'Cuidados'}).click();await expect(page).toHaveURL(/#cuidados$/);await expect(page.getByRole('button',{name:'Abrir menu'})).toHaveAttribute('aria-expanded','false');
  await page.getByRole('button',{name:'Abrir menu'}).click();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Abrir menu'})).toBeFocused();
 }
 expect(errors).toEqual([]);
 await page.goto('/');await page.screenshot({path:`test-results/${info.project.name}.png`,fullPage:true});
});

test('vídeo decorativo e preferência de movimento',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 if(info.project.name==='mobile') {
  await expect(page.locator('.hero-video')).toHaveCount(0);
 } else {
  const video=page.locator('.hero-video');
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Pausar vídeo de fundo'}).click();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
  await page.getByRole('button',{name:'Reproduzir vídeo de fundo'}).click();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(false);
 }
 if(info.project.name==='desktop') {
  await page.setViewportSize({width:1920,height:1080});
  await expect(page.locator('.hero-video')).toHaveAttribute('src','/videos/bruna-hero-4k.mp4');
  await expect.poll(()=>page.locator('.hero-video').evaluate((v:HTMLVideoElement)=>v.videoWidth)).toBe(3840);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.hero-video')).toHaveCount(0);
 await expect(page.locator('.hero-background')).toBeVisible();
});

test('falha de vídeo mantém imagem de fallback',async({page},info)=>{
 test.skip(info.project.name==='mobile','Celulares usam o poster sem baixar vídeo');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.route('**/videos/*.mp4',route=>route.abort());
 const failedRequest=page.waitForEvent('requestfailed',r=>r.url().endsWith('.mp4'));
 await page.goto('/');
 await failedRequest;
 await expect(page.locator('.hero-video')).toHaveCount(0);
 await expect.poll(()=>page.locator('.hero-background').evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
});
