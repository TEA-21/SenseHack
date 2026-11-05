Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

Write-Host "Image Size: $($bmp.Width) x $($bmp.Height)"

# User indicated tube is roughly X in [0.228, 0.772], Y in [0.118, 0.888]
# In 2752 x 1536:
# X: 0.228 * 2752 = 627, 0.772 * 2752 = 2124
# Y: 0.118 * 1536 = 181, 0.888 * 1536 = 1364

# Let's inspect horizontal center row Y = 768:
Write-Host "`nHorizontal center line Y = 768:"
for ($x = 550; $x -le 680; $x += 10) {
  $c = $bmp.GetPixel($x, 768)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}
Write-Host "Right edge around X=2100..2200:"
for ($x = 2050; $x -le 2180; $x += 10) {
  $c = $bmp.GetPixel($x, 768)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

# Vertical center line X = 1376:
Write-Host "`nVertical center line X = 1376:"
for ($y = 120; $y -le 250; $y += 10) {
  $c = $bmp.GetPixel(1376, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}
for ($y = 1300; $y -le 1420; $y += 10) {
  $c = $bmp.GetPixel(1376, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

