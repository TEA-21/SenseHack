Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\verify-ch07.png")
Write-Host "verify-ch07 size: $($bmp.Width) x $($bmp.Height)"

# In verify-ch07.png, let's find the left and right edge of the snow at Y = middle
$midY = [int]($bmp.Height * 0.5)
Write-Host "Mid Y = $midY"

$minX = -1; $maxX = -1
for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $midY)
    # Snow is noisy black/white, R=G=B > 100 on white dots
    if ($c.R -gt 150 -and $c.G -gt 150 -and $c.B -gt 150) {
        if ($minX -eq -1) { $minX = $x }
        $maxX = $x
    }
}
Write-Host ("Snow X span at Y={0}: {1} to {2} (Width={3}, Left%={4:F2}%, Right%={5:F2}%)" -f $midY, $minX, $maxX, ($maxX - $minX), ($minX / $bmp.Width * 100), ($maxX / $bmp.Width * 100))

# Top and bottom at mid X
$midX = [int]($bmp.Width * 0.44)
$minY = -1; $maxY = -1
for ($y = 0; $y -lt $bmp.Height; $y++) {
    $c = $bmp.GetPixel($midX, $y)
    if ($c.R -gt 150 -and $c.G -gt 150 -and $c.B -gt 150) {
        if ($minY -eq -1) { $minY = $y }
        $maxY = $y
    }
}
Write-Host ("Snow Y span at X={0}: {1} to {2} (Height={3}, Top%={4:F2}%, Bottom%={5:F2}%)" -f $midX, $minY, $maxY, ($maxY - $minY), ($minY / $bmp.Height * 100), ($maxY / $bmp.Height * 100))

$bmp.Dispose()

