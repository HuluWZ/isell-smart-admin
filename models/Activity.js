const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const conditionSchema = mongoose.Schema({
  powerOn: { type:String,required:[true,"Condition Power is required"],enum:["Yes","No"] },
  functional: { type: String,required:[true,"Condition Fully Functional is required"],enum:["Yes","No"] },
  crackFree: { type: String, required: [true, "Condition Free Of Crack is required"], enum: ["Yes", "No"] }
  // overall:{ type: String, enum: ["Broken", "Scratched","Slighlty Used","Flawless"]}
},{ _id: false })

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    model: {
      type: String,
      trim: true,
      required: [true, "Model is required"],
    },
    images: [{ type: String, required: [true, "Images is required"] }],
    price: { type: Number, trim: true, required: [true, " Item Price is required"], },
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    }, 
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp Number is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    meetingDate: {
      type: Date,
      required: [true, "Meeting Date is required"],
    },
    modeOfPayment: {
      type: String,
      enum: ['Cash', 'Pickup', 'Paypal', 'Transfer'],
      default: "Cash",
      required: [true, "Mode of Payment ['Cash', 'Pickup', 'Paypal', 'Transfer'] is required"],
    },
    condition: [conditionSchema],
    status: {
      type: String,
      enum: ['Pending', 'Approved'],
      default: "Pending",
    }
    
  },
  { timestamps: true }
);

const Activity =  mongoose.model("Item", itemSchema, "Item");
module.exports = { Activity };