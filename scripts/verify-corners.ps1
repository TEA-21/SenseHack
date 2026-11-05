Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

Write-Host "Top-Right corner diagonal:"
for ($x = 2020; $x -le 2100; $x += 10) {
  $c = $bmp.GetPixel($x, 275)
  Write-Host "X=$x, Y=275 : ($($c.R), $($c.G), $($c.B))"
}

Write-Host "`nBottom-Left corner diagonal:"
for ($x = 650; $x -le 720; $x += 10) {
  $c = $bmp.GetPixel($x, 1260)
  Write-Host "X=$x, Y=1260 : ($($c.R), $($c.G), $($c.B))"
}

Write-Host "`nBottom-Right corner diagonal:"
for ($x = 2020; $x -le 2100; $x += 10) {
  $c = $bmp.GetPixel($x, 1260)
  Write-Host "X=$x, Y=1260 : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

