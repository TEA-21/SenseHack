Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-tight.png")

Write-Host "crt-full-tight.png size: $($bmp.Width) x $($bmp.Height)"

# In crt-full-tight.png:
# Let's inspect the horizontal center line Y = 710 (exact vertical center of 1420)
Write-Host "`nHorizontal slice at Y=710:"
# Left edge: scan X from 150 to 250
for ($x = 180; $x -le 230; $x += 5) {
  $c = $bmp.GetPixel($x, 710)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}
# Right edge: scan X from 1650 to 1750
for ($x = 1660; $x -le 1710; $x += 5) {
  $c = $bmp.GetPixel($x, 710)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

# Vertical center line: X = 940 (center of tube: (198 + 1685)/2 = 941.5)
Write-Host "`nVertical slice at X=942:"
# Top edge: scan Y from 120 to 200
for ($y = 150; $y -le 195; $y += 5) {
  $c = $bmp.GetPixel(942, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}
# Bottom edge: scan Y from 1300 to 1350
for ($y = 1305; $y -le 1345; $y += 5) {
  $c = $bmp.GetPixel(942, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

