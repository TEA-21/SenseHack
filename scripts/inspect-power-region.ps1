Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

Write-Host "Inspecting power switch at X=2374, Y=1274:"
for ($y = 1250; $y -le 1300; $y += 5) {
  $c = $bmp.GetPixel(2374, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

Write-Host "`nInspecting between volume knob (588) and speaker louvres:"
for ($y = 650; $y -le 850; $y += 20) {
  $c = $bmp.GetPixel(2326, $y)
  Write-Host "Y=$y : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

