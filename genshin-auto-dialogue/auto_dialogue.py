"""
原神自动对话工具
检测屏幕左下角对话按钮，自动模拟 Xbox A 键推进对话。
每 250ms 检测一次，按 ESC 暂停/继续。
"""

import ctypes
import ctypes.wintypes as wt
import sys
import time
import winsound
import numpy as np
from pathlib import Path

user32 = ctypes.windll.user32
gdi32 = ctypes.windll.gdi32
kernel32 = ctypes.windll.kernel32

# ── 按钮区域（2560x1440） ──────────────────────────────────────────────
BTN_X, BTN_Y, BTN_W, BTN_H = 293, 1329, 28, 28
REF_PATH = Path(__file__).parent / "ref.png"
TARGET_PROCESS = "yuanshen.exe"
PROCESS_QUERY_LIMITED_INFORMATION = 0x1000

# ── Windows 结构（仅用于屏幕截取） ─────────────────────────────────────

class BITMAPINFOHEADER(ctypes.Structure):
    _fields_ = [
        ("biSize", ctypes.c_uint32), ("biWidth", ctypes.c_long),
        ("biHeight", ctypes.c_long), ("biPlanes", ctypes.c_uint16),
        ("biBitCount", ctypes.c_uint16), ("biCompression", ctypes.c_uint32),
        ("biSizeImage", ctypes.c_uint32), ("biXPelsPerMeter", ctypes.c_long),
        ("biYPelsPerMeter", ctypes.c_long), ("biClrUsed", ctypes.c_uint32),
        ("biClrImportant", ctypes.c_uint32),
    ]

class BITMAPINFO(ctypes.Structure):
    _fields_ = [("bmiHeader", BITMAPINFOHEADER)]

user32.GetForegroundWindow.restype = wt.HWND
user32.GetWindowThreadProcessId.argtypes = [wt.HWND, ctypes.POINTER(wt.DWORD)]
user32.GetWindowThreadProcessId.restype = wt.DWORD
kernel32.OpenProcess.argtypes = [wt.DWORD, wt.BOOL, wt.DWORD]
kernel32.OpenProcess.restype = wt.HANDLE
kernel32.QueryFullProcessImageNameW.argtypes = [wt.HANDLE, wt.DWORD, wt.LPWSTR, ctypes.POINTER(wt.DWORD)]
kernel32.QueryFullProcessImageNameW.restype = wt.BOOL
kernel32.CloseHandle.argtypes = [wt.HANDLE]
kernel32.CloseHandle.restype = wt.BOOL


def get_foreground_process_name():
    hwnd = user32.GetForegroundWindow()
    if not hwnd:
        return ""

    pid = wt.DWORD(0)
    user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
    if pid.value == 0:
        return ""

    h_process = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid.value)
    if not h_process:
        return ""

    try:
        size = wt.DWORD(1024)
        buf = ctypes.create_unicode_buffer(size.value)
        ok = kernel32.QueryFullProcessImageNameW(h_process, 0, buf, ctypes.byref(size))
        if not ok:
            return ""
        return Path(buf.value).name.lower()
    finally:
        kernel32.CloseHandle(h_process)

# ── 截取屏幕区域 ────────────────────────────────────────────────────────

def grab(x, y, w, h):
    hScr = user32.GetDC(0)
    hMem = gdi32.CreateCompatibleDC(hScr)
    hBmp = gdi32.CreateCompatibleBitmap(hScr, w, h)
    gdi32.SelectObject(hMem, hBmp)
    gdi32.BitBlt(hMem, 0, 0, w, h, hScr, x, y, 0x00CC0020)
    bi = BITMAPINFO()
    bi.bmiHeader.biSize = ctypes.sizeof(BITMAPINFOHEADER)
    bi.bmiHeader.biWidth = w
    bi.bmiHeader.biHeight = -h
    bi.bmiHeader.biPlanes = 1
    bi.bmiHeader.biBitCount = 32
    buf = (ctypes.c_ubyte * (w * h * 4))()
    gdi32.GetDIBits(hMem, hBmp, 0, h, buf, ctypes.byref(bi), 0)
    gdi32.DeleteObject(hBmp)
    gdi32.DeleteDC(hMem)
    user32.ReleaseDC(0, hScr)
    return np.frombuffer(buf, dtype=np.uint8).reshape(h, w, 4)[:, :, :3].copy()

# ── Xbox 手柄 A 键模拟（vgamepad） ──────────────────────────────────────

import vgamepad as vg

_pad = None

def get_pad():
    global _pad
    if _pad is None:
        _pad = vg.VX360Gamepad()
        time.sleep(0.5)
    return _pad

def press_a():
    pad = get_pad()
    pad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_A)
    pad.update()
    time.sleep(0.1)
    pad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_A)
    pad.update()

# ── 模板加载 ─────────────────────────────────────────────────────────────

def load_ref():
    from PIL import Image
    img = np.array(Image.open(REF_PATH))[:, :, :3]
    return np.mean(img.astype(np.float64), axis=2)

# ── NCC ──────────────────────────────────────────────────────────────────

def ncc(a, b):
    a = a.ravel().astype(np.float64)
    b = b.ravel().astype(np.float64)
    a -= a.mean()
    b -= b.mean()
    na, nb = np.sqrt((a*a).sum()), np.sqrt((b*b).sum())
    if na < 1 or nb < 1:
        return 0.0
    return float((a * b).sum() / (na * nb))

# ── 主程序 ───────────────────────────────────────────────────────────────

def main():
    user32.SetProcessDPIAware()

    if "--capture" in sys.argv:
        print("3 秒后截取屏幕...")
        for i in range(3, 0, -1):
            print(f"{i}...")
            time.sleep(1)
        sw, sh = user32.GetSystemMetrics(0), user32.GetSystemMetrics(1)
        full = grab(0, 0, sw, sh)
        from PIL import Image
        Image.fromarray(full[:,:,::-1]).save("capture.png")
        print(f"已保存 capture.png ({sw}x{sh})")
        return

    ref = load_ref()
    pad = get_pad()
    print("=" * 40)
    print("  原神自动对话工具")
    print("=" * 40)
    print(f"检测区域: ({BTN_X},{BTN_Y}) {BTN_W}x{BTN_H}")
    print(f"目标窗口进程: {TARGET_PROCESS}")
    print("虚拟 Xbox 手柄已创建")
    print("间隔: 250ms | ESC 暂停/继续")
    print("-" * 40)

    count = 0
    last = 0.0
    paused = False
    esc_held = False

    winsound.Beep(800, 200)

    while True:
        esc_now = bool(user32.GetAsyncKeyState(0x1B) & 0x8000)
        if esc_now and not esc_held:
            paused = not paused
            if paused:
                winsound.Beep(400, 300)
                print(f"\r⏸ 已暂停 | 按键: {count}              ", end="", flush=True)
            else:
                winsound.Beep(800, 200)
                print(f"\r▶ 已继续                              ", end="", flush=True)
        esc_held = esc_now

        if paused:
            time.sleep(0.1)
            continue

        ts = time.strftime('%H:%M:%S')
        fg_process = get_foreground_process_name()
        if fg_process != TARGET_PROCESS:
            print(f"\r[{ts}] 当前前台: {fg_process or 'N/A'} | 等待 {TARGET_PROCESS} | 按键: {count}   ", end="", flush=True)
            time.sleep(0.25)
            continue

        patch = grab(BTN_X, BTN_Y, BTN_W, BTN_H)
        score = ncc(ref, np.mean(patch, axis=2))

        now = time.time()
        if score > 0.85 and now - last >= 0.5:
            press_a()
            last = now
            count += 1

        print(f"\r[{ts}] 匹配度: {score:.3f} | 按键: {count}   ", end="", flush=True)

        time.sleep(0.25)

if __name__ == "__main__":
    main()
