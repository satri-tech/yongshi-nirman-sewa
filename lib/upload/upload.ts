import { writeFile, mkdir, access } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function isValidFileType(file: File): boolean {
  return Object.keys(ALLOWED_FILE_TYPES).includes(file.type);
}

function getFileExtension(file: File): string {
  const extensions =
    ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
  if (extensions?.length) return extensions[0];

  const originalExtension = file.name.split(".").pop();
  return originalExtension ? `.${originalExtension}` : ".bin";
}

async function ensureDirectoryExists(dirPath: string) {
  try {
    await access(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * Save files to a given folder under /public
 * @param files File[] - the uploaded files
 * @param folder string - e.g. "projects" or "testimonials"
 * @param multiple boolean - allow multiple or enforce single
 */
export async function saveUploadedFiles(
  files: File[] | File,
  folder: string,
  multiple = true
): Promise<string[] | string> {
  const fileArray = Array.isArray(files) ? files : [files];
  if (!multiple && fileArray.length > 1) {
    throw new Error(`Only one file allowed in ${folder} upload`);
  }

  const uploadDir = join(process.cwd(), "public", folder);
  await ensureDirectoryExists(uploadDir);

  const savedFiles: string[] = [];

  for (const file of fileArray) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File ${file.name} exceeds max size of 5MB`);
    }

    if (!isValidFileType(file)) {
      throw new Error(`Invalid file type: ${file.type}`);
    }

    const ext = getFileExtension(file);
    const filename = `${uuidv4()}${ext}`;
    const filepath = join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    savedFiles.push(`/${folder}/${filename}`);
  }

  return multiple ? savedFiles : savedFiles[0];
}
