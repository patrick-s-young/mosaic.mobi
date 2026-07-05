import env from '../../environment';
import S3Service from '../S3Service/S3Service';
const fs = require('fs');

const ASSET_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour of inactivity before archiving
// the bundled demo asset the frontend always references by default; never archive/delete it
const EXCLUDED_ASSET_IDS = ['330055'];

export default class ArchiveService {
  private s3Service: S3Service = new S3Service();

  public async sweep(): Promise<void> {
    const volumePath = env.getVolumnPath();
    let entries: string[];
    try {
      entries = fs.readdirSync(volumePath);
    } catch (err) {
      console.log(`ArchiveService.sweep readdir err: ${err}`);
      return;
    }

    for (const assetID of entries) {
      if (EXCLUDED_ASSET_IDS.includes(assetID)) continue;
      const assetDir = `${volumePath}/${assetID}`;

      let stats;
      try {
        stats = fs.statSync(assetDir);
      } catch (err) {
        continue;
      }
      if (!stats.isDirectory()) continue;

      const age = Date.now() - this.getLastActivityTime(assetDir);
      if (age < ASSET_MAX_AGE_MS) continue;

      try {
        await this.s3Service.uploadAsset(assetID, assetDir, ['upload.mov', 'mosaic.mov', 'manifest.json']);
        fs.rmSync(assetDir, { recursive: true, force: true });
        console.log(`ArchiveService.sweep archived and removed asset ${assetID}`);
      } catch (err) {
        // leave the local copy in place if the upload failed (e.g. S3 not configured yet)
        console.log(`ArchiveService.sweep err for asset ${assetID}: ${err}`);
      }
    }
  }

  private getLastActivityTime(assetDir: string): number {
    try {
      return fs.statSync(`${assetDir}/manifest.json`).mtimeMs;
    } catch (err) {
      return fs.statSync(assetDir).mtimeMs;
    }
  }
}
