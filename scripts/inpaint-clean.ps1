Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity\brain\62fae0a2-57b2-41b2-8c76-8d29cba083c3\.user_uploaded\media_1793815279630_7d6e85ba.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $bmp.Width
$height = $bmp.Height

$rng = New-Object System.Random(42)

for ($y = 470; $y -le 516; $y++) {
    $ySrc = $y - 70

    for ($x = 926; $x -le 952; $x++) {
        $cOrig = $bmp.GetPixel($x, $y)
        
        # In this zone, watermark star pixels have R > 45 and G > 35
        # The surrounding plastic is R~38-44, G~32-38, B~27-32
        $isStar = ($cOrig.R -gt 45 -and $cOrig.G -gt 35)

        if ($isStar) {
            # Source X is in pristine matte plastic band [938, 964]
            $xSrc = 938 + ($x - 926)
            if ($xSrc -ge $width) { $xSrc = $width - 1 }

            $cSrc = $bmp.GetPixel($xSrc, $ySrc)

            # Micro grain noise matching matte plastic
            $noise = [int]($rng.Next(-2, 3))
            $r = [Math]::Max(0, [Math]::Min(255, $cSrc.R + $noise))
            $g = [Math]::Max(0, [Math]::Min(255, $cSrc.G + $noise))
            $b = [Math]::Max(0, [Math]::Min(255, $cSrc.B + $noise))

            # Clamp to authentic matte plastic tone
            if ($r -gt 50) { $r = 43 + $noise }
            if ($g -gt 44) { $g = 36 + $noise }
            if ($b -gt 38) { $b = 30 + $noise }

            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($r, $g, $b))
        }
    }
}

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
Write-Host "Inpainting complete and saved test-clean-crop.png"

