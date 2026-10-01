param(
  [int]$Port = 9333,
  [int]$Width = 0,
  [int]$Height = 800,
  [int]$WaitSeconds = 9,
  [string]$MatchUrl = "localhost:8080"
)
$ErrorActionPreference = "Stop"
$pages = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json" -UseBasicParsing
$page = $pages | Where-Object { $_.type -eq "page" -and $_.url -like "*$MatchUrl*" } | Select-Object -First 1
if (-not $page) { $page = $pages | Where-Object { $_.type -eq "page" } | Select-Object -First 1 }
if (-not $page) { Write-Host "NO PAGE FOUND"; exit 1 }

$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).Wait()

function Send-Cdp([string]$Method, [hashtable]$Params, [int]$Id) {
  $payload = @{ id = $Id; method = $Method; params = $Params } | ConvertTo-Json -Depth 8 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
  $sendSeg = New-Object 'System.ArraySegment[byte]' -ArgumentList (, $bytes)
  $ws.SendAsync($sendSeg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()
}

function Receive-Cdp-Time([int]$TimeoutMs) {
  $cts = New-Object System.Threading.CancellationTokenSource
  $cts.CancelAfter($TimeoutMs)
  $buffer = New-Object byte[] 2097152
  $ms = New-Object System.IO.MemoryStream
  try {
    while ($true) {
      $task = $ws.ReceiveAsync([System.ArraySegment[byte]]::new($buffer), $cts.Token)
      $task.Wait()
      $res = $task.Result
      if ($res.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) { return $null }
      $ms.Write($buffer, 0, $res.Count)
      if ($res.EndOfMessage) { break }
    }
  } catch {
    return $null
  }
  return [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
}

# Viewport setzen (0 => Desktop)
if ($Width -gt 0) {
  Send-Cdp "Emulation.setDeviceMetricsOverride" @{ width = $Width; height = $Height; deviceScaleFactor = 1; mobile = $true } 1
} else {
  Send-Cdp "Emulation.clearDeviceMetricsOverride" @{} 1
}
$null = Receive-Cdp-Time 2000

Send-Cdp "Runtime.enable" @{} 2
$null = Receive-Cdp-Time 2000
Send-Cdp "Network.enable" @{} 3
$null = Receive-Cdp-Time 2000
Send-Cdp "Log.enable" @{} 4
$null = Receive-Cdp-Time 2000

# Seite neu laden, um alle Fehler während des Ladens zu erfassen
Send-Cdp "Page.reload" @{ ignoreCache = $true } 5

$errors = New-Object System.Collections.ArrayList
$deadline = (Get-Date).AddSeconds($WaitSeconds)
while ((Get-Date) -lt $deadline) {
  $msg = Receive-Cdp-Time 600
  if (-not $msg) { continue }
  try { $j = $msg | ConvertFrom-Json } catch { continue }
  if (-not $j.method) { continue }
  switch ($j.method) {
    "Runtime.exceptionThrown" {
      $d = $j.params.exceptionDetails
      $text = ""
      if ($d.exception -and $d.exception.description) { $text = $d.exception.description }
      else { $text = $d.text }
      [void]$errors.Add("EXCEPTION: " + $text)
    }
    "Runtime.consoleAPICalled" {
      if ($j.params.type -in @('error', 'warning')) {
        $args = @($j.params.args | ForEach-Object { $_.value })
        [void]$errors.Add("CONSOLE[" + $j.params.type.ToUpper() + "]: " + ($args -join ' '))
      }
    }
    "Log.entryAdded" {
      if ($j.params.entry.level -in @('error', 'warning')) {
        [void]$errors.Add("LOG[" + $j.params.entry.level.ToUpper() + "]: " + $j.params.entry.text)
      }
    }
    "Network.responseReceived" {
      $resp = $j.params.response
      if ($resp.status -ge 400) {
        [void]$errors.Add("HTTP " + $resp.status + ": " + $resp.url)
      }
    }
    "Network.loadingFailed" {
      if ($j.params.canceled -ne $true) {
        [void]$errors.Add("LOADFAIL: " + $j.params.errorText + " -> " + $j.params.requestId)
      }
    }
    "Network.responseReceivedExtraInfo" {
      $resp = $j.params.response
      if ($resp.status -ge 400) {
        [void]$errors.Add("HTTP-EXTRA " + $resp.status + ": " + $j.params.url)
      }
    }
  }
}

Write-Host "=== ERGEBNIS (Viewport: " + $(if ($Width -gt 0) { "Mobile ${Width}px" } else { "Desktop" }) + ") ==="
if ($errors.Count -eq 0) { Write-Host "Keine Fehler erfasst." }
else {
  $errors | Select-Object -Unique | ForEach-Object { Write-Host $_ }
}