

import { jsPDF } from 'jspdf';
import 'jspdf-customfonts';

export const registerRussianFont = (doc) => {
  doc.setFont('helvetica');
};