import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from './cv-builder';

export const exportToDocx = async (data: CVData, layout: 'standard' | 'ats' | 'modern' | 'two-column' = 'standard') => {
  let doc: Document;

  if (layout === 'ats') {
    doc = generateAtsDocx(data);
  } else if (layout === 'modern') {
    doc = generateModernDocx(data);
  } else if (layout === 'two-column') {
    doc = generateTwoColumnDocx(data);
  } else {
    doc = generateStandardDocx(data);
  }

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.name.replace(/\s+/g, '_') || 'Resume'}.docx`);
};

// ─── GENERATORS ─────────────────────────────────────────────────────────────

function generateAtsDocx(data: CVData): Document {
  const sections: any[] = [];
  
  sections.push(
    new Paragraph({ text: data.name, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({
      children: [
        new TextRun({ text: data.title, bold: true }),
        new TextRun({ text: ` | ${data.email}` }),
        ...(data.phone ? [new TextRun({ text: ` | ${data.phone}` })] : []),
        ...(data.location ? [new TextRun({ text: ` | ${data.location}` })] : []),
        ...(data.linkedin ? [new TextRun({ text: ` | ${data.linkedin}` })] : []),
        ...(data.portfolio ? [new TextRun({ text: ` | ${data.portfolio}` })] : []),
      ],
      spacing: { after: 200 },
    })
  );

  if (data.summary) {
    sections.push(
      new Paragraph({ text: "Professional Summary", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      new Paragraph({ text: data.summary, spacing: { after: 200 } })
    );
  }

  if (data.experiences && data.experiences.length > 0) {
    sections.push(new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
    data.experiences.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: exp.role, bold: true }), new TextRun({ text: ` - ${exp.company}` })],
          spacing: { before: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.period }), new TextRun({ text: exp.type ? ` (${exp.type})` : '' })],
          spacing: { after: 100 },
        })
      );
      if (exp.bullets) {
        exp.bullets.split('\n').map(b => b.trim().replace(/^[-*•]\s*/, '')).filter(b => b.length > 0).forEach((bullet) => {
          sections.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
        });
      }
    });
  }

  if (data.education && data.education.length > 0) {
    sections.push(new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 100 } }));
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: edu.institution, bold: true }), new TextRun({ text: ` - ${edu.cityCountry}` })],
          spacing: { before: 100 },
        }),
        new Paragraph({ children: [new TextRun({ text: edu.degree })] }),
        new Paragraph({
          children: [new TextRun({ text: edu.period }), new TextRun({ text: edu.gpa ? ` | GPA: ${edu.gpa}` : '' })],
          spacing: { after: 100 },
        })
      );
      if (edu.awards) sections.push(new Paragraph({ text: `Awards: ${edu.awards}`, bullet: { level: 0 } }));
      if (edu.thesis) sections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 } }));
    });
  }

  if (data.hardSkills || data.softSkills) {
    sections.push(new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 100 } }));
    if (data.hardSkills) sections.push(new Paragraph({ children: [new TextRun({ text: "Technical: ", bold: true }), new TextRun({ text: data.hardSkills })] }));
    if (data.softSkills) sections.push(new Paragraph({ children: [new TextRun({ text: "Soft Skills: ", bold: true }), new TextRun({ text: data.softSkills })] }));
  }

  if (data.certifications && data.certifications.length > 0) {
    sections.push(new Paragraph({ text: "Certifications", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 100 } }));
    data.certifications.forEach((cert) => {
      sections.push(
        new Paragraph({ children: [new TextRun({ text: cert.name, bold: true }), new TextRun({ text: ` (${cert.date})` })] }),
        new Paragraph({ children: [new TextRun({ text: cert.issuer }), new TextRun({ text: cert.link ? ` - ${cert.link}` : '' })], spacing: { after: 100 } })
      );
    });
  }

  if (data.languages && data.languages.length > 0) {
    sections.push(new Paragraph({ text: "Languages", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 100 } }));
    data.languages.forEach((lang) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: lang.name, bold: true }), new TextRun({ text: ` - ${lang.proficiency}` })] }));
    });
  }

  return new Document({ sections: [{ properties: {}, children: sections }] });
}

function generateStandardDocx(data: CVData): Document {
  const sections: any[] = [];
  
  sections.push(
    new Paragraph({ text: data.name, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({
      children: [
        new TextRun({ text: data.title, bold: true }),
        new TextRun({ text: ` | ${data.email}` }),
        ...(data.phone ? [new TextRun({ text: ` | ${data.phone}` })] : []),
        ...(data.location ? [new TextRun({ text: ` | ${data.location}` })] : []),
        ...(data.linkedin ? [new TextRun({ text: ` | ${data.linkedin}` })] : []),
        ...(data.portfolio ? [new TextRun({ text: ` | ${data.portfolio}` })] : []),
      ],
      spacing: { after: 200 },
    })
  );

  const addHeading = (text: string) => {
    sections.push(new Paragraph({
      text, heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 },
      border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } }
    }));
  };

  if (data.summary) {
    addHeading("Professional Summary");
    sections.push(new Paragraph({ text: data.summary, spacing: { after: 200 } }));
  }

  if (data.experiences && data.experiences.length > 0) {
    addHeading("Experience");
    data.experiences.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: exp.role, bold: true }), new TextRun({ text: ` - ${exp.company}` })],
          spacing: { before: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.period, italics: true }), new TextRun({ text: exp.type ? ` (${exp.type})` : '', italics: true })],
          spacing: { after: 100 },
        })
      );
      if (exp.bullets) {
        exp.bullets.split('\n').map(b => b.trim().replace(/^[-*•]\s*/, '')).filter(b => b.length > 0).forEach((bullet) => {
          sections.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
        });
      }
    });
  }

  if (data.education && data.education.length > 0) {
    addHeading("Education");
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: edu.institution, bold: true }), new TextRun({ text: ` - ${edu.cityCountry}` })],
          spacing: { before: 100 },
        }),
        new Paragraph({ children: [new TextRun({ text: edu.degree, italics: true })] }),
        new Paragraph({
          children: [new TextRun({ text: edu.period }), new TextRun({ text: edu.gpa ? ` | GPA: ${edu.gpa}` : '' })],
          spacing: { after: 100 },
        })
      );
      if (edu.awards) sections.push(new Paragraph({ text: `Awards: ${edu.awards}`, bullet: { level: 0 } }));
      if (edu.thesis) sections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 } }));
    });
  }

  if (data.hardSkills || data.softSkills) {
    addHeading("Skills");
    if (data.hardSkills) sections.push(new Paragraph({ children: [new TextRun({ text: "Technical: ", bold: true }), new TextRun({ text: data.hardSkills })] }));
    if (data.softSkills) sections.push(new Paragraph({ children: [new TextRun({ text: "Soft Skills: ", bold: true }), new TextRun({ text: data.softSkills })] }));
  }

  if (data.certifications && data.certifications.length > 0) {
    addHeading("Certifications");
    data.certifications.forEach((cert) => {
      sections.push(
        new Paragraph({ children: [new TextRun({ text: cert.name, bold: true }), new TextRun({ text: ` (${cert.date})` })] }),
        new Paragraph({ children: [new TextRun({ text: cert.issuer }), new TextRun({ text: cert.link ? ` - ${cert.link}` : '', italics: true })], spacing: { after: 100 } })
      );
    });
  }

  if (data.languages && data.languages.length > 0) {
    addHeading("Languages");
    data.languages.forEach((lang) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: lang.name, bold: true }), new TextRun({ text: ` - ${lang.proficiency}` })] }));
    });
  }

  return new Document({ sections: [{ properties: {}, children: sections }] });
}

function generateModernDocx(data: CVData): Document {
  const sections: any[] = [];
  const INDIGO = "4F46E5";

  sections.push(
    new Paragraph({ children: [new TextRun({ text: data.name, bold: true, size: 48, color: INDIGO })], spacing: { after: 100 } }),
    new Paragraph({
      children: [
        new TextRun({ text: data.title, bold: true, color: "000000" }),
        new TextRun({ text: ` | ${data.email}` }),
        ...(data.phone ? [new TextRun({ text: ` | ${data.phone}` })] : []),
        ...(data.location ? [new TextRun({ text: ` | ${data.location}` })] : []),
        ...(data.linkedin ? [new TextRun({ text: ` | ${data.linkedin}` })] : []),
        ...(data.portfolio ? [new TextRun({ text: ` | ${data.portfolio}` })] : []),
      ],
      spacing: { after: 400 },
      border: { bottom: { color: INDIGO, space: 1, style: BorderStyle.SINGLE, size: 12 } }
    })
  );

  const addHeading = (text: string, icon: string) => {
    sections.push(new Paragraph({
      children: [new TextRun({ text: `${icon} ${text}`, bold: true, size: 28, color: INDIGO })],
      spacing: { before: 300, after: 100 },
    }));
  };

  if (data.summary) {
    sections.push(new Paragraph({
      text: data.summary,
      spacing: { before: 100, after: 200 },
      shading: { type: ShadingType.SOLID, color: "EEF2FF", fill: "EEF2FF" }
    }));
  }

  const itemBorder = { left: { color: INDIGO, space: 15, style: BorderStyle.SINGLE, size: 12 } };

  if (data.experiences && data.experiences.length > 0) {
    addHeading("Experience", "💻");
    data.experiences.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: exp.role, bold: true }), new TextRun({ text: ` - ${exp.company}`, color: "555555" })],
          spacing: { before: 100 },
          border: itemBorder
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.period, color: INDIGO, bold: true }), new TextRun({ text: exp.type ? ` (${exp.type})` : '', color: "777777" })],
          spacing: { after: 100 },
          border: itemBorder
        })
      );
      if (exp.bullets) {
        exp.bullets.split('\n').map(b => b.trim().replace(/^[-*•]\s*/, '')).filter(b => b.length > 0).forEach((bullet) => {
          sections.push(new Paragraph({ text: bullet, bullet: { level: 0 }, border: itemBorder }));
        });
      }
    });
  }

  if (data.education && data.education.length > 0) {
    addHeading("Education", "🎓");
    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: edu.institution, bold: true }), new TextRun({ text: ` - ${edu.cityCountry}`, color: "555555" })],
          spacing: { before: 100 },
          border: itemBorder
        }),
        new Paragraph({ children: [new TextRun({ text: edu.degree })], border: itemBorder }),
        new Paragraph({
          children: [new TextRun({ text: edu.period, color: INDIGO, bold: true }), new TextRun({ text: edu.gpa ? ` | GPA: ${edu.gpa}` : '' })],
          spacing: { after: 100 },
          border: itemBorder
        })
      );
      if (edu.awards) sections.push(new Paragraph({ text: `Awards: ${edu.awards}`, bullet: { level: 0 }, border: itemBorder }));
      if (edu.thesis) sections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 }, border: itemBorder }));
    });
  }

  const skillsCell: any[] = [];
  const otherCell: any[] = [];

  const addGridHeading = (text: string, icon: string, arr: any[]) => {
    arr.push(new Paragraph({
      children: [new TextRun({ text: `${icon} ${text}`, bold: true, size: 28, color: INDIGO })],
      spacing: { before: 300, after: 100 },
    }));
  };

  if (data.hardSkills || data.softSkills) {
    addGridHeading("Skills", "⚡", skillsCell);
    if (data.hardSkills) skillsCell.push(new Paragraph({ children: [new TextRun({ text: "Technical:\n", bold: true }), new TextRun({ text: data.hardSkills })], spacing: { after: 100 } }));
    if (data.softSkills) skillsCell.push(new Paragraph({ children: [new TextRun({ text: "Soft Skills:\n", bold: true }), new TextRun({ text: data.softSkills })] }));
  }

  if (data.languages && data.languages.length > 0) {
    addGridHeading("Languages", "🌍", otherCell);
    data.languages.forEach((lang) => {
      otherCell.push(new Paragraph({ children: [new TextRun({ text: lang.name, bold: true }), new TextRun({ text: ` - ${lang.proficiency}`, color: INDIGO })] }));
    });
  }

  if (data.certifications && data.certifications.length > 0) {
    addGridHeading("Certifications", "🏆", otherCell);
    data.certifications.forEach((cert) => {
      otherCell.push(
        new Paragraph({ children: [new TextRun({ text: cert.name, bold: true }), new TextRun({ text: ` (${cert.date})`, color: INDIGO, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: cert.issuer }), new TextRun({ text: cert.link ? ` - ${cert.link}` : '', color: "555555" })], spacing: { after: 100 } })
      );
    });
  }

  if (skillsCell.length > 0 || otherCell.length > 0) {
    sections.push(new Table({
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: skillsCell.length > 0 ? skillsCell : [new Paragraph("")],
              margins: { right: 200 },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              }
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: otherCell.length > 0 ? otherCell : [new Paragraph("")],
              margins: { left: 200 },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              }
            }),
          ],
        }),
      ],
    }));
  }

  return new Document({ sections: [{ properties: {}, children: sections }] });
}

function generateTwoColumnDocx(data: CVData): Document {
  const leftSections: any[] = [];
  const rightSections: any[] = [];
  
  // LEFT COLUMN
  leftSections.push(new Paragraph({ children: [new TextRun({ text: data.name, bold: true, size: 36 })], spacing: { after: 100 } }));
  leftSections.push(new Paragraph({ children: [new TextRun({ text: data.title, bold: true, color: "555555" })], spacing: { after: 300 } }));
  
  if (data.email) leftSections.push(new Paragraph({ text: data.email }));
  if (data.phone) leftSections.push(new Paragraph({ text: data.phone }));
  if (data.location) leftSections.push(new Paragraph({ text: data.location }));
  if (data.linkedin) leftSections.push(new Paragraph({ text: data.linkedin }));
  if (data.portfolio) leftSections.push(new Paragraph({ text: data.portfolio }));
  
  const addLeftHeading = (text: string) => {
    leftSections.push(new Paragraph({ children: [new TextRun({ text, bold: true, size: 24 })], spacing: { before: 300, after: 100 } }));
  };

  if (data.hardSkills || data.softSkills) {
    addLeftHeading("Skills");
    if (data.hardSkills) leftSections.push(new Paragraph({ children: [new TextRun({ text: "Technical\n", bold: true }), new TextRun({ text: data.hardSkills })], spacing: { after: 100 } }));
    if (data.softSkills) leftSections.push(new Paragraph({ children: [new TextRun({ text: "Professional\n", bold: true }), new TextRun({ text: data.softSkills })] }));
  }

  if (data.languages && data.languages.length > 0) {
    addLeftHeading("Languages");
    data.languages.forEach((lang) => {
      leftSections.push(new Paragraph({ children: [new TextRun({ text: lang.name, bold: true }), new TextRun({ text: ` - ${lang.proficiency}` })] }));
    });
  }

  // RIGHT COLUMN
  const addRightHeading = (text: string) => {
    rightSections.push(new Paragraph({
      children: [new TextRun({ text, bold: true, size: 28 })],
      spacing: { before: text === "Profile" ? 0 : 300, after: 100 },
      border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } }
    }));
  };

  if (data.summary) {
    addRightHeading("Profile");
    rightSections.push(new Paragraph({ text: data.summary, spacing: { after: 200 } }));
  }

  if (data.experiences && data.experiences.length > 0) {
    addRightHeading("Experience");
    data.experiences.forEach((exp) => {
      rightSections.push(
        new Paragraph({
          children: [new TextRun({ text: exp.role, bold: true }), new TextRun({ text: ` - ${exp.company}` })],
          spacing: { before: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.period, italics: true }), new TextRun({ text: exp.type ? ` (${exp.type})` : '', italics: true })],
          spacing: { after: 100 },
        })
      );
      if (exp.bullets) {
        exp.bullets.split('\n').map(b => b.trim().replace(/^[-*•]\s*/, '')).filter(b => b.length > 0).forEach((bullet) => {
          rightSections.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
        });
      }
    });
  }

  if (data.education && data.education.length > 0) {
    addRightHeading("Education");
    data.education.forEach((edu) => {
      rightSections.push(
        new Paragraph({
          children: [new TextRun({ text: edu.institution, bold: true }), new TextRun({ text: ` - ${edu.cityCountry}` })],
          spacing: { before: 100 },
        }),
        new Paragraph({ children: [new TextRun({ text: edu.degree, italics: true })] }),
        new Paragraph({
          children: [new TextRun({ text: edu.period }), new TextRun({ text: edu.gpa ? ` | GPA: ${edu.gpa}` : '' })],
          spacing: { after: 100 },
        })
      );
      if (edu.awards) rightSections.push(new Paragraph({ text: `Awards: ${edu.awards}`, bullet: { level: 0 } }));
      if (edu.thesis) rightSections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 } }));
    });
  }

  if (data.certifications && data.certifications.length > 0) {
    addRightHeading("Certifications");
    data.certifications.forEach((cert) => {
      rightSections.push(
        new Paragraph({ children: [new TextRun({ text: cert.name, bold: true }), new TextRun({ text: ` (${cert.date})` })] }),
        new Paragraph({ children: [new TextRun({ text: cert.issuer }), new TextRun({ text: cert.link ? ` - ${cert.link}` : '', italics: true })], spacing: { after: 100 } })
      );
    });
  }

  // Create two-column table layout
  const layoutTable = new Table({
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            children: leftSections.length > 0 ? leftSections : [new Paragraph("")],
            margins: { right: 400 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            }
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            children: rightSections.length > 0 ? rightSections : [new Paragraph("")],
            margins: { left: 400 },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            }
          }),
        ],
      }),
    ],
  });

  return new Document({ sections: [{ properties: {}, children: [layoutTable] }] });
}
