Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\verify-ch02.png")
Write-Host "verify-ch02 (SMPTE) size: $($bmp.Width) x $($bmp.Height)"

# In verify-ch02.png, let's find the left and right edge of the color bars at Y = 300
$testY = 300
$minX = -1; $maxX = -1
for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $testY)
    # Yellow bar: R > 150, G > 150, B < 50; Grey bar: R=G=B > 150; Blue bar: B > 150
    $isColorBar = ($c.R -gt 100 -or $c.G -gt 100 -or $c.B -gt 100) -and -not ($c.R -lt 40 -and $c.G -lt 40 -and $c.B -lt 40)
    if ($isColorBar -and $x -gt 50 -and $x -lt 1150) {
        if ($minX -eq -1) { $minX = $x }
        $maxX = $x
    }
}
Write-Host ("SMPTE X span at Y={0}: {1} to {2} (Width={3}, Left%={4:F2}%, Right%={5:F2}%)" -f $testY, $minX, $maxX, ($maxX - $minX), ($minX / $bmp.Width * 100), ($maxX / $bmp.Width * 100))

# Bottom row of PLUGE (Y = 750)
$testY = 750
$minX = -1; $maxX = -1
for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $testY)
    $isColorBar = ($c.R -gt 80 -or $c.G -gt 80 -or $c.B -gt 80)
    if ($isColorBar -and $x -gt 50 -and $x -lt 1150) {
        if ($minX -eq -1) { $minX = $x }
        $maxX = $x
    }
}
Write-Host ("PLUGE X span at Y={0}: {1} to {2} (Width={3}, Left%={4:F2}%, Right%={5:F2}%)" -f $testY, $minX, $maxX, ($maxX - $minX), ($minX / $bmp.Width * 100), ($maxX / $bmp.Width * 100))

$bmp.Dispose()

