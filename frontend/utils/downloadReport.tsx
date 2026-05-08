import { Share } from '@capacitor/share';
import type { Mission } from '../types'; // Adjust this path to your actual types folder

/**
 * Generates a CSV report and triggers the Android Share menu on mobile
 * or a direct download on the web browser.
 */
export const downloadMissionReport = async (mission: Mission) => {
  if (!mission) return;

  // --- 1. CSV Data Generation ---
  let csvContent = "Property,Value\r\n";
  
  // Mission Details
  csvContent += `Mission Name,"${mission.name}"\r\n`;
  csvContent += `Date,"${mission.date}"\r\n`;
  csvContent += `Status,"${mission.status}"\r\n`;
  csvContent += `Duration (secs),${mission.duration || '0'}\r\n`;
  csvContent += `Location,"${mission.location}"\r\n`;

  // Detected Objects
  if (mission.detectedSites && mission.detectedSites.length > 0) {
    csvContent += "\r\nDetected Objects\r\n";
    csvContent += "Index,Class Name,Type,Bounding Box\r\n";
    
    mission.detectedSites.forEach((site, index) => {
      const bbox = site.bbox ? `"${site.bbox.join(', ')}"` : "N/A";
      csvContent += `${index + 1},"${site.object}","${site.type}",${bbox}\r\n`;
    });
  } else {
    csvContent += "\r\nDetected Objects,None\r\n";
  }

  // GPS Track
  if (mission.gpsTrack && mission.gpsTrack.length > 0) {
    csvContent += "\r\nGPS Track\r\n";
    csvContent += "Latitude,Longitude\r\n";
    mission.gpsTrack.forEach(point => {
      csvContent += `${point.lat},${point.lon}\r\n`;
    });
  }

  // --- 2. File Naming ---
  const fileName = `${mission.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.csv`;

  // --- 3. Execution Logic ---
  try {
    // Check if we are running on a mobile device
    const canShare = await Share.canShare();
    
    if (canShare.value) {
      // MOBILE: Convert to Base64 and open Android Share Sheet
      // We use btoa() to encode the string for the data URL
      const base64Data = btoa(unescape(encodeURIComponent(csvContent)));
      
      await Share.share({
        title: 'Mission Report',
        text: `Exported flight data for ${mission.name}`,
        url: `data:text/csv;base64,${base64Data}`,
        dialogTitle: 'Save Mission Report',
      });
    } else {
      throw new Error("Sharing not supported, falling back to web download");
    }
  } catch (error) {
    // WEB BROWSER FALLBACK: Standard anchor tag download
    console.log("Web environment detected or sharing failed, downloading via browser...");
    
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};