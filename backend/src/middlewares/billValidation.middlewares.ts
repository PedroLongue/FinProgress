import { body } from "express-validator";

const STATUSES = [
  "PENDING",
  "PAID",
  "OVERDUE",
  "SCHEDULED",
  "CANCELLED",
] as const;

const isIsoDate = (v: unknown) => !Number.isNaN(new Date(String(v)).getTime());

const normalizeBarcode = (v: unknown) => String(v ?? "").replace(/\D/g, "");

export const createBillValidation = () => [
  body("title")
    .isString()
    .withMessage("Título é obrigatório.")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Título deve ter entre 2 e 120 caracteres."),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Valor (amount) deve ser maior que 0."),

  body("dueDate")
    .custom((v) => isIsoDate(v))
    .withMessage("dueDate deve ser uma data válida (ISO)."),

  body("status")
    .optional()
    .isIn(STATUSES as unknown as string[])
    .withMessage("status inválido."),

  body("barcode")
    .optional({ nullable: true })
    .custom((v) => {
      if (v === null || v === undefined || v === "") return true;
      const digits = normalizeBarcode(v);
      // boletos geralmente têm 44 ou 47 dígitos (aceita ambos)
      if (!(digits.length === 44 || digits.length === 47)) {
        throw new Error(
          "barcode inválido. Use 44 ou 47 dígitos (com ou sem máscara)."
        );
      }
      return true;
    }),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("description deve ser string."),

  body("paidAt")
    .optional({ nullable: true })
    .custom((v) => {
      if (v === null || v === undefined || v === "") return true;
      if (!isIsoDate(v))
        throw new Error("paidAt deve ser uma data válida (ISO) ou null.");
      return true;
    }),
];

export const updateBillValidation = () => [
  body().custom((_, { req }) => {
    const allowed = [
      "title",
      "category",
      "status",
      "barcode",
      "description",
      "paidAt",
    ];
    const keys = Object.keys(req.body ?? {});
    const invalid = keys.filter((k) => !allowed.includes(k));
    if (invalid.length)
      throw new Error(`Campos não permitidos: ${invalid.join(", ")}`);
    if (keys.length === 0)
      throw new Error("Envie ao menos um campo para atualizar.");
    return true;
  }),

  body("title")
    .optional()
    .isString()
    .withMessage("title deve ser string.")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Título deve ter entre 2 e 120 caracteres."),

  body("category")
    .optional()
    .isString()
    .withMessage("category deve ser string.")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Categoria deve ter entre 2 e 60 caracteres."),

  body("status")
    .optional()
    .isIn(STATUSES as unknown as string[])
    .withMessage("status inválido."),

  body("barcode")
    .optional({ nullable: true })
    .custom((v) => {
      if (v === null || v === undefined || v === "") return true;
      const digits = normalizeBarcode(v);
      if (!(digits.length === 44 || digits.length === 47)) {
        throw new Error(
          "barcode inválido. Use 44 ou 47 dígitos (com ou sem máscara)."
        );
      }
      return true;
    }),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("description deve ser string."),

  body("paidAt")
    .optional({ nullable: true })
    .custom((v) => {
      if (v === null || v === undefined || v === "") return true;
      if (!isIsoDate(v))
        throw new Error("paidAt deve ser uma data válida (ISO) ou null.");
      return true;
    }),
];
