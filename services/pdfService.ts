
import { jsPDF } from "jspdf";
import { User } from "../types";

export const generateATPdf = (user: User) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Helper for text wrapping
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, align: 'left' | 'center' = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    
    const splitText = doc.splitTextToSize(text, pageWidth - 40);
    
    if (align === 'center') {
        doc.text(text, pageWidth / 2, yPos, { align: 'center' });
    } else {
        doc.text(splitText, 20, yPos);
    }
    yPos += (splitText.length * fontSize * 0.5) + 2;
  };

  // 1. Header (Name & Contact)
  addText(user.name.toUpperCase(), 18, true, 'center');
  yPos += 2;
  
  let contactInfo = user.email;
  if (user.phoneNumber) contactInfo += ` | ${user.phoneNumber}`;
  if (user.location) contactInfo += ` | ${user.location}`;
  if (user.socialLinks?.linkedin) contactInfo += ` | ${user.socialLinks.linkedin}`;
  
  addText(contactInfo, 10, false, 'center');
  yPos += 10;

  // Draw Line
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // 2. Summary
  if (user.summary) {
    addText("PROFESSIONAL SUMMARY", 12, true);
    addText(user.summary, 10, false);
    yPos += 5;
  }

  // 3. Experience
  if (user.experience && user.experience.length > 0) {
    addText("WORK EXPERIENCE", 12, true);
    user.experience.forEach(exp => {
      // Company & Date
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(exp.company, 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${exp.startDate} - ${exp.endDate}`, pageWidth - 20, yPos, { align: "right" });
      yPos += 5;

      // Position
      doc.setFont("helvetica", "bold");
      doc.text(exp.position, 20, yPos);
      yPos += 5;

      // Desc
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(exp.description, pageWidth - 40);
      doc.text(descLines, 20, yPos);
      yPos += (descLines.length * 5) + 5;
    });
    yPos += 5;
  }

  // 4. Education
  if (user.education && user.education.length > 0) {
    addText("EDUCATION", 12, true);
    user.education.forEach(edu => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(edu.institution, 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${edu.startDate} - ${edu.endDate}`, pageWidth - 20, yPos, { align: "right" });
      yPos += 5;
      
      addText(`${edu.degree} in ${edu.major}`, 10, false);
      yPos += 3;
    });
    yPos += 5;
  }

  // 5. Skills
  if (user.skills && user.skills.length > 0) {
    addText("SKILLS", 12, true);
    const skillList = user.skills.map(s => s.name).join(", ");
    addText(skillList, 10, false);
  }

  doc.save(`CV_${user.name.replace(/\s+/g, '_')}_SWAPRO.pdf`);
};
