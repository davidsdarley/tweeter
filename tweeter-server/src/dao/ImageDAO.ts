// AI-assisted: see AI-ATTRIBUTION.md

export interface ImageDAO {
    // Stores the image and returns its public URL.
    putImage(fileName: string, imageBase64: string): Promise<string>;
}
