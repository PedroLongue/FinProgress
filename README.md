# FinProgress - Gerenciador de Finanças Pessoais

Aplicação full-stack para gerenciamento inteligente de finanças pessoais, permitindo controlar despesas, definir metas de gastos mensal e receber notificações sobre contas.

## Sobre o Projeto

FinProgress é uma plataforma web moderna desenvolvida para ajudar usuários a gerenciar suas finanças pessoais de forma eficiente e intuitiva. O sistema permite rastrear contas, categorizar despesas, estabelecer metas de gastos mensais e receber notificações automáticas sobre vencimentos de bills.

### Principais Funcionalidades

- **Autenticação Segura**: Sistema de login com JWT e criptografia bcrypt
- **Gerenciamento de Contas**: Criar, atualizar e acompanhar status de contas (pendente, pago, pago com atraso)
- **Metas de Gastos Mensais**: Definir limites de gastos por mês e acompanhar progresso
- **Notificações Inteligentes**: Alertas via email e notificações na aplicação para contas vencendo
- **Relatórios e Análises**: Gerar relatórios de gastos com visualizações em gráficos
- **Sistema de Lembretes**: Configurar dias de aviso antes do vencimento das contas
- **Upload de Arquivos**: Adicionar comprovantes e documentos relacionados às contas

---

## Stack Tecnológico

### Backend

| Tecnologia             | Versão  | Descrição                            |
| ---------------------- | ------- | ------------------------------------ |
| **Node.js**            | -       | Runtime JavaScript                   |
| **Express**            | ^5.2.1  | Framework web minimalista            |
| **TypeScript**         | ^5.9.3  | Tipagem estática para JavaScript     |
| **Prisma**             | ^7.2.0  | ORM e gerenciador de banco de dados  |
| **PostgreSQL**         | -       | Banco de dados relacional            |
| **JWT**                | ^9.0.3  | Autenticação baseada em tokens       |
| **Bcrypt**             | ^6.0.0  | Hash seguro de senhas                |
| **Express Validator**  | ^7.3.1  | Validação de requisições             |
| **Express Rate Limit** | ^8.2.1  | Proteção contra abuso de API         |
| **Multer**             | ^2.0.2  | Upload de arquivos                   |
| **Node Cron**          | ^4.2.1  | Agendamento de jobs                  |
| **Resend**             | ^6.9.1  | Serviço de email                     |
| **OpenAI**             | ^6.15.0 | Integração com IA (análise de dados) |
| **CORS**               | ^2.8.5  | Controle de requisições cross-origin |

### Frontend

| Tecnologia          | Versão   | Descrição                              |
| ------------------- | -------- | -------------------------------------- |
| **React**           | ^19.2.0  | Biblioteca de UI                       |
| **TypeScript**      | -        | Tipagem estática                       |
| **Vite**            | -        | Build tool moderno                     |
| **TanStack Router** | ^1.144.0 | Roteamento type-safe                   |
| **TanStack Query**  | ^5.90.16 | Gerenciamento de dados remotos (cache) |
| **React Hook Form** | ^7.70.0  | Gerenciamento eficiente de formulários |
| **Zod**             | ^4.3.5   | Validação de schemas TypeScript        |
| **Tailwind CSS**    | -        | Framework CSS utilitário               |
| **Material-UI**     | ^7.3.7   | Componentes UI pre-built               |
| **Chart.js**        | ^4.5.1   | Visualização de gráficos               |
| **Axios**           | ^1.13.2  | Cliente HTTP                           |
| **Zustand**         | ^5.0.9   | Gerenciamento de estado global         |
| **Vitest**          | -        | Framework de testes unitários          |
| **Testing Library** | -        | Testes de componentes React            |

---

## Estrutura do Projeto

```
FinProgress/
├── backend/                          # Servidor API REST
│   ├── src/
│   │   ├── controllers/              # Lógica dos endpoints
│   │   ├── services/                 # Lógica de negócio
│   │   ├── routes/                   # Definição de rotas
│   │   ├── middlewares/              # Autenticação, validação, rate limit
│   │   ├── jobs/                     # Tarefas agendadas (cron)
│   │   ├── templates/                # Templates de email
│   │   ├── db/                       # Configuração de banco de dados
│   │   └── index.ts                  # Entrada da aplicação
│   ├── prisma/
│   │   ├── schema.prisma             # Definição dos modelos
│   │   └── migrations/               # Histórico de alterações do banco
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                         # Aplicação React
│   ├── src/
│   │   ├── components/               # Componentes reusáveis
│   │   ├── pages/                    # Páginas da aplicação
│   │   ├── routes/                   # Definição de rotas
│   │   ├── services/                 # Integração com API
│   │   ├── queries/                  # React Query configurations
│   │   ├── stores/                   # Zustand state management
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── types/                    # TypeScript types/interfaces
│   │   ├── utils/                    # Funções utilitárias
│   │   ├── constants/                # Constantes da aplicação
│   │   ├── mocks/                    # Dados mockados para testes
│   │   └── main.tsx                  # Entrada da aplicação
│   ├── public/                       # Assets estáticos
│   ├── package.json
│   └── Dockerfile
│
└── README.md                         # Este arquivo
```

---

## Modelos de Dados

O projeto utiliza os seguintes modelos principais:

- **User**: Usuários com autenticação JWT
- **Bill**: Contas com status (pendente, pago, pago_com_atraso)
- **MonthlySpendingGoal**: Metas de gastos mensais por categoria
- **Notification**: Sistema de notificações via email e push
- **BillReminderDays**: Configuração de dias para lembretes

---

## Segurança

- Autenticação JWT com refresh tokens
- Senhas criptografadas com bcrypt
- Rate limiting em endpoints sensíveis
- Validação de entrada em todos os endpoints
- CORS configurado
- Proteção contra duplicação de notificações

---

## Autor

Desenvolvido como projeto full-stack moderno demonstrando boas práticas em:

- Arquitetura clean code
- TypeScript strongly typed
- Testes unitários
- DevOps e containerização
- API REST RESTful
- Gerenciamento de estado
- UI/UX responsivo
