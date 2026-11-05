Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\public\crt-full-tight.png")

Write-Host "--- LEFT APEX (Y=710) ---"
for ($x = 180; $x -le 220; $x += 2) {
    $c = $bmp.GetPixel($x, 710)
    Write-Host ("X={0,4} : R={1,3} G={2,3} B={3,3}" -f $x, $c.R, $c.G, $c.B)
}

Write-Host "`n--- RIGHT APEX (Y=710) ---"
for ($x = 1660; $x -le 1700; $x += 2) {
    $c = $bmp.GetPixel($x, 710)
    Write-Host ("X={0,4} : R={1,3} G={2,3} B={3,3}" -f $x, $c.R, $c.G, $c.B)
}

Write-Host "`n--- TOP APEX (X=942) ---"
for ($y = 165; $y -le 195; $y += 2) {
    $c = $bmp.GetPixel(942, $y)
    Write-Host ("Y={0,4} : R={1,3} G={2,3} B={3,3}" -f $y, $c.R, $c.G, $c.B)
}

Write-Host "`n--- BOTTOM APEX (X=942) ---"
for ($y = 1240; $y -le 1310; $y += 2) {
    $c = $bmp.GetPixel(942, $y)
    Write-Host ("Y={0,4} : R={1,3} G={2,3} B={3,3}" -f $y, $c.R, $c.G, $c.B)
}

$bmp.Dispose()
