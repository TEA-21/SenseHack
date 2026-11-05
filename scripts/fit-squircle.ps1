Add-Type -AssemblyName System.Drawing

$vx = 180.0
$vy = 160.0
$vw = 1520.0
$vh = 1114.0

$bmp = [System.Drawing.Bitmap]::FromFile("d:\Projects\SenseHack\public\crt-full-tight.png")
$testImg = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($testImg)
$g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

function ToP($nx, $ny) {
    return New-Object System.Drawing.PointF(($vx + $nx * $vw), ($vy + $ny * $vh))
}

$path = New-Object System.Drawing.Drawing2D.GraphicsPath

# 1. Top Edge
$path.AddBezier((ToP 0.22 0.012), (ToP 0.38 0.000), (ToP 0.62 0.000), (ToP 0.78 0.012))
# 2. Top-Right Corner
$path.AddBezier((ToP 0.78 0.012), (ToP 0.930 0.012), (ToP 0.990 0.070), (ToP 0.990 0.220))
# 3. Right Edge
$path.AddBezier((ToP 0.990 0.220), (ToP 1.000 0.350), (ToP 1.000 0.630), (ToP 0.990 0.760))
# 4. Bottom-Right Corner
$path.AddBezier((ToP 0.990 0.760), (ToP 0.990 0.910), (ToP 0.930 0.988), (ToP 0.780 0.988))
# 5. Bottom Edge
$path.AddBezier((ToP 0.780 0.988), (ToP 0.620 1.000), (ToP 0.380 1.000), (ToP 0.220 0.988))
# 6. Bottom-Left Corner
$path.AddBezier((ToP 0.220 0.988), (ToP 0.070 0.988), (ToP 0.010 0.910), (ToP 0.010 0.760))
# 7. Left Edge
$path.AddBezier((ToP 0.010 0.760), (ToP 0.000 0.630), (ToP 0.000 0.350), (ToP 0.010 0.220))
# 8. Top-Left Corner
$path.AddBezier((ToP 0.010 0.220), (ToP 0.010 0.070), (ToP 0.070 0.012), (ToP 0.220 0.012))

$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Lime, 3)
$g.DrawPath($pen, $path)

$pen.Dispose()
$path.Dispose()
$g.Dispose()

$testImg.Save("d:\Projects\SenseHack\scripts\fit-on-photo-refined.png", [System.Drawing.Imaging.ImageFormat]::Png)
$testImg.Dispose()
$bmp.Dispose()
Write-Host "Saved fit-on-photo-refined.png"
