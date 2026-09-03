const crypto = require('crypto');

/**
 * Generate Enterprise University Site License Key
 */
function generateLicenseKey(institutionCode = 'CAMPUS') {
  const cleanCode = institutionCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'UNIV';
  const year = new Date().getFullYear();
  const rand1 = crypto.randomBytes(3).toString('hex').toUpperCase();
  const rand2 = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `AETH-${cleanCode}-${year}-${rand1}-${rand2}`;
}

/**
 * Generate IMS QTI 2.1 XML Quiz Package for Canvas, Moodle, and Blackboard
 */
function generateQtiXml(title, questions = []) {
  const sanitizedTitle = (title || 'Aethera Assessment').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  let itemsXml = '';
  questions.forEach((q, idx) => {
    const qId = `item_${idx + 1}_${Date.now()}`;
    const questionPrompt = (q.q || q.question || `Question ${idx + 1}`).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const options = Array.isArray(q.opts) ? q.opts : (Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D']);
    const correctIdx = typeof q.ans === 'number' ? q.ans : 0;
    const correctIdentifier = `choice_${correctIdx}`;

    let choicesXml = '';
    options.forEach((opt, optIdx) => {
      const choiceId = `choice_${optIdx}`;
      const optText = String(opt).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      choicesXml += `
        <simpleChoice identifier="${choiceId}">${optText}</simpleChoice>`;
    });

    itemsXml += `
    <assessmentItem identifier="${qId}" title="Question ${idx + 1}" adaptive="false" timeDependent="false">
      <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
        <correctResponse>
          <value>${correctIdentifier}</value>
        </correctResponse>
      </responseDeclaration>
      <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
        <defaultValue>
          <value>1.0</value>
        </defaultValue>
      </outcomeDeclaration>
      <itemBody>
        <p>${questionPrompt}</p>
        <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">${choicesXml}
        </choiceInteraction>
      </itemBody>
    </assessmentItem>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<assessmentTest xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/imsqti_v2p1.xsd"
                identifier="aethera_test_${Date.now()}"
                title="${sanitizedTitle}">
  <testPart identifier="part_1" navigationMode="nonlinear" submissionMode="individual">
    <assessmentSection identifier="section_1" title="Main Section" visible="true">${itemsXml}
    </assessmentSection>
  </testPart>
</assessmentTest>`;
}

/**
 * Generate Moodle XML Format
 */
function generateMoodleXml(title, questions = []) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n`;
  xml += `  <question type="category">\n    <category>\n      <text>$course$/${title || 'Aethera Questions'}</text>\n    </category>\n  </question>\n`;

  questions.forEach((q, idx) => {
    const questionText = (q.q || q.question || `Question ${idx + 1}`).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const options = Array.isArray(q.opts) ? q.opts : (Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D']);
    const correctIdx = typeof q.ans === 'number' ? q.ans : 0;

    xml += `  <question type="multichoice">\n`;
    xml += `    <name><text>Question ${idx + 1}</text></name>\n`;
    xml += `    <questiontext format="html"><text><![CDATA[${questionText}]]></text></questiontext>\n`;
    xml += `    <single>true</single>\n    <shuffleanswers>true</shuffleanswers>\n`;

    options.forEach((opt, oIdx) => {
      const fraction = oIdx === correctIdx ? 100 : 0;
      xml += `    <answer fraction="${fraction}" format="html">\n      <text><![CDATA[${opt}]]></text>\n    </answer>\n`;
    });

    xml += `  </question>\n`;
  });

  xml += `</quiz>`;
  return xml;
}

/**
 * Cohort Risk & Learning Analytics Engine
 */
function calculateCohortRisk(studentsWithScores = []) {
  if (!studentsWithScores.length) return { averageScore: 0, atRiskCount: 0, atRiskStudents: [], passRate: 100 };

  let totalScore = 0;
  const atRiskStudents = [];
  let passingCount = 0;

  studentsWithScores.forEach(s => {
    const score = Number(s.score) || 0;
    totalScore += score;
    if (score >= 60) passingCount++;
    
    if (score < 60 || (s.plagiarism_score && s.plagiarism_score > 30)) {
      atRiskStudents.push({
        studentId: s.student_id || s.id,
        name: s.student_name || 'Student',
        email: s.student_email || '',
        score,
        riskLevel: score < 45 ? 'CRITICAL' : 'MODERATE',
        reason: score < 60 ? 'Low exam comprehension' : 'Academic integrity anomaly',
        recommendedAction: score < 45 ? 'Assign 1-on-1 TA tutoring and SuperStudy flashcard deck' : 'Schedule concept review session'
      });
    }
  });

  const averageScore = Math.round(totalScore / studentsWithScores.length);
  const passRate = Math.round((passingCount / studentsWithScores.length) * 100);

  return {
    totalStudents: studentsWithScores.length,
    averageScore,
    passRate,
    atRiskCount: atRiskStudents.length,
    atRiskStudents
  };
}

/**
 * Institutional ROI & Workload Financial Calculator
 */
function calculateInstitutionalROI({ studentsCount = 5000, professorsCount = 150, avgHourlyFacultyCost = 45 } = {}) {
  const assignmentsPerYearPerProfessor = 12;
  const hoursPerGradingManual = 8;
  const hoursPerGradingAethera = 1.2;

  const hoursSavedPerYearPerProf = assignmentsPerYearPerProfessor * (hoursPerGradingManual - hoursPerGradingAethera);
  const totalFacultyHoursSaved = Math.round(professorsCount * hoursSavedPerYearPerProf);
  const annualFinancialSavingsUsd = Math.round(totalFacultyHoursSaved * avgHourlyFacultyCost);

  const studentsRetained = Math.round(studentsCount * 0.034);
  const estimatedTuitionSavedUsd = studentsRetained * 4200;

  return {
    metrics: {
      totalFacultyHoursSaved,
      annualFacultyCostSavedUsd: annualFinancialSavingsUsd,
      estimatedStudentsRetained: studentsRetained,
      tuitionRetentionImpactUsd: estimatedTuitionSavedUsd,
      totalNetValueCreatedUsd: annualFinancialSavingsUsd + estimatedTuitionSavedUsd,
      gradingSpeedupFactor: '6.7x Faster',
      studentEngagementIncrease: '+42%'
    }
  };
}

module.exports = {
  generateLicenseKey,
  generateQtiXml,
  generateMoodleXml,
  calculateCohortRisk,
  calculateInstitutionalROI
};
