Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('d:\Projects\SenseHack\public\crt-master-clean.jpg')
Write-Host "Dimensions: $($bmp.Width) x $($bmp.Height)"

$yMid = 286
for ($x = 20; $x -lt 980; $x += 5) {
    $c = $bmp.GetPixel($x, $yMid)
    if ($c.R -gt 25 -or $c.G -gt 20) {
        Write-Host "Screen start X=$x RGB: $($c.R) $($c.G) $($c.B)"
        break
    }
}
for ($x = 1000; $x -gt 50; $x -= 5) {
    $c = $bmp.GetPixel($x, $yMid)
    if ($c.R -gt 25 -or $c.G -gt 20) {
        Write-Host "Screen end X=$x RGB: $($c.R) $($c.G) $($c.B)"
        break
    }
}

$xMid = 500
for ($y = 5; $y -lt 550; $y += 3) {
    $c = $bmp.GetPixel($xMid, $y)
    if ($c.R -gt 25 -or $c.G -gt 20) {
        Write-Host "Screen start Y=$y RGB: $($c.R) $($c.G) $($c.B)"
        break
    }
}
for ($y = 565; $y -gt 5; $y -= 3) {
    $c = $bmp.GetPixel($xMid, $y)
    if ($c.R -gt 25 -or $c.G -gt 20) {
        Write-Host "Screen end Y=$y RGB: $($c.R) $($c.G) $($c.B)"
        break
    }
}
$bmp.Dispose()

