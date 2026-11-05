Add-Type -AssemblyName System.Drawing

$f1 = "d:\Projects\SenseHack\scripts\fit-on-photo-refined.png"
$f2 = "d:\Projects\SenseHack\live-ch02.png"

$b1 = [System.Drawing.Bitmap]::FromFile($f1) # 2130 x 1420
$b2 = [System.Drawing.Bitmap]::FromFile($f2) # 1360 x 907

Write-Host "b1: $($b1.Width)x$($b1.Height), b2: $($b2.Width)x$($b2.Height)"

# Rescale b2 to 2130 x 1420 and compare
$cmp = New-Object System.Drawing.Bitmap(2130, 1420)
$g = [System.Drawing.Graphics]::FromImage($cmp)
$g.DrawImage($b1, 0, 0, 2130, 1420)

# Draw semi-transparent b2 or red difference
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Red, 2)

# Check 4 corner points of snow in b2 rescaled:
# Top-Left corner: where does snow start on row Y = 250 in b1?
for ($y = 200; $y -le 350; $y += 20) {
    # Scale Y to b2
    $y2 = [int]($y * 907.0 / 1420.0)
    $minX2 = -1
    for ($x2 = 0; $x2 -lt $b2.Width; $x2++) {
        $c = $b2.GetPixel($x2, $y2)
        if ($c.R -gt 150 -and $c.G -gt 150 -and $c.B -gt 150) {
            $minX2 = $x2; break
        }
    }
    if ($minX2 -ne -1) {
        $xInB1 = [int]($minX2 * 2130.0 / 1360.0)
        # Check b1 pixel at ($xInB1, $y)
        $cB1 = $b1.GetPixel($xInB1, $y)
        Write-Host ("At Y={0,4}: Snow left edge in plate is X={1,4}. In base plate, R={2,3} G={3,3} B={4,3}" -f $y, $xInB1, $cB1.R, $cB1.G, $cB1.B)
    }
}

$b1.Dispose()
$b2.Dispose()
$cmp.Dispose()
$g.Dispose()
$pen.Dispose()

