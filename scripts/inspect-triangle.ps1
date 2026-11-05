Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Inspecting the left tip area of the star in original media_1793815279630_7d6e85ba.jpg:"
for ($y = 482; $y -le 494; $y++) {
    Write-Host "Y=${y}:"
    for ($x = 920; $x -le 930; $x++) {
        $c = $bmp.GetPixel($x, $y)
        Write-Host -NoNewline " X=${x}:($($c.R),$($c.G),$($c.B))"
    }
    Write-Host ""
}
$bmp.Dispose()
