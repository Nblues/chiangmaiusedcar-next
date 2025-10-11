# Project Backup Snapshot — 2025-10-10

Snapshot tag: `backup-2025-10-10-car-detail-ux-backline`

## Scope in this backup

- Car detail page improvements
  - Smart Back: button returns to the exact previous list page (keeps filters/pagination) using sessionStorage, with
    safe fallbacks
  - LINE contact: fix “ทดลองขับฟรี” to use working short URL `https://lin.ee/8ugfzstD`
  - Loading hint: non-blocking “กำลังโหลดรูป…” indicator on hero image when slow
- Performance work done earlier
  - Hero image preload + fetchPriority, removed gating overlay
  - Thumbnails smaller and all lazy
  - Server-side similar cars with same scoring; reduced page payload
- ISR remains 600 seconds

## How to rollback

- Use Git tag:
  - Checkout: `git checkout backup-2025-10-10-car-detail-ux-backline`
  - Or reset: `git reset --hard backup-2025-10-10-car-detail-ux-backline`
- ZIP archive also exported at repo parent folder (see below) for offline restore

## Files touched recently

- `pages/car/[handle].jsx`
  - Added smart back logic (sessionStorage + button)
  - Updated LINE links to `lin.ee`
  - Added hero image loading hint with delay to avoid flicker
- `components/A11yImage.tsx` (earlier)
  - Thumbnail size/srcset reductions

## Notes

- This snapshot reflects production-ready state after deployment on 2025-10-10.
- Tag and ZIP created for quick revert/restore.
