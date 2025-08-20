import { config } from "../../package.json";

/**
 * Get preference value.
 * Wrapper of `Zotero.Prefs.get`.
 * @param key
 */
export function getPref(key: string): string | boolean | number {
  return Zotero.Prefs.get(`${config.prefsPrefix}.${key}`, true);
}

/**
 * Set preference value.
 * Wrapper of `Zotero.Prefs.set`.
 * @param key
 * @param value
 */
export function setPref(
  key: string,
  value: string | boolean | number,
): string | boolean | number {
  return Zotero.Prefs.set(`${config.prefsPrefix}.${key}`, value, true);
}

/**
 * Clear preference value.
 * Wrapper of `Zotero.Prefs.clear`.
 * @param key
 */
export function clearPref(key: string) {
  return Zotero.Prefs.clear(`${config.prefsPrefix}.${key}`, true);
}

/**
 * 根据当前平台获取正确的目录路径
 * @param baseKey 基础配置键名 (sourceDir 或 destDir)
 * @returns 对应平台的目录路径
 */
export function getPlatformSpecificDir(baseKey: 'sourceDir' | 'destDir'): string {
  const isWindows = Zotero.isWin;
  const platformKey = isWindows ? `${baseKey}Windows` : `${baseKey}Linux`;
  
  // 首先尝试获取平台特定的路径
  let platformPath = getPref(platformKey) as string;
  
  // 如果平台特定路径不存在，回退到通用路径（向后兼容）
  if (!platformPath) {
    platformPath = getPref(baseKey) as string;
  }
  
  return platformPath || '';
}

/**
 * 设置平台特定的目录路径
 * @param baseKey 基础配置键名 (sourceDir 或 destDir)
 * @param value 目录路径
 */
export function setPlatformSpecificDir(baseKey: 'sourceDir' | 'destDir', value: string): void {
  const isWindows = Zotero.isWin;
  const platformKey = isWindows ? `${baseKey}Windows` : `${baseKey}Linux`;
  
  // 设置平台特定的路径
  setPref(platformKey, value);
  
  // 同时更新通用路径以保持向后兼容
  setPref(baseKey, value);
}

/**
 * 迁移旧的目录配置到新的平台特定配置
 * 这个函数确保向后兼容性
 */
export function migrateDirectoryPreferences(): void {
  // const isWindows = Zotero.isWin;
  
  // // 迁移源目录配置
  // const oldSourceDir = getPref("sourceDir") as string;
  // const platformSourceKey = isWindows ? "sourceDirWindows" : "sourceDirLinux";
  // const platformSourceDir = getPref(platformSourceKey) as string;
  
  // if (oldSourceDir && !platformSourceDir) {
  //   setPref(platformSourceKey, oldSourceDir);
  // }
  
  // // 迁移目标目录配置
  // const oldDestDir = getPref("destDir") as string;
  // const platformDestKey = isWindows ? "destDirWindows" : "destDirLinux";
  // const platformDestDir = getPref(platformDestKey) as string;
  
  // if (oldDestDir && !platformDestDir) {
  //   setPref(platformDestKey, oldDestDir);
  // }
}
