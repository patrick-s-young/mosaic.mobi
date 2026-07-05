import { httpServer } from "./App";
import ArchiveService from "./MosaicServices/ArchiveService/ArchiveService";

const PORT = 3001
const ARCHIVE_SWEEP_INTERVAL_MS = 15 * 60 * 1000;

httpServer.listen(PORT, () => {
   console.log('Express server listening on port ' + PORT);
});

const archiveService = new ArchiveService();
setInterval(() => archiveService.sweep(), ARCHIVE_SWEEP_INTERVAL_MS);