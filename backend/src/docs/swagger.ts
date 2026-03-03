import type { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "FinProgress API",
    version: "1.0.0",
    description:
      "Documentação da API do FinProgress para autenticação, gestão de contas, metas mensais, notificações e relatórios.",
  },
  servers: [
    {
      url: "https://api.fin-progress.com",
      description: "Ambiente de produção",
    },
  ],
  tags: [
    { name: "Health", description: "Verificação de disponibilidade" },
    { name: "Users", description: "Autenticação e perfil" },
    { name: "Bills", description: "Gestão de contas" },
    { name: "Reports", description: "Relatórios financeiros" },
    { name: "Monthly Goal", description: "Metas mensais de gastos" },
    { name: "Notifications", description: "Notificações e preferências" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            items: { type: "string" },
            example: ["Não autenticado"],
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "clx123abc" },
          name: { type: "string", example: "Pedro" },
          email: {
            type: "string",
            format: "email",
            example: "pedro@email.com",
          },
          phone: { type: "string", nullable: true, example: "11999999999" },
          isActive: { type: "boolean", example: true },
          billReminderDays: { type: "integer", nullable: true, example: 2 },
          emailNotificationsEnabled: { type: "boolean", example: true },
          notificationsEnabled: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthUser: {
        type: "object",
        properties: {
          id: { type: "string", example: "clx123abc" },
          name: { type: "string", example: "Pedro" },
          email: {
            type: "string",
            format: "email",
            example: "pedro@email.com",
          },
          emailNotificationsEnabled: { type: "boolean", example: true },
          notificationsEnabled: { type: "boolean", example: true },
          billReminderDays: { type: "integer", nullable: true, example: 2 },
        },
      },
      Bill: {
        type: "object",
        properties: {
          id: { type: "string", example: "bill_123" },
          userId: { type: "string", example: "clx123abc" },
          title: { type: "string", example: "Conta de energia" },
          amount: { type: "number", format: "float", example: 249.9 },
          dueDate: { type: "string", format: "date-time" },
          category: { type: "string", nullable: true, example: "Moradia" },
          status: {
            type: "string",
            enum: [
              "PENDING",
              "PAID",
              "PAID_LATE",
              "OVERDUE",
              "SCHEDULED",
              "CANCELLED",
            ],
            example: "PENDING",
          },
          barcode: {
            type: "string",
            nullable: true,
            example: "34191790010104351004791020150008291070026000",
          },
          description: {
            type: "string",
            nullable: true,
            example: "Fatura do mês",
          },
          paidAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "string", example: "ntf_123" },
          type: { type: "string", example: "BILL_DUE_SOON" },
          title: { type: "string", example: "Conta vencendo" },
          body: {
            type: "string",
            example: "Sua conta de energia vence amanhã",
          },
          isRead: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/api": {
      get: {
        tags: ["Health"],
        summary: "Health check da API",
        responses: {
          "200": {
            description: "API online",
            content: {
              "text/plain": {
                schema: { type: "string", example: "API is running" },
              },
            },
          },
        },
      },
    },
    "/api/users/register": {
      post: {
        tags: ["Users"],
        summary: "Registrar novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "confirmPassword"],
                properties: {
                  name: { type: "string", minLength: 3 },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 5 },
                  confirmPassword: { type: "string", minLength: 5 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário criado e autenticado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/AuthUser" },
                  },
                },
              },
            },
          },
          "409": { description: "Email já cadastrado" },
          "422": { description: "Validação de senha falhou" },
        },
      },
    },
    "/api/users/login": {
      post: {
        tags: ["Users"],
        summary: "Autenticar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário autenticado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/AuthUser" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Credenciais inválidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/users/logout": {
      post: {
        tags: ["Users"],
        summary: "Encerrar sessão",
        security: [{ cookieAuth: [] }],
        responses: {
          "204": { description: "Logout realizado" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/users/forgot-password": {
      post: {
        tags: ["Users"],
        summary: "Solicitar redefinição de senha",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description:
              "Instruções enviadas (ou resposta neutra de segurança)",
          },
          "400": { description: "Email ausente" },
        },
      },
    },
    "/api/users/reset-password": {
      post: {
        tags: ["Users"],
        summary: "Redefinir senha com token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword", "confirmNewPassword"],
                properties: {
                  token: { type: "string" },
                  newPassword: { type: "string", minLength: 5 },
                  confirmNewPassword: { type: "string", minLength: 5 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Senha redefinida" },
          "400": { description: "Token inválido ou campos ausentes" },
          "422": { description: "Senhas diferentes" },
        },
      },
    },
    "/api/users/profile": {
      get: {
        tags: ["Users"],
        summary: "Obter usuário autenticado",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Perfil do usuário",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Atualizar telefone do usuário autenticado",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  phone: {
                    oneOf: [{ type: "string" }, { type: "null" }],
                    example: "11999999999",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Telefone atualizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
          "422": { description: "Falha de validação" },
        },
      },
    },
    "/api/users/change-password": {
      patch: {
        tags: ["Users"],
        summary: "Trocar senha do usuário autenticado",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "currentPassword",
                  "newPassword",
                  "confirmNewPassword",
                ],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 5 },
                  confirmNewPassword: { type: "string", minLength: 5 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Senha atualizada" },
          "401": { description: "Não autenticado ou senha atual inválida" },
          "404": { description: "Usuário não encontrado" },
          "422": { description: "Nova senha inválida" },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Obter usuário por id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Usuário encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
          "404": { description: "Usuário não encontrado" },
        },
      },
    },
    "/api/bills": {
      get: {
        tags: ["Bills"],
        summary: "Listar contas do usuário autenticado",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: ["PENDING", "PAID", "PAID_LATE", "OVERDUE", "UNPAID"],
            },
          },
          { in: "query", name: "category", schema: { type: "string" } },
          {
            in: "query",
            name: "start",
            schema: { type: "string", format: "date-time" },
          },
          {
            in: "query",
            name: "end",
            schema: { type: "string", format: "date-time" },
          },
        ],
        responses: {
          "200": {
            description: "Lista paginada de contas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    page: { type: "integer" },
                    pageSize: { type: "integer" },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                    bills: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Bill" },
                    },
                    userCategories: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Intervalo inválido" },
          "401": { description: "Não autenticado" },
        },
      },
      post: {
        tags: ["Bills"],
        summary: "Criar conta manualmente",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "amount", "dueDate"],
                properties: {
                  title: { type: "string", minLength: 2, maxLength: 120 },
                  amount: { type: "number", minimum: 0.01 },
                  dueDate: { type: "string", format: "date-time" },
                  category: { type: "string" },
                  status: {
                    type: "string",
                    enum: [
                      "PENDING",
                      "PAID",
                      "OVERDUE",
                      "SCHEDULED",
                      "CANCELLED",
                    ],
                  },
                  barcode: { type: "string", nullable: true },
                  description: { type: "string", nullable: true },
                  paidAt: {
                    type: "string",
                    format: "date-time",
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Conta criada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { bill: { $ref: "#/components/schemas/Bill" } },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
          "409": { description: "Código de barras duplicado" },
          "422": { description: "Falha de validação" },
        },
      },
    },
    "/api/bills/bill-details": {
      get: {
        tags: ["Bills"],
        summary: "Obter indicadores gerais de contas",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Indicadores calculados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalBills: { type: "integer" },
                    totalPaidNotLate: { type: "integer" },
                    totalPaidLate: { type: "integer" },
                    totalPending: { type: "integer" },
                    totalLate: { type: "integer" },
                    score: { type: "number" },
                  },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/bills/bill-score-explanation": {
      get: {
        tags: ["Bills"],
        summary: "Explicar score das contas",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Explicação gerada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    scoreExplanation: {
                      oneOf: [
                        {
                          type: "object",
                          properties: {
                            title: { type: "string" },
                            summary: { type: "string" },
                            bills: { type: "array", items: { type: "string" } },
                            nextSteps: {
                              type: "array",
                              items: { type: "string" },
                            },
                            confidence: { type: "number" },
                          },
                        },
                        { type: "null" },
                      ],
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/bills/from-pdf": {
      post: {
        tags: ["Bills"],
        summary: "Criar conta a partir de PDF",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Arquivo PDF com tamanho máximo de 10MB",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Conta criada via extração de PDF",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { bill: { $ref: "#/components/schemas/Bill" } },
                },
              },
            },
          },
          "400": { description: "Arquivo ausente/inválido" },
          "401": { description: "Não autenticado" },
          "409": { description: "Código de barras duplicado" },
          "422": { description: "Falha de extração de dados essenciais" },
        },
      },
    },
    "/api/bills/{id}": {
      get: {
        tags: ["Bills"],
        summary: "Obter conta por id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Conta encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { bill: { $ref: "#/components/schemas/Bill" } },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
          "404": { description: "Conta não encontrada" },
        },
      },
      patch: {
        tags: ["Bills"],
        summary: "Atualizar conta",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", minLength: 2, maxLength: 120 },
                  category: { type: "string", minLength: 2, maxLength: 60 },
                  status: {
                    type: "string",
                    enum: [
                      "PENDING",
                      "PAID",
                      "OVERDUE",
                      "SCHEDULED",
                      "CANCELLED",
                    ],
                  },
                  barcode: { type: "string", nullable: true },
                  description: { type: "string", nullable: true },
                  paidAt: {
                    type: "string",
                    format: "date-time",
                    nullable: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Conta atualizada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { bill: { $ref: "#/components/schemas/Bill" } },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
          "404": { description: "Conta não encontrada" },
          "422": { description: "Falha de validação" },
        },
      },
      delete: {
        tags: ["Bills"],
        summary: "Remover conta",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "Conta removida" },
          "401": { description: "Não autenticado" },
          "404": { description: "Conta não encontrada" },
        },
      },
    },
    "/api/reports/spending": {
      get: {
        tags: ["Reports"],
        summary: "Relatório de gastos por mês",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "range",
            schema: { type: "integer", enum: [3, 6, 12], default: 3 },
            description: "Quantidade de meses na janela do relatório",
          },
        ],
        responses: {
          "200": {
            description: "Relatório consolidado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rangeMonths: { type: "integer" },
                    currentMonth: {
                      type: "object",
                      properties: {
                        month: { type: "string", example: "2026-03" },
                        total: { type: "number" },
                        count: { type: "integer" },
                      },
                    },
                    totals: {
                      type: "object",
                      properties: {
                        totalInRange: { type: "number" },
                        monthsCount: { type: "integer" },
                      },
                    },
                    byMonth: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          month: { type: "string" },
                          total: { type: "number" },
                          count: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/reports/spending-by-category": {
      get: {
        tags: ["Reports"],
        summary: "Relatório de gastos por categoria",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "start",
            schema: { type: "string", format: "date-time" },
          },
          {
            in: "query",
            name: "end",
            schema: { type: "string", format: "date-time" },
          },
        ],
        responses: {
          "200": {
            description: "Relatório por categoria",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    range: {
                      type: "object",
                      properties: {
                        start: { type: "string", format: "date-time" },
                        end: { type: "string", format: "date-time" },
                      },
                    },
                    totals: {
                      type: "object",
                      properties: {
                        totalInRange: { type: "number" },
                        categoriesCount: { type: "integer" },
                      },
                    },
                    byCategory: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          category: { type: "string" },
                          total: { type: "number" },
                          count: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Intervalo inválido" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/monthly-goal": {
      get: {
        tags: ["Monthly Goal"],
        summary: "Resumo da meta mensal",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "month",
            schema: { type: "string", example: "2026-03" },
            description: "Mês no formato YYYY-MM",
          },
        ],
        responses: {
          "200": {
            description: "Resumo da meta",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    month: { type: "string", example: "2026-03" },
                    goalAmount: { type: "number", nullable: true },
                    totalDue: { type: "number" },
                    billsCount: { type: "integer" },
                    remaining: { type: "number", nullable: true },
                    percentUsed: { type: "number", nullable: true },
                    goalUpdatedAt: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Query month inválida" },
          "401": { description: "Não autenticado" },
        },
      },
      post: {
        tags: ["Monthly Goal"],
        summary: "Criar ou atualizar meta mensal",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: { type: "number", minimum: 0 },
                  month: {
                    type: "string",
                    example: "2026-03",
                    description: "Opcional. Se ausente, usa mês atual",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Meta salva",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    month: { type: "string" },
                    goalAmount: { type: "number" },
                    goalUpdatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "400": { description: "Body inválido" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/monthly-goal/history": {
      get: {
        tags: ["Monthly Goal"],
        summary: "Histórico de metas e gastos pagos",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "range",
            schema: { type: "integer", enum: [3, 6, 12], default: 3 },
          },
        ],
        responses: {
          "200": {
            description: "Histórico mensal",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      month: { type: "string", example: "2026-03" },
                      goalAmount: { type: "number", nullable: true },
                      spent: { type: "number" },
                    },
                  },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/notifications/expiring-bills": {
      post: {
        tags: ["Notifications"],
        summary: "Disparar emails de contas próximas do vencimento",
        description:
          "Endpoint para job de envio de emails de lembrete. Atualmente não exige autenticação na rota.",
        responses: {
          "200": {
            description: "Envio processado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    sentCount: { type: "integer", example: 4 },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro interno no disparo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/notifications/settings": {
      patch: {
        tags: ["Notifications"],
        summary: "Atualizar configurações de notificação",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  billReminderDays: { type: "integer", minimum: 1, maximum: 7 },
                  emailNotificationsEnabled: { type: "boolean" },
                  notificationsEnabled: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Configurações atualizadas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        billReminderDays: { type: "integer", nullable: true },
                        emailNotificationsEnabled: { type: "boolean" },
                        notificationsEnabled: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Parâmetros inválidos" },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/notifications/count": {
      get: {
        tags: ["Notifications"],
        summary: "Contar notificações não lidas",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Total de não lidas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    unread: { type: "integer", example: 3 },
                  },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Listar notificações",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "take",
            schema: { type: "integer", default: 20, maximum: 50 },
            description: "Quantidade de notificações retornadas",
          },
        ],
        responses: {
          "200": {
            description: "Lista de notificações",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Notification" },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
    "/api/notifications/{id}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Marcar notificação como lida",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Notificação marcada como lida",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          "401": { description: "Não autenticado" },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
  });

  app.get("/api/docs", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FinProgress API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api/docs.json',
        dom_id: '#swagger-ui',
      });
    </script>
  </body>
</html>`);
  });
};
