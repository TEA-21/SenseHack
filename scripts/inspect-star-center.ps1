Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

Write-Host "Vertical profile through center X=2646:"
for ($y = 1280; $y -le 1520; $y += 10) {
  $c = $bmp.GetPixel(2646, $y)
  Write-Host "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Host "`nHorizontal profile through center Y=1398:"
for ($x = 2500; $x -le 2750; $x += 10) {
  $c = $bmp.GetPixel($x, 1398)
  Write-Host "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$bmp.Dispose()

