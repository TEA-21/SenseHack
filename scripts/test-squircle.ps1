Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-tight.png")
$w = $bmp.Width
$h = $bmp.Height

# We want to identify the exact bounding box and shape of the CRT glass tube.
# Let's inspect where the amber glow is.
$mask = New-Object System.Drawing.Bitmap($w, $h)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # In CRT tube, phosphor has amber hue: R > 40, R > B + 20, or in bright text R,G,B are high
        # But even in dark phosphor lines: R > 35, G > 18, B < 25.
        # Bezel has R < 35 or (R-B) < 15.
        $isPhosphor = ($c.R -gt 35 -and ($c.R - $c.B) -gt 15) -or ($c.R -gt 200 -and $c.G -gt 200)
        if ($isPhosphor -and $x -ge 180 -and $x -le 1720 -and $y -ge 150 -and $y -le 1320) {
            $mask.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 0, 255, 0)) # Green
        } else {
            $mask.SetPixel($x, $y, $c)
        }
    }
}

$mask.Save("d:\Projects\SenseHack\scripts\phosphor-mask.png", [System.Drawing.Imaging.ImageFormat]::Png)
$mask.Dispose()
$bmp.Dispose()
Write-Host "Saved phosphor-mask.png"
