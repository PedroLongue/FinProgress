import { Router } from "express";
import { authGuard } from "../middlewares/authGuard.middlewares";
import {
  createBill,
  createBillFromPdf,
  deleteBill,
  getBillById,
  listBills,
  updateBill,
  usersBillsDetails,
  usersBillsScoreExplanation,
} from "../controllers/bill.controller.js";
import {
  createBillValidation,
  updateBillValidation,
} from "../middlewares/billValidation.middlewares";
import { handleValidation } from "../middlewares/handleValidation.middlewares";
import { uploadPdf } from "../middlewares/upload.middlewares";

const billRoutes = Router();

billRoutes.use(authGuard);

billRoutes.post("/", createBillValidation(), handleValidation, createBill);
billRoutes.get("/", listBills);
billRoutes.get("/bill-details", usersBillsDetails);
billRoutes.get("/bill-score-explanation", usersBillsScoreExplanation);
billRoutes.post("/from-pdf", uploadPdf.single("file"), createBillFromPdf);
billRoutes.get("/:id", getBillById);
billRoutes.patch("/:id", updateBillValidation(), handleValidation, updateBill);
billRoutes.delete("/:id", deleteBill);

export default billRoutes;
