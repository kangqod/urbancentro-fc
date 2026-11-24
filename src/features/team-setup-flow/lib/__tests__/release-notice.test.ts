import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  RELEASE_NOTICE_SEEN_KEY,
  getNoticeId,
  getPendingNotice,
  readSeenNoticeId,
  syncSeenNoticeId,
  writeSeenNoticeId,
  type ReleaseNotice
} from '../release-notice'

const notice = (item: string, date = '2026.11.24'): ReleaseNotice => ({ date, items: [item] })

describe('release-notice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getPendingNotice', () => {
    it('공지가 null이면 null', () => {
      expect(getPendingNotice(null, null)).toBeNull()
    })

    it('미확인이면 공지를 반환', () => {
      const n = notice('a')
      expect(getPendingNotice(n, null)).toBe(n)
    })

    it('확인한 공지면 null', () => {
      const n = notice('a')
      expect(getPendingNotice(n, getNoticeId(n))).toBeNull()
    })

    it('같은 날이라도 내용이 바뀌면 다시 표시', () => {
      const n = notice('b')
      expect(getPendingNotice(n, getNoticeId(notice('a')))).toBe(n)
    })
  })

  describe('getNoticeId', () => {
    it('내용이 같으면 같은 id, 날짜나 항목이 다르면 다른 id', () => {
      expect(getNoticeId(notice('a'))).toBe(getNoticeId(notice('a')))
      expect(getNoticeId(notice('a'))).not.toBe(getNoticeId(notice('b')))
      expect(getNoticeId(notice('a'))).not.toBe(getNoticeId(notice('a', '2026.11.25')))
    })
  })

  describe('storage', () => {
    it('저장값이 없으면 ok:true, id:null', () => {
      expect(readSeenNoticeId()).toEqual({ ok: true, id: null })
    })

    it('읽기가 throw 하면 ok:false', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })
      expect(readSeenNoticeId()).toEqual({ ok: false })
      spy.mockRestore()
    })

    it('서로 다른 id로 두 번 확인해도 키 1개에 최신 id만 남는다', () => {
      writeSeenNoticeId('a')
      writeSeenNoticeId('b')
      expect(localStorage.length).toBe(1)
      expect(localStorage.getItem(RELEASE_NOTICE_SEEN_KEY)).toBe('b')
    })

    it('syncSeenNoticeId(null)은 키를 제거하고 공지가 있으면 유지', () => {
      writeSeenNoticeId('a')
      syncSeenNoticeId(notice('a'))
      expect(localStorage.getItem(RELEASE_NOTICE_SEEN_KEY)).toBe('a')
      syncSeenNoticeId(null)
      expect(localStorage.getItem(RELEASE_NOTICE_SEEN_KEY)).toBeNull()
    })
  })
})
