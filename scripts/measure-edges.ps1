Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

Write-Host "Top edge (Y=10):"
for ($x = 100; $x -le 2600; $x += 400) {
  $c = $bmp.GetPixel($x, 10)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

Write-Host "`nBottom edge (Y=1520):"
for ($x = 100; $x -le 2600; $x += 400) {
  $c = $bmp.GetPixel($x, 1520)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

Write-Host "`nLeft edge (X=10):"
for ($y = 100; $y -le 1400; $y += 300) {
  $c = $bmp.GetPixel(10, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

Write-Host "`nRight edge (X=2740):"
for ($y = 100; $y -le 1400; $y += 300) {
  $c = $bmp.GetPixel(2740, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

