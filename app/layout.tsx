import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import './globals.css';
export const metadata: Metadata = { title: 'Bruna Hertel | Biomedicina Estética em Blumenau', description: 'Ciência, cuidado e naturalidade. Conheça a Bruna Hertel Biomedicina Estética, em Blumenau, e agende sua avaliação.', robots: {index:true,follow:true}, openGraph:{title:'Bruna Hertel · Biomedicina Estética',description:'A beleza de ser você, com a precisão da ciência.',locale:'pt_BR',type:'website'} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="pt-BR"><body>{children}</body></html>; }
