Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\scripts\phosphor-mask.png")
$w = $bmp.Width
$h = $bmp.Height

# Find bounding box of green pixels (Color.FromArgb(255, 0, 255, 0))
$minX = $w; $maxX = 0; $minY = $h; $maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.G -eq 255 -and $c.R -eq 0 -and $c.B -eq 0) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Phosphor Bounding Box:"
Write-Host "X: $minX to $maxX (Width = $($maxX - $minX))"
Write-Host "Y: $minY to $maxY (Height = $($maxY - $minY))"
Write-Host ("Left %: {0:F4}%, Width %: {1:F4}%" -f ($minX / $w * 100), (($maxX - $minX) / $w * 100))
Write-Host ("Top %:  {0:F4}%, Height %: {1:F4}%" -f ($minY / $h * 100), (($maxY - $minY) / $h * 100))

$bmp.Dispose()

