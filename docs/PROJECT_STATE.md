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
- Live page deployed from dcfb4465f9443c8eedd5fc01fca33ba9c43b5faa through PR #1
- GitHub Pages build succeeded; production URL returns HTTP 200
- Browser confirmed new page, disclosure and skip target, unchanged checkout URL
- Existing Pages source main / root remains unchanged

## Verification / limits
- Preview layout 320/390/680 and consent gating checks passed
- Checkout product and RUB 2490 form verified in browser, including card/SBP options
- No payment submitted; material delivery not tested
- No existing client-event collector found for this static page
- Continuous end-to-end payment monitoring is not configured

## Rollback
- Restore page from e88ddfd9238cf618b3e750c8448e2ecb377b7d35 via revert PR
- Old product and payment links remain unchanged

## Next
- Verify main publication and natural checkout handoff without payment
