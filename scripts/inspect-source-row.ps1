Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Row Y=410 (clean source area):"
for ($x = 900; $x -le 960; $x += 2) {
    $c = $bmp.GetPixel($x, 410)
    Write-Host "X=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$bmp.Dispose()

