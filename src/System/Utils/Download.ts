/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @class DownloadUtilError
 * @description An error thrown when the download util fails
 * @extends Error
 */
class DownloadUtilError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DownloadUtilError";
  }
}

/**
 * @method downloadFile
 * @description Downloads the file with the given filename and file
 * @param file The file to download
 * @param filename The filename to download the file as (e.g. "file.txt")
 * @throws {DownloadUtilError} If the file is not a File
 * @throws {DownloadUtilError} If the filename is not a string
 * @throws {DownloadUtilError} If the filename is empty 
 * @throws {DownloadUtilError} If the filename does not have an extension
 */
export const downloadFile = (file: File, filename: string): void => {
  // Check the filename for emptiness
  if (filename.length === 0) {
    throw new DownloadUtilError("Filename must not be empty!");
  }

  // Check the filename for an extension
  if (!filename.includes(".")) {
    throw new DownloadUtilError("Filename must have an extension!");
  }

  // Create the link
  const link = document.createElement('a');
  // Create the URL
  const url = URL.createObjectURL(file);

  // Set the link properties
  link.href = url;
  // Set the download attribute
  link.download = filename;
  // Set the visibility to hidden
  link.style.visibility = 'hidden';
  // Append the link to the body
  document.body.appendChild(link);
  // Click the link
  link.click();

  // Remove the link
  document.body.removeChild(link);
  // Revoke the URL
  window.URL.revokeObjectURL(url);
}

/**
 * @method downloadTextFile
 * @description Downloads the text file with the given filename and lines
 * @param lines The lines to download
 * @param filename The filename to download the file as (e.g. "file.txt")
 * @throws {DownloadUtilError} If the lines are not an array of strings
 * @throws {DownloadUtilError} If the filename is not a string
 * @throws {DownloadUtilError} If the filename is empty
 * @throws {DownloadUtilError} If the filename does not have an extension
 */
export const downloadTextFile = (lines: string[], filename: string): void => {
  // If the filename does not have an extension, add the .txt extension
  if (!filename.includes(".")) {
    filename += ".txt";
  }

  // Create the text by joining the lines with a newline
  const text = lines.join("\n");
  // Create the file
  const file = new File([text], filename, { type: "text/plain" });

  // Download the file
  downloadFile(file, filename);
}