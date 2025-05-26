import path from 'path';
import { IssueDetails, PackageFoxRequest } from '../../process-issue';
import { getProjectRoot } from '../../utils/getProjectRoot';
import fs from 'fs';

export const cleanupFoxRequests = async (
  requestType: IssueDetails['type'],
  params: Record<string, string>,
) => {
  const foxLogPath = path.join(
    getProjectRoot(),
    '.microfox/packagefox-build.json',
  );
  try {
    if (fs.existsSync(foxLogPath)) {
      const foxlog = fs.readFileSync(foxLogPath, 'utf8');
      const foxlogData = JSON.parse(foxlog);
      const newRequests: PackageFoxRequest[] = foxlogData.requests.filter(
        (request: PackageFoxRequest) => {
          let shouldRemove = false;
          Object.entries(params).forEach(([key, value]) => {
            if (
              request[key as keyof PackageFoxRequest] === value &&
              requestType === request.type
            ) {
              shouldRemove = true;
            }
          });
          return !shouldRemove;
        },
      );
      foxlogData.requests = newRequests;
      fs.writeFileSync(foxLogPath, JSON.stringify(foxlogData, null, 2));
      console.log('✅ Cleaned up packagefox-build.json log.');
    }
  } catch (logError) {
    console.warn('⚠️ Could not clean up packagefox-build.json:', logError);
  }
};
