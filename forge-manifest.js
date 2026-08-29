/**
 * =========================================================================
 * NEXUS CORE ENGINE (ZERO-TRUST) - FORTRESS EDITION
 * FILE: forge-manifest.js
 * MASTER BLUEPRINT TEMPLATE: OMNI-INFRASTRUCTURE GENERATOR
 * TARGET REPO: PLANETCAN-house-of-chiefs-GEN11.V6
 * SYSTEM CATEGORY: AUTH-FORTRESS
 * VERSION: GEN 11.3 V01.001.008
 * =========================================================================
 */

const fs = require('fs');
const path = require('path');
const DIRECTORY_TO_SCAN = './';
const MANIFEST_FILE = 'fleet-manifest.json';
const IGNORE_DIRS = ['node_modules', '.git'];

/**
 * Recursively scans the directory for files, respecting the IGNORE_DIRS protocol.
 */
function scanFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory() && !IGNORE_DIRS.includes(file)) {
            scanFiles(path.join(dir, file), fileList);
        } else if (stat.isFile()) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

/**
 * Extracts sovereign metadata from the file content based on extension and naming.
 */
function extractMetadata(filePath, ext, fileName) {
    let metadata = { 
        cloudTruth: "UNTRACKED", 
        survivalWeight: "FOUNDATION", 
        apexSolutionTitle: "NEXUS COMPONENT", 
        campusVisibility: false,
        systemCategory: "00-CORE-VAULT" 
    };

    // Categorise Static Assets
    if (['.mp4', '.pdf', '.jpg', '.png', '.ico', '.webp', '.jpeg'].includes(ext)) { 
        metadata.survivalWeight = "BRIEFCASE"; 
        metadata.systemCategory = "STATIC-ASSET";
    }

    // Categorise Infrastructure Files
    if (fileName.includes('service-worker.js') || fileName === 'package.json' || fileName === 'netlify.toml' || fileName === 'forge-manifest.js') {
        metadata.systemCategory = "AUTH-FORTRESS";
    }

    try {
        if (['.html', '.js', '.json', '.toml', '.css'].includes(ext)) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract Version (Cloud Truth)
            const versionMatch = content.match(/(V[0-9]{2,3}\.[0-9]{3}\.[0-9]{3})/);
            if (versionMatch) metadata.cloudTruth = versionMatch[1];
            
            // Extract Survival Weight
            const weightMatch = content.match(/<meta name="survival-weight" content="([^"]+)">/);
            if (weightMatch) metadata.survivalWeight = weightMatch[1];
            
            // Extract Solution Title
            const titleMatch = content.match(/<meta name="apex-solution-title" content="([^"]+)">/);
            if (titleMatch) metadata.apexSolutionTitle = titleMatch[1];
            
            // Extract Campus Visibility
            const visMatch = content.match(/<meta name="campus-visibility" content="([^"]+)">/);
            if (visMatch && visMatch[1] === 'true') metadata.campusVisibility = true;

            // Extract System Category (Multi-Format Support)
            const catMatchHtml = content.match(/<meta name="system-category" content="([^"]+)">/);
            const catMatchHeader = content.match(/SYSTEM CATEGORY:\s*([^\n\r]+)/);
            const catMatchJson = content.match(/"_SYSTEM_CATEGORY":\s*"([^"]+)"/);
            
            if (catMatchHtml) metadata.systemCategory = catMatchHtml[1].trim();
            else if (catMatchHeader) metadata.systemCategory = catMatchHeader[1].trim();
            else if (catMatchJson) metadata.systemCategory = catMatchJson[1].trim();
        }
    } catch (err) {
        // Metadata extraction failed for this node
    }
    
    return metadata;
}

/**
 * Orchestrates the Omni-Scan and writes the final fleet-manifest.json.
 */
function buildManifest() {
    console.log("[FORGE] Initiating [house-of-chiefs] Cloud Truth Omni-Scan (V01.001.008)...");
    const allFiles = scanFiles(DIRECTORY_TO_SCAN);
    const manifest = [];
    
    // SERVER-SIDE LOCKDOWN: Do not include .toml in the final output array
    const allowedExtensions = ['.html', '.js', '.json', '.jpg', '.png', '.mp4', '.pdf', '.css', '.ico', '.webp', '.jpeg'];
    
    for (const file of allFiles) {
        const ext = path.extname(file).toLowerCase();
        const fileName = path.basename(file);

        if (allowedExtensions.includes(ext)) {
            // Absolute Server-Side Block: Never cache build scripts or node configurations
            if (file.endsWith(MANIFEST_FILE) || 
                file.endsWith('package-lock.json') || 
                file.endsWith('halo-comms.json') ||
                fileName === 'forge-manifest.js' ||
                fileName === 'package.json') {
                continue;
            }

            const metadata = extractMetadata(file, ext, fileName);
            const normalizedPath = file.replace(/\\/g, '/');
            let finalPath = normalizedPath.startsWith('./') ? normalizedPath.slice(2) : normalizedPath;
            
            manifest.push({
                fileNode: '/' + finalPath, 
                cloudTruth: metadata.cloudTruth, 
                survivalWeight: metadata.survivalWeight,
                apexSolutionTitle: metadata.apexSolutionTitle, 
                campusVisibility: metadata.campusVisibility, 
                systemCategory: metadata.systemCategory,
                lastForged: new Date().toISOString()
            });
        }
    }
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`[FORGE] [house-of-chiefs] Manifest forged successfully. Tracked ${manifest.length} nodes.`);
}

buildManifest();