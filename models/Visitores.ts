import mongoose, { Schema, model, models } from "mongoose";

const VisitorsSchema = new Schema({
  name: { type: String, default: "total_visitors" },
  count: { type: Number, default: 0 },
});

const Visitors = models.Visitors || model("Visitors", VisitorsSchema);
export default Visitors;
