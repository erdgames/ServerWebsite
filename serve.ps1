# Einfacher HTTP-Server für die Website
# Nutzt das Verzeichnis, in dem dieses Skript liegt – dadurch ist der Ordner
# beliebig verschiebbar (andere Geräte, Benutzer, Laufwerke usw.)
$port = 8080
$root = $PSScriptRoot

$listener = [System.Net.HttpListener]::new()
# Auf allen Netzwerk-Interfaces lauschen, damit auch andere Geräte
# (z.B. Handy im WLAN) auf die Website zugreifen können
$listener.Prefixes.Add("http://*:$port/")
$listener.Start()
Write-Host "Server läuft auf http://localhost:$port/"
Write-Host "Im WLAN erreichbar unter: http://$((Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1).IPAddress):$port/"
Write-Host "Zum Beenden: Strg+C"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }

    # API-Endpoint: Alle MP3-Dateien im audio/-Ordner als JSON auflisten
    # Dadurch werden alle vorhandenen (und zukünftigen) MP3s automatisch im Player angezeigt
    if ($path -eq "/api/tracks") {
        $audioDir = Join-Path $root "audio"
        $mp3Files = Get-ChildItem -Path $audioDir -Filter "*.mp3" -File | Sort-Object Name
        $tracks = @($mp3Files | ForEach-Object {
            $title = [System.IO.Path]::GetFileNameWithoutExtension($_.Name) -replace '^\d+\s*', ''
            [PSCustomObject]@{
                file  = "audio/$($_.Name)"
                title = $title
            }
        })
        $json = $tracks | ConvertTo-Json -Compress
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        $response.ContentType = "application/json; charset=utf-8"
        $response.StatusCode = 200
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.Close()
        continue
    }

    $filePath = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))
    
    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        $contentType = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".mp3"  { "audio/mpeg" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".ico"  { "image/x-icon" }
            ".txt"  { "text/plain; charset=utf-8" }
            default { "application/octet-stream" }
        }
        $response.ContentType = $contentType
        $response.StatusCode = 200
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Datei nicht gefunden")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.Close()
}