import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from './cv-builder';

export const exportToDocx = async (data: CVData) => {
  const sections: any[] = [];

  // 1. Header (Name & Contact)
  sections.push(
    new Paragraph({
      text: data.name,
      heading: HeadingLevel.HEADING_1,
    }),
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

  // 2. Summary
  if (data.summary) {
    sections.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      }),
      new Paragraph({
        text: data.summary,
        spacing: { after: 200 },
      })
    );
  }

  // 3. Experience
  if (data.experiences && data.experiences.length > 0) {
    sections.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      })
    );

    data.experiences.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true }),
            new TextRun({ text: ` - ${exp.company}` }),
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: exp.period, italics: true }),
            new TextRun({ text: exp.type ? ` (${exp.type})` : '', italics: true }),
          ],
          spacing: { after: 100 },
        })
      );

      if (exp.bullets) {
        const bulletPoints = exp.bullets.split('\n').map(b => b.trim().replace(/^[-*•]\s*/, '')).filter(b => b.length > 0);
        bulletPoints.forEach((bullet) => {
          sections.push(
            new Paragraph({
              text: bullet,
              bullet: { level: 0 },
            })
          );
        });
      }
    });
  }

  // 4. Education
  if (data.education && data.education.length > 0) {
    sections.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      })
    );

    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true }),
            new TextRun({ text: ` - ${edu.cityCountry}` }),
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, italics: true }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.period }),
            new TextRun({ text: edu.gpa ? ` | GPA: ${edu.gpa}` : '' }),
          ],
          spacing: { after: 100 },
        })
      );

      if (edu.awards) {
        sections.push(new Paragraph({ text: `Awards: ${edu.awards}`, bullet: { level: 0 } }));
      }
      if (edu.thesis) {
        sections.push(new Paragraph({ text: `Thesis: ${edu.thesis}`, bullet: { level: 0 } }));
      }
    });
  }

  // 5. Skills
  if (data.hardSkills || data.softSkills) {
    sections.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      })
    );

    if (data.hardSkills) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "Technical: ", bold: true }),
          new TextRun({ text: data.hardSkills }),
        ],
      }));
    }
    if (data.softSkills) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "Soft Skills: ", bold: true }),
          new TextRun({ text: data.softSkills }),
        ],
      }));
    }
  }

  // 6. Certifications
  if (data.certifications && data.certifications.length > 0) {
    sections.push(
      new Paragraph({
        text: "Certifications",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      })
    );

    data.certifications.forEach((cert) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            new TextRun({ text: ` (${cert.date})` }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: cert.issuer }),
            new TextRun({ text: cert.link ? ` - ${cert.link}` : '', italics: true }),
          ],
          spacing: { after: 100 },
        })
      );
    });
  }

  // 7. Languages
  if (data.languages && data.languages.length > 0) {
    sections.push(
      new Paragraph({
        text: "Languages",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
        border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      })
    );

    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: lang.name, bold: true }),
            new TextRun({ text: ` - ${lang.proficiency}` }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.name.replace(/\s+/g, '_') || 'Resume'}.docx`);
};
