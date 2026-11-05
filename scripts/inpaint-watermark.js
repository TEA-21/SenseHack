import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Running watermark inpainting via seam-relative radial contour tracking...');
const psScript = path.join(__dirname, 'inpaint-watermark.ps1');
const result = execSync(`powershell -ExecutionPolicy Bypass -File "${psScript}"`, { encoding: 'utf-8' });
console.log(result);
