import { Application, Request, Response } from 'express';
import basicAuth from 'express-basic-auth';
import S3Service from './MosaicServices/S3Service/S3Service';
import env from './environment';
const path = require('path');

export class AdminRoutes {
  private s3Service: S3Service = new S3Service();

  public route(app: Application) {
    const auth = basicAuth({
      users: { admin: env.getAdminPassword() },
      challenge: true,
      unauthorizedResponse: 'Unauthorized'
    });

    app.get('/admin', auth, (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../public/admin/index.html'));
    });

    app.get('/admin/api/assets', auth, async (req: Request, res: Response) => {
      try {
        const assetIDs = await this.s3Service.listAssetIDs();
        const assets = await Promise.all(assetIDs.map(async (assetID) => {
          const manifest = await this.s3Service.getManifest(assetID);
          return manifest ? { assetID, ...manifest } : null;
        }));
        const found = assets.filter((asset) => asset !== null);
        found.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        res.json({ assets: found });
      } catch (err) {
        res.status(500).json({ error: true, message: String(err) });
      }
    });

    app.get('/admin/api/video-url', auth, async (req: Request, res: Response) => {
      const assetID = String(req.query.assetID ?? '');
      const filename = String(req.query.filename ?? '');
      const url = await this.s3Service.getSignedVideoUrl(assetID, filename);
      if (!url) {
        res.status(404).json({ error: true, message: 'Not found' });
        return;
      }
      res.json({ url });
    });
  }
}
