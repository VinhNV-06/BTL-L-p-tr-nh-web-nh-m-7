const Category = require("../models/CategoryModel");

// Thêm danh mục
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Tên danh mục không được để trống" });

  try {
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Danh mục đã tồn tại" });

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ createdAt: -1 });

    // Nếu chưa có danh mục nào, tạo danh mục mặc định
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Đồ ăn" },
        { name: "Di chuyển" },
        { name: "Giải trí" },
        { name: "Học tập" },
        { name: "Mua sắm" },
      ];
      categories = await Category.insertMany(defaultCategories);
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Sửa danh mục
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updated = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Đã xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
