// ============================================================
// 差分検知（added / updated / removed / title_changed / category_changed）
// 既存DBページ vs 今回クロール結果 を突き合わせる純関数。
// ============================================================

import type { OfficialPage } from '../types';

/** 今回クロールで得た保存対象ページ（C以上）の中間表現 */
export interface IncomingPage {
  id: string;
  url: string;
  title: string;
  categoryId: string | null;
  priority: string;
  contentHash: string;
}

export interface ChangeRecord {
  officialPageId: string | null;
  changeType: 'added' | 'updated' | 'removed' | 'title_changed' | 'category_changed';
  previousHash: string | null;
  currentHash: string | null;
  titleSnapshot: string | null;
  officialUrlSnapshot: string | null;
  prioritySnapshot: string | null;
}

/**
 * @param existing 既存 official_pages（URLキー）
 * @param incoming 今回の保存対象ページ
 */
export function detectChanges(existing: OfficialPage[], incoming: IncomingPage[]): ChangeRecord[] {
  const changes: ChangeRecord[] = [];
  const exByUrl = new Map(existing.map((p) => [p.official_url, p]));
  const inByUrl = new Map(incoming.map((p) => [p.url, p]));

  for (const inp of incoming) {
    const prev = exByUrl.get(inp.url);
    if (!prev) {
      changes.push({
        officialPageId: inp.id,
        changeType: 'added',
        previousHash: null,
        currentHash: inp.contentHash,
        titleSnapshot: inp.title,
        officialUrlSnapshot: inp.url,
        prioritySnapshot: inp.priority,
      });
      continue;
    }
    if (prev.content_hash !== inp.contentHash) {
      changes.push(mk(inp, 'updated', prev.content_hash));
    }
    if ((prev.title || '') !== inp.title) {
      changes.push(mk(inp, 'title_changed', prev.content_hash));
    }
    if ((prev.category || null) !== inp.categoryId) {
      changes.push(mk(inp, 'category_changed', prev.content_hash));
    }
  }

  // removed: 既存にあるが今回見つからなかった（D化・削除）
  for (const prev of existing) {
    if (!inByUrl.has(prev.official_url)) {
      changes.push({
        officialPageId: prev.id,
        changeType: 'removed',
        previousHash: prev.content_hash,
        currentHash: null,
        titleSnapshot: prev.title,
        officialUrlSnapshot: prev.official_url,
        prioritySnapshot: prev.priority,
      });
    }
  }

  return changes;
}

function mk(inp: IncomingPage, type: ChangeRecord['changeType'], prevHash: string | null): ChangeRecord {
  return {
    officialPageId: inp.id,
    changeType: type,
    previousHash: prevHash,
    currentHash: inp.contentHash,
    titleSnapshot: inp.title,
    officialUrlSnapshot: inp.url,
    prioritySnapshot: inp.priority,
  };
}
