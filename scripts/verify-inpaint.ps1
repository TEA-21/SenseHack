Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-clean.png")

Write-Host "Checking center (2646, 1398):"
for ($y = 1380; $y -le 1420; $y += 5) {
  $c = $bmp.GetPixel(2646, $y)
  Write-Host "Y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$bmp.Dispose()

