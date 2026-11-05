Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

# Let's inspect a horizontal slice across y=1398 from x=2000 to 2750
Write-Host "Row y=1398:"
for ($x = 2200; $x -le 2750; $x += 25) {
  $c = $bmp.GetPixel($x, 1398)
  Write-Host "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Host "`nRow y=1200:"
for ($x = 2200; $x -le 2750; $x += 25) {
  $c = $bmp.GetPixel($x, 1200)
  Write-Host "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Host "`nRow y=1000:"
for ($x = 2200; $x -le 2750; $x += 25) {
  $c = $bmp.GetPixel($x, 1000)
  Write-Host "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$bmp.Dispose()

