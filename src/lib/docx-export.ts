import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from './cv-builder';

// ─── STYLING CONSTANTS ────────────────────────────────────────────────────────

const BORDERLESS = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

const BORDERLESS_BORDERS = {
  top: BORDERLESS,
  bottom: BORDERLESS,
  left: BORDERLESS,
  right: BORDERLESS,
  insideHorizontal: BORDERLESS,
  insideVertical: BORDERLESS,
};

const CELL_BORDERLESS = {
  top: BORDERLESS,
  bottom: BORDERLESS,
  left: BORDERLESS,
  right: BORDERLESS,
};

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

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

// Creates a borderless two-column row for headers or details where left/right alignment is needed
function createTwoColumnRow(leftContent: Paragraph[], rightContent: Paragraph[], leftWidth: number = 70, rightWidth: number = 30): Table {
  return new Table({
    borders: BORDERLESS_BORDERS,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: leftWidth, type: WidthType.PERCENTAGE },
            children: leftContent.length > 0 ? leftContent : [new Paragraph("")],
            borders: CELL_BORDERLESS
          }),
          new TableCell({
            width: { size: rightWidth, type: WidthType.PERCENTAGE },
            children: rightContent.length > 0 ? rightContent : [new Paragraph("")],
            borders: CELL_BORDERLESS
          }),
        ]
      })
    ]
  });
}

// ─── ATS GENERATOR ────────────────────────────────────────────────────────────

function generateAtsDocx(data: CVData): Document {
  const sections: (Paragraph | Table)[] = [];
  
  // Header details in simple text stack or line
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
    addHeading("Summary");
    sections.push(new Paragraph({ text: data.summary, spacing: { after: 200 } }));
  }

  if (data.experiences && data.experiences.length > 0) {
    addHeading("Experience");
    data.experiences.forEach((exp) => {
      sections.push(
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: exp.company, bold: true })] }),
            new Paragraph({ children: [
              new TextRun({ text: exp.role, italics: true }),
              ...(exp.type ? [new TextRun({ text: ` (${exp.type})`, color: "555555" })] : [])
            ] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: exp.period || '', color: "555555" })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } }) // spacer
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
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: edu.institution, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: edu.degree, italics: true })] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: edu.period, color: "555555" })], alignment: AlignmentType.RIGHT }),
            new Paragraph({ children: [new TextRun({ text: edu.cityCountry || '' })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
      if (edu.gpa) sections.push(new Paragraph({ text: `GPA: ${edu.gpa}`, bullet: { level: 0 } }));
      if (edu.awards) sections.push(new Paragraph({ text: `Award: ${edu.awards}`, bullet: { level: 0 } }));
      if (edu.thesis) sections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 } }));
    });
  }

  if (data.hardSkills || data.softSkills) {
    addHeading("Skills");
    if (data.hardSkills) sections.push(new Paragraph({ children: [new TextRun({ text: "Technical Skills: ", bold: true }), new TextRun({ text: data.hardSkills })] }));
    if (data.softSkills) sections.push(new Paragraph({ children: [new TextRun({ text: "Soft Skills: ", bold: true }), new TextRun({ text: data.softSkills })] }));
  }

  if (data.certifications && data.certifications.length > 0) {
    addHeading("Certifications");
    data.certifications.forEach((cert) => {
      sections.push(
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: cert.name, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: cert.issuer || '' })] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: cert.date || '', color: "555555" })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
    });
  }

  if (data.languages && data.languages.length > 0) {
    addHeading("Languages");
    sections.push(new Paragraph({
      children: data.languages.map((lang, idx) => {
        const separator = idx > 0 ? "  |  " : "";
        return new TextRun({ text: `${separator}${lang.name} (${lang.proficiency})` });
      })
    }));
  }

  return new Document({ sections: [{ properties: {}, children: sections }] });
}

// ─── STANDARD GENERATOR ───────────────────────────────────────────────────────

function generateStandardDocx(data: CVData): Document {
  const sections: (Paragraph | Table)[] = [];
  
  // Header Table (Split: Name/Title on Left, contact details right stacked)
  const headerTable = new Table({
    borders: {
      bottom: { color: "000000", space: 10, style: BorderStyle.SINGLE, size: 12 },
      top: BORDERLESS, left: BORDERLESS, right: BORDERLESS,
      insideHorizontal: BORDERLESS, insideVertical: BORDERLESS
    },
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({ children: [new TextRun({ text: data.name, bold: true, size: 36 })] }),
              new Paragraph({ children: [new TextRun({ text: data.title, bold: true, color: "555555", size: 18 })] }),
            ],
            borders: CELL_BORDERLESS
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              ...(data.email ? [new Paragraph({ children: [new TextRun({ text: data.email })], alignment: AlignmentType.RIGHT })] : []),
              ...(data.phone ? [new Paragraph({ children: [new TextRun({ text: data.phone })], alignment: AlignmentType.RIGHT })] : []),
              ...(data.location ? [new Paragraph({ children: [new TextRun({ text: data.location })], alignment: AlignmentType.RIGHT })] : []),
              ...(data.linkedin ? [new Paragraph({ children: [new TextRun({ text: data.linkedin })], alignment: AlignmentType.RIGHT })] : []),
              ...(data.portfolio ? [new Paragraph({ children: [new TextRun({ text: data.portfolio })], alignment: AlignmentType.RIGHT })] : []),
            ],
            borders: CELL_BORDERLESS
          }),
        ]
      })
    ]
  });
  
  sections.push(headerTable, new Paragraph({ spacing: { after: 200 } }));

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
    addHeading("Professional Experience");
    data.experiences.forEach((exp) => {
      sections.push(
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: exp.company, bold: true })] }),
            new Paragraph({ children: [
              new TextRun({ text: exp.role, italics: true }),
              ...(exp.type ? [new TextRun({ text: ` (${exp.type})`, color: "555555" })] : [])
            ] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: exp.period, bold: true, color: "555555" })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
      if (exp.bullets) {
        exp.bullets.split('\n').map(b => b.trim().replace(/^[-*•]\s*/, '')).filter(b => b.length > 0).forEach((bullet) => {
          sections.push(new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            border: { left: { color: "CCCCCC", space: 10, style: BorderStyle.SINGLE, size: 6 } }
          }));
        });
      }
    });
  }

  if (data.education && data.education.length > 0) {
    addHeading("Education");
    data.education.forEach((edu) => {
      sections.push(
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: edu.institution, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: edu.degree, italics: true })] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: edu.period, bold: true, color: "555555" })], alignment: AlignmentType.RIGHT }),
            new Paragraph({ children: [new TextRun({ text: edu.cityCountry || '' })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
      if (edu.gpa) sections.push(new Paragraph({ text: `GPA / Score: ${edu.gpa}`, bullet: { level: 0 } }));
      if (edu.awards) sections.push(new Paragraph({ text: `Award: ${edu.awards}`, bullet: { level: 0 } }));
      if (edu.thesis) sections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 } }));
    });
  }

  if (data.hardSkills || data.softSkills) {
    addHeading("Skills Directory");
    sections.push(
      createTwoColumnRow(
        [
          new Paragraph({ children: [new TextRun({ text: "Technical Skills", bold: true })] }),
          new Paragraph({ text: data.hardSkills || '' })
        ],
        [
          new Paragraph({ children: [new TextRun({ text: "Soft Skills", bold: true })] }),
          new Paragraph({ text: data.softSkills || '' })
        ],
        50, 50
      )
    );
  }

  if (data.certifications && data.certifications.length > 0) {
    addHeading("Certifications");
    data.certifications.forEach((cert) => {
      sections.push(
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: cert.name, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: cert.issuer || '' })] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: cert.date || '', bold: true, color: "555555" })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
    });
  }

  if (data.languages && data.languages.length > 0) {
    addHeading("Languages");
    sections.push(new Paragraph({
      children: data.languages.map((lang, idx) => {
        const separator = idx > 0 ? "    |    " : "";
        return new TextRun({ text: `${separator}${lang.name} (${lang.proficiency})`, bold: true });
      })
    }));
  }

  return new Document({ sections: [{ properties: {}, children: sections }] });
}

// ─── MODERN GENERATOR ─────────────────────────────────────────────────────────

function generateModernDocx(data: CVData): Document {
  const sections: (Paragraph | Table)[] = [];
  const INDIGO = "4F46E5";

  // Modern Centered Header
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: data.name, bold: true, size: 48, color: INDIGO })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.title, bold: true, color: INDIGO }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.email }),
        ...(data.phone ? [new TextRun({ text: ` | ${data.phone}` })] : []),
        ...(data.location ? [new TextRun({ text: ` | ${data.location}` })] : []),
        ...(data.linkedin ? [new TextRun({ text: ` | ${data.linkedin}` })] : []),
        ...(data.portfolio ? [new TextRun({ text: ` | ${data.portfolio}` })] : []),
      ],
      alignment: AlignmentType.CENTER,
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
        createTwoColumnRow(
          [
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true }),
                ...(exp.type ? [new TextRun({ text: ` (${exp.type})`, color: "777777" })] : [])
              ],
              border: itemBorder
            }),
            new Paragraph({
              children: [new TextRun({ text: exp.company, color: "555555" })],
              border: itemBorder
            })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: exp.period, color: INDIGO, bold: true })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
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
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true })], border: itemBorder }),
            new Paragraph({ children: [new TextRun({ text: `${edu.institution}${edu.cityCountry ? ` — ${edu.cityCountry}` : ''}`, color: "555555" })], border: itemBorder })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: edu.period, color: INDIGO, bold: true })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
      if (edu.gpa) sections.push(new Paragraph({ text: `GPA: ${edu.gpa}`, bullet: { level: 0 }, border: itemBorder }));
      if (edu.awards) sections.push(new Paragraph({ text: `Award: ${edu.awards}`, bullet: { level: 0 }, border: itemBorder }));
      if (edu.thesis) sections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 }, border: itemBorder }));
    });
  }

  // Modern Skills grid using 2-column Table at bottom
  const skillsCell: (Paragraph | Table)[] = [];
  const otherCell: (Paragraph | Table)[] = [];

  const addGridHeading = (text: string, icon: string, arr: (Paragraph | Table)[]) => {
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
      borders: BORDERLESS_BORDERS,
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: skillsCell.length > 0 ? skillsCell : [new Paragraph("")],
              margins: { right: 200 },
              borders: CELL_BORDERLESS
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: otherCell.length > 0 ? otherCell : [new Paragraph("")],
              margins: { left: 200 },
              borders: CELL_BORDERLESS
            }),
          ],
        }),
      ],
    }));
  }

  return new Document({ sections: [{ properties: {}, children: sections }] });
}

// ─── TWO COLUMN GENERATOR ─────────────────────────────────────────────────────

function generateTwoColumnDocx(data: CVData): Document {
  const leftSections: (Paragraph | Table)[] = [];
  const rightSections: (Paragraph | Table)[] = [];
  
  // LEFT COLUMN
  leftSections.push(new Paragraph({ children: [new TextRun({ text: data.name, bold: true, size: 36 })], spacing: { after: 100 } }));
  leftSections.push(new Paragraph({ children: [new TextRun({ text: data.title, bold: true, color: "555555" })], spacing: { after: 300 } }));
  
  if (data.email) leftSections.push(new Paragraph({ text: `✉️  ${data.email}` }));
  if (data.phone) leftSections.push(new Paragraph({ text: `📱  ${data.phone}` }));
  if (data.location) leftSections.push(new Paragraph({ text: `📍  ${data.location}` }));
  if (data.linkedin) leftSections.push(new Paragraph({ text: `💼  ${data.linkedin}` }));
  if (data.portfolio) leftSections.push(new Paragraph({ text: `🌐  ${data.portfolio}` }));
  
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
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: exp.role, bold: true })] }),
            new Paragraph({ children: [
              new TextRun({ text: exp.company || '' }),
              ...(exp.type ? [new TextRun({ text: ` (${exp.type})`, color: "555555" })] : [])
            ] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: exp.period || '', color: "555555" })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
      if (exp.bullets) {
        exp.bullets.split('\n').map(b => b.trim().replace(/^[-*•]\s*/, '')).filter(b => b.length > 0).forEach((bullet) => {
          rightSections.push(new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            border: { left: { color: "CCCCCC", space: 10, style: BorderStyle.SINGLE, size: 6 } }
          }));
        });
      }
    });
  }

  if (data.education && data.education.length > 0) {
    addRightHeading("Education");
    data.education.forEach((edu) => {
      rightSections.push(
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: edu.institution || '' })] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: edu.period || '', color: "555555" })], alignment: AlignmentType.RIGHT }),
            new Paragraph({ children: [new TextRun({ text: edu.cityCountry || '' })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
      if (edu.gpa) rightSections.push(new Paragraph({ text: `GPA: ${edu.gpa}`, bullet: { level: 0 } }));
      if (edu.awards) rightSections.push(new Paragraph({ text: `Awards: ${edu.awards}`, bullet: { level: 0 } }));
      if (edu.thesis) rightSections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 } }));
    });
  }

  if (data.certifications && data.certifications.length > 0) {
    addRightHeading("Certifications");
    data.certifications.forEach((cert) => {
      rightSections.push(
        createTwoColumnRow(
          [
            new Paragraph({ children: [new TextRun({ text: cert.name, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: cert.issuer || '' })] })
          ],
          [
            new Paragraph({ children: [new TextRun({ text: cert.date || '', color: "555555" })], alignment: AlignmentType.RIGHT })
          ]
        ),
        new Paragraph({ spacing: { after: 50 } })
      );
    });
  }

  // Create two-column table layout
  const layoutTable = new Table({
    borders: BORDERLESS_BORDERS,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            children: leftSections.length > 0 ? leftSections : [new Paragraph("")],
            margins: { right: 400 },
            borders: CELL_BORDERLESS
          }),
          new TableCell({
            width: { size: 67, type: WidthType.PERCENTAGE },
            children: rightSections.length > 0 ? rightSections : [new Paragraph("")],
            margins: { left: 400 },
            borders: CELL_BORDERLESS
          }),
        ],
      }),
    ],
  });

  return new Document({ sections: [{ properties: {}, children: [layoutTable] }] });
}
