import { app, InvocationContext } from "@azure/functions";
import { BlockBlobClient } from "@azure/storage-blob";
import { QueueClient } from "@azure/storage-queue";
import Jimp = require("jimp");

const ICON_SIZE = 128;

export async function createThumbnailTrigger(
  blob: Buffer,
  context: InvocationContext
): Promise<void> {
  context.log(
    `Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`
  );

  const blobName = context.triggerMetadata.name as string;

  if (blobName.startsWith("min")) {
    return;
  }

  const image = await Jimp.read(blob);
  image.resize(ICON_SIZE, ICON_SIZE);
  const thumbnail = await image.getBufferAsync(Jimp.MIME_JPEG);

  const blobClient = new BlockBlobClient(
    "CONN_STRING",
    "BLOB_CONTAINER",
    `min-${blobName}`
  );

  try {
    await blobClient.uploadData(thumbnail, {
      blobHTTPHeaders: { blobContentType: "image/jpeg" },
    });

    const queueClient = new QueueClient(
      "CONN_STRING",
      "QUEUE_NAME"
    );

    await queueClient.sendMessage(
      JSON.stringify({
        specversion: "1.0",
        type: "thumbnail-created",
        source: `/${blobName}`,
        id: context.invocationId,
        time: new Date(),
        datacontenttype: "application/json",
        data: {
          id: context.triggerMetadata.metadata["id"],
          thumbnailUrl: blobClient.url,
        },
      })
    );
  } catch (err) {
    context.error(err.message);
    return;
  }
}

app.storageBlob("createThumbnailTrigger", {
  path: "BLOB_CONTAINER/{name}",
  connection: "AzureWebJobsStorage",
  handler: createThumbnailTrigger,
});
