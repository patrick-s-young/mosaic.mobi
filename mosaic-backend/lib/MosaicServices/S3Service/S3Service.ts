import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../../environment';
const fs = require('fs');

export default class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = env.getS3BucketName();
    // credentials are resolved automatically from the EC2 instance's IAM role
    this.client = new S3Client({ region: env.getAwsRegion() });
  }

  private assetKey(assetID: string, filename: string): string {
    return `assets/${assetID}/${filename}`;
  }

  public async uploadAsset(assetID: string, localDir: string, filenames: string[]): Promise<void> {
    for (const filename of filenames) {
      const localPath = `${localDir}/${filename}`;
      if (!fs.existsSync(localPath)) continue;
      const body = fs.readFileSync(localPath);
      await this.client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.assetKey(assetID, filename),
        Body: body
      }));
    }
  }

  public async listAssetIDs(): Promise<string[]> {
    const assetIDs = new Set<string>();
    let continuationToken: string | undefined = undefined;
    do {
      const response = await this.client.send(new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: 'assets/',
        Delimiter: '/',
        ContinuationToken: continuationToken
      }));
      (response.CommonPrefixes ?? []).forEach((p) => {
        const match = p.Prefix?.match(/^assets\/([^/]+)\/$/);
        if (match) assetIDs.add(match[1]);
      });
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);
    return Array.from(assetIDs);
  }

  public async getManifest(assetID: string): Promise<any | null> {
    try {
      const response = await this.client.send(new GetObjectCommand({
        Bucket: this.bucket,
        Key: this.assetKey(assetID, 'manifest.json')
      }));
      const body = await response.Body?.transformToString();
      return body ? JSON.parse(body) : null;
    } catch (err) {
      return null;
    }
  }

  public async getSignedVideoUrl(assetID: string, filename: string, expiresInSeconds = 3600): Promise<string | null> {
    try {
      const command = new GetObjectCommand({ Bucket: this.bucket, Key: this.assetKey(assetID, filename) });
      return await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
    } catch (err) {
      console.log(`S3Service.getSignedVideoUrl err: ${err}`);
      return null;
    }
  }
}
