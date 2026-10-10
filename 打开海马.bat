@echo off
rem 海马 Hippocampus 固定入口：双击我，别双击 html 文件！
rem file:// 方式打开会导致配置丢失（浏览器按地址分家存数据）。
cd /d %~dp0
curl -s -o nul http://localhost:8787/index.html 2>nul
if errorlevel 1 (
  echo 正在启动海马服务...
  start "海马服务" /min node serve.mjs
  timeout /t 2 /nobreak >nul
)
start "" http://localhost:8787/
echo 海马已打开。数据都在，直接用。
timeout /t 2 >nul
