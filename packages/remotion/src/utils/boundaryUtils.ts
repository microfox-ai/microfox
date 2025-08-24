export const calculateGridPosition = (
  index: number,
  columns: number,
  cellWidth: number,
  cellHeight: number,
  spacing: number
) => {
  const row = Math.floor(index / columns);
  const col = index % columns;

  return {
    x: col * (cellWidth + spacing),
    y: row * (cellHeight + spacing),
    width: cellWidth,
    height: cellHeight,
  };
};

export const calculateCircularPosition = (
  index: number,
  total: number,
  radius: number,
  centerX: number,
  centerY: number
) => {
  const angle = (index / total) * 2 * Math.PI;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};
