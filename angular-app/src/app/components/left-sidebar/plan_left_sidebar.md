# Implementation Plan - Left Sidebar Refactor

Refactor the `LeftSidebarComponent` to strictly use Vanilla CSS classes instead of inline styles, ensuring a clean separation of concerns and a premium look.

## Proposed Changes

### CSS (`left-sidebar.css`)
- [ ] Add `.guest-cover` class for the guest profile background gradient.
- [ ] Add `.guest-avatar` class for the guest placeholder styling.
- [ ] Add `.guest-icon` for the person icon inside the guest avatar.
- [ ] Add `.guest-info` container for the text block.
- [ ] Add `.guest-title`, `.guest-subtitle` typography classes.
- [ ] Add `.guest-action` or `.full-width-btn` for the login button.
- [ ] Add `.filled` utility class for Material Symbols to handle the filled state (e.g. `font-variation-settings: 'FILL' 1`).

### HTML (`left-sidebar.html`)
- [ ] Replace `style="..."` attributes with the new CSS classes found above.
- [ ] Keep `[style.background-image]` for dynamic user avatars as this is data-driven.

### Verification
- [ ] Ensure `routerLinkActive` correctly applies `.active` class styles in the menu.
- [ ] Verify responsive behavior (sidebar is `sticky`).
- [ ] Visual check of Guest vs Logged-in views.
