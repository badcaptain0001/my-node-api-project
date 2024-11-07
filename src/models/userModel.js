const moongoose = require("mongoose");

const bankDetails = [
  {
    bankName: { type: String, required: false },
    accountNumber: { type: String, required: false },
    ifscCode: { type: String, required: false },
    accountHolderName: { type: String, required: false },
    cancelChequeUrl: { type: String, required: false },
    panCard: { type: String, required: false },
  },
];

const wallet = [
  {
    balance: { type: Number, required: false, default: 0 },
    transaction: [
      {
        amount: { type: Number, required: false },
        type: { type: String, required: false },
        paymentMode: { type: String, required: false },
        txnId: { type: String, required: false },
        date: { type: Date, default: Date.now },
      },
    ],
  },
];

const userSchema = new moongoose.Schema({
  fullName: { type: String, required: false },
  phone: { type: String, required: false, unique: true },
  pin: { type: Number, required: false },
  role: { type: String, required: false },
  address: { type: String, required: false },
  state: { type: String, required: false },
  city: { type: String, required: false },
  pincode: { type: String, required: false },
  status: { type: String, required: false, default: "active" },
  profilePicture: { type: String, required: false },
  idProof: { type: String, required: false },
  aadharCard: { type: String, required: false },
  date: { type: Date, default: Date.now },
  bankDetails: bankDetails,
  wallet: wallet,
  perSqFtPrice: { type: Number, required: false },
  totalSqFt: { type: Number, required: false },
});

module.exports = moongoose.model("users", userSchema);
