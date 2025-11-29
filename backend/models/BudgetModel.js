const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User là bắt buộc"],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category là bắt buộc"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Số tiền là bắt buộc"],
      min: [1, "Số tiền phải lớn hơn 0"],
    },
    month: {
      type: Number,
      required: [true, "Tháng là bắt buộc"],
      min: [1, "Tháng phải từ 1-12"],
      max: [12, "Tháng phải từ 1-12"],
      validate: {
        validator: Number.isInteger,
        message: "Tháng phải là số nguyên",
      },
    },
    year: {
      type: Number,
      required: [true, "Năm là bắt buộc"],
      min: [2000, "Năm phải >= 2000"],
      max: [2100, "Năm phải <= 2100"],
      validate: {
        validator: Number.isInteger,
        message: "Năm phải là số nguyên",
      },
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Ghi chú không được quá 500 ký tự"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index tránh trùng lặp: 1 user chỉ có 1 budget cho 1 category/tháng/năm
BudgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

// Virtual kiểm tra budget có còn hiệu lực
BudgetSchema.virtual("isActive").get(function () {
  const now = new Date();
  return this.year === now.getFullYear() && this.month === now.getMonth() + 1;
});

// Pre-save hook: tránh tạo budget quá xa trong quá khứ
BudgetSchema.pre("save", function (next) {
  const now = new Date();
  if (this.year < now.getFullYear() - 1) {
    return next(new Error("Không thể tạo budget cho năm quá xa trong quá khứ"));
  }
  next();
});

// Post-save hook bắt duplicate key
BudgetSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Đã tồn tại định mức cho danh mục này trong tháng đã chọn"));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Budget", BudgetSchema);
