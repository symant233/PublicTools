# 原神自动对话工具

检测屏幕左下角对话按钮，自动模拟 Xbox 手柄 A 键推进对话。

## 依赖

```
pip install numpy Pillow vgamepad
```

> `vgamepad` 需要 [ViGEm Bus Driver](https://github.com/nefarius/ViGEmBus/releases)。

## 使用

```
python auto_dialogue.py
```

- 启动后每 250ms 截取屏幕固定区域（28×28），与 `ref.png` 模板做 NCC 匹配
- 匹配度 > 0.85 时模拟 Xbox A 键
- 按 **ESC** 暂停/继续（有声音提示）
- 适用于 2560×1440 分辨率

## 校准

如果按钮位置不对，修改 `auto_dialogue.py` 中的坐标常量：

```python
BTN_X, BTN_Y, BTN_W, BTN_H = 293, 1329, 28, 28
```

用 `--capture` 截取当前屏幕查看坐标：

```
python auto_dialogue.py --capture
```

然后重新截取 `ref.png`。
