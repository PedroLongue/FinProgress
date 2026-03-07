# Prisma – Migrações

Sempre que um **model** for criado ou alterado em `prisma/schema.prisma`, é obrigatório gerar uma migração para persistir a mudança no banco de dados.

## Comando

```bash
npx prisma migrate dev --name NOME_DA_MIGRACAO
```

```bash
npx prisma generate
```

## Conectar webhook Telegram:
execute isso no navegador: 
```bash 
https://api.telegram.org/botSEU_TOKEN/setWebhook?url=https://api.fin-progress.com/api/notifications/telegram/webhook
```
