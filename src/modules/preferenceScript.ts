import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { getPref, setPref, getPlatformSpecificDir, setPlatformSpecificDir } from "../utils/prefs";
import { listenShortcut } from "../utils/shortcut";

export async function registerPrefsScripts(_window: Window) {
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
    };
  } else {
    addon.data.prefs.window = _window;
  }
  updatePrefsUI();
  bindPrefEvents(_window);
}

async function updatePrefsUI() {
  const doc = addon.data.prefs!.window.document;
  const destSettingBox = doc.querySelector("#dest-setting") as XUL.GroupBox;
  if (getPref("attachType") == "importing") {
    destSettingBox.style.opacity = ".6";
  } else {
    destSettingBox.style.opacity = "1";
  }
}

function bindPrefEvents(_window: Window) {
  const doc = addon.data.prefs!.window.document;
  
  // 选择Windows源目录
  doc
    .querySelector("#choose-source-dir-windows")
    ?.addEventListener("command", async () => {
      let oldPath = getPref("sourceDirWindows") as string;
      try { PathUtils.normalize(oldPath) } catch { oldPath = "" }

      // @ts-ignore _window
      const fp = new _window.FilePicker();
      if (oldPath) {
        fp.displayDirectory = PathUtils.normalize(oldPath);
      }
      fp.init(window, "Select Windows Source Directory", fp.modeGetFolder);
      fp.appendFilters(fp.filterAll);
      if ((await fp.show()) != fp.returnOK) {
        return false;
      }
      const newPath = PathUtils.normalize(fp.file);
      if (newPath) {
        setPref("sourceDirWindows", newPath);
      }
    });

  // 选择Linux源目录
  doc
    .querySelector("#choose-source-dir-linux")
    ?.addEventListener("command", async () => {
      let oldPath = getPref("sourceDirLinux") as string;
      try { PathUtils.normalize(oldPath) } catch { oldPath = "" }

      // @ts-ignore _window
      const fp = new _window.FilePicker();
      if (oldPath) {
        fp.displayDirectory = PathUtils.normalize(oldPath);
      }
      fp.init(window, "Select Linux Source Directory", fp.modeGetFolder);
      fp.appendFilters(fp.filterAll);
      if ((await fp.show()) != fp.returnOK) {
        return false;
      }
      const newPath = PathUtils.normalize(fp.file);
      if (newPath) {
        setPref("sourceDirLinux", newPath);
      }
    });

  // 选择Windows目标目录
  doc
    .querySelector("#choose-dest-dir-windows")
    ?.addEventListener("command", async () => {
      let oldPath = getPref("destDirWindows") as string;
      try { PathUtils.normalize(oldPath) } catch { oldPath = "" }
      
      // @ts-ignore _window
      const fp = new _window.FilePicker();
      if (oldPath) {
        fp.displayDirectory = PathUtils.normalize(oldPath);
      }
      fp.init(window, "Select Windows Destination Directory", fp.modeGetFolder);
      fp.appendFilters(fp.filterAll);
      if ((await fp.show()) != fp.returnOK) {
        return false;
      }
      const newPath = PathUtils.normalize(fp.file);
      if (newPath) {
        setPref("destDirWindows", newPath);
      }
    });

  // 选择Linux目标目录
  doc
    .querySelector("#choose-dest-dir-linux")
    ?.addEventListener("command", async () => {
      let oldPath = getPref("destDirLinux") as string;
      try { PathUtils.normalize(oldPath) } catch { oldPath = "" }
      
      // @ts-ignore _window
      const fp = new _window.FilePicker();
      if (oldPath) {
        fp.displayDirectory = PathUtils.normalize(oldPath);
      }
      fp.init(window, "Select Linux Destination Directory", fp.modeGetFolder);
      fp.appendFilters(fp.filterAll);
      if ((await fp.show()) != fp.returnOK) {
        return false;
      }
      const newPath = PathUtils.normalize(fp.file);
      if (newPath) {
        setPref("destDirLinux", newPath);
      }
    });

  doc.querySelector("#attach-type")?.addEventListener("command", async () => {
    await updatePrefsUI();
  });

  doc
    .querySelectorAll(".shortcut")
    // @ts-ignore forEach
    .forEach((inputNode: HTMLInputElement) => {
      listenShortcut(inputNode, (shortcut: string) => {
        Zotero.Prefs.set(
          inputNode.getAttribute("preference") as string,
          shortcut,
          true,
        );
      });
    });
}
