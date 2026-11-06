# Bruna Hertel · Biomedicina Estética

Site em português, Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, GSAP e lucide-react. Fontes Inter e Cormorant Garamond distribuídas localmente via Fontsource.

## Desenvolvimento

Node.js 24 e npm 11. Use o checkout existente, sem criar worktrees.

```sh
npm ci
npm run dev
```

## Validação e produção

```sh
npm run build
npm run typecheck
npm run start
npm test
```

Os testes Playwright cobrem desktop, tablet, celular, ausência de overflow, menu, contatos e carrossel. Usam Chromium em `/usr/bin/chromium`; em outro ambiente, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` para o executável instalado. O servidor de produção é iniciado automaticamente pelo runner se necessário. Webpack é usado porque Turbopack depende de portas internas bloqueadas neste ambiente.

## Conteúdo e mídia pendentes

- O fundo SVG é uma ilustração abstrata original, não uma fotografia da clínica.
- Não foram fornecidos retrato, fotografias autorizadas, procedimentos confirmados ou qualificações. O site não os inventa. O carrossel apresenta etapas conceituais de cuidado, sem fotos atribuídas à clínica.
- Vídeo Pexels 4K integrado com versões locais comprimidas, fallback WebP e controle de pausa. A resolução original 3840 × 2160 foi verificada com ffprobe. Consulte [origem, licença e tratamento da mídia](docs/media.md).
- O código do Liquid Glass mencionado no briefing não foi anexado. Foi implementada uma versão local com os componentes solicitados e filtro SVG; ela não é uma cópia de um componente fornecido.
- A tentativa de inicialização pelo shadcn CLI falhou ao acessar ui.shadcn.com. A configuração e o botão local com Radix Slot seguem a estrutura de componentes solicitada; geração pelo CLI não foi concluída.
- Contato e endereço são os informados no briefing; revise antes de publicar.
- Lighthouse 90 é uma meta, não uma medição confirmada.

Não há banco de dados nem necessidade de chaves secretas para executar o site.
