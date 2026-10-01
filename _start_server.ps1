$p = Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','C:\Users\piesc\Pictures\NoName SMP\serve.ps1' -PassThru -WindowStyle Hidden
$p.Id | Out-File 'C:\Users\piesc\Pictures\NoName SMP\_server.pid' -Encoding ascii
