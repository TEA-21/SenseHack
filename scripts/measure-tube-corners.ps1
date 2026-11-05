Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

# Center: X = 1376, Y = 768
# Left edge: X = 638 (0.2318)
# Right edge: X = 2125 (0.7721)
# Top edge: Y = 202 (0.1315)
# Bottom edge: Y = 1355 (0.8821)

# Let's inspect the corner diagonals to find where the squircle curves inward at corners:
# Top-left corner around X in [680, 800], Y in [230, 350]
Write-Host "Top-Left diagonal (X=Y*2):"
for ($y = 230; $y -le 350; $y += 20) {
  $x = [Math]::Round($y * 2.5)
  $c = $bmp.GetPixel($x, $y)
  Write-Host "X=$x, Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

