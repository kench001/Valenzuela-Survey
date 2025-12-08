import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFReportData {
  title: string;
  generatedAt: string;
  summary: {
    totalResponses: number;
    todayResponses: number;
    responseRate: string;
    activeLocations: number;
  };
  demographics: {
    age: Array<{ age: string; count: number }>;
    gender: Array<{ name: string; value: number }>;
    barangay: Array<{ barangay: string; responses: number }>;
  };
  questions?: Array<{
    id: string;
    label: string;
    type: string;
    analysis: any;
  }>;
  customData?: any;
}

export class PDFReportGenerator {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private margin: number = 20;

  constructor() {
    this.pdf = new jsPDF();
  }

  async generateReport(data: PDFReportData, includeCharts: boolean = false): Promise<void> {
    // Reset position
    this.currentY = 20;

    // Add header
    this.addHeader(data.title, data.generatedAt);

    // Add executive summary
    this.addExecutiveSummary(data.summary);

    // Add demographic analysis
    this.addDemographicAnalysis(data.demographics);

    // Add question analysis if available
    if (data.questions && data.questions.length > 0) {
      this.addQuestionAnalysis(data.questions);
    }

    // Add barangay breakdown
    this.addBarangayBreakdown(data.demographics.barangay);

    // Add charts if requested
    if (includeCharts) {
      await this.addChartsFromDOM();
    }

    // Add footer
    this.addFooter();

    // Download the PDF
    this.pdf.save(`survey-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private addHeader(title: string, generatedAt: string): void {
    // Title
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(220, 38, 38); // Red color
    this.pdf.text('Valenzuela Survey Analytics', this.margin, this.currentY);
    
    this.currentY += 12;
    
    // Subtitle
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(title, this.margin, this.currentY);
    
    this.currentY += 10;
    
    // Generated date
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(`Generated: ${generatedAt}`, this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Divider line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.currentY, 210 - this.margin, this.currentY);
    this.currentY += 15;
  }

  private addExecutiveSummary(summary: PDFReportData['summary']): void {
    this.checkPageSpace(40);
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Executive Summary', this.margin, this.currentY);
    this.currentY += 12;

    // Create summary boxes
    const boxWidth = 40;
    const boxHeight = 25;
    const spacing = 5;
    
    const summaryItems = [
      { label: 'Total Responses', value: summary.totalResponses.toString(), color: [59, 130, 246] },
      { label: 'Today\'s Responses', value: summary.todayResponses.toString(), color: [34, 197, 94] },
      { label: 'Response Rate', value: summary.responseRate, color: [168, 85, 247] },
      { label: 'Active Locations', value: summary.activeLocations.toString(), color: [239, 68, 68] }
    ];

    summaryItems.forEach((item, index) => {
      const x = this.margin + (index * (boxWidth + spacing));
      
      // Box background
      this.pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
      this.pdf.rect(x, this.currentY, boxWidth, boxHeight, 'F');
      
      // Value
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(255, 255, 255);
      const valueWidth = this.pdf.getTextWidth(item.value);
      this.pdf.text(item.value, x + (boxWidth - valueWidth) / 2, this.currentY + 10);
      
      // Label
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      const labelWidth = this.pdf.getTextWidth(item.label);
      this.pdf.text(item.label, x + (boxWidth - labelWidth) / 2, this.currentY + 18);
    });

    this.currentY += boxHeight + 15;
  }

  private addDemographicAnalysis(demographics: PDFReportData['demographics']): void {
    this.checkPageSpace(80);
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Demographic Analysis', this.margin, this.currentY);
    this.currentY += 15;

    // Age Distribution
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Age Distribution:', this.margin, this.currentY);
    this.currentY += 8;

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    demographics.age.forEach(item => {
      this.pdf.text(`• ${item.age}: ${item.count} responses`, this.margin + 5, this.currentY);
      this.currentY += 6;
    });
    this.currentY += 5;

    // Gender Distribution
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Gender Distribution:', this.margin, this.currentY);
    this.currentY += 8;

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    demographics.gender?.forEach(item => {
      if (item && item.name && item.value !== undefined) {
        this.pdf.text(`• ${item.name}: ${item.value}%`, this.margin + 5, this.currentY);
        this.currentY += 6;
      }
    });
    this.currentY += 10;
  }

  private addQuestionAnalysis(questions: PDFReportData['questions']): void {
    this.checkPageSpace(40);
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Question Analysis', this.margin, this.currentY);
    this.currentY += 15;

    questions?.slice(0, 5).forEach((question, index) => {
      this.checkPageSpace(30);
      
      // Question number and title
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`Q${index + 1}: ${question.type.toUpperCase()}`, this.margin, this.currentY);
      this.currentY += 8;

      // Question text (truncated if too long)
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      const questionText = question.label.length > 80 
        ? question.label.substring(0, 80) + '...' 
        : question.label;
      this.pdf.text(questionText, this.margin, this.currentY);
      this.currentY += 8;

      // Analysis summary
      if (question.analysis) {
        this.pdf.text(`• Total Responses: ${question.analysis.totalResponses || 0}`, this.margin + 5, this.currentY);
        this.currentY += 5;
        this.pdf.text(`• Response Rate: ${question.analysis.responseRate || 0}%`, this.margin + 5, this.currentY);
        this.currentY += 5;

        if (question.analysis.sentiment) {
          this.pdf.text(`• Sentiment: ${question.analysis.sentiment}`, this.margin + 5, this.currentY);
          this.currentY += 5;
        }

        if (question.analysis.topChoice) {
          this.pdf.text(`• Top Choice: ${question.analysis.topChoice}`, this.margin + 5, this.currentY);
          this.currentY += 5;
        }
      }
      
      this.currentY += 10;
    });
  }

  private addBarangayBreakdown(barangayData: Array<{ barangay: string; responses: number }>): void {
    this.checkPageSpace(40);
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Top Responding Barangays', this.margin, this.currentY);
    this.currentY += 15;

    // Sort and take top 10
    const topBarangays = barangayData
      .sort((a, b) => b.responses - a.responses)
      .slice(0, 10);

    // Table headers
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Rank', this.margin, this.currentY);
    this.pdf.text('Barangay', this.margin + 20, this.currentY);
    this.pdf.text('Responses', this.margin + 80, this.currentY);
    this.pdf.text('Percentage', this.margin + 120, this.currentY);
    this.currentY += 8;

    // Table divider
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.currentY - 2, 170, this.currentY - 2);
    this.currentY += 3;

    // Table data
    const totalResponses = barangayData.reduce((sum, item) => sum + item.responses, 0);
    this.pdf.setFont('helvetica', 'normal');

    topBarangays.forEach((item, index) => {
      const percentage = totalResponses > 0 ? (item.responses / totalResponses * 100).toFixed(1) : '0.0';
      
      this.pdf.text(`${index + 1}`, this.margin, this.currentY);
      this.pdf.text(item.barangay, this.margin + 20, this.currentY);
      this.pdf.text(item.responses.toString(), this.margin + 80, this.currentY);
      this.pdf.text(`${percentage}%`, this.margin + 120, this.currentY);
      
      this.currentY += 6;
    });
  }

  private async addChartsFromDOM(): Promise<void> {
    // Look for chart elements in the DOM
    const chartElements = document.querySelectorAll('canvas');
    
    for (let i = 0; i < Math.min(chartElements.length, 3); i++) {
      const element = chartElements[i];
      
      try {
        this.checkPageSpace(60);
        
        // Capture the chart as image
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 120;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add chart to PDF
        this.pdf.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
        this.currentY += imgHeight + 10;
        
      } catch (error) {
        console.warn('Could not capture chart:', error);
      }
    }
  }

  private addFooter(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      
      // Page number
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text(`Page ${i} of ${pageCount}`, 210 - this.margin - 20, this.pageHeight - 10);
      
      // Footer text
      this.pdf.text('Generated by Valenzuela Survey System', this.margin, this.pageHeight - 10);
    }
  }

  private checkPageSpace(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.pdf.addPage();
      this.currentY = 20;
    }
  }

  // Static method for quick report generation
  static async generateQuickReport(data: Partial<PDFReportData>): Promise<void> {
    const generator = new PDFReportGenerator();
    
    const reportData: PDFReportData = {
      title: data.title || 'Survey Analytics Report',
      generatedAt: new Date().toLocaleString(),
      summary: data.summary || {
        totalResponses: 0,
        todayResponses: 0,
        responseRate: '0%',
        activeLocations: 0
      },
      demographics: data.demographics || {
        age: [],
        gender: [],
        barangay: []
      },
      questions: data.questions,
      customData: data.customData
    };

    await generator.generateReport(reportData, true);
  }
}