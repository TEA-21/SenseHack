Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('d:\Projects\SenseHack\public\crt-master-clean.jpg')
Write-Host "Sampling right edge X from 910 to 1020 at Y=286 (middle):"
for ($x = 910; $x -lt 1020; $x += 10) {
    $c = $bmp.GetPixel($x, 286)
    Write-Host "X=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}
Write-Host "Sampling left edge X from 10 to 110 at Y=286:"
for ($x = 10; $x -lt 110; $x += 10) {
    $c = $bmp.GetPixel($x, 286)
    Write-Host "X=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$bmp.Dispose()

