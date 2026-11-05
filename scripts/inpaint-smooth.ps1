Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $bmp.Width
$height = $bmp.Height

# Step 1: Seam contour tracking
$rawSeam = @{}
for ($y = 380; $y -le 530; $y++) {
    $minLum = 999
    $bestX = 925
    for ($x = 916; $x -le 934; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
        if ($lum -lt $minLum) {
            $minLum = $lum
            $bestX = $x
        }
    }
    $rawSeam[$y] = $bestX
}

# Step 2: 7-point moving average smoothing
$smoothSeam = @{}
for ($y = 385; $y -le 525; $y++) {
    $sum = 0
    for ($dy = -3; $dy -le 3; $dy++) {
        $sum += $rawSeam[$y + $dy]
    }
    $smoothSeam[$y] = [int][Math]::Round($sum / 7.0)
}

# Step 3: Exact spectral watermark detection
$rng = New-Object System.Random(42)
$patched = 0

for ($y = 460; $y -le 524; $y++) {
    $xSeamTarget = $smoothSeam[$y]
    $ySrc = $y - 65
    $xSeamSrc = $smoothSeam[$ySrc]

    for ($dx = -6; $dx -le 38; $dx++) {
        $x = $xSeamTarget + $dx
        $xSrc = $xSeamSrc + $dx

        if ($x -ge 918 -and $x -lt $width -and $xSrc -ge 918 -and $xSrc -lt $width) {
            $cOrig = $bmp.GetPixel($x, $y)
            
            $isNeutralGrey = ([Math]::Abs($cOrig.R - $cOrig.B) -lt 38 -and [Math]::Abs($cOrig.R - $cOrig.G) -lt 25)
            $isBrighterThanBezel = ($cOrig.R -gt 42 -and $cOrig.G -gt 36)

            if ($isNeutralGrey -and $isBrighterThanBezel) {
                $cSrc = $bmp.GetPixel($xSrc, $ySrc)

                $noise = [int]($rng.Next(-1, 2))
                $targetR = [Math]::Max(0, [Math]::Min(255, $cSrc.R + $noise))
                $targetG = [Math]::Max(0, [Math]::Min(255, $cSrc.G + $noise))
                $targetB = [Math]::Max(0, [Math]::Min(255, $cSrc.B + $noise))

                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($targetR, $targetG, $targetB))
                $patched++
            }
        }
    }
}

Write-Host "Patched $patched spectral watermark pixels with authentic natural tone."

# Save clean plate
$destPath = "d:\Projects\SenseHack\public\crt-master-clean.jpg"
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]98)
$bmp.Save($destPath, $encoder, $encoderParams)

# Save test crop
$crop = New-Object System.Drawing.Bitmap(240, 180)
$g = [System.Drawing.Graphics]::FromImage($crop)
$srcRect = New-Object System.Drawing.Rectangle(784, 392, 240, 180)
$destRect = New-Object System.Drawing.Rectangle(0, 0, 240, 180)
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("d:\Projects\SenseHack\test-clean-crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()

$bmp.Dispose()
Write-Host "Saved test-clean-crop.png"
