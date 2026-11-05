Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Clean source row Y=425:"
for ($x = 915; $x -le 960; $x += 2) {
    $c = $bmp.GetPixel($x, 425)
    Write-Host -NoNewline " X=${x}:($($c.R),$($c.G),$($c.B))"
}
Write-Host ""
$bmp.Dispose()

