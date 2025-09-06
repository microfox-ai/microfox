#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Script to check for MP4 files in the out folder and generate corresponding MP3 files
 * when MP3 files are missing using Remotion's ffmpeg command
 */

interface FileInfo {
  name: string;
  path: string;
  extension: string;
}

function getOutFolderPath(): string {
  // Check if we're in the scripts directory or project root
  const currentDir = process.cwd();
  const possibleOutPaths = [
    join(currentDir, 'out'),
    join(currentDir, '..', 'out'),
    join(currentDir, '..', '..', 'out'),
    join(currentDir, '..', '..', '..', 'out'),
  ];

  for (const path of possibleOutPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error(
    'Could not find "out" folder. Please run this script from the project root or ensure the "out" folder exists.',
  );
}

function getMp4Files(outFolderPath: string): FileInfo[] {
  if (!existsSync(outFolderPath)) {
    console.log(`Out folder does not exist: ${outFolderPath}`);
    return [];
  }

  const files = readdirSync(outFolderPath);
  const mp4Files: FileInfo[] = [];

  for (const file of files) {
    const filePath = join(outFolderPath, file);
    const stat = statSync(filePath);

    if (stat.isFile() && extname(file).toLowerCase() === '.mp4') {
      mp4Files.push({
        name: file,
        path: filePath,
        extension: '.mp4',
      });
    }
  }

  return mp4Files;
}

function mp3FileExists(outFolderPath: string, mp4FileName: string): boolean {
  const mp3FileName = mp4FileName.replace(/\.mp4$/i, '.wav');
  const mp3FilePath = join(outFolderPath, mp3FileName);
  return existsSync(mp3FilePath);
}

function generateMp3FromMp4(mp4Path: string, mp3Path: string): void {
  try {
    console.log(`Generating MP3: ${mp4Path} -> ${mp3Path}`);

    // Use npx remotion ffmpeg command with metadata
    const command = `npx remotion ffmpeg -i ${mp4Path} ${mp3Path} -metadata artist="Get into Zone" -metadata comment="Get into Zone"`;

    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log(`✅ Successfully generated: ${mp3Path}`);
  } catch (error) {
    console.error(`❌ Failed to generate MP3 from ${mp4Path}:`, error);
    throw error;
  }
}

function main(): void {
  try {
    console.log('🎵 MP4 to MP3 Converter Script');
    console.log('================================');

    const outFolderPath = getOutFolderPath();
    console.log(`📁 Checking out folder: ${outFolderPath}`);

    const mp4Files = getMp4Files(outFolderPath);

    if (mp4Files.length === 0) {
      console.log('ℹ️  No MP4 files found in the out folder.');
      return;
    }

    console.log(`📹 Found ${mp4Files.length} MP4 file(s):`);
    mp4Files.forEach(file => console.log(`   - ${file.name}`));

    let processedCount = 0;
    let skippedCount = 0;

    for (const mp4File of mp4Files) {
      const mp3FileName = mp4File.name.replace(/\.mp4$/i, '.wav');
      const mp3Path = outFolderPath + '/' + mp3FileName;

      if (mp3FileExists(outFolderPath, mp4File.name)) {
        console.log(
          `⏭️  Skipping ${mp4File.name} - MP3 already exists: ${mp3FileName}`,
        );
        skippedCount++;
        continue;
      }

      try {
        generateMp3FromMp4(mp4File.path, mp3Path);
        processedCount++;
      } catch (error) {
        console.error(`Failed to process ${mp4File.name}:`, error);
        // Continue with other files even if one fails
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   - Total MP4 files: ${mp4Files.length}`);
    console.log(`   - MP3 files generated: ${processedCount}`);
    console.log(`   - MP3 files skipped (already exist): ${skippedCount}`);

    if (processedCount > 0) {
      console.log('\n🎉 MP3 generation completed successfully!');
    } else if (skippedCount > 0) {
      console.log('\n✅ All MP4 files already have corresponding MP3 files.');
    }
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main as generateMp3FromMp4 };
