# JHSEE Unified Design System V1

Date: 2026-09-17
Status: Design approved in chat, implementation not started
Scope: JHSEE-Study-Planner, JHSEE-All-Subjects, JHSEE-English-Adventure

## 1. Product family

The three repositories remain separate applications with separate responsibilities, data stores, routes, releases, and test suites. They share a visual system and product language so they feel like one professional education suite.

- Study Planner: decide what to study next.
- All Subjects: practice, mock exams, question review.
- English Adventure: daily English practice and progression.

Do not merge repositories and do not introduce hidden cross-project LocalStorage reads. Cross-project data exchange remains explicit through supported import/export interfaces.

Working family name: **JHSEE Learning Suite**.

## 2. Visual direction

Selected direction: **B-Pro — Professional Academic SaaS**.

Design principles:

1. Professional and credible rather than playful or childlike.
2. Quiet visual hierarchy: whitespace, restrained borders, subtle elevation.
3. Mobile-first but equally polished on desktop.
4. Data-rich without looking like enterprise BI software.
5. One dominant action per page.
6. Consistent language and component behavior across the suite.
7. Product-specific accent colors provide identity without changing structure.
8. Illustration is optional and secondary. Do not let decorative art overpower learning information.

## 3. Theme architecture

### 3.1 Common light shell

Default application shell for all three products:

- Background: cool off-white / light gray.
- Surface: white.
- Text: dark navy-gray, never pure black.
- Border: cool light gray.
- Shadows: low contrast; use border + spacing before heavy shadows.
- Corner radius: 16–20 px for main cards, 10–12 px for controls.

### 3.2 Product accents

Study Planner:
- Primary: Indigo `#4F46E5`
- Primary strong: `#4338CA`
- Primary soft: `#EEF2FF`

All Subjects:
- Primary: Teal `#0F766E`
- Primary strong: `#115E59`
- Primary soft: `#ECFDF5`

English Adventure:
- Primary: Amber `#D97706`
- Primary strong: `#B45309`
- Primary soft: `#FFF7ED`
- Optional secondary accent for special progression moments: restrained violet, never used as a competing primary.

Shared semantic colors:
- Success: `#15803D`
- Warning: `#B45309`
- Danger: `#B91C1C`
- Info: `#2563EB`

### 3.3 All Subjects Focus Mode

Only the formal mock-exam answering flow may switch to dark Focus Mode.

Focus Mode characteristics:
- Deep navy background.
- High-contrast question surface.
- Minimal navigation.
- Timer, question number, bookmark/mark, answer sheet, previous/next and submit remain visible.
- Hide gamification, dashboards, unrelated statistics, app switcher and promotional surfaces.
- Exiting/submitting exam returns to the shared light shell.

Focus Mode is an exam-state theme, not the All Subjects brand theme.

## 4. Typography

Font stack:
`Inter, "Noto Sans TC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Recommended scale:
- Display: 32–40 px desktop / 28–34 px mobile.
- H1: 28–32 px desktop / 24–28 px mobile.
- H2: 20–24 px.
- H3: 16–18 px.
- Body: 15–16 px.
- Small/meta: 12–14 px.

Rules:
- Primary headings: 700 weight.
- Body: 400–500.
- KPI numbers: 700, tabular numerals where applicable.
- Avoid decorative serif fonts in core product UI.
- Do not use excessive uppercase English labels; eyebrow labels are allowed sparingly.

## 5. Spacing and layout tokens

Base spacing unit: 4 px.

Tokens:
- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-5: 20px`
- `--space-6: 24px`
- `--space-8: 32px`
- `--space-10: 40px`
- `--space-12: 48px`

Layout:
- Max desktop content width: 1120–1200 px.
- Standard desktop page padding: 24–32 px.
- Standard mobile page padding: 16 px.
- Main card gap: 16 px mobile, 20–24 px desktop.

Do not create per-page arbitrary spacing values when an existing token fits.

## 6. Core shared components

### 6.1 App Header

Same information architecture in all products:
- JHSEE family brand.
- Current product name.
- Optional context: 116 會考準備.
- App switcher on desktop; compact switcher in More on small mobile if space is constrained.
- Settings/profile utility area.

The header must not dominate vertical space on mobile.

### 6.2 Desktop navigation

Shared sidebar/topbar visual grammar:
- Consistent icon size.
- Same selected-state treatment.
- Same spacing and typography.
- Product accent drives active state.

### 6.3 Mobile bottom navigation

Exactly four high-frequency entries.

Study Planner:
- 今日
- 進度
- 錯題
- 更多

All Subjects:
- 練習
- 模考
- 錯題
- 更多

English Adventure:
- 今日
- 闖關
- 錯題
- 更多

Same bar height, icon scale, active state, safe-area behavior and touch targets across apps.

### 6.4 Buttons

Types:
- Primary
- Secondary
- Ghost/text
- Danger

Rules:
- Minimum touch height: 44 px.
- Primary CTA uses product accent.
- One obvious primary action per card/page section.
- Avoid full-width primary buttons on desktop unless the context is a wizard or exam action.
- Disabled state must remain readable.

### 6.5 Cards

Standard card variants:
- Primary/Hero Card
- Task Card
- Metric Card
- Alert Card
- Success Card
- Empty State Card

Cards share:
- Radius
- Border
- Spacing
- Heading rhythm
- Footer/action placement

Do not create unique card geometry per product.

### 6.6 Status badges

Canonical Chinese labels:
- 優先加強
- 需要注意
- 穩定維持
- 已掌握
- 資料不足

These are shared semantic states and should not be renamed per app.

Future Performance Mode labels can coexist as a separate dimension:
- Recovery
- Stabilize
- Advance
- Elite
- Maintain

Do not equate Performance Mode stages to official JHSEE grades.

### 6.7 Progress

Shared progress component supports:
- Linear progress
- Compact KPI progress
- Circular progress only when it materially improves comprehension

Use product accent for active progress; semantic colors only when progress itself represents a semantic state.

### 6.8 Forms

- Label always visible.
- 44 px minimum controls.
- Clear focus state.
- Inline validation.
- Avoid long setup forms as a default user journey.
- Advanced fields belong behind optional settings.

## 7. Common home-page structure

All products use the same high-level order.

### A. Today Hero

One dominant recommendation/action.

Study Planner example:
- 今日建議 75 分鐘
- 英文優先
- 4 個任務
- CTA: 開始今天的學習

All Subjects example:
- 今日建議練習
- 英文閱讀 10 題
- CTA: 開始練習

English Adventure example:
- Day 26
- Streak 8 天
- CTA: 繼續闖關

### B. Quick Stats

3–4 compact metric cards, such as:
- 今日完成
- 本週時間
- 錯題待複習
- 連續天數

### C. Recommended Next

The application decides the next useful action rather than forcing the learner to browse deeply.

### D. Progress Snapshot

Compact weekly trend / subject state / progress overview. Detailed analytics remain on dedicated progress/results pages.

## 8. Product-specific behavior

### 8.1 Study Planner

Primary UX philosophy: **Lazy Mode by default**.

The product should ask only for information it cannot reasonably infer.

Quick Start target:
1. Recent diagnostic grades, with a fast input path such as `A B A A A` and/or one-tap grade chips.
2. Usual daily study time.
3. Generate today's plan immediately.

Optional/advanced:
- writing level
- next mock label/date
- school progress/current scopes
- manual subject weighting

Usage itself becomes data. Practice logs, review results, completion patterns and imported results should reduce future manual entry.

### 8.2 All Subjects

Light shell for:
- practice home
- paper selection
- result analysis
- wrong-question review
- setup/settings

Dark Focus Mode only during formal exam answering/check flow where appropriate.

Current neon/grid styling should not remain as the default product shell.

### 8.3 English Adventure

Retain progression and achievement mechanics, but present them within the professional shared shell.

Gamification may use warmer illustration and celebratory micro-interactions, but:
- no oversized decorative artwork that pushes learning content below the fold on mobile
- no inconsistent fonts
- no component shapes outside the shared system

## 9. App Switcher

Purpose: make three separate GitHub Pages applications feel connected without technically merging them.

Switcher entries:
- Study Planner
- All Subjects
- English Adventure

Behavior:
- Explicit navigation only.
- No iframe composition.
- No hidden storage access across applications.
- Preserve each product's independent origin/path behavior.

## 10. Motion

Use motion only to confirm state or improve continuity.

Defaults:
- 150–200 ms for hover/press/fade/slide.
- No bouncing persistent UI.
- Respect `prefers-reduced-motion`.
- Celebrate milestones with brief, dismissible effects only in English Adventure or achievement contexts.

## 11. Icons

Use one consistent line-icon family or an equivalent internally consistent SVG set.

Rules:
- Standard size 18–20 px in controls.
- Do not mix emoji, filled illustrations and line icons as navigation primitives.
- Emoji may appear in educational content, not as the primary system icon language.

## 12. Accessibility

Minimum requirements:
- WCAG-conscious contrast for body text and controls.
- Visible focus outlines.
- 44 px touch targets.
- Semantic labels for controls.
- Keyboard-accessible navigation and exam controls.
- Status must not rely on color alone.
- Focus Mode maintains readable contrast without pure-white-on-pure-black glare.

## 13. Responsive behavior

Mobile-first breakpoints should be consistent across products.

Suggested breakpoints:
- `< 640px`: phone
- `640–899px`: tablet/small desktop
- `>= 900px`: desktop navigation/layout

Rules:
- Bottom navigation on phone.
- Sidebar/topbar pattern on desktop.
- Avoid horizontal scroll except explicitly scrollable tables/readers.
- KPI grids collapse predictably.

## 14. Shared design tokens implementation strategy

V1 should avoid introducing a fourth runtime dependency or cross-repo CDN dependency.

Recommended implementation:
- Define a canonical `design-tokens.css` and component contract in this spec.
- Copy/version the stable shared token/component layer into each repository during implementation.
- Keep product theme variables in a small product-specific theme file.
- Add a visible version comment, e.g. `JHSEE Design System v1.0`, so drift can be audited.

This is intentionally simpler and more reliable for static GitHub Pages than runtime-loading a shared external stylesheet.

A future dedicated shared package is optional only if duplication becomes operationally costly.

## 15. Testing strategy

Each repository keeps its own tests.

Add UI contract tests where practical for:
- four-entry mobile navigation
- product accent/theme class
- shared status labels
- minimum required routes/components
- Focus Mode only in All Subjects exam routes
- App Switcher target URLs
- no regression to LocalStorage namespace isolation

Manual visual QA checklist:
- 375 px mobile
- 768 px tablet
- 1440 px desktop
- keyboard focus
- long Traditional Chinese labels
- empty states
- error states
- max-content scenarios

## 16. Migration sequence

Implement in this order to minimize risk:

1. Build canonical tokens + shared component styles in Study Planner first.
2. Apply to Study Planner and verify V1.1 behavior remains unchanged.
3. Apply same shell/components to English Adventure while preserving its game logic.
4. Apply same light shell to All Subjects.
5. Isolate existing dark exam UI into explicit Focus Mode.
6. Add App Switcher across all three.
7. Run per-repo regression tests and mobile/desktop visual QA.
8. Merge/deploy each repository independently.

Do not deploy all three simultaneously without individual verification.

## 17. Non-goals for V1

- Do not merge repositories.
- Do not create shared authentication.
- Do not introduce a backend.
- Do not redesign the learning algorithms as part of the visual migration.
- Do not build a new illustration system.
- Do not create hidden cross-project synchronization.
- Do not add a new UI framework unless existing code makes plain CSS untenable.

## 18. Success criteria

The design is successful when:

1. A user can switch between the three products and immediately recognize one product family.
2. Product identity remains clear through accent color and product name.
3. Mobile navigation behavior is predictable across all three.
4. Study Planner feels fast and low-input rather than form-heavy.
5. All Subjects feels professional in normal browsing and distinctly focused during exams.
6. English Adventure retains motivation without looking childish.
7. Existing learning, exam, storage and review logic continues to work.
8. Each product can still deploy and evolve independently.
