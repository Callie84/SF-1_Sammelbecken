const PDFDocument = require("pdfkit");
const GrowCycle = require("../models/GrowCycle");

async function generateGrowCyclePDF(cycleId, outputPath) {
  const cycle = await GrowCycle.findById(cycleId).lean();
  if (!cycle) throw new Error("Zyklus nicht gefunden");
  const doc = new PDFDocument();
  doc.pipe(require("fs").createWriteStream(outputPath));
  doc.fontSize(20).text(`GrowCycle: ${cycle.title}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Strain: ${cycle.strain}`);
  doc.text(`Start: ${cycle.startDate}`);
  doc.text(`Erwartete Dauer: ${cycle.expectedDurationDays} Tage`);
  doc.moveDown();
  doc.text("Einträge:", { underline: true });
  cycle.entries.forEach((e) => {
    doc.text(`- ${e.date}: ${e.stage} - ${e.note}`);
  });
  doc.end();
}
module.exports = { generateGrowCyclePDF };
