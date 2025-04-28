import { Storage } from "@plasmohq/storage";

// 存储键
const SUMMARY_CACHE_KEY = "summary_cache";
const NOTES_CACHE_KEY = "notes_cache";

// 缓存条目的类型定义
interface CacheEntry {
  content: string;
  timestamp: number;
}

// 缓存对象的类型定义
interface Cache {
  [videoId: string]: CacheEntry;
}

// 缓存过期时间 (24小时，单位：毫秒)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// 初始化存储实例
const storage = new Storage();

/**
 * 保存视频摘要到缓存
 */
export const saveSummaryToCache = async (
  videoId: string,
  summary: string
): Promise<void> => {
  try {
    // 获取现有缓存
    const currentCache = await getSummaryCache();

    // 更新缓存
    const updatedCache: Cache = {
      ...currentCache,
      [videoId]: {
        content: summary,
        timestamp: Date.now()
      }
    };

    // 保存更新后的缓存
    await storage.set(SUMMARY_CACHE_KEY, updatedCache);
  } catch (error) {
    console.error("保存摘要到缓存时出错:", error);
  }
};

/**
 * 从缓存获取视频摘要
 */
export const getSummaryFromCache = async (
  videoId: string
): Promise<string | null> => {
  try {
    const cache = await getSummaryCache();
    const cacheEntry = cache[videoId];

    // 检查缓存是否存在且未过期
    if (
      cacheEntry &&
      Date.now() - cacheEntry.timestamp < CACHE_EXPIRATION
    ) {
      return cacheEntry.content;
    }

    return null;
  } catch (error) {
    console.error("从缓存获取摘要时出错:", error);
    return null;
  }
};

/**
 * 保存视频笔记到缓存
 */
export const saveNotesToCache = async (
  videoId: string,
  notes: string
): Promise<void> => {
  try {
    // 获取现有缓存
    const currentCache = await getNotesCache();

    // 更新缓存
    const updatedCache: Cache = {
      ...currentCache,
      [videoId]: {
        content: notes,
        timestamp: Date.now()
      }
    };

    // 保存更新后的缓存
    await storage.set(NOTES_CACHE_KEY, updatedCache);
  } catch (error) {
    console.error("保存笔记到缓存时出错:", error);
  }
};

/**
 * 从缓存获取视频笔记
 */
export const getNotesFromCache = async (
  videoId: string
): Promise<string | null> => {
  try {
    const cache = await getNotesCache();
    const cacheEntry = cache[videoId];

    // 检查缓存是否存在且未过期
    if (
      cacheEntry &&
      Date.now() - cacheEntry.timestamp < CACHE_EXPIRATION
    ) {
      return cacheEntry.content;
    }

    return null;
  } catch (error) {
    console.error("从缓存获取笔记时出错:", error);
    return null;
  }
};

// 辅助函数：获取摘要缓存
const getSummaryCache = async (): Promise<Cache> => {
  const cache = await storage.get<Cache>(SUMMARY_CACHE_KEY);
  return cache || {};
};

// 辅助函数：获取笔记缓存
const getNotesCache = async (): Promise<Cache> => {
  const cache = await storage.get<Cache>(NOTES_CACHE_KEY);
  return cache || {};
};