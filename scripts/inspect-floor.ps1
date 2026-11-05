Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

Write-Host "Checking background at X=2100, 2200, 2300, 2400, 2500 for Y in 1200..1530:"
foreach ($y in @(1250, 1300, 1350, 1400, 1450, 1500)) {
  $c2100 = $bmp.GetPixel(2100, $y)
  $c2300 = $bmp.GetPixel(2300, $y)
  $c2400 = $bmp.GetPixel(2400, $y)
  $c2500 = $bmp.GetPixel(2500, $y)
  Write-Host "Y=$y | X=2100: ($($c2100.R),$($c2100.G),$($c2100.B)) | X=2300: ($($c2300.R),$($c2300.G),$($c2300.B)) | X=2400: ($($c2400.R),$($c2400.G),$($c2400.B)) | X=2500: ($($c2500.R),$($c2500.G),$($c2500.B))"
}

$bmp.Dispose()

