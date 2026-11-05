Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$destPath = "d:\Projects\SenseHack\public\crt-master-clean.jpg"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $bmp.Width
$height = $bmp.Height

Write-Host "Loaded image: $width x $height"

# 1. Map inner seam groove X_seam(y) by locating minimum luminance groove
$seamMap = @{}
for ($y = 360; $y -lt 550; $y++) {
    $minLum = 999
    $bestX = 920
    for ($x = 905; $x -le 945; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = [int](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
        if ($lum -lt $minLum) {
            $minLum = $lum
            $bestX = $x
        }
    }
    $seamMap[$y] = $bestX
}

# 2. Inpaint entire watermark star region [470, 515]
$rng = New-Object System.Random(42)
$patchedCount = 0

for ($y = 470; $y -le 512; $y++) {
    $xSeamTarget = $seamMap[$y]
    # Clean source band [390, 430]
    $ySrc = 392 + (($y - 470) % 36)
    $xSeamSrc = $seamMap[$ySrc]

    for ($x = ($xSeamTarget + 1); $x -le 954; $x++) {
        $cOrig = $bmp.GetPixel($x, $y)
        
        # Clean bezel has R <= 46, G <= 40, B <= 36
        # Any pixel in this diamond zone brighter than background plastic is watermark
        $isStar = ($cOrig.R -gt 48 -or $cOrig.G -gt 42 -or $cOrig.B -gt 38)

        if ($isStar) {
            $dx = $x - $xSeamTarget
            $xSrc = $xSeamSrc + $dx

            if ($xSrc -lt ($xSeamSrc + 1)) { $xSrc = $xSeamSrc + 1 }
            if ($xSrc -ge $width) { $xSrc = $width - 1 }

            $cSrc = $bmp.GetPixel($xSrc, $ySrc)

            # Micro-noise matching matte plastic grain
            $noise = [int]($rng.Next(-2, 3))
            $r = [Math]::Max(0, [Math]::Min(255, $cSrc.R + $noise))
            $g = [Math]::Max(0, [Math]::Min(255, $cSrc.G + $noise))
            $b = [Math]::Max(0, [Math]::Min(255, $cSrc.B + $noise))

            # Strictly ensure matte plastic values
            if ($r -gt 52) { $r = 44 + $noise }
            if ($g -gt 46) { $g = 37 + $noise }
            if ($b -gt 40) { $b = 31 + $noise }

            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $g, $b))
            $patchedCount++
        }
    }
}

Write-Host "Patched $patchedCount total watermark pixels including full glow contour."

# Save high quality JPEG
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]98)

$bmp.Save($destPath, $encoder, $encoderParams)
$bmp.Dispose()

Write-Host "Saved clean plate to $destPath"
