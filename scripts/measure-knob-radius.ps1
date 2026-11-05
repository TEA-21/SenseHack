Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\FullCRT.png")

# Inspect horizontal line through tuning knob center (Y=336)
Write-Host "Horizontal profile of Tuning knob (Y=336):"
for ($x = 2220; $x -le 2430; $x += 5) {
  $c = $bmp.GetPixel($x, 336)
  Write-Host "X=$x : ($($c.R), $($c.G), $($c.B))"
}

$bmp.Dispose()

