import fallbackExperience from '../config/experience';

export async function fetchResumeData(driveFileId) {
  if (!driveFileId) {
    console.warn("No Google Doc ID provided for resume data. Using fallback config.");
    return fallbackExperience;
  }

  try {
    const res = await fetch(`https://docs.google.com/document/d/${driveFileId}/export?format=txt`);
    if (!res.ok) throw new Error("Failed to fetch Google Doc file");
    const text = await res.text();

    // extract experience section
    const expMatch = text.match(/\\section\{Experience\}([\s\S]*?)%-----------/);
    if (!expMatch) return fallbackExperience;

    const expText = expMatch[1];
    const items = expText.split('\\resumeSubheading');
    items.shift(); // remove first element before the first subheading

    const experienceData = items.map(item => {
      const headerRegex = /^\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}/;
      const headerMatch = item.match(headerRegex);
      if (!headerMatch) return null;

      const company = headerMatch[1];
      const role = headerMatch[3];
      const duration = headerMatch[4];

      const bullets = [];
      const lines = item.split('\\resumeItem{');
      lines.shift();
      lines.forEach(line => {
        let clean = line.trim();
        // remove the last matching closing brace
        const lastBrace = clean.lastIndexOf('}');
        if (lastBrace !== -1) {
          clean = clean.substring(0, lastBrace);
        }
        // basic bold/italic stripping
        clean = clean.replace(/\\textbf\{([^}]+)\}/g, '$1');
        clean = clean.replace(/\\textit\{([^}]+)\}/g, '$1');

        clean = clean.replace(/\\%/g, '%');
        clean = clean.replace(/\\&/g, '&');
        clean = clean.replace(/\\\$/g, '$');
        clean = clean.replace(/\\#/g, '#');
        clean = clean.replace(/\\_/g, '_');

        bullets.push(clean.trim());
      });

      return { company, role, duration, bullets };
    }).filter(Boolean);

    return experienceData.length > 0 ? experienceData : fallbackExperience;
  } catch (err) {
    console.error("Error fetching/parsing resume:", err);
    return fallbackExperience;
  }
}
