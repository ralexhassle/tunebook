#!/usr/bin/env ts-node

/**
 * HTML Report Generator for Irish Music Statistics
 * Generates beautiful HTML reports instead of console output
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { TuneSearchEngine } from '../scripts/search-engine';
import { readTunesData } from '../utils/data-reader';
import {
  TuneType,
  TuneMode,
  TimeSignature,
  getAllTuneTypes,
  getAllTuneModes,
  getAllTimeSignatures,
} from '../enums';

interface ReportData {
  metadata: {
    generatedAt: string;
    totalTunes: number;
    dataSource: string;
  };
  distributions: {
    types: Array<{ name: string; count: number; percentage: number }>;
    modes: Array<{ name: string; count: number; percentage: number }>;
    meters: Array<{ name: string; count: number; percentage: number }>;
  };
  examples: {
    popularReels: Array<{ name: string; mode: string; username: string }>;
    popularJigs: Array<{ name: string; mode: string; username: string }>;
    popularPolkas: Array<{ name: string; mode: string; username: string }>;
  };
  insights: string[];
}

export class HTMLReportGenerator {
  private searchEngine: TuneSearchEngine;
  private reportData: ReportData;

  constructor() {
    this.searchEngine = new TuneSearchEngine();
    this.reportData = this.generateReportData();
  }

  private generateReportData(): ReportData {
    const tunes = readTunesData();
    const stats = this.searchEngine.getStats();

    // Calculate distributions
    const typeEntries = Object.entries(stats.typeDistribution)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / tunes.length) * 100,
      }));

    const modeEntries = Object.entries(stats.modeDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15) // Top 15 modes
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / tunes.length) * 100,
      }));

    const meterEntries = Object.entries(stats.meterDistribution)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / tunes.length) * 100,
      }));

    // Get popular examples
    const popularReels = this.searchEngine
      .getPopularByType(TuneType.REEL, 10)
      .map((tune) => ({
        name: tune.name,
        mode: tune.mode,
        username: tune.username,
      }));

    const popularJigs = this.searchEngine
      .getPopularByType(TuneType.JIG, 10)
      .map((tune) => ({
        name: tune.name,
        mode: tune.mode,
        username: tune.username,
      }));

    const popularPolkas = this.searchEngine
      .getPopularByType(TuneType.POLKA, 10)
      .map((tune) => ({
        name: tune.name,
        mode: tune.mode,
        username: tune.username,
      }));

    // Generate insights
    const insights = this.generateInsights(
      typeEntries,
      modeEntries,
      meterEntries
    );

    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalTunes: tunes.length,
        dataSource: 'thesession.org',
      },
      distributions: {
        types: typeEntries,
        modes: modeEntries,
        meters: meterEntries,
      },
      examples: {
        popularReels,
        popularJigs,
        popularPolkas,
      },
      insights,
    };
  }

  private generateInsights(
    types: any[],
    modes: any[],
    meters: any[]
  ): string[] {
    const insights = [];

    // Type insights
    const topType = types[0];
    const secondType = types[1];
    insights.push(
      `${topType.name.charAt(0).toUpperCase() + topType.name.slice(1)}s dominate the repertoire with ${topType.percentage.toFixed(1)}% of all tunes.`
    );
    insights.push(
      `The top two tune types (${topType.name} and ${secondType.name}) account for ${(topType.percentage + secondType.percentage).toFixed(1)}% of the collection.`
    );

    // Mode insights
    const topMode = modes[0];
    const secondMode = modes[1];
    insights.push(
      `${topMode.name} and ${secondMode.name} are the most popular keys, representing ${(topMode.percentage + secondMode.percentage).toFixed(1)}% of all tunes.`
    );

    // Meter insights
    const topMeter = meters[0];
    insights.push(
      `${topMeter.percentage.toFixed(1)}% of tunes are in ${topMeter.name} time signature.`
    );

    // Diversity insight
    insights.push(
      `The collection shows remarkable diversity with ${getAllTuneTypes().length} distinct tune types, ${getAllTuneModes().length} musical modes, and ${getAllTimeSignatures().length} time signatures.`
    );

    return insights;
  }

  private generateCSS(): string {
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

  private generateHTML(): string {
    const { metadata, distributions, examples, insights } = this.reportData;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Irish Traditional Music Statistics Report</title>
    <style>${this.generateCSS()}</style>
</head>
<body>
    <div class="container">
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
        </header>

        <div class="section">
            <h2>📊 Tune Type Distribution</h2>
            <div class="chart-container">
                <div class="bar-chart">
                    ${distributions.types
                      .map(
                        (type) => `
                        <div class="bar">
                            <div class="bar-label">${type.name}</div>
                            <div class="bar-fill" style="width: ${Math.max(type.percentage * 8, 20)}px"></div>
                            <div class="bar-value">${type.count.toLocaleString()} (${type.percentage.toFixed(1)}%)</div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🎼 Musical Mode Distribution</h2>
            <div class="chart-container">
                <div class="bar-chart">
                    ${distributions.modes
                      .map(
                        (mode) => `
                        <div class="bar">
                            <div class="bar-label">${mode.name}</div>
                            <div class="bar-fill" style="width: ${Math.max(mode.percentage * 8, 20)}px"></div>
                            <div class="bar-value">${mode.count.toLocaleString()} (${mode.percentage.toFixed(1)}%)</div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🥁 Time Signature Distribution</h2>
            <div class="chart-container">
                <div class="bar-chart">
                    ${distributions.meters
                      .map(
                        (meter) => `
                        <div class="bar">
                            <div class="bar-label">${meter.name}</div>
                            <div class="bar-fill" style="width: ${Math.max(meter.percentage * 8, 20)}px"></div>
                            <div class="bar-value">${meter.count.toLocaleString()} (${meter.percentage.toFixed(1)}%)</div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🌟 Popular Tunes by Category</h2>
            <div class="examples-grid">
                <div class="example-category">
                    <h3>Popular Reels</h3>
                    <ul class="tune-list">
                        ${examples.popularReels
                          .map(
                            (tune) => `
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
                
                <div class="example-category">
                    <h3>Popular Jigs</h3>
                    <ul class="tune-list">
                        ${examples.popularJigs
                          .map(
                            (tune) => `
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
                
                <div class="example-category">
                    <h3>Popular Polkas</h3>
                    <ul class="tune-list">
                        ${examples.popularPolkas
                          .map(
                            (tune) => `
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
            </div>
        </div>

        <div class="insights">
            <h2>💡 Key Insights</h2>
            ${insights
              .map(
                (insight) => `
                <div class="insight">${insight}</div>
            `
              )
              .join('')}
        </div>

        <footer>
            <p>Report generated by @tunebook/thesession-types • Data from thesession.org</p>
        </footer>
    </div>
</body>
</html>
    `;
  }

  generateReport(outputDir: string = './reports'): string {
    try {
      // Create reports directory
      mkdirSync(outputDir, { recursive: true });

      // Generate HTML content
      const htmlContent = this.generateHTML();

      // Write HTML file
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `irish-music-report-${timestamp}.html`;
      const filePath = join(outputDir, filename);

      writeFileSync(filePath, htmlContent, 'utf-8');

      // Also generate a JSON data file
      const jsonFilename = `irish-music-data-${timestamp}.json`;
      const jsonPath = join(outputDir, jsonFilename);
      writeFileSync(
        jsonPath,
        JSON.stringify(this.reportData, null, 2),
        'utf-8'
      );

      return filePath;
    } catch (error) {
      throw new Error(`Failed to generate report: ${error}`);
    }
  }
}

// CLI execution
function main() {
  console.log('🎨 Generating HTML Statistics Report...');

  const generator = new HTMLReportGenerator();
  const reportPath = generator.generateReport();

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
