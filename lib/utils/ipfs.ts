import { create } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_PROJECT_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

export const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization,
  },
});

export async function uploadToIPFS(
  file: File,
  metadata: Record<string, any>
): Promise<string> {
  try {
    // Upload the file
    const fileAdded = await ipfsClient.add(file);

    // Create metadata with file hash
    const metadataWithFile = {
      ...metadata,
      audioUrl: `ipfs://${fileAdded.path}`,
    };

    // Upload metadata
    const metadataAdded = await ipfsClient.add(
      JSON.stringify(metadataWithFile)
    );

    return `ipfs://${metadataAdded.path}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload to IPFS");
  }
}
