Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

# Center: X=1376, Y=768
# Let's find outer left edge of TV cabinet around Y=768:
Write-Host "Horizontal scan for TV cabinet outer left edge (Y=768):"
for ($x = 400; $x -le 600; $x += 10) {
  $c = $bmp.GetPixel($x, 768)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

# Outer right edge of TV cabinet around Y=768:
Write-Host "`nHorizontal scan for TV cabinet outer right edge (Y=768):"
for ($x = 2400; $x -le 2550; $x += 10) {
  $c = $bmp.GetPixel($x, 768)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

# Outer top edge of TV cabinet around X=1376:
Write-Host "`nVertical scan for TV cabinet outer top edge (X=1376):"
for ($y = 80; $y -le 200; $y += 10) {
  $c = $bmp.GetPixel(1376, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

# Outer bottom edge of TV cabinet around X=1376:
Write-Host "`nVertical scan for TV cabinet outer bottom edge (X=1376):"
for ($y = 1350; $y -le 1480; $y += 10) {
  $c = $bmp.GetPixel(1376, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

