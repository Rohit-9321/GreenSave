export function estimateCO2(type: string, amount: number): number {
  switch (type) {
    case 'bike': return amount * 0.2;
    case 'bus': return amount * 0.1;
    case 'train': return amount * 0.12;
    case 'plant': return amount * 21;
    case 'solar': return amount * 0.8;
    case 'recycle': return amount * 1.5;
    default: return amount * 0.1;
  }
}
