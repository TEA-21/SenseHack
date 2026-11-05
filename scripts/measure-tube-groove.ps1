Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\public\crt-full-tight.png")

# Image: 2130 x 1420
# Let's find for each Y from 180 to 1300 the left and right edge of the glass tube.
# The glass tube has amber phosphor or dark groove seam.
# Let's find the exact groove coordinates.
# Notice: the groove is the darkest point (local minimum in luminance) between the outer bezel and the inner phosphor.

function Find-MinX($y, $xStart, $xEnd) {
    $minLum = 999999
    $minX = $xStart
    for ($x = $xStart; $x -le $xEnd; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
        if ($lum -lt $minLum) {
            $minLum = $lum
            $minX = $x
        }
    }
    return $minX
}

function Find-MinY($x, $yStart, $yEnd) {
    $minLum = 999999
    $minY = $yStart
    for ($y = $yStart; $y -le $yEnd; $y++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
        if ($lum -lt $minLum) {
            $minLum = $lum
            $minY = $y
        }
    }
    return $minY
}

Write-Host "--- TUBE CONTOUR MEASUREMENTS (Local Minima Groove) ---"
$yPoints = @(190, 220, 260, 320, 400, 500, 600, 710, 800, 900, 1000, 1100, 1180, 1240, 1280)
foreach ($y in $yPoints) {
    $left = Find-MinX $y 180 260
    $right = Find-MinX $y 1620 1700
    Write-Host ("Y={0,4} : Left X={1,4}, Right X={2,4}" -f $y, $left, $right)
}

Write-Host "`n--- TOP & BOTTOM CONTOURS ---"
$xPoints = @(250, 350, 500, 700, 942, 1180, 1380, 1530, 1630)
foreach ($x in $xPoints) {
    $top = Find-MinY $x 170 260
    $bottom = Find-MinY $x 1240 1330
    Write-Host ("X={0,4} : Top Y={1,4}, Bottom Y={2,4}" -f $x, $top, $bottom)
}

$bmp.Dispose()

