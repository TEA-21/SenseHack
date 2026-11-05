Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

# Full image is 2752 x 1536
# Let's inspect:
# Leftmost pixel of TV cabinet:
# In find-chassis-outer, left edge was around X=470..480
# Rightmost pixel of TV cabinet / cord:
# On the right, is there a cord? At the bottom right there is a black coiled cord around X=2400..2600, Y=1200..1300!
# Let's inspect the cord and the TV chassis boundaries in detail:

# Check row Y=1250 from X=2400 to 2650 for cord:
Write-Host "Checking cord on right at Y=1250:"
for ($x = 2450; $x -le 2650; $x += 20) {
  $c = $bmp.GetPixel($x, 1250)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

# Top of cabinet: around Y=60..90
Write-Host "`nChecking top of cabinet (X=1376):"
for ($y = 50; $y -le 110; $y += 5) {
  $c = $bmp.GetPixel(1376, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

# Bottom of TV feet / contact shadow: around Y=1410..1480
Write-Host "`nChecking bottom of TV feet / shadow (X=1376):"
for ($y = 1380; $y -le 1500; $y += 10) {
  $c = $bmp.GetPixel(1376, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

