Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $bmp.Width
$height = $bmp.Height

# Function to find the tube edge (where bright orange drops to dark bezel)
function Get-TubeEdge($bmp, $y) {
    # Scan from X=900 to X=940
    # In tube, R > 70 and G > 25 and B < 30 (warm amber)
    # Bezel starts where luminance drops to minimum (the dark bevel shadow)
    $minLum = 999
    $bestX = 920
    for ($x = 905; $x -le 935; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
        if ($lum -lt $minLum) {
            $minLum = $lum
            $bestX = $x
        }
    }
    return $bestX
}

# Map tube edge for Y=370 to Y=530
$edges = @{}
for ($y = 370; $y -le 530; $y++) {
    $edges[$y] = Get-TubeEdge $bmp $y
}

# Inpaint watermark star using exact edge-relative sampling from Y=390..450
$rng = New-Object System.Random(42)

for ($y = 462; $y -le 524; $y++) {
    $edgeTarget = $edges[$y]
    $ySrc = $y - 72
    $edgeSrc = $edges[$ySrc]

    # Star spans from edgeTarget to edgeTarget + 42
    for ($dx = 1; $dx -le 44; $dx++) {
        $x = $edgeTarget + $dx
        $xSrc = $edgeSrc + $dx

        if ($x -lt $width -and $xSrc -lt $width) {
            $cSrc = $bmp.GetPixel($xSrc, $ySrc)
            
            # Vertical blend factor for smooth transitions at top and bottom of patch
            $alpha = 1.0
            if ($y -lt 468) {
                $alpha = ($y - 462) / 6.0
            } elseif ($y -gt 518) {
                $alpha = (524 - $y) / 6.0
            }
            if ($dx -gt 38) {
                $alpha = $alpha * ((44 - $dx) / 6.0)
            }

            if ($alpha -gt 0.05) {
                $cOrig = $bmp.GetPixel($x, $y)
                # Subtle grain
                $noise = [int]($rng.Next(-1, 2))
                $r = [int]($cOrig.R * (1 - $alpha) + ($cSrc.R + $noise) * $alpha)
                $g = [int]($cOrig.G * (1 - $alpha) + ($cSrc.G + $noise) * $alpha)
                $b = [int]($cOrig.B * (1 - $alpha) + ($cSrc.B + $noise) * $alpha)

                $r = [Math]::Max(0, [Math]::Min(255, $r))
                $g = [Math]::Max(0, [Math]::Min(255, $g))
                $b = [Math]::Max(0, [Math]::Min(255, $b))

                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $g, $b))
            }
        }
    }
}

# Save clean plate
$destPath = "d:\Projects\SenseHack\public\crt-master-clean.jpg"
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]98)
$bmp.Save($destPath, $encoder, $encoderParams)

# Also save a test crop of bottom-right
$crop = New-Object System.Drawing.Bitmap(240, 180)
$g = [System.Drawing.Graphics]::FromImage($crop)
$srcRect = New-Object System.Drawing.Rectangle(784, 392, 240, 180)
$destRect = New-Object System.Drawing.Rectangle(0, 0, 240, 180)
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("d:\Projects\SenseHack\test-clean-crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()

$bmp.Dispose()
Write-Host "Inpainting complete and saved test-clean-crop.png"

