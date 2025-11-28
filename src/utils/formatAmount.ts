export const formatAmount = (value: number): string => {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B VNĐ";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M VNĐ";
  if (value >= 1_000) return (value / 1_000).toFixed(0) + "K VNĐ";
  return value.toLocaleString("vi-VN") + " VNĐ";
};
