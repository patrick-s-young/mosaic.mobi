import { Request, Response } from 'express';
import env from '../../environment';
import GeoService from '../GeoService/GeoService';
const fs = require('fs');

interface RenderEntry {
  renderedAt: string;
  numTiles: number;
  scrubberFrame: string;
  outputFilename: string;
}

interface Manifest {
  assetID: string;
  uploadedAt: string;
  location: { country: string | null; region: string | null; city: string | null };
  renders: RenderEntry[];
}

export default class ManifestService {
  private geoService: GeoService = new GeoService();

  private manifestPath(assetID: string): string {
    return `${env.getVolumnPath()}/${assetID}/manifest.json`;
  }

  private readManifest(assetID: string): Manifest | null {
    try {
      const raw = fs.readFileSync(this.manifestPath(assetID), 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  private writeManifest(assetID: string, manifest: Manifest) {
    fs.writeFileSync(this.manifestPath(assetID), JSON.stringify(manifest, null, 2));
  }

  // called right after upload; writes the manifest immediately so the
  // response isn't blocked, then fills in geolocation asynchronously
  public createManifest (req: Request, res: Response, next: any) {
    const assetID = res.locals.assetID;
    const manifest: Manifest = {
      assetID: String(assetID),
      uploadedAt: new Date().toISOString(),
      location: { country: null, region: null, city: null },
      renders: []
    };
    try {
      this.writeManifest(assetID, manifest);
    } catch (err) {
      console.log(`ManifestService.createManifest write err: ${err}`);
    }
    next();

    const clientIp = req.ip?.replace(/^::ffff:/, '') ?? '';
    this.geoService.lookupLocation(clientIp).then((location) => {
      const current = this.readManifest(assetID);
      if (!current) return;
      current.location = location;
      this.writeManifest(assetID, current);
    });
  }

  // called after a successful render (cache hit or fresh encode); records the edit choice made
  public recordRender (assetID: string, numTiles: number, scrubberFrame: string, outputFilename: string) {
    let manifest = this.readManifest(assetID);
    if (!manifest) {
      manifest = {
        assetID: String(assetID),
        uploadedAt: new Date().toISOString(),
        location: { country: null, region: null, city: null },
        renders: []
      };
    }
    manifest.renders.push({
      renderedAt: new Date().toISOString(),
      numTiles,
      scrubberFrame,
      outputFilename
    });
    try {
      this.writeManifest(assetID, manifest);
    } catch (err) {
      console.log(`ManifestService.recordRender write err: ${err}`);
    }
  }
}
