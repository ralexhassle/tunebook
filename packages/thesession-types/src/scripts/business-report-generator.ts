#!/usr/bin/env ts-node

/**
 * Business-focused HTML Report Generator for Irish Music Statistics
 * Refactored for clarity and maintainability
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { TuneSearchEngine } from './search-engine';
import { readTunesData } from '../utils/data-reader';
import {
  TuneType,
  TuneMode,
  TimeSignature,
  getAllTuneTypes,
  getAllTuneModes,
  getAllTimeSignatures,
} from '../enums';

// Business domain types
interface TuneStatistics {
  name: string;
  count: number;
  percentage: number;
}

interface PopularTune {
  name: string;
  mode: string;
  username: string;
}

interface ReportMetadata {
  generatedAt: string;
  totalTunes: number;
  dataSource: string;
}

interface MusicAnalytics {
  metadata: ReportMetadata;
  distributions: {
    types: TuneStatistics[];
    modes: TuneStatistics[];
    meters: TuneStatistics[];
  };
  examples: {
    popularReels: PopularTune[];
    popularJigs: PopularTune[];
    popularPolkas: PopularTune[];
  };
  insights: string[];
}

/**
 * Business-focused HTML Report Generator
 */
export class MusicAnalyticsReportGenerator {
  private searchEngine: TuneSearchEngine;

  constructor() {
    this.searchEngine = new TuneSearchEngine();
  }

  /**
   * Generate comprehensive music analytics
   */
  generateAnalytics(): MusicAnalytics {
    const tunes = readTunesData();
    const stats = this.searchEngine.getStats();

    const distributions = this.calculateAllDistributions(stats, tunes.length);
    const examples = this.extractPopularExamples();
    const insights = this.generateBusinessInsights(distributions);

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalTunes: tunes.length,
        dataSource: 'thesession.org',
      },
      distributions,
      examples,
      insights,
    };
  }

  /**
   * Calculate statistical distributions for all categories
   */
  private calculateAllDistributions(stats: any, totalTunes: number) {
    return {
      types: this.calculateDistribution(stats.typeDistribution, totalTunes),
      modes: this.calculateDistribution(stats.modeDistribution, totalTunes, 15),
      meters: this.calculateDistribution(stats.meterDistribution, totalTunes),
    };
  }

  /**
   * Calculate distribution statistics for a data category
   */
  private calculateDistribution(
    stats: Record<string, number>,
    totalCount: number,
    limit?: number
  ): TuneStatistics[] {
    const entries = Object.entries(stats).sort(([, a], [, b]) => b - a);

    if (limit) {
      entries.splice(limit);
    }

    return entries.map(([name, count]) => ({
      name,
      count,
      percentage: (count / totalCount) * 100,
    }));
  }

  /**
   * Extract popular tune examples by category
   */
  private extractPopularExamples() {
    return {
      popularReels: this.getPopularTunesForType(TuneType.REEL),
      popularJigs: this.getPopularTunesForType(TuneType.JIG),
      popularPolkas: this.getPopularTunesForType(TuneType.POLKA),
    };
  }

  /**
   * Get popular tunes for a specific type
   */
  private getPopularTunesForType(
    type: TuneType,
    limit: number = 10
  ): PopularTune[] {
    return this.searchEngine.getPopularByType(type, limit).map((tune) => ({
      name: tune.name,
      mode: tune.mode,
      username: tune.username,
    }));
  }

  /**
   * Generate business insights from analytics
   */
  private generateBusinessInsights(distributions: any): string[] {
    const insights = [];

    // Market dominance analysis
    insights.push(...this.analyzeMarketDominance(distributions.types));

    // Musical preferences analysis
    insights.push(
      ...this.analyzeMusicalPreferences(
        distributions.modes,
        distributions.meters
      )
    );

    // Diversity analysis
    insights.push(this.analyzeDiversity());

    return insights;
  }

  /**
   * Analyze market dominance patterns
   */
  private analyzeMarketDominance(types: TuneStatistics[]): string[] {
    const [topType, secondType] = types;

    return [
      `${this.capitalizeFirst(topType.name)}s dominate the repertoire with ${topType.percentage.toFixed(1)}% of all tunes.`,
      `The top two tune types (${topType.name} and ${secondType.name}) account for ${(topType.percentage + secondType.percentage).toFixed(1)}% of the collection.`,
    ];
  }

  /**
   * Analyze musical preferences
   */
  private analyzeMusicalPreferences(
    modes: TuneStatistics[],
    meters: TuneStatistics[]
  ): string[] {
    const [topMode, secondMode] = modes;
    const [topMeter] = meters;

    return [
      `${topMode.name} and ${secondMode.name} are the most popular keys, representing ${(topMode.percentage + secondMode.percentage).toFixed(1)}% of all tunes.`,
      `${topMeter.percentage.toFixed(1)}% of tunes are in ${topMeter.name} time signature.`,
    ];
  }

  /**
   * Analyze collection diversity
   */
  private analyzeDiversity(): string {
    return `The collection shows remarkable diversity with ${getAllTuneTypes().length} distinct tune types, ${getAllTuneModes().length} musical modes, and ${getAllTimeSignatures().length} time signatures.`;
  }

  /**
   * Utility: Capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(outputDir: string = './reports'): string {
    const analytics = this.generateAnalytics();
    const htmlContent = this.buildHTMLContent(analytics);

    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true });

    // Write files
    const timestamp = new Date().toISOString().split('T')[0];
    const htmlPath = join(outputDir, `irish-music-report-${timestamp}.html`);
    const jsonPath = join(outputDir, `irish-music-data-${timestamp}.json`);

    writeFileSync(htmlPath, htmlContent, 'utf-8');
    writeFileSync(jsonPath, JSON.stringify(analytics, null, 2), 'utf-8');

    return htmlPath;
  }

  /**
   * Build complete HTML content
   */
  private buildHTMLContent(analytics: MusicAnalytics): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Irish Traditional Music Statistics Report</title>
    <style>${this.getCSS()}</style>
</head>
<body>
    <div class="container">
        ${this.buildHeader(analytics.metadata)}
        ${this.buildDistributionSection('📊 Tune Type Distribution', analytics.distributions.types)}
        ${this.buildDistributionSection('🎼 Musical Mode Distribution', analytics.distributions.modes)}
        ${this.buildDistributionSection('🥁 Time Signature Distribution', analytics.distributions.meters)}
        ${this.buildPopularTunesSection(analytics.examples)}
        ${this.buildInsightsSection(analytics.insights)}
        ${this.buildFooter()}
    </div>
</body>
</html>`;
  }

  /**
   * Build header section
   */
  private buildHeader(metadata: ReportMetadata): string {
    return `
        <header>
            <h1>🎵 Irish Traditional Music Analysis</h1>
            <p class="subtitle">Statistical Analysis of thesession.org Collection</p>
            
            <div class="metadata">
                <div class="metadata-item">
                    <div class="metadata-label">Total Tunes</div>
                    <div class="metadata-value">${metadata.totalTunes.toLocaleString()}</div>
                </div>
                <div class="metadata-item">
                    <div class="metadata-label">Data Source</div>
                    <div class="metadata-value">${metadata.dataSource}</div>
                </div>
                <div class="metadata-item">
                    <div class="metadata-label">Generated</div>
                    <div class="metadata-value">${new Date(metadata.generatedAt).toLocaleDateString()}</div>
                </div>
            </div>
        </header>`;
  }

  /**
   * Build distribution section
   */
  private buildDistributionSection(
    title: string,
    distribution: TuneStatistics[]
  ): string {
    const bars = distribution
      .map(
        (item) => `
        <div class="bar">
            <div class="bar-label">${item.name}</div>
            <div class="bar-fill" style="width: ${Math.max(item.percentage * 8, 20)}px"></div>
            <div class="bar-value">${item.count.toLocaleString()} (${item.percentage.toFixed(1)}%)</div>
        </div>
    `
      )
      .join('');

    return `
        <div class="section">
            <h2>${title}</h2>
            <div class="chart-container">
                <div class="bar-chart">
                    ${bars}
                </div>
            </div>
        </div>`;
  }

  /**
   * Build popular tunes section
   */
  private buildPopularTunesSection(examples: any): string {
    const categories = [
      { title: 'Popular Reels', tunes: examples.popularReels },
      { title: 'Popular Jigs', tunes: examples.popularJigs },
      { title: 'Popular Polkas', tunes: examples.popularPolkas },
    ];

    const categoriesHTML = categories
      .map(
        (category) => `
        <div class="example-category">
            <h3>${category.title}</h3>
            <ul class="tune-list">
                ${category.tunes
                  .map(
                    (tune: PopularTune) => `
                    <li class="tune-item">
                        <div class="tune-name">"${tune.name}"</div>
                        <div class="tune-details">
                            <span class="tune-mode">${tune.mode}</span>
                            <span class="tune-author">by ${tune.username}</span>
                        </div>
                    </li>
                `
                  )
                  .join('')}
            </ul>
        </div>
    `
      )
      .join('');

    return `
        <div class="section">
            <h2>🌟 Popular Tunes by Category</h2>
            <div class="examples-grid">
                ${categoriesHTML}
            </div>
        </div>`;
  }

  /**
   * Build insights section
   */
  private buildInsightsSection(insights: string[]): string {
    const insightBoxes = insights
      .map(
        (insight) => `
        <div class="insight">${insight}</div>
    `
      )
      .join('');

    return `
        <div class="insights">
            <h2>💡 Key Insights</h2>
            ${insightBoxes}
        </div>`;
  }

  /**
   * Build footer
   */
  private buildFooter(): string {
    return `
        <footer>
            <p>Report generated by @tunebook/thesession-types • Data from thesession.org</p>
        </footer>`;
  }

  /**
   * Get CSS styles
   */
  private getCSS(): string {
    return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #2c3e50;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    header {
      text-align: center;
      margin-bottom: 40px;
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    h1 {
      color: #2c5530;
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 1.1em;
      font-style: italic;
    }

    .metadata {
      background: #34495e;
      color: white;
      padding: 15px;
      border-radius: 10px;
      margin: 20px 0;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .metadata-item {
      flex: 1;
    }

    .metadata-label {
      font-size: 0.9em;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .metadata-value {
      font-size: 1.5em;
      font-weight: bold;
      margin-top: 5px;
    }

    .section {
      background: white;
      margin: 30px 0;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }

    .section h2 {
      color: #2c5530;
      font-size: 1.8em;
      margin-bottom: 20px;
      border-bottom: 3px solid #27ae60;
      padding-bottom: 10px;
    }

    .chart-container {
      margin: 20px 0;
    }

    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .bar {
      display: flex;
      align-items: center;
      background: #ecf0f1;
      border-radius: 8px;
      padding: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .bar:hover {
      background: #bdc3c7;
      transform: translateX(5px);
    }

    .bar-label {
      min-width: 120px;
      font-weight: bold;
      text-transform: capitalize;
    }

    .bar-fill {
      height: 25px;
      background: linear-gradient(90deg, #27ae60, #2ecc71);
      border-radius: 4px;
      margin: 0 10px;
      transition: all 0.3s ease;
      flex-grow: 0;
      flex-shrink: 0;
    }

    .bar-value {
      margin-left: auto;
      font-weight: bold;
      color: #2c3e50;
      font-size: 0.9em;
      min-width: 120px;
      text-align: right;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .example-category {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      border-left: 5px solid #27ae60;
    }

    .example-category h3 {
      color: #2c5530;
      margin-bottom: 15px;
      font-size: 1.3em;
    }

    .tune-list {
      list-style: none;
    }

    .tune-item {
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .tune-item:last-child {
      border-bottom: none;
    }

    .tune-name {
      font-weight: bold;
      color: #2c3e50;
      font-size: 1em;
      margin-bottom: 4px;
    }

    .tune-details {
      font-size: 0.85em;
      color: #7f8c8d;
      display: flex;
      gap: 8px;
    }

    .tune-mode {
      color: #27ae60;
      font-weight: 500;
    }

    .tune-author {
      color: #8e44ad;
      font-style: italic;
    }

    .insights {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      margin-top: 30px;
    }

    .insights h2 {
      color: white;
      border-bottom-color: rgba(255,255,255,0.3);
    }

    .insight {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      border-left: 4px solid rgba(255,255,255,0.5);
    }

    footer {
      text-align: center;
      margin-top: 50px;
      color: #7f8c8d;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .container { padding: 10px; }
      .metadata { flex-direction: column; gap: 10px; }
      .examples-grid { grid-template-columns: 1fr; }
      h1 { font-size: 2em; }
    }
    `;
  }
}

// CLI execution
function main() {
  console.log('🎨 Generating Business Analytics Report...');

  const generator = new MusicAnalyticsReportGenerator();
  const reportPath = generator.generateHTMLReport();

  console.log(`✅ Report generated successfully!`);
  console.log(`📄 HTML Report: ${reportPath}`);
  console.log(
    `🌐 Open in browser: file://${require('path').resolve(reportPath)}`
  );
}

// Execute if run directly
if (require.main === module) {
  main();
}
