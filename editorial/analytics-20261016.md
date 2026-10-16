# Medição GA4 — FFL

- Conta: 412333582; propriedade: 559369954 (FFL Lubrificantes — Site).
- Fluxo web: 16144278014; ID público da tag: G-NCXV9VCE15.
- Fuso São Paulo, moeda BRL. Objetivos: tráfego e leads.
- src/analytics.js carrega a tag somente no domínio canônico e após aceitar estatísticas. Recusa não bloqueia formulário. Preferências podem ser alteradas no rodapé. Preview e localhost não enviam eventos.
- generate_lead: somente depois de quote_accepted, confirmado pelo endpoint. Não dispara na página obrigado nem no clique de envio. whatsapp_click e phone_click não são pedidos confirmados.
- Nenhum campo de formulário é enviado ao GA. URLs de página/referrer sem query nem fragmento; isso também remove parâmetros de campanha UTM nesta versão. Origem via referrer permanece disponível.
- Google Signals e personalização de anúncios desativados na configuração da tag. Compartilhamentos opcionais da conta desmarcados.
- Medição otimizada: formulários, pesquisa e cliques externos automáticos desativados para evitar duplicidade e captura de URLs de WhatsApp com dados de formulário.
- Testes: node scripts/test-analytics.mjs; node scripts/test-form.mjs; npm run build; npm run check.
- O consentimento e bloqueadores podem reduzir a contagem. Não há recuperação retroativa das visitas anteriores à instalação.
- Notificações por e-mail da Netlify continuam pendentes por decisão do proprietário; Analytics não resolve a entrega de e-mail.
