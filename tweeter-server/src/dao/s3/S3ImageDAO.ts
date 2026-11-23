// AI-assisted: see AI-ATTRIBUTION.md
import {
    ObjectCannedACL,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { ImageDAO } from "../ImageDAO";

const CONTENT_TYPES: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
};

export class S3ImageDAO implements ImageDAO {
    private readonly client: S3Client;
    private readonly bucket: string;
    private readonly region: string;

    public constructor(client: S3Client, bucket: string, region: string) {
        this.client = client;
        this.bucket = bucket;
        this.region = region;
    }

    public async putImage(
        fileName: string,
        imageBase64: string
    ): Promise<string> {
        const decodedImageBuffer: Buffer = Buffer.from(imageBase64, "base64");
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: "image/" + fileName,
            Body: decodedImageBuffer,
            ContentType: this.contentTypeFor(fileName),
            ACL: ObjectCannedACL.public_read,
        });

        try {
            await this.client.send(command);
        } catch (error) {
            throw new Error(
                "[internal-server-error] s3 put image failed with: " + error
            );
        }

        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${fileName}`;
    }

    private contentTypeFor(fileName: string): string {
        const dot = fileName.lastIndexOf(".");
        const extension =
            dot === -1 ? "" : fileName.substring(dot + 1).toLowerCase();
        return CONTENT_TYPES[extension] ?? "application/octet-stream";
    }
}
