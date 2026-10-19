# Project state
Updated: 2026-10-19

## Source
- Accepted parent page promoted from codex/bella-preview only
- Path: gayd-spokoynyy-roditel.html; new isolated parent-assets directory
- Other articles, product delivery files and consent.js unchanged
- Payment destination and price 2490 RUB unchanged
- Parent preview noindex replaced by production canonical URL
- Collapsed seven phrases, floating skip, paid offer and generated product visuals

## Live
- Pending main merge and GitHub Pages publication
- Existing Pages source main / root remains unchanged

## Verification / limits
- Preview layout 320/390/680 and consent gating checks passed
- Real payment and material delivery not tested
- No existing client-event collector found for this static page
- Continuous end-to-end payment monitoring is not configured

## Rollback
- Restore page from e88ddfd9238cf618b3e750c8448e2ecb377b7d35 via revert PR
- Old product and payment links remain unchanged

## Next
- Verify main publication and natural checkout handoff without payment
